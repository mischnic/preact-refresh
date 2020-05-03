const { Template } = require('webpack');
const { NAMESPACE } = require('./constants');

const afterModule = `
const exports = module.exports || module.__proto__.exports;
let shouldBind = false;

if (Array.isArray(exports)) {
  // TODO: method to find out if this is a component
} else if (!moduleExports || typeof moduleExports !== 'object') {
  shouldBind = false;
} else {
  for (const key in moduleExports) {
    const exportValue = moduleExports[key];
    // TODO: method to find out if this is a component
  }
}

if (module.hot && shouldBind) {
  const m = module.hot.data && module.hot.data.module && module.hot.data.module;
  if (m) {
    for (let i in module.exports) {
      const fn = module.exports[i];
      try {
        if (typeof fn === 'function') {
          if (i in m.exports) {
            window.${NAMESPACE}.replaceComponent(m.exports[i], fn);
          }
        }
      } catch (e) {
        window.location.reload();
      }
    }
  } else {
    window.location.reload();
  }

  module.hot.dispose(function(data) {
    data.module = module;
  });

  module.hot.accept(function errorRecovery() {
    require.cache[module.id].hot.accept(errorRecovery);
  });
}
`;

function createRefreshTemplate(source, chunk, hash, mainTemplate) {
	let filename = mainTemplate.outputOptions.filename;
	if (typeof filename === 'function') {
		filename = filename({
			chunk,
			hash,
			contentHashType: 'javascript',
			hashWithLength: length =>
				mainTemplate.renderCurrentHashCode(hash, length),
			noChunkHash: mainTemplate.useChunkHash(chunk)
		});
	}

	if (!filename || !filename.includes('.js')) {
		return source;
	}

	const lines = source.split('\n');

	// Webpack generates this line whenever the mainTemplate is called
	const moduleInitializationLineNumber = lines.findIndex(line =>
		line.startsWith('modules[moduleId].call')
	);

	return Template.asString([
		...lines.slice(0, moduleInitializationLineNumber),
		Template.indent(lines[moduleInitializationLineNumber]),
		afterModule,
		...lines.slice(moduleInitializationLineNumber + 1, lines.length)
	]);
}

exports.createRefreshTemplate = createRefreshTemplate;
