const { parallel, series, src, dest } = require('gulp');
const rollupTaskFactory = require('@hugsmidjan/gulp-rollup');
const del = require('del');
const writeFile = require('fs').writeFileSync;

// ===========================================================================

const {
	srcFolder,
	distFolder,
	testingFolder,
	scriptsBundleMap,
	testGlobs,
	polyfillsGlobs,
	polyfillsSrcFolder,
	polyfillsDistFolder,
} = require('./build-config');

// ===========================================================================

// Returns true for local module ids (treats node_modules/*  as external)
const isNonLocalModule = (id) => !/^(?:\0|\.|\/|tslib)/.test(id);

const baseOpts = {
	src: srcFolder,
	format: 'cjs',
	minify: false,
	sourcemaps: false,
	inputOpts: { external: isNonLocalModule },
	outputOpts: { strict: false },
};

// ===========================================================================

const [scriptsBundle, scriptsWatch] = rollupTaskFactory({
	...baseOpts,
	name: 'scripts',
	entryPoints: scriptsBundleMap,
	dist: distFolder,
	typescriptOpts: { declaration: true },
});

const [polyfillsBundle, polyfillsWatch] = rollupTaskFactory({
	...baseOpts,
	name: 'polyfills',
	src: polyfillsSrcFolder,
	glob: polyfillsGlobs,
	dist: polyfillsDistFolder,
});

const [testsBundle, testsWatch] = rollupTaskFactory({
	...baseOpts,
	name: 'build_tests',
	glob: testGlobs,
	dist: testingFolder,
	// TODO: Create a ospec gulp plugin
	// onWatchEvent: (e) => {
	// 	if (e.code === 'BUNDLE_END') {
	// 		console.info('ospec __tests/' + Object.keys(e.input)[0] + '.js');
	// 		require('child_process').execSync(
	// 			'ospec __tests/' + Object.keys(e.input)[0] + '.js'
	// 		);
	// 	}
	// },
});

// ---------------------------------------------------------------------------

const cleanup = () => del([distFolder, testingFolder]);

const makePackageJson = (done) => {
	const pkg = require('./package.json');
	const { dist_package_json } = pkg;
	delete pkg.scripts;
	delete pkg.engines;
	delete pkg.devDependencies;
	delete pkg.hxmstyle;
	delete pkg.dist_package_json;
	Object.assign(pkg, dist_package_json);
	writeFile(distFolder + 'package.json', JSON.stringify(pkg, null, '\t'));
	done();
};

const copyDocs = () => src(['README.md', 'CHANGELOG.md']).pipe(dest(distFolder));

// ===========================================================================

const build = parallel(scriptsBundle, polyfillsBundle, testsBundle);
const watch = parallel(scriptsWatch, polyfillsWatch, testsWatch);
const publishPrep = parallel(makePackageJson, copyDocs);

// ---------------------------------------------------------------------------

exports.dev = series(cleanup, build, watch);
exports.build = series(cleanup, build, publishPrep);
exports.default = build;
