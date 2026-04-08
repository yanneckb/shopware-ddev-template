const path = require('path');

const toolingDir = __dirname;
const cfg = (name) => path.join(toolingDir, name);
const quote = (files) => files.map((f) => `"${f}"`).join(' ');

// Paths are matched relative to cwd (lint-staged generateTasks).
// Glob starts with ** so it matches when commit is run from a plugin subdir
// (relative paths like src/Resources/app/... vs custom/static-plugins/.../src/...).
// Scoped to src/Resources/app (Shopware plugin app root).
module.exports = {
    '**/src/Resources/app/**/*.{js,ts}': (filenames) => [
        `prettier --config "${cfg('prettier.config.cjs')}" --write ${quote(filenames)}`,
        `ESLINT_USE_FLAT_CONFIG=true eslint --config "${cfg('eslint.config.cjs')}" --fix ${quote(filenames)}`,
    ],
    '**/src/Resources/app/**/*.scss': (filenames) => [
        `prettier --config "${cfg('prettier.config.cjs')}" --write ${quote(filenames)}`,
        `stylelint --config "${cfg('stylelint.config.cjs')}" --fix ${quote(filenames)}`,
    ],
};
