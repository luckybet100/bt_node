module.exports = async function(req, res) {
    try {
        req.user.stats = {
            clear: 1,
            passing: 0,
            sustained: 0,
            alert: 0,
            last_update: 0,
            last_covid: 0,
            last_medium: 0
        };
        await req.user.save();
        res.json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'error': 'Internal Server Error'
        });
    }
}