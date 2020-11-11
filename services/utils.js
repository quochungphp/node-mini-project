var dateFormat = require('dateformat');
const path = require('path');

class Utils {
	/**
	 * responses
	 * @param {*} res
	 * @param {*} status
	 * @param {*} statusCode
	 * @param {*} message
	 */
	responses(res, status, statusCode, data, message) {
		return res.status(status).json({
			status_code: statusCode,
			data: data,
			msg: message
		});
	}

	/**
	 * checkUserName
	 * @param {*} username
	 * @param {*} locales
	 */
	checkUserName(username, locales) {
		//Độ dài: 5 ~ 16.
		if (username.length < 5 || username.length > 16) {
			return locales.user_register_user_length;
		}
		//Chỉ chứa các ký tự chữ cái, numbers, dashes (-), periods (.), and underscores (_)
		var Regex = /^[a-zA-Z0-9-._]*$/;
		if (Regex.test(username)) {
			return '';
		} else {
			return locales.user_register_user_wrong_format;
		}
	}

	/**
	 * checkPassword
	 * @param {*} password
	 * @param {*} username
	 * @param {*} locales
	 */
	checkPassword(password, username, locales) {
		//Không giống với username.
		if (password === username) {
			return locales.user_register_user_pass;
		}
		//Độ dài: 8 ~ 16
		if (password.length < 8 || password.length > 16) {
			return locales.user_register_pass_length;
		}
		//Phải chứa ít nhất 1 ký tự đặc biệt (e.g. !, @, #, $ etc.)
		//new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'); tối thiểu 8
		var Regex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
		if (Regex.test(password) === false) {
			return locales.user_register_check_pass;
		}
		return '';
	}

	/**
	 * Convert string to object
	 * @param { } string
	 */
	parseJson(string) {
		return JSON.parse(string);
	}

	/**
	 * Write Log
	 * @param { } string
	 */
	writeLog(str, req) {
		if (process.env.WRITE_LOG == 1) {
			var fs = require('fs');
			let currentDate = new Date();
			let dateTime = dateFormat(currentDate, 'yyyymmdd');
			let content = '';
			content += '\n';
			content += 'Time: ' + dateFormat(currentDate, 'yyyy-mm-dd HH:MM:ss') + '; \n\n';
			content += 'Parameter: ' + JSON.stringify(req) + ' \n\n';
			content += str;
			content += '\n';
			content += '-------------------------------------------------------------';
			fs.appendFile('logs/' + dateTime + '.txt', content, function (err) {});
		}
	}
}

module.exports = {
	utils: Utils
}
