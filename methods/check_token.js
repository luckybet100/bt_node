module.exports = (req, res) => {
    res.json({
        'public_token': req.user.public_token
    })
}