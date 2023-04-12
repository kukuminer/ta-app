module.exports = {
    getUser: function (req, fromURL) {
        if (fromURL) {
            return req.params.userId
        }
        else {
            return req.get("PYork-User")
        }
    }
}