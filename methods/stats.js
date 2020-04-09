module.exports = (req, res) => {
    const stats = req.user.stats;
    const total = stats.clear + stats.passing + stats.sustained + stats.alert;
    let risk = ''
    if (stats.alert / total >= 0.25) {
        risk = 'HIGH'
    } else if (stats.clear >= 0.5) {
        risk = 'LOW'
    } else {
        risk = 'MEDIUM'
    }
    res.json({
        'clear': Math.round(stats.clear / total * 100),
        'passing': Math.round(stats.passing / total * 100),
        'sustained': Math.round(stats.sustained / total * 100),
        'alert': Math.round(stats.alert / total * 100),
        'risk': risk
    });
}