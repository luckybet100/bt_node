module.exports = async function(req, res) {
    try {
        const date_birth = req.body.date_birth;
        if (!date_birth) {
            res.json({
                'error': 'no date_birth'
            });
        } else {
            req.user.date_birth = date_birth;
            await req.user.save();
            res.json({ });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'error': 'Internal Server Error'
        });
    }
}