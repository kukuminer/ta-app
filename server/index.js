const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:docker@host.docker.internal:5432/testdb");

db.any('SELECT now()', [])
    .then((data) => {
        console.log('SQL Connection established at ', data)
    })
    .catch((error) => {
        console.log('SQL ERROR:\n', error)
    });

app.get("/db", (req, res) => {
    db.any('SELECT * from application', [])
        .then((data) => {
            console.log('psql res: ', data)
            res.json({ data: data });
        })
        .catch((error) => {
            console.log('psql err: ', error)
            res.json({ error: error });
        });
});

app.get("/api/user/:userid", (req, res) => {
    id = req.params.userid;
    // SELECT usertype FROM users WHERE id = $1
    db.any("SELECT usertype FROM users WHERE id = $1", id)
        .then((data) => {
            if (data.length > 1) throw new Error("Retrieved more than one user??")
            res.json({ userType: data[0].usertype });
        })
        .catch((error) => {
            console.log('error retrieving usertype from db')
            res.json({ userType: error })
        })

})

/** 
 * For populating the professor dashboard
 */
app.get("/api/professor/courses/:userid", (req, res) => {
    const id = req.params.userid
    db.any("SELECT course, letter FROM section WHERE profid=$1 AND isCurrent=true", id)
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
 * SELECT firstname, lastname, grade, interest, qualification, pref, note
    FROM application 
    INNER JOIN section
    ON application.course = section.course 
    AND application.term = section.term
    INNER JOIN users
    ON application.student = users.id
    LEFT OUTER JOIN assignment
    ON application.student = assignment.student
    WHERE profid = 2
    AND iscurrent = true
    AND section.course = '2030'
    AND section.letter = 'A'
    `
 */
app.get("/api/professor/:course/:letter/:userid", (req, res) => {
    const id = req.params.userid
    const course = req.params.course
    const letter = req.params.letter
    dbQuery =
        `
    SELECT section.id as sectionId, users.id as userId, firstname, lastname, grade, interest, qualification, pref, note
    FROM application 
    INNER JOIN section
    ON application.course = section.course 
    AND application.term = section.term
    INNER JOIN users
    ON application.student = users.id
    LEFT OUTER JOIN assignment
    ON application.student = assignment.student
    WHERE profid = $1
    AND iscurrent = true
    AND section.course = $2
    AND section.letter = $3
    `
    db.any(dbQuery, [id, course, letter])
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
        if(data.length !== 1) throw new Error('Bad auth')
        res.json(data)
    })
    .catch((error) => {
        console.log('db assignment upsert error: ', error)
        res.json({status: 400})
    })
    // res.json({ status: 200 })
})


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