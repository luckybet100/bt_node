const https = require('https');

let options = {
    hostname: 'graph.facebook.com',
    port: 443,
    method: 'GET'
}

const parseBirthday = (birthday) => {
    const params = birthday.split('/');
    return `${params[1]}.${params[0]}.${params[2]}`
}

module.exports = async function(req, res) {
    try {
        const fb_token = req.body.token;
        options.path = `/me?fields=id,gender,birthday&access_token=${fb_token}`
        const api_req = https.request(options, api_res => {
            api_res.on('data', async function(data) {
                try {
                    const body = JSON.parse(data.toString());
                    const fb_id = body.id;
                    let auth = await req.db.FBAuth.findOne({ fb_id: fb_id });
                    if (auth) {
                        res.json({ 'token': auth.token });
                        return;
                    }
                    let user = req.db.newUser();
                    user.gender = body.gender;
                    user.date_birth = parseBirthday(body.birthday);
                    auth = req.db.FBAuth({ fb_id: fb_id, token: user.token });
                    await user.save();
                    await auth.save();
                    res.json({ 'token': auth.token, 'public_token': user.public_token });
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