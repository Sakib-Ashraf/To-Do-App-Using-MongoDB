const jwt = require('jsonwebtoken');
const config = require('../config');

const Checker = (req, res, next) => {
	const { authorization } = req.headers;

	try {
		const token = authorization.split(' ')[1];
		const decoded = jwt.verify(token, config.JWT_SECRET);
		const { username, userId } = decoded;
		req.username = username;
		req.userId = userId;
		next();
    } catch (error) {
        console.log(error);
		next('authentication failed!');
	}
};

module.exports = Checker;
