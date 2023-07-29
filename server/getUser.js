const URL_ID = process.env.USER_ID_IN_URL || false
if (URL_ID) console.log("GETTING USER FROM URL")

module.exports = {
    getUser: function (req) {
        if (URL_ID) {
            return req.params.userId
        }
        else {
            return req.get("PYork-User")
        }
    },
    getUserFromBody: function(req, key='userId') {
        if (URL_ID) {
            return req.body[key]
        }
        else {
            return req.get("PYork-User")
        }
    }
}