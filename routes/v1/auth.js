var express = require('express');
var router = express.Router();

const UsersModel = require(__path_models + 'users');
const ValidateLogin = require(__path_validates + 'login');
const notify = require(__path_configs + 'notify');

// POST login page
router.post('/login',async function (req, res, next) {

	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateLogin.validator(req);

	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	var username = req.body.username;
	var password = req.body.password;
	if (errors) {
		__utils.responses(res,200 , 401, '', errors);
	} else {
		const response = await UsersModel.findByCredentials(username, password);
		try {

			if (response !== false) {
				var userInfo = {};
				userInfo.id 		= response.id;
				userInfo.email 		= response.email;
				userInfo.login_at 	= Date.now();
				//UsersModel.updateLoginTime(response);
				let dataToken = JSON.stringify(userInfo);

				let buf;
				if (Buffer.from && Buffer.from !== Uint8Array.from) {
					buf = Buffer.from(dataToken);
				} else {
					buf = new Buffer(dataToken);
				}
				userInfo.user_token = __jwt.sign(buf);
				__utils.responses(res,200 , 200, userInfo, '');
			} else {
				__utils.responses(res,200 , 400, '', notify.ERROR_LOGIN);
			}
		} catch (e) {
			__utils.responses(res,200 , 400, '');
		}
		
	}
});

// GET logout page
router.get('/logout', function (req, res, next) {

});

module.exports = router;
