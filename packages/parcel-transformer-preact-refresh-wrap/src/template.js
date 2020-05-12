const { statements } = require('@babel/template');

module.exports.wrapper = statements(`
const __prefresh_utils__ = require(%%helpersPath%%);
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;

__prefresh_utils__.prelude(module);

try {
  %%body%%
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}

__prefresh_utils__.postlude(module);
`);
