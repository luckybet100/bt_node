module.exports = async function(req, res) {
    try {
        const user = req.db.newUser();
        await user.save();
        res.json({ 'token': user.token, 'public_token': user.public_token });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'error': 'Internal Server Error'
        });
    }
}