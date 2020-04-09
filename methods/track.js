const CLEAR_TIME = 60 * 1000;
const ALERT_TIME = 60 * 1000;

const radius = 100;

const nearby_options = {
    withCoordinates: true, 
    withHashes: true,
    withDistances: true,
    order: 'ASC', 
    units: 'm',
    count: 64,
    accurate: false
};

module.exports = async function(req, res) {
    const token = req.body.token;
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const rssi = req.body.rssi;
    if (!lat || !lon || !rssi) {
        return res.json({
            'error': 'no latitude, longitude or rssi'
        });
    }
    const lat_lon = { latitude: lat, longitude: lon };
    req.geo.addLocation(token, lat_lon, (err, _) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                'error': 'Internal Server Error'
            });
        }
        req.geo.nearby(lat_lon, radius, nearby_options, async function(err, locations) {
            try {
                if (err) { throw err; }

                const time = Date.now();

                const tokens = locations.map(location => {
                    return location['key'];
                }).filter(key => key != token);

                const bt_tokens = rssi.map(
                    token => token.public_token
                );

                let users = await req.db.User.find({ token: { $in: tokens } });
                let bt_users = await req.db.User.find({ public_token: { $in: bt_tokens } });

                users = users.concat(bt_users);

                users = users.filter(user => time - user.stats.last_update < CLEAR_TIME);
                let stats = req.user.stats;

                let time_since_update = time - stats.last_update;
                if (time_since_update > CLEAR_TIME) {
                    stats.last_medium = 0;
                    stats.last_covid = 0;
                    time_since_update = 0;
                }
                stats.last_update = time;

                const has_medium = users.filter(user => user.health_status == "medium").length > 0;
                const has_covid = users.filter(user => user.health_status == "covid19").length > 0;

                if (has_covid && stats.last_covid == 0) {
                    stats.last_covid = time;
                } else if (!has_covid) {
                    stats.last_covid = 0;
                }

                if ((has_medium || has_covid) && stats.last_medium == 0) {
                    stats.last_medium = time;
                } else if (!(has_medium || has_covid)) {
                    stats.last_medium = 0;
                }

                let result = '';

                if (stats.last_covid != 0 && time - stats.last_covid > ALERT_TIME) {
                     result = 'alert';
                     stats.alert += time_since_update;
                } else if (stats.last_medium != 0 && time - stats.last_medium > ALERT_TIME) {
                     result = 'sustained';
                     stats.sustained += time_since_update;
                } else if (stats.last_medium != 0 || stats.last_covid != 0) {
                     result = 'passing';
                     stats.passing += time_since_update;
                } else {
                    result = 'clear';
                    stats.clear += time_since_update;
                }

                req.user.stats = stats;
                await req.user.save();
                res.json({ "result": result });
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    'error': 'Internal Server Error'
                });
            }
        });
    });
}