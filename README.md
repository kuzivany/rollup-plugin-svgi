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

| Property | Description | Default |
| -------- | ----------- | ------- |
| `options` | The options object | `undefined` |
| `options.jsx` | The JSX library to use e.g. `"preact"` or `"react"` | `undefined` |
| `options.factory` | The JSX pragma or name of the function called at runtime for each node to e.g. `preact.h` or `React.createElement` | `undefined` |
| `options.default` | Whether or not the `options.factory` is the `default` export of the provided `options.jsx` library.<br/>If `false`, the provided `options.jsx` will be a [named `export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) | `true` |
| `options.clean` | The function used to clean up/ prepare the SVG for inlining. It has a `(rawSVG) => string` function signature and removes the `DOCTYPE`, XML declaration and namespaced attributes | [`function`](./index.js#L30) |
| `exclude` | Minimatch pattern(s) to exclude.<br/>[More at rollupjs.org](https://rollupjs.org/guide/en#transformers). | `undefined` |
| `include` | Minimatch pattern(s) to include.<br/>[More at rollupjs.org](https://rollupjs.org/guide/en#transformers). | `"**/*.svg"` |

### Basic setup

```js
// main.js
import { h } from 'preact'; // OR import React from 'react';
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
  // ...
  plugins: [
    svgi({
      options: {
        jsx: "preact", // Your chosen JSX library
      },
    }),
  ]
}
```

### Advanced setup

```js
// rollup.config.js
import svgi from 'rollup-plugin-svgi';

export default {
  entry: 'main.js',
  plugins: [
    svgi({
      options: {
        jsx: "inferno-create-element",
        factory: "createElement",
        'default': false // import { createElement } from 'inferno-create-element';
      },
    }),
  ]
}
```