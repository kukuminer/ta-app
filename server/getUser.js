const URL_ID = process.env.USER_ID_IN_URL || false
if (URL_ID) console.log("GETTING USER FROM URL")

const DEBUG = process.env.DEBUG_MODE || false
const DEBUG_NAME = process.env.DEBUG_NAME;
if (DEBUG) console.log("DEBUG MODE; NAME: ", DEBUG_NAME)

module.exports = {
    getUser: function(req) {
        if(DEBUG && !DEBUG_NAME) console.log("Missing DEBUG_NAME in .env!")
        return DEBUG ? DEBUG_NAME : req.get("PYork-User")
    },
    // getUser: function (req) {
    //     if (URL_ID) {
    //         return req.params.userId
    //     }
    //     else {
    //         return req.get("PYork-User")
    //     }
    // },
    // getUserFromBody: function(req, key='userId',) {
    //     if (URL_ID) {
    //         return req.body[key]
    //     }
    //     else {
    //         return req.get("PYork-User")
    //     }
    // },
}