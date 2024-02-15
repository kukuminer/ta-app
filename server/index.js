const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
/**
 * NOTE: In most of the endpoints, "id" actually refers to the username
 */
const PORT = process.env.PORT || 3001;

const DB_USER = process.env.DB_USER || "postgres";
const DB_PASS = process.env.DB_PASSWORD || "docker";
const DB_HOST = process.env.DB_HOST || "host.docker.internal";
const DB_PORT = process.env.DB_PORT || "5432";
const DB_NAME = process.env.DB_NAME || "ta_db";

const pgp = require("pg-promise")();
const db = pgp({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS,
});

require("./runMigrations")({ db, pgp });
// import migrate from "./runMigrations.js";
// await migrate({ db, pgp });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./middleware/auth")({ app, db, pgp });
require("./api/applicant")({ app, db, pgp });
require("./api/instructor")({ app, db, pgp });
require("./api/admin")({ app, db, pgp });

db.one("SELECT now()", [])
  .then((data) => {
    console.log("SQL Connection established at", data?.now);
  })
  .catch((error) => {
    console.log("SQL ERROR:\n", error);
  });

/**
 * Gets all user info for profile page
 */
app.get("/api/user/:userid", (req, res) => {
  id = res.locals.userid;
  dbQuery = `
    SELECT firstname, lastname, email, usertype, username
    FROM users
    WHERE username = $1
    `;
  db.any(dbQuery, [id])
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("error fetching user info from db:", error);
      res.status(500).send(error);
    });
});

/**
 * Posts user info to DB
 *     
    INSERT INTO users (username, firstname, lastname, email, usertype)
    VALUES ('kuku', 'liran', 'zheku', 'liranz@yorku.ca', 'admin')
    ON CONFLICT (username) DO UPDATE 
    SET firstname='liran', lastname='zheku', 
    email='liranz@yorku.ca', usertype='admin'
    WHERE users.username='kuku'
 */
app.post("/api/user/update", (req, res) => {
  const r = req.body.state;
  r.username = res.locals.userid;
  r.usertype = res.locals.usertype;

  const colSet = new pgp.helpers.ColumnSet(
    ["username", "firstname", "lastname", "email", "usertype"],
    { table: "users" }
  );
  const postQuery =
    pgp.helpers.insert(r, colSet) +
    ' ON CONFLICT ("username") DO UPDATE SET ' +
    colSet.assignColumns({ from: "EXCLUDED", skip: "username" }) +
    " RETURNING usertype";

  db.any(postQuery)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

/**
 * Gets usertype from userId
 */
app.get("/api/userdata", (req, res) => {
  const id = res.locals.userid;
  // SELECT usertype FROM users WHERE id = $1
  db.oneOrNone("SELECT username, usertype FROM users WHERE username = $1", [id])
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.json({ usertype: null });
      }
    })
    .catch((error) => {
      console.log("error retrieving usertype from db on login");
      res.status(500).send(error);
    });
});

/**
 * Gets public section info, insecure endpoint (no id check)
 * Gets:
 *  course (2030)
 *  letter (A)
 *  term (W23)
 */
app.get("/api/section/:sectionId", (req, res) => {
  const sectionId = req.params.sectionId;
  const dbQuery = `
        SELECT course.code AS course, letter, term FROM section 
        INNER JOIN course ON section.course=course.id
        WHERE section.id = $1
    `;
  db.any(dbQuery, sectionId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("error retrieving section data from db:", sectionId);
      res.status(400).send(error);
    });
});

// /**
//  * Public endpoint to get term name from term ID
//  */
// app.get("/api/term/:termId", (req, res) => {
//     const termId = req.params.termId
//     const dbQuery = `SELECT term, visible FROM term WHERE id=$1`
//     db.oneOrNone(dbQuery, [termId])
//         .then((data) => {
//             res.json(data)
//         })
//         .catch((error) => {
//             console.log('error retrieving term data from db:', termId)
//             res.status(400).send(error)
//         })
// })

/**
 * ENDPOINTS BELOW HERE TO BE DELETED
 */
//For testing:
app.post("/api/post/:ding", (req, res) => {
  console.log(req.params.ding);
  console.log(req.body);
  res.json({ message: "received" });
});

//do via form
app.post("/db", (req, res) => {
  db.any("SELECT now()", [])
    .then((data) => {
      console.log("posting at: ", data);
      res.json({ response: data });
    })
    .catch((error) => {
      console.log("psql err: ", error);
      res.json({ error: error });
    });
});

app.get("/api", (req, res) => {
  console.log("Connection from", req.headers.host);
  res.json({ message: "Backend connection established" });
});

app.listen(PORT, () => {
  console.log(`SERVER listening on ${PORT}`);
});
