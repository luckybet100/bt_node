module.exports = (req, res) => {
    res.json({ 'date_birth': req.user.date_birth,
    		   'gender': req.user.gender,
    		   'health_status': req.user.health_status
    });
}