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

const config = {/* ... */};

export default {
  entry: 'main.js',
  plugins: [
    svgi(config)
  ]
}
```

### Configuration

The `config` object passed to the plugin is composed of the following properties:

| Property | Description |
| ------ | ----------- |
| `options` | The options object |
| `options.jsx` | The JSX library to use e.g. `"preact"` or `"react"` |
| `exclude` | Minimatch pattern(s) to exclude. Defaults to `undefined`.<br/>[More at rollupjs.org](https://rollupjs.org/guide/en#transformers). |
| `include` | Minimatch pattern(s) to include. Defaults to `undefined`.<br/>[More at rollupjs.org](https://rollupjs.org/guide/en#transformers). |

### Basic setup

```js
// main.js
import { h } from 'preact';
import Logo from 'path/to/logo.svg';

export default () => (
  <div class="App">
    <div class="App-header">
      <Logo class="App-logo" />
    </div>
  </div>
);
```

```js
// rollup.config.js
import svgi from 'rollup-plugin-svgi';

export default {
  entry: 'main.js',
  plugins: [
    svgi({
      options: {
        jsx: "preact",
      },
    }),
  ]
}
```

### Advanced setup

```js
/** EXAMPLE 1: Specific `exclude` */

// rollup.config.js
import svgi from 'rollup-plugin-svgi';

export default {
  entry: 'main.js',
  plugins: [
    svgi({
      options: {
        jsx: "react",
        exclude: ['**/*.dev.svg', '**/*.max.svg'],
      },
    }),
  ]
}
```

```js
/** EXAMPLE 2: Using a different JSX library */

// rollup.config.js
import svgi from 'rollup-plugin-svgi';

export default {
  entry: 'main.js',
  plugins: [
    svgi({
      options: {
        jsx: "inferno",
        factory: "createElement",
        'default': false // import { createElement } from 'inferno';
      },
    }),
  ]
}
```