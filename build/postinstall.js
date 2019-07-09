/* global process require */
const env = process.env;
const initCwd = env.INIT_CWD
if (
    // This seems to happen when running `yarn install` on a parent project (installing qj as a dependency)
    // on Win10's Linux sub-system.
    typeof initCwd === 'undefined' ||
    // if INIT_CWD (yarn/npm install invocation) and PWD are the same, then local (dev) install/add is taking place
    // local (dev) yarn install may have been run from a project subfolder
    initCwd.indexOf(env.PWD) !== 0
) {
  if (typeof initCwd === 'undefined') {
    console.warn('process.env.INIT_CWD is undefined.');
  }
  const exec = require('child_process').execSync;
    if (process.platform === 'win32') { // Ack!
        exec('xcopy dist\\* . /s' + ['', 'dist', 'build', 'src'].join('  &&  rmdir /s /q '));
    }
    else {
        exec('cp -R dist/* .  &&  rm -rf dist build src');
    }
}
else {
  console.info('Skipping `postinstall` script on local installs');
}
