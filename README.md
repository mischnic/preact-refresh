# Preact-Refresh

**Experimental package**

[![npm version](https://badgen.net/npm/v/preact-refresh)](https://www.npmjs.com/package/preact-refresh)

We are still fleshing out the details on how to go about this approach best for [Preact](https://github.com/preactjs/preact), we'd
love to give you the best reloading experience possible.

Note that now the refreshing component will dispose of its `hookState` to reload in case of added hook, ... this to ensure consistency.

## Setup

```
npm i -s preact-refresh
## OR
yarn add preact-refresh 
```

Then add it to your `webpack` config by doing

```js
import PreactRefreshPlugin from 'preact-refresh';

const config = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new PreactRefreshPlugin(),
  ],
  devServer: {
    hot: true, // ensure dev-server.hot is on
    ...moreDevServerConfig
  },
  ...moreWebpackConfig
}
```

## Uncertainties

- [x] component altering lifecycles
- [x] error recovery
- [x] adding dependencies to hooks
- [x] state-hooks ordering
- [ ] avoid triggering effects for added dependencies
- [ ] transition better from Functional --> class and other way around
- [ ] provide fallback if no hot modules/no preact modules (window.location.reload())
