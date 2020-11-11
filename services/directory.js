const path = require('path');
const fs = require('fs');

class directory {

	constructor() {}
	/**
	 * getFiles
	 * @param {*} dir
	 * @param {*} skip
	 */
	getFiles(dir, skip) {

		let files = fs.readdirSync(dir);

		files = files.map((file) => {
				file = path.parse(file).name;
				return file;
			})
			.filter(file => {
				if (Array.isArray(skip)) {
					return skip.indexOf(file) == -1;
				}
				return true;
			})
		return files;
	}
	/**
	 * requireFiles
	 * @param { } dir
	 * @param {*} skip
	 */
	requireFiles(dir, skip) {

		if (dir) {
			let files = this.getFiles(dir, skip);
			if (Array.isArray(files)) {
				let fileObj = {};
				files.forEach(file => {
					fileObj[file] = require(`${dir}/${file}`);
				})
				return fileObj;
			} else {
				throw new Error('Error');
			}
		} else {
			throw new Error('Error');
		}
	}
}

module.exports = {
	directory: directory
}
