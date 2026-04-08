# Frontend linting (static plugins)

Shared **Prettier**, **ESLint**, and **Stylelint** for JavaScript, TypeScript, and SCSS under `custom/static-plugins/*/src/Resources/app/` (covers both **storefront** and **administration** assets in each plugin).

## Prerequisites

- **Node** version from `.nvmrc` (e.g. `nvm use`).
- From the **repository root**: `npm install` (Husky, lint-staged, and all lint devDependencies live here—not in individual plugins).

## Config layout

| Location | Role |
|----------|------|
| `frontend-tools/eslint.config.cjs` | ESLint flat config |
| `frontend-tools/prettier.config.cjs` | Prettier |
| `frontend-tools/stylelint.config.cjs` | Stylelint 16 |
| `frontend-tools/tsconfig.eslint.json` | TypeScript project for ESLint only (`noEmit`) |
| `frontend-tools/lint-staged.config.cjs` | Pre-commit staged files |
| `frontend-tools/lint-static-plugins.cjs` | linting automation script |
| `package.json` → `"prettier": "./frontend-tools/prettier.config.cjs"` | Lets Prettier discover settings from the repo root |
| `.prettierignore` (repo root) | Prettier ignore patterns (walks up from each file; keep at root) |

There is **no** `eslint.config.js` in the repo root; ESLint is always invoked with an explicit config path (see below).

## npm scripts (repo root)

| Command | Purpose |
|---------|---------|
| `npm run lint:static-plugins` | Prettier (check), ESLint, Stylelint for every plugin that has `src/Resources/app` |
| `npm run lint:static-plugins:fix` | Same with `--write` / `--fix` |
| `npm run eslint -- <paths>` | ESLint on given files/globs (uses flat config + env; see below) |

### Quiet vs verbose output

- **Default (quiet):** For each plugin you see `==> PluginName` and a short spinner while Prettier, ESLint, and Stylelint run. Tool output is buffered: ESLint and Stylelint use the **compact** formatter (issues only, no long per-file listings). Prettier uses `--log-level warn` so routine chatter is reduced; style problems still print as warnings. If a step fails, that command’s **stdout/stderr** is printed before the process exits.
- **Verbose:** Pass **`--verbose`** after `--`, or set **`LINT_VERBOSE=1`**, to stream full tool output (Prettier log level `log`, ESLint **stylish**, Stylelint **string**).

Examples:

```bash
npm run lint:static-plugins -- --verbose
LINT_VERBOSE=1 npm run lint:static-plugins
```

## Pre-commit (Husky)

`.husky/pre-commit` runs:

```bash
cd "$(git rev-parse --show-toplevel)" || exit 1
npx lint-staged --config frontend-tools/lint-staged.config.cjs --shell
```

**Why `cd` to the repo root:** lint-staged matches globs against paths **relative to the current working directory**. Without `cd`, committing from a subdirectory (e.g. inside a plugin) yields relative paths like `src/Resources/app/...`, which would not match a pattern that starts with `custom/static-plugins/`.

**Why `--shell`:** lint-staged v15 runs tasks without a shell by default. Commands like `ESLINT_USE_FLAT_CONFIG=true eslint …` must run in a shell so the environment assignment applies to `eslint`; otherwise the first token is treated as the executable and you get **ENOENT**. If one task fails, lint-staged can **kill** sibling tasks—failures may show as **KILLED** for Stylelint even when the root cause was ESLint.

**“No staged files match any configured task”:** Normal when you only stage files outside `**/src/Resources/app/**` (e.g. PHP, `package.json`, docs). Lint-staged skips and the commit continues.

Staged files under `**/src/Resources/app/` (typically `custom/static-plugins/*/src/Resources/app/`) are formatted/fixed (**`.js` / `.ts`**: Prettier + ESLint; **`.scss`**: Prettier + Stylelint).

## ESLint 8 and flat config

With **ESLint 8**, a flat config file must be loaded with flat mode enabled when it is not the default `eslint.config.js` at the project root:

- Set **`ESLINT_USE_FLAT_CONFIG=true`** together with **`--config frontend-tools/eslint.config.cjs`**.

The `npm run eslint` script and the lint automation (`lint-static-plugins`, lint-staged) set this for you.

**Manual example:**

```bash
ESLINT_USE_FLAT_CONFIG=true npx eslint --config frontend-tools/eslint.config.cjs "custom/static-plugins/MyPlugin/src/Resources/app/**/*.js"
```

## Manual Stylelint / Prettier

```bash
npx stylelint --config frontend-tools/stylelint.config.cjs "custom/static-plugins/MyPlugin/src/Resources/app/**/*.scss"
npx prettier --check "custom/static-plugins/MyPlugin/src/Resources/app"
```

Prettier picks up `frontend-tools/prettier.config.cjs` via `package.json` when run from the repo root.

## IDE notes

- **ESLint**: Point the editor to **`frontend-tools/eslint.config.cjs`**, enable **flat config**, and ensure **`ESLINT_USE_FLAT_CONFIG=true`** (or upgrade to ESLint 9, where flat config is the default).
- **Prettier**: Workspace folder should be the repo root so `package.json` / `.prettierignore` resolve correctly.

## Changing rules

Edit the files under **`frontend-tools/`** only. After dependency changes, run `npm install` at the repo root.
