const db = require("./repo/db.js");
const config = require("./repo/config.js");
const express = require("express");
const router = require("./router.js");
const redis = require('redis')

let redis_client = redis.createClient(config.redis_port, config.redis_url)
let app = express();
let geo = require('georedis').initialize(redis_client)

redis_client.on('connect', function() {
	console.log('Connected to redis!');
	db.connect(config.db_url).then(() => {
		router.initialize(app, db, geo);
	}).then(() => {
		app.listen(config.port, function () {
	        console.log(`Listenning on port ${config.port}...`);
	    });
	}).catch(console.error);
});
