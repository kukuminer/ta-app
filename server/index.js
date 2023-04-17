const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const getUser = require('./getUser.js')
/**
 * TODO: ADD ENV FOR GET USER 
 * req.get("PYork-User")
 * TODO: nohup to run (or multi tab)
 * ps ux to see processes
 * kill PID to kill processes
 */
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_USER = process.env.DB_USER || 'postgres'
const DB_PASS = process.env.DB_PASSWORD || 'docker'
const DB_HOST = process.env.DB_HOST || 'host.docker.internal'
const DB_PORT = process.env.DB_PORT || '5432'
const DB_NAME = process.env.DB_NAME || 'ta_db'

const URL_ID = process.env.USER_ID_IN_URL || false

const pgp = require("pg-promise")();
const db = pgp("postgres://" + DB_USER + ":" + DB_PASS + "@" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME)

db.any('SELECT now()', [])
    .then((data) => {
        console.log('SQL Connection established at ', data)
    })
    .catch((error) => {
        console.log('SQL ERROR:\n', error)
    });

app.get("/api/user/:userId", (req, res) => {
    id = getUser.getUser(req, URL_ID);
    // SELECT usertype FROM users WHERE id = $1
    db.any("SELECT usertype FROM users WHERE id = $1", [id])
        .then((data) => {
            if (data.length > 1) throw new Error("Retrieved more than one user??")
            res.json({ userType: data[0].usertype });
        })
        .catch((error) => {
            console.log('error retrieving usertype from db on login')
            res.json({ userType: error })
        })

})

/** 
 * For populating the professor dashboard
 */
app.get("/api/professor/courses/:userId", (req, res) => {
    const id = getUser.getUser(req, URL_ID)
    db.any("SELECT id, course, letter, term FROM section WHERE profid=$1 AND isCurrent=true", id)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving prof sections from db')
            res.json({ error: error })
        })
})

/**
 * For populationg the professor section view
 * `
    SELECT section.id as sectionId, users.id as userId, firstname, lastname, grade, interest, qualification, pref, note
    FROM application 
    INNER JOIN users 
    ON application.student=users.id
    INNER JOIN section
    ON application.course = section.course AND application.term = section.term
    LEFT JOIN assignment 
    ON application.student = assignment.student AND section.id = assignment.section
    WHERE section.id = 1
    AND profid = 2
    `
 */
app.get("/api/professor/:sectionId/:userId", (req, res) => {
    const id = getUser.getUser(req, URL_ID)
    // const course = req.params.course
    // const letter = req.params.letter
    const sectionId = req.params.sectionId
    dbQuery =
        `
    SELECT section.id as sectionId, users.id as userId, firstname, lastname, grade, interest, qualification, pref, note
    FROM application 
    INNER JOIN users 
    ON application.student=users.id
    INNER JOIN section
    ON application.course = section.course AND application.term = section.term
    LEFT JOIN assignment 
    ON application.student = assignment.student AND section.id = assignment.section
    WHERE section.id = $1
    AND profid = $2
        `
    db.any(dbQuery, [sectionId, id])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving prof section info from db')
            res.json({ error: error })
        })
})

/**
 * For updating prof preference and note 
 */
app.post("/api/professor/assignment", (req, res) => {
    /*
    INSERT INTO assignment(student, section, pref, note)
    VALUES (3, (SELECT id FROM section WHERE profid=2 AND id=1), 1, 'eebe')
    ON CONFLICT (student, section)
    DO UPDATE SET pref = 1, note = 'eeb'
    WHERE assignment.student = 3 
    AND assignment.section in (SELECT id FROM section WHERE profid=4 AND id=1)
    RETURNING assignment.id
     */
    const dbQuery = `
    INSERT INTO assignment(student, section, pref, note)
    VALUES ($1, (SELECT id FROM section WHERE profid=$5 AND id=$2), $3, $4)
    ON CONFLICT (student, section)
    DO UPDATE SET pref = $3, note = $4
    WHERE assignment.student = $1 
    AND assignment.section in (SELECT id FROM section WHERE profid=$5 AND id=$2)
    RETURNING assignment.id, assignment.pref, assignment.note
    `
    const r = req.body
    db.any(dbQuery, [r.studentId, r.sectionId, r.pref, r.note, r.userId])
        .then((data) => {
            if (data.length !== 1) throw new Error('Bad auth')
            res.json(data)
        })
        .catch((error) => {
            console.log('db assignment upsert error: ', error)
            res.json({ status: 400 })
        })
    // res.json({ status: 200 })
})

app.get("/api/student/applications/:userId", (req, res) => {
    const userId = getUser.getUser(req, URL_ID)
    const dbQuery = "SELECT term, availability, approval, explanation, incanada, iscurrent FROM termapplication WHERE student=$1"
    db.any(dbQuery, userId)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving student applications from db')
            res.json({ error: error })
        })
})


/**
 * Gets all the terms that the student can or has applied to
 * `
SELECT 
    COALESCE(secterm.term, termapplication.term) AS term, 
    COALESCE(secterm.iscurrent, termapplication.iscurrent) AS iscurrent,
    availability, approval, explanation, wantstoteach
FROM
(SELECT DISTINCT term, iscurrent FROM section) AS secterm
FULL OUTER JOIN (SELECT * FROM termapplication WHERE student=3) AS termapplication
ON secterm.term = termapplication.term
`
 */
app.get("/api/student/applications/available/:userId", (req, res) => {
    const userId = getUser.getUser(req, URL_ID)
    const dbQuery = `
    SELECT 
    COALESCE(secterm.term, termapplication.term) AS term, 
    COALESCE(secterm.iscurrent, termapplication.iscurrent) AS iscurrent,
    availability, approval, explanation, incanada, wantstoteach, submitted
    FROM
    (SELECT DISTINCT term, iscurrent FROM section) AS secterm
    FULL OUTER JOIN (SELECT * FROM termapplication WHERE student=$1) AS termapplication
    ON secterm.term = termapplication.term
    `
    // AND section.term NOT IN (SELECT term FROM termapplication)
    db.any(dbQuery, userId)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving available applications from db')
            res.json({ error: error })
        })
})

/**
 * Get the courses that the student has and can apply to 
 * Gets existing applications if they exist
`
SELECT * FROM (SELECT * FROM course WHERE code IN 
(SELECT course FROM section WHERE term='F23')) AS course
LEFT JOIN (SELECT * FROM application WHERE student=3 AND term='F23') AS application
ON application.course = course.code
`
 */
app.get("/api/student/applications/:term/:userId", (req, res) => {
    const userId = getUser.getUser(req, URL_ID)
    const term = req.params.term
    const dbQuery = `
    SELECT code, name, description, grade, interest, qualification
    FROM 
    (SELECT * FROM course WHERE code IN 
        (SELECT course FROM section WHERE term=$2)
    ) AS course
    LEFT JOIN 
    (SELECT * FROM application WHERE student=$1 AND term=$2) AS application
    ON application.course = course.code
    `
    db.any(dbQuery, [userId, term])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving application info on courses from db for term:', term)
            res.json({ error: error })
        })
})

/**
 * Gets public section info, insecure endpoint (no id check)
 */
app.get("/api/section/:sectionId", (req, res) => {
    const sectionId = req.params.sectionId
    const dbQuery = `SELECT course, letter, term, iscurrent FROM section WHERE id = $1`
    db.any(dbQuery, sectionId)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving section data from db:', sectionId)
            res.json({ error: error })
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