const { isComponent, compareSignatures } = require('@prefresh/utils');

const NAMESPACE = '__PREFRESH__';

// eslint-disable-next-line
const getExports = m => m.exports;

const registerExports = m => {
	let isCitizen = false;
	const moduleId = m.id;
	const moduleExports = getExports(m);

	if (
		typeof moduleExports === 'function' &&
		isComponent(moduleExports.displayName || moduleExports.name)
	) {
		isCitizen = true;
		window.__PREFRESH__.register(moduleExports, moduleId + ' %exports%');
	}

	if (
		moduleExports === undefined ||
		moduleExports === null ||
		typeof moduleExports !== 'object'
	) {
		isCitizen = isCitizen || false;
	} else {
		for (const key in moduleExports) {
			if (key === '__esModule') continue;

			const exportValue = moduleExports[key];
			if (
				typeof exportValue === 'function' &&
				isComponent(exportValue.displayName || exportValue.name)
			) {
				isCitizen = isCitizen || true;
				const typeID = moduleId + ' %exports% ' + key;
				window.__PREFRESH__.register(exportValue, typeID);
			}
		}
	}

	return isCitizen;
};

function prelude(m) {
	window.$RefreshSig$ = () => {
		let status = 'begin';
		let savedType;
		return (type, key, forceReset, getCustomHooks) => {
			if (!savedType) savedType = type;
			status = self[NAMESPACE].sign(
				type || savedType,
				key,
				forceReset,
				getCustomHooks,
				status
			);
		};
	};

	window.$RefreshReg$ = (type, id) => {
		self[NAMESPACE].register(type, m.i + ' ' + id);
	};
}

function postlude(m) {
	const isPrefreshComponent = registerExports(m);

	if (m.hot && isPrefreshComponent) {
		const hotModuleExports = getExports(m);
		const previousHotModuleExports = m.hot.data && m.hot.data.moduleExports;

		if (previousHotModuleExports) {
			for (let i in hotModuleExports) {
				try {
					if (typeof hotModuleExports[i] === 'function') {
						if (i in previousHotModuleExports) {
							compareSignatures(
								previousHotModuleExports[i],
								hotModuleExports[i]
							);
						}
					}
				} catch (e) {
					// Only available in newer webpack versions.
					if (m.hot.invalidate) {
						m.hot.invalidate();
					} else {
						self.location.reload();
					}
				}
			}
		}

		m.hot.dispose(function(data) {
			data.moduleExports = getExports(m);
		});

		m.hot.accept(function errorRecovery() {
			// require.cache[m.id].hot.accept(errorRecovery);
		});
	}
}

module.exports = Object.freeze({
	postlude,
	prelude
});
