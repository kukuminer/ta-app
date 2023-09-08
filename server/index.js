const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
// const getUser = require('./getUser.js').getUser;
// const Async = require("async");
/**
 * TODO: ADD ENV FOR GET USER 
 * req.get("PYork-User") COMPLETE
 * TODO: nohup to run (or multi tab)
 * ps ux to see processes
 * kill PID to kill processes COMPLETE
 * 
 * NOTE: In most of the endpoints, "id" actually refers to the username
 */
const PORT = process.env.PORT || 3001;

const DB_USER = process.env.DB_USER || 'postgres'
const DB_PASS = process.env.DB_PASSWORD || 'docker'
const DB_HOST = process.env.DB_HOST || 'host.docker.internal'
const DB_PORT = process.env.DB_PORT || '5432'
const DB_NAME = process.env.DB_NAME || 'ta_db'

const pgp = require("pg-promise")();
const db = pgp("postgres://" + DB_USER + ":" + DB_PASS + "@" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME)

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./middleware/auth')({ app, db, pgp })
require('./api/applicant')({ app, db, pgp })
require('./api/instructor')({ app, db, pgp })
require('./api/admin')({ app, db, pgp })

db.any('SELECT now()', [])
    .then((data) => {
        console.log('SQL Connection established at ', data)
    })
    .catch((error) => {
        console.log('SQL ERROR:\n', error)
    });

/**
 * Gets all user info for profile page
 */
app.get("/api/user/:userid", (req, res) => {
    id = res.locals.userid
    dbQuery = `
    SELECT firstname, lastname, email, usertype, username
    FROM users
    WHERE username = $1
    `
    db.any(dbQuery, [id])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log("error fetching user info from db:", error)
            res.status(500).send(error)
        })
})

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
    const r = req.body.state
    r.username = res.locals.userid
    r.usertype = res.locals.usertype

    const colSet = new pgp.helpers.ColumnSet(
        ['username', 'firstname', 'lastname', 'email', 'usertype'],
        { table: 'users' }
    )
    const postQuery = pgp.helpers.insert(r, colSet) +
        ' ON CONFLICT ("username") DO UPDATE SET ' +
        colSet.assignColumns({ from: 'EXCLUDED', skip: 'username' }) +
        ' RETURNING usertype'

    db.any(postQuery)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
})

/**
 * Gets usertype from userId
 */
app.get("/api/usertype/:userId", (req, res) => {
    id = res.locals.userid
    // SELECT usertype FROM users WHERE id = $1
    db.any("SELECT usertype FROM users WHERE username = $1", [id])
        .then((data) => {
            if (data.length > 1) {
                throw new Error("DB returned more than one user")
            }
            else if (data.length === 1) {
                res.json(data[0]);
            }
            else {
                res.json({ usertype: null })
            }
        })
        .catch((error) => {
            console.log('error retrieving usertype from db on login')
            res.status(500).send(error)
        })
})

/**
 * Gets public section info, insecure endpoint (no id check)
 * Gets:
 *  course (2030)
 *  letter (A)
 *  term (W23)
 */
app.get("/api/section/:sectionId", (req, res) => {
    const sectionId = req.params.sectionId
    const dbQuery = `
        SELECT course.code AS course, letter, term FROM section 
        INNER JOIN course ON section.course=course.id
        WHERE section.id = $1
    `
    db.any(dbQuery, sectionId)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving section data from db:', sectionId)
            res.status(400).send(error)
        })
})

/**
 * ENDPOINTS BELOW HERE TO BE DELETED
 */
//For testing:
app.post("/api/post/:ding", (req, res) => {
    console.log(req.params.ding)
    console.log(req.body)
    res.json({ message: 'received' })
})

//do via form
app.post("/db", (req, res) => {
    db.any('SELECT now()', [])
        .then((data) => {
            console.log('posting at: ', data)
            res.json({ response: data });
        })
        .catch((error) => {
            console.log('psql err: ', error)
            res.json({ error: error });
        })
});

app.get("/api", (req, res) => {
    console.log("Connection from", req.headers.host)
    res.json({ message: "Backend connection established" });
});

app.listen(PORT, () => {
    console.log(`SERVER listening on ${PORT}`);
});