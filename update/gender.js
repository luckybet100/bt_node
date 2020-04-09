const options = [ "male", "female", "other" ]

module.exports = async function(req, res) {
    try {
        const gender = req.body.gender;
        if (!gender) {
            res.json({
                'error': 'no gender'
            });
        } else if (options.includes(gender)) {
            req.user.gender = gender;
            await req.user.save();
            res.json({ });
        } else {
            res.json({
                'error': `Invalid gender. Possible values: ${options.toString()}`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'error': 'Internal Server Error'
        });
    }
}