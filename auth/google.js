const https = require('https');

let options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '/userinfo/v2/me',
    method: 'GET',
    headers: {}
}

module.exports = async function(req, res) {
    try {
        const google_token = req.body.token;
        options.headers.Authorization = `Bearer ${google_token}`;
        const api_req = https.request(options, api_res => {
            api_res.on('data', async function(data) {
                try {
                    const google_id = JSON.parse(data.toString()).id;
                    let auth = await req.db.GoogleAuth.findOne({ google_id: google_id });
                    if (auth) {
                        res.json({ 'token': auth.token });
                        return;
                    }
                    let user = req.db.newUser();
                    auth = req.db.GoogleAuth({ google_id: google_id, token: user.token });
                    await user.save();
                    await auth.save();
                    res.json({ 'token': auth.token, 'public_token': user.public_token  });
                } catch (err) {
                    console.error(err);
                    res.status(500).json({
                        'error': 'Internal Server Error'
                    });
                }
            });
        });
        api_req.on('error', err => {
            res.json({ 'error': err.toString() });
        });
        api_req.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'error': 'Internal Server Error'
        });
    }
}