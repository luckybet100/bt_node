const request = require('sync-request');

const host = process.argv[2]

function testAuth() {
	console.log('sending auth request');
	let auth = JSON.parse(request('POST', `${host}/auth/anonymus`).getBody('utf-8'));
	if (auth.error) {
		throw auth.error;
	}
	if (!auth.token) {
		throw "no access token";
	}
	return auth.token;
}

tests = [ testAuth ]
tests.forEach(test => {
	console.log(`STARTING ${test}`);
	test();
	console.log(`PASSED ${test}`);
})

