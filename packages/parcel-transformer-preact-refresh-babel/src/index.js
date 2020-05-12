// @flow

const { Transformer } = require('@parcel/plugin');

async function shouldExclude(asset, options) {
	if (
		!asset.isSource ||
		!options.hot ||
		!asset.env.isBrowser() ||
		options.mode !== 'development'
	) {
		return true;
	}

	let pkg = await asset.getPackage();
	return !(pkg && pkg.dependencies && pkg.dependencies.preact);
}

module.exports = new Transformer({
	async transform({ asset, options }) {
		if (!(await shouldExclude(asset, options))) {
			let reactRefreshBabelPlugin = (
				await options.packageManager.resolve('react-refresh/babel', __filename)
			).resolved;

			asset.meta.babelPlugins = asset.meta.babelPlugins || [];
			asset.meta.babelPlugins.push([
				reactRefreshBabelPlugin,
				{ skipEnvCheck: true }
			]);
		}
		return [asset];
	}
});
