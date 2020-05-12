const semver = require('semver');
const path = require('path');
const { Transformer } = require('@parcel/plugin');
const { generate, parse } = require('@parcel/babel-ast-utils');
const t = require('@babel/types');

const { wrapper } = require('./template');

const HELPERS = path.join(__dirname, 'helpers.js');

function shouldExclude(asset, options) {
	return (
		!asset.isSource ||
		!options.hot ||
		!asset.env.isBrowser() ||
		options.mode !== 'development' ||
		!asset.getDependencies().find(v => v.moduleSpecifier === 'preact')
	);
}

module.exports = new Transformer({
	canReuseAST({ ast }) {
		return ast.type === 'babel' && semver.satisfies(ast.version, '^7.0.0');
	},

	async parse({ asset, options }) {
		if (shouldExclude(asset, options)) {
			return null;
		}

		return parse({
			asset,
			code: await asset.getCode(),
			options
		});
	},

	async transform({ asset, options }) {
		let ast = await asset.getAST();
		if (!ast || shouldExclude(asset, options)) {
			return [asset];
		}

		let helpersPath = path
			.relative(path.dirname(asset.filePath), HELPERS)
			.replace(/\\/g, '/');
		if (!helpersPath.startsWith('.')) {
			helpersPath = './' + helpersPath;
		}

		ast.program.program.body = wrapper({
			body: ast.program.program.body,
			helpersPath: t.stringLiteral(helpersPath)
		});
		asset.setAST(ast);

		// The JSTransformer has already run, do it manually
		asset.addDependency({
			moduleSpecifier: helpersPath
		});

		return [asset];
	},

	generate({ asset, ast, options }) {
		return generate({ asset, ast, options });
	}
});
