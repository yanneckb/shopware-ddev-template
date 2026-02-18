# Cursor setup (Shopware 6.7 DDEV template)

This folder contains Cursor IDE rules (`.mdc`), MCP configuration (`mcp.json`), and a helper script for the Context7 MCP server. Everything is intended to be committed except secrets (the Context7 API key belongs in `.env.local`).

---

## Rules (`.cursor/rules/*.mdc`)

Rules are Markdown files with YAML frontmatter. Cursor uses them to provide consistent project context. They can apply always or only when certain files are open (`globs`).

| File                    | When it applies        | Purpose |
| ----------------------- | ---------------------- | ------- |
| **project-context.mdc** | Always (`alwaysApply: true`) | Project overview, DDEV commands, doc links, Context7 setup, Shopware library IDs. |
| **shopware-6-7.mdc**    | `**/*.php`, `custom/**/*`, `**/theme.json`, `**/composer.json` | Shopware 6.7 standard: plugins, themes, storefront, API. |
| **theme-storefront.mdc**| Storefront/theme files (Twig, SCSS, `theme.json`, theme plugins) | Theme structure, quality tools (ESLint, Stylelint, Prettier), BEM, view order. |
| **php-plugin.mdc**      | `**/src/**/*.php`, `custom/**/*.php` | PHP 8.3, plugin namespaces, services, CLI commands, migrations, code style. |
| **shopware-frontends.mdc** | Frontends/Nuxt/storefront config files | When to use Shopware Frontends (headless) docs; default is classic storefront. |

- **Edit rules** in `.cursor/rules/*.mdc` to change what the AI assumes (e.g. DDEV, docs, conventions).
- **Add rules:** create new `.mdc` files with `description`, optional `globs`, and `alwaysApply: true/false`.

---

## MCP (`mcp.json`)

[MCP (Model Context Protocol)](https://cursor.com/docs/context/mcp) lets Cursor use external tools (e.g. fetch URLs, Context7 docs). Configuration is in `.cursor/mcp.json`.

### Configured servers

1. **fetch**  
   - Command: `npx -y @modelcontextprotocol/server-fetch`  
   - Use: fetch URLs (docs, APIs). No API key.

2. **context7**  
   - Runs via `.cursor/run-context7-mcp.sh` (see below).  
   - Use: up-to-date library/docs (e.g. Shopware) in chat. Requires `CONTEXT7_API_KEY` in `.env.local`.

### Context7 and the API key

The Context7 server needs an API key. Cursor does not expand env vars in `mcp.json`, so the key is **not** stored in `mcp.json`. Instead:

1. Get a free key at [context7.com/dashboard](https://context7.com/dashboard).
2. Add to **`.env.local`** (gitignored):  
   `CONTEXT7_API_KEY=your_key`
3. The script `run-context7-mcp.sh` sources `.env.local` and starts the Context7 MCP with that key.

The key stays only in `.env.local` and is never committed.

### Shopware library IDs (Context7)

In chat you can target specific docs, e.g. `use context7` or `use library /shopware/docs`. Useful IDs:

| Library ID                 | Description |
| -------------------------- | ----------- |
| `/shopware/shopware`       | Shopware 6 platform |
| `/websites/shopware_en`    | docs.shopware.com/en |
| `/shopware/docs`           | Developer documentation |
| `/shopware/store-api-reference` | Store API reference |
| `/shopware/frontends`      | Shopware Frontends (Vue/custom storefronts) |
| `/shopware/administration` | Administration (JS/Vue) |
| `/shopware/meteor`         | Meteor design system |

---

## Scripts

### `run-context7-mcp.sh`

- **Purpose:** Start the Context7 MCP server with `CONTEXT7_API_KEY` from `.env.local` (so the key is not in `mcp.json`).
- **Used by:** Cursor when it starts the `context7` MCP server (see `mcp.json`).
- **Behaviour:**
  - Resolve project root from the script path and change to it.
  - Source **only** `.env.local`.
  - Exit with error if `CONTEXT7_API_KEY` is missing.
  - With `--check`: only verify the key is set and print "OK".
  - Otherwise: run `npx -y @upstash/context7-mcp --api-key "$CONTEXT7_API_KEY"`.

**Verify from project root:**

```bash
make check-context7
# or
bash .cursor/run-context7-mcp.sh --check
```

Expected: `OK: CONTEXT7_API_KEY is set (length N chars).`

If you see "CONTEXT7_API_KEY is not set", ensure `.env.local` contains:

- `CONTEXT7_API_KEY=your_key` (no spaces around `=`, line not commented out).

---

## Quick reference

| Task                 | Action |
| -------------------- | ------ |
| Set Context7 key      | Put `CONTEXT7_API_KEY=...` in `.env.local`. |
| Check key            | `make check-context7` or `bash .cursor/run-context7-mcp.sh --check` |
| MCP status in Cursor  | Settings → MCP (or Tools & MCP) |
| Use Context7 in chat  | e.g. "How do I add a CMS block? use context7" or "use library /shopware/docs" |
| Change project rules  | Edit `.cursor/rules/*.mdc` |
| Change MCP servers    | Edit `.cursor/mcp.json` (restart Cursor after changes) |
