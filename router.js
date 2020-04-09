const body_parser = require('body-parser')
const morgan_body = require('morgan-body');

const auth_anonymus = require('./auth/anonymus.js');
const auth_google = require('./auth/google.js');
const auth_fb = require('./auth/fb.js');

const method_account = require('./methods/account.js')
const method_stats = require('./methods/stats.js')
const method_track = require('./methods/track.js')
const method_check_token = require('./methods/check_token.js')

const update_gender = require('./update/gender.js')
const update_stats = require('./update/stats.js')
const update_date_birth = require('./update/date_birth.js')
const update_health_status = require('./update/health_status.js')

var parseJsonBody = function (req, res, next) {
    try {
        req.body = JSON.parse(req.body);
        next();
    } catch (err) {
        res.json({ 'error': "could not parse json" });
    }
};

module.exports.initialize = (app, db, geo) => {

	morgan_body(app);

	const provide_db = (req, res, next) => {
		req.db = db;
		req.geo = geo;
		next();
	};

	app.post('/auth/anonymus', provide_db, auth_anonymus);
	app.post('/auth/google', provide_db, body_parser.text(), parseJsonBody, auth_google);
	app.post('/auth/fb', provide_db, body_parser.text(), parseJsonBody, auth_fb);

	const provide_user = async function(req, res, next) {
		try {
	        const token = req.body.token;
	        if (!token)
	        	return res.json({ 'error': 'no access token' });
	        req.user = await db.User.findOne({token: token});
	        if (!req.user)
	        	return res.json({ 'error': 'invalid access token' });
	        next();
	    } catch (err) {
	    	console.error(err);
	        res.status(500).json({
	        	'error': 'Internal server error'
	        });
	    }
	};

	app.post('/account', provide_db, body_parser.text(), parseJsonBody, provide_user, method_account);
	app.post('/stats', provide_db, body_parser.text(), parseJsonBody, provide_user, method_stats);
	app.post('/track', provide_db, body_parser.text(), parseJsonBody, provide_user, method_track);
	app.post('/check_token', provide_db, body_parser.text(), parseJsonBody, provide_user, method_check_token);

	app.post('/update/gender', provide_db, body_parser.text(), parseJsonBody, provide_user, update_gender);
	app.post('/update/stats', provide_db, body_parser.text(), parseJsonBody, provide_user, update_stats);
	app.post('/update/date_birth', provide_db, body_parser.text(), parseJsonBody, provide_user, update_date_birth);
	app.post('/update/health_status', provide_db, body_parser.text(), parseJsonBody, provide_user, update_health_status);

	console.log('Routes initialized!');
}