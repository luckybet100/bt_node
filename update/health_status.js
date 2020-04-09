const options = [ "ok", "medium", "covid19" ]

module.exports = async function(req, res) {
    try {
        const health_status = req.body.health_status;
        if (!health_status) {
            res.json({
                'error': 'no health_status'
            });
        } else if (options.includes(health_status)) {
            req.user.health_status = health_status;
            await req.user.save();
            res.json({ });
        } else {
            res.json({
                'error': `Invalid health_status. Possible values: ${options.toString()}`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'error': 'Internal Server Error'
        });
    }
}