// const getUser = require("../getUser").getUser;
import { getUser, init } from "../getUser.mjs";

const USERTYPES = ["applicant", "instructor", "admin"];

function auth({ app, db }) {
  init();
  // Set userid
  app.use("/api", async (req, res, next) => {
    const id = getUser(req);
    if (!id) res.status(403).send("You must be signed in!");
    else {
      res.locals.userid = id;
      next();
    }
  });

  // Set usertype
  app.use("/api", async (req, res, next) => {
    const dbQuery = `SELECT usertype FROM users WHERE username=$1`;
    const u = await db.oneOrNone(dbQuery, [res.locals.userid]);
    res.locals.usertype = u?.usertype ?? "applicant";
    next();
  });

  // REFACTOR ENDPOINTS, THEN SWITCH TO THIS: (and remove the following 3 middleware)

  app.use("/api/:usertype", async (req, res, next) => {
    // console.log(req.originalUrl)
    if (
      !USERTYPES.includes(req.params.usertype) ||
      res.locals.usertype === req.params.usertype
    ) {
      next();
      return;
    }
    console.log("Forbidden request from", req.socket.remoteAddress);
    res.status(403).send("You are not allowed to do that");
  });
}

export { auth };

// app.use("/api/student", async (req, res, next) => {
//     if(res.locals.usertype === 'applicant') {
//         next()
//         return
//     }
//     console.log("Forbidden request from", req.socket.remoteAddress)
//     res.status(403).send("You are not allowed to do that")
// })

// app.use("/api/professor", async (req, res, next) => {
//     if(res.locals.usertype === 'professor') {
//         next()
//         return
//     }
//     console.log("Forbidden request from", req.socket.remoteAddress)
//     res.status(403).send("You are not allowed to do that")
// })

// app.use("/api/admin", async (req, res, next) => {
//     if(res.locals.usertype === 'admin') {
//         next()
//         return
//     }
//     console.log("Forbidden request from", req.socket.remoteAddress)
//     res.status(403).send("You are not allowed to do that")
// })
