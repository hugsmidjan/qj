/* global process require */
const env = process.env;
if (
    // if INIT_CWD (yarn/npm install invocation) and PWD are the same, then local (dev) install/add is taking place
    env.INIT_CWD === env.PWD ||
    // local (dev) yarn install may have been run from a project subfolder
    env.INIT_CWD.indexOf(env.PWD) === 0
) {
    console.info('Skipping `postinstall` script on local installs');
}
else {
    const exec = require('child_process').execSync;
    exec('rm -rf build  &&  cp -R dist/* .  &&  rm -rf dist');
}
