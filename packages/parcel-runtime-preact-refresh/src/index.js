const { Runtime } = require('@parcel/plugin');

const runtimePath = require.resolve('@prefresh/core');

module.exports = new Runtime({
	async apply({ bundle, options }) {
		if (
			bundle.type !== 'js' ||
			!options.hot ||
			!bundle.env.isBrowser() ||
			options.mode !== 'development'
		) {
			return;
		}

		let mainEntry = bundle.getMainEntry();
		if (mainEntry) {
			let pkg = await mainEntry.getPackage();
			if (pkg && pkg.dependencies && pkg.dependencies.preact) {
				return {
					filePath: runtimePath,
					isEntry: true
				};
			}
		}
	}
});
