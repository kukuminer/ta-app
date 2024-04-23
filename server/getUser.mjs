// const URL_ID = process.env.USER_ID_IN_URL || false;
// if (URL_ID) console.log("GETTING USER FROM URL");

let DEBUG;
let DEBUG_NAME;
// const D = "eee";
// console.log(DEBUG_NAME);
// console.log(process.env.DEBUG_NAME);
// if (DEBUG) console.log("DEBUG MODE; NAME: ", DEBUG_NAME);

function init() {
  DEBUG = process.env.DEBUG_MODE || false;
  DEBUG_NAME = process.env.DEBUG_NAME;
  if (DEBUG) console.log("DEBUG MODE; NAME: ", DEBUG_NAME);
}

function getUser(req) {
  if (DEBUG && !DEBUG_NAME) console.log("Missing DEBUG_NAME in .env!");
  return DEBUG ? DEBUG_NAME : req.get("PYork-User");
}
export { getUser, init };
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
