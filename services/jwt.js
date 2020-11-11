const path = require('path');
const jwtToken = require('jsonwebtoken');
const Crypt = require('./crypt').crypt;

class Jwt {

	constructor() {
		this.key = new Buffer(process.env.JWT_KEY).toString('base64');
	}

	/**
	 * Create token
	 * @param {*} data
	 */
	sign(data) {
		let crypt = new Crypt();
		let payload = crypt.encrypt(data);
		let token = jwtToken.sign(payload, this.key);
		expiresIn: ((86400 * 10) * 7) // expires in 7 day
		return token;
	}

	/**
	 * verify
	 * @param {*} token
	 */
	verify(token) {
		let decoded = jwtToken.decode(token, {
			complete: true
		});
		if (typeof decoded === '' || typeof decoded === 'undefined' || decoded === 'null' || decoded === null) {
			return false;
		}
		let payload = decoded.payload;
		let crypt = new Crypt();
		let decrypt = crypt.decrypt(payload);
		try {
			payload = JSON.parse(decrypt);
		} catch (e) {
			payload = decrypt;
		}
		return payload;
	}
}

module.exports = Jwt
