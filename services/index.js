const readDir = require('./directory').directory;

let directory = new readDir();
let skipFiles = ['index'];
let fileObj = directory.requireFiles(__dirname, skipFiles);

module.exports = fileObj
