module.exports = {
    getUser: function (req, fromURL) {
        if (fromURL) {
            console.log("GETTING USER FROM URL")
            return req.params.userId
        }
        else {
            return req.get("PYork-User")
        }
    }
}