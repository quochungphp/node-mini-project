var express = require('express');
var router = express.Router();

/**
 * Welcome function
 * @route GET /
 * @group Index - Welcome page
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.route('/').get(function (req, res) {
    res.json('Pre-Order Management API');
});

module.exports = router;
