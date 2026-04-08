'use strict';

const { readdirSync, statSync, existsSync } = require('fs');
const { join } = require('path');
const { exec, execSync } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

const root = join(__dirname, '..');
const pluginsDir = join(root, 'custom', 'static-plugins');
const fix = process.argv.includes('--fix');
const verbose =
    process.argv.includes('--verbose') || process.env.LINT_VERBOSE === '1';

const frontendToolsDir = join(root, 'frontend-tools');
const prettierConfig = join(frontendToolsDir, 'prettier.config.cjs');
const eslintConfig = join(frontendToolsDir, 'eslint.config.cjs');
const stylelintConfig = join(frontendToolsDir, 'stylelint.config.cjs');
const prettierIgnore = join(root, '.prettierignore');

const baseEnv = { ...process.env, ESLINT_USE_FLAT_CONFIG: 'true' };

const execOptsVerbose = {
    cwd: root,
    env: baseEnv,
    stdio: 'inherit',
};

const execOptsQuiet = {
    cwd: root,
    env: baseEnv,
    maxBuffer: 50 * 1024 * 1024,
};

function startSpinner(text) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const id = setInterval(() => {
        process.stdout.write(`\r${frames[i++ % frames.length]} ${text}`);
    }, 90);
    return () => {
        clearInterval(id);
        process.stdout.write('\r\x1b[K');
    };
}

function runVerbose(cmd) {
    console.log(`\n$ ${cmd}`);
    execSync(cmd, execOptsVerbose);
}

async function runQuiet(cmd) {
    try {
        await execAsync(cmd, execOptsQuiet);
    } catch (err) {
        if (err.stdout) {
            process.stdout.write(err.stdout);
        }
        if (err.stderr) {
            process.stderr.write(err.stderr);
        }
        const e = new Error(`Command failed: ${cmd}`);
        e.code = err.code;
        throw e;
    }
}

async function lintPlugin(name, appDir) {
    const logLevel = verbose ? 'log' : 'warn';
    const eslintFmt = verbose ? 'stylish' : 'compact';
    const stylelintFmt = verbose ? 'string' : 'compact';

    const prettierCmd = fix
        ? `npx prettier --config "${prettierConfig}" --ignore-path "${prettierIgnore}" --log-level ${logLevel} "${appDir}" --write`
        : `npx prettier --config "${prettierConfig}" --ignore-path "${prettierIgnore}" --log-level ${logLevel} "${appDir}" --check`;

    const eslintCmd = `npx eslint --config "${eslintConfig}" "${appDir}"${fix ? ' --fix' : ''} -f ${eslintFmt}`;

    const stylelintCmd = `npx stylelint --config "${stylelintConfig}" --ignore-pattern "**/storefront/src/scss/vendor/**" --allow-empty-input -f ${stylelintFmt} "${appDir}/**/*.scss" "${appDir}/**/*.html.twig" "${appDir}/**/*.vue"${fix ? ' --fix' : ''}`;

    if (verbose) {
        console.log(`\n==> ${name}`);
        runVerbose(prettierCmd);
        runVerbose(eslintCmd);
        runVerbose(stylelintCmd);
        return;
    }

    console.log(`\n==> ${name}`);
    const stop = startSpinner(`Prettier, ESLint, Stylelint…`);
    try {
        await runQuiet(prettierCmd);
        await runQuiet(eslintCmd);
        await runQuiet(stylelintCmd);
    } finally {
        stop();
    }
}

(async () => {
    for (const name of readdirSync(pluginsDir)) {
        const pluginRoot = join(pluginsDir, name);
        if (!statSync(pluginRoot).isDirectory()) {
            continue;
        }
        const appDir = join(pluginRoot, 'src', 'Resources', 'app');
        if (!existsSync(appDir)) {
            continue;
        }

        try {
            await lintPlugin(name, appDir);
        } catch {
            process.exitCode = 1;
            process.exit(1);
        }
    }
})();
