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
    id = getUser.getUser(req);
    // SELECT usertype FROM users WHERE id = $1
    db.any("SELECT usertype FROM users WHERE username = $1", [id])
        .then((data) => {
            res.json({ userType: data[0].usertype });
        })
        .catch((error) => {
            console.log('error retrieving usertype from db on login')
            res.status(500).send(error)
        })
})

/** 
 * For populating the professor dashboard
 */
app.get("/api/professor/courses/:userId", (req, res) => {
    const id = getUser.getUser(req)
    const dbQuery = `
    SELECT id, course, letter, term
    FROM section 
    WHERE profid IN (SELECT id FROM users WHERE username=$1)
    AND iscurrent=true
    `
    db.any(dbQuery, [id])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving prof sections from db')
            res.status(500).send(error)
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
    const id = getUser.getUser(req)
    // const course = req.params.course
    // const letter = req.params.letter
    const sectionId = req.params.sectionId
    const dbQuery =
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
    AND profid IN (SELECT id FROM users WHERE username = $2)
        `
    db.any(dbQuery, [sectionId, id])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving prof section info from db')
            res.status(500).send(error)
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
    VALUES ($1, 
        (SELECT id 
        FROM section 
        WHERE profid IN (SELECT id FROM users WHERE username=$5) 
        AND id=$2), 
        $3, 
        $4)
    ON CONFLICT (student, section)
    DO UPDATE SET pref = $3, note = $4
    WHERE assignment.student = $1 
    AND assignment.section in 
        (SELECT id FROM section 
            WHERE profid IN (SELECT id FROM users WHERE username=$5) 
            AND id=$2)
    RETURNING assignment.id, assignment.pref, assignment.note
    `
    const r = req.body
    const userId = getUser.getUserFromBody(req)
    db.any(dbQuery, [r.studentId, r.sectionId, r.pref, r.note, userId])
        .then((data) => {
            if (data.length !== 1) throw new Error('Bad auth')
            res.json(data)
        })
        .catch((error) => {
            console.log('db assignment upsert error: ', error)
            res.status(500).send(error)
        })
})

/**
 * Gets list of users termapplications
 */
// app.get("/api/student/applications/:userId", (req, res) => {
//     const userId = getUser.getUser(req)
//     const dbQuery = "SELECT term, availability, approval, explanation, incanada, iscurrent FROM termapplication WHERE student=$1"
//     db.any(dbQuery, userId)
//         .then((data) => {
//             res.json(data)
//         })
//         .catch((error) => {
//             console.log('error retrieving student applications from db')
//             res.json({ error: error })
//         })
// })

/**
 * Gets all the terms that the student can or has applied to
 * For populating the student dashboard
 * `
SELECT 
    COALESCE(secterm.term, termapplication.term) AS term, 
    COALESCE(secterm.iscurrent, termapplication.iscurrent) AS iscurrent,
    availability, approval, explanation, incanada, wantstoteach, submitted
FROM
(SELECT DISTINCT term, iscurrent FROM section) AS secterm
FULL OUTER JOIN 
(SELECT * FROM termapplication WHERE student IN (SELECT id FROM users WHERE username='johndoe')) AS termapplication
ON secterm.term = termapplication.term
`
 */
app.get("/api/student/applications/available/:userId", (req, res) => {
    const userId = getUser.getUser(req)
    const dbQuery = `
    SELECT 
    COALESCE(secterm.term, termapplication.term) AS term, 
    COALESCE(secterm.iscurrent, termapplication.iscurrent) AS iscurrent,
    availability, approval, explanation, incanada, wantstoteach, submitted
    FROM
    (SELECT DISTINCT term, iscurrent FROM section) AS secterm
    FULL OUTER JOIN 
    (SELECT * FROM termapplication WHERE student IN (SELECT id FROM users WHERE username=$1)) AS termapplication
    ON secterm.term = termapplication.term
    `
    // AND section.term NOT IN (SELECT term FROM termapplication)
    db.any(dbQuery, userId)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving available applications from db')
            res.status(500).send(error)
        })
})

app.get("/api/student/termapplication/:term/:userId", (req, res) => {
    const userId = getUser.getUser(req)
    const term = req.params.term
    const dbQuery = `
    SELECT submitted, availability, approval, explanation, incanada, wantstoteach
    FROM termapplication
    WHERE student=$1 AND term=$2
    `
    db.any(dbQuery, [userId, term])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving termapplication details from db')
            res.status(400).json({ error: error })
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
    const userId = getUser.getUser(req)
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

/** `
INSERT INTO application(student, course, term, interest, qualification) 
VALUES (3, '3214', 'F23', 4, 4)
ON CONFLICT (student, course, term)
DO UPDATE SET interest=4, qualification=4
WHERE application.student=3
AND application.course='3214'
AND application.term='F23'
RETURNING application.interest, application.qualification
`
 * The request is safe because of DB restrictions
 */
app.post("/api/student/application", (req, res) => {
    const r = req.body
    const userId = getUser.getUserFromBody(req)
    const dbQuery = `
    INSERT INTO application(student, course, term, interest, qualification) 
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (student, course, term)
    DO UPDATE SET interest=$4, qualification=$5
    WHERE application.student=$1
    AND application.course=$2
    AND application.term=$3
    RETURNING application.interest, application.qualification
    `
    db.any(dbQuery, [userId, r.course, r.term, r.interest, r.qualification])
        .then((data) => {
            if (data.length !== 1) throw new Error('Could not add application to db')
            res.json(data)
        })
        .catch((error) => {
            console.log('db application upsert error: ', error)
            res.status(400).json({ error: error })
        })
})

/** `
    INSERT INTO termapplication(student, term, submitted, availability, approval, explanation, incanada, wantstoteach)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (student, term)
    DO UPDATE SET submitted=$3, availability=$4,
    approval=$5, explanation=$6, incanada=$7, wantsoteach=$8
    WHERE termapplication.student=$1
    AND termapplication.term=$2
    RETURNING submitted, availability
`
 * 
 */
app.post("/api/student/term", (req, res) => {
    const r = req.body
    const userId = getUser.getUserFromBody(req)
    dbQuery = `
    INSERT INTO termapplication(student, term, submitted, availability, approval, explanation, incanada, wantstoteach)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (student, term)
    DO UPDATE SET submitted=$3, availability=$4,
    approval=$5, explanation=$6, incanada=$7, wantstoteach=$8
    WHERE termapplication.student=$1
    AND termapplication.term=$2
    RETURNING submitted, availability, approval, explanation, incanada, wantstoteach
    `
    db.any(dbQuery, [userId, r.term, r.submitted, r.availability, r.approval, r.explanation, r.incanada, r.wantstoteach])
        .then((data) => {
            if (data.length !== 1) throw new Error('Could not add termapplication to DB')
            res.json(data)
        })
        .catch((error) => {
            console.log('db termapplication upsert error: ', error)
            res.status(400).json({ error: error })
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
 * Get db table names
 */
app.get("/api/admin/tables", (req, res) => {
    const dbQuery = `
    SELECT tablename FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog'
    AND schemaname != 'information_schema'
    `
    db.any(dbQuery)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error fetching table list from DB:', error)
            res.status(400).json({ error: error })
        })
})

app.get("/api/admin/table/:tableName", (req, res) => {
    const tableName = req.params.tableName
    const dbQuery = `
    SELECT * FROM `+ tableName + ` LIMIT 1
    `
    db.any(dbQuery, tableName)
        .then((data) => {
            res.json(Object.keys(data[0]))
        })
        .catch((error) => {
            console.log('error fetching table info for table:', tableName)
            res.status(400).send(error)
        })
})

app.post("/api/admin/overwrite", (req, res) => {
    const userId = getUser.getUserFromBody(req)
    db.any('SELECT usertype FROM users WHERE id=$1', userId)
        .then((data) => {
            if (!(data.length === 1 && data[0].usertype === 'admin')) {
                console.log('unauthorized request!')
                res.status(403).send('Unauthorized!')
                return
            }
            const tableName = req.body.tableName
            const rows = req.body.rows
            const cols = req.body.columns.split(',')
            dbQuery = "BEGIN; "
            dbQuery += 'DELETE FROM ' + tableName + '; '
            dbQuery += 'INSERT INTO ' + tableName + '(' + cols + ') VALUES '
            for (const [idx, row] of Object.entries(rows)) {
                if (row) {
                    const split = row.trim().split(',')
                    for (const idx in split) {
                        split[idx] = "'" + split[idx] + "'"
                    }
                    const joined = split.join(',')
                    dbQuery += '(' + joined + '),'
                }
            }
            dbQuery = dbQuery.slice(0, dbQuery.lastIndexOf(','))
            dbQuery += "; END;"
            console.log(dbQuery)
            db.any(dbQuery)
                .then((data) => {
                    res.json(data)
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500).send(error)
                })
        })

})

app.post("/api/admin/upsert", (req, res) => {
    const userId = getUser.getUserFromBody(req)
    db.any('SELECT usertype FROM users WHERE id=$1', userId)
        .then((data) => {
            if (!(data.length === 1 && data[0].usertype === 'admin')) {
                console.log('unauthorized request!')
                res.status(403).send('Unauthorized!')
                return
            }
            const tableName = req.body.tableName
            const rows = req.body.rows
            const constr = req.body.constraints.split(',')
            const cols = req.body.columns.split(',')
            dbQuery = `INSERT INTO ` + tableName + `(` + cols + `) VALUES `
            for (const [idx, row] of Object.entries(rows)) {
                if (row) {
                    const split = row.trim().split(',')
                    for (const idx in split) {
                        split[idx] = "'" + split[idx] + "'"
                    }
                    const joined = split.join(',')
                    dbQuery += '(' + joined + '),'
                }
            }
            dbQuery = dbQuery.slice(0, dbQuery.lastIndexOf(','))
            if (req.body.constraints) {
                dbQuery += `
                ON CONFLICT (`+ constr.join(',') + `) DO
                UPDATE SET 
                `
                for (const col of cols) {
                    if (!constr.includes(col)) {
                        dbQuery += col + '=EXCLUDED.' + col + ','
                    }
                }
                dbQuery = dbQuery.slice(0, dbQuery.lastIndexOf(','))
            }
            db.any(dbQuery)
                .then((data) => {
                    res.status(200).send(data)
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500).send(error)
                })
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