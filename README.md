# rollup-plugin-svgi

Use SVG files in JSX.

## Why?

- To `import` SVG as JSX in [Preact](http://preactjs.com/)/ [React](https://reactjs.org/) using [Rollup](http://rollupjs.org/).
- To use inline svg in JSX

## Installation

### `npm`

```bash
npm install rollup-plugin-svgi --save-dev
```

### [`yarn`](http://yarnpkg.com/)

```bash
yarn add rollup-plugin-svgi -D
```

## Usage

```js
// rollup.config.js
import svgi from 'rollup-plugin-svgi';

export default {
  entry: 'main.js',
  plugins: [
    svgi(config)
  ]
}
```

| Item | Description |
| ------ | ----------- |
| `config` | The config object passed to the plugin |
| `config.options` | The options object |
| `config.options.jsx` | The JSX library to use e.g. `"preact"` or `"react"` |
| `config.exclude` | Minimatch pattern(s) to exclude. Defaults to `undefined`.<br/>[More at rollupjs.org](https://rollupjs.org/guide/en#transformers). |
| `config.include` | Minimatch pattern(s) to include. Defaults to `undefined`.<br/>[More at rollupjs.org](https://rollupjs.org/guide/en#transformers). |

### Example

```js
// rollup.config.js
import svgi from 'rollup-plugin-svgi';

export default {
  entry: 'main.js',
  plugins: [
    svgi({
      options: {
        jsx: "preact"
      }
    })
  ]
}
```

```js
// main.js
import { h } from 'preact';
import Logo from 'path/to/logo.svg';

export default () => (
  <div class="App">
    <div class="App-header">
      <Logo class="App-logo" />
    </div>
    {/* ... */}
  </div>
);
```