# react-tour-stats
Trial for what react stats would be like


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.


## helpful sites
- [colab] Working recommendation for Colab - sheets https://medium.com/@bopingliu/using-the-google-sheets-api-1f75316d784b
- [colab] How to use service account with gspread https://github.com/burnash/gspread/blob/master/docs/oauth2.rst
- [colab] How to use append https://medium.com/@jb.ranchana/write-and-append-dataframes-to-google-sheets-in-python-f62479460cf0
- [ui] Material ui with tailwind https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/#vite-js-or-any-other-spa
- [ui] Styling interior of components https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/#usage
- [gh-pages] Deploying to Github Pages https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3
   - In the network tab 

## learnings
- If you're adding deleting and stuff from objects, maybe it's better to use a Map
- Do NOT have multiple functions modify a map even if they are supposed to run sequentially
- Filereader may execute some things later... https://stackoverflow.com/questions/42260524/array-length-is-zero-but-the-array-has-elements-in-it