# Deployment & workflow

## Git-flow

```mermaid
%%{init: {'theme':'neutral', 'themeVariables': {'primaryColor':'#e8e8e8','primaryBorderColor':'#b0b0b0','lineColor':'#888'}, 'gitGraph': {'diagramPadding':4, 'titleTopMargin':8}} }%%
gitGraph
  commit id: "main"
  branch develop
  branch release
  branch feature
  checkout feature
  commit id: "work"
  checkout develop
  merge feature tag: "merge when done"
  checkout release
  merge feature tag: "after approval"
  checkout main
  merge release tag: "tag"
  commit id: "Production"
  branch hotfix
  commit id: "fix"
  checkout main
  merge hotfix
  checkout develop
  merge hotfix
```

## Deployment strategy

- **develop/staging** and **release** branch from **main**.
- **feature** branches from **main**; merge into **develop/staging** when done.
- After approval, merge **feature** into **release**.
- When **release** is ready, merge into **main** and create a **tag**.
- **Hotfixes** branch from **main** and merge into **develop** and **main**.

Close or delete feature branches only after they have been deployed to production.