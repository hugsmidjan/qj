/* global process require */
if ( process.env.NODE_ENV !== 'development' ) {
    const exec = require('child_process').execSync;
    exec('rm -rf build  &&  cp -R cjs/* .  &&  rm -rf cjs');
}
