const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const getUser = require('./getUser.js')
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

/**
 * Gets all user info for profile page
 */
app.get("/api/user/:userId", (req, res) => {
    id = getUser.getUser(req)
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
    const id = getUser.getUserFromBody(req)
    const r = req.body.state
    const usertypeQuery = 'SELECT usertype FROM users WHERE username=$1'
    const postQuery = `
    INSERT INTO users (username, firstname, lastname, email, usertype)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (username) DO UPDATE 
    SET firstname=$2, lastname=$3, email=$4, usertype=$5
    WHERE users.username=$1
    RETURNING usertype
    `
    db.any(usertypeQuery, [id])
        .then((data) => {
            var usertype = 'student'
            if (data.length === 1) {
                usertype = data[0].usertype
            }
            db.any(postQuery, [id, r.firstname, r.lastname, r.email, usertype])
                .then((data) => {
                    res.status(200).json(data)
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500).send(error)
                })
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
    id = getUser.getUser(req);
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

app.get("/api/user/student/:userId", (req, res) => {
    const id = getUser.getUser(req)
    const dbQuery = `
    SELECT studentid, pool FROM student 
    WHERE id IN (SELECT id FROM users WHERE username=$1)
    `
    db.any(dbQuery, [id])
        .then((data) => {
            if (data.length === 1) {
                res.json(data[0])
            }
            else {
                res.json([{ studentid: null, pool: null }])
            }
        })
        .catch((error) => {
            console.log("Error fetching student info from DB:", error)
            res.status(500).send(error)
        })
})

/**
 * Posts student info to DB
 */
app.post("/api/user/student/update", (req, res) => {
    const id = getUser.getUserFromBody(req)
    const r = req.body.state
    const idQuery = 'SELECT id FROM users WHERE username=$1'
    const postQuery = `
        INSERT INTO student(id, studentid, pool) 
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE
        SET studentid=$2, pool=$3
        WHERE student.id=$1
    `
    db.any(idQuery, id)
        .then((data) => {
            if (data.length !== 1) throw new Error("Not 1 user found in DB!")
            const uid = data[0].id
            db.any(postQuery, [uid, r.studentid, r.pool])
                .then((data) => {
                    res.status(200).send()
                })
                .catch((error) => {
                    console.log("error posting to student table:", error)
                    res.status(500).send(error)
                })
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
 * Gets right of first refusal table info 
 */
app.get("/api/student/refusal/:term/:userId", (req, res) => {
    const userId = getUser.getUser(req)
    const term = req.params.term
    const dbQuery = `
    SELECT student, course, term FROM rightofrefusal
    WHERE student IN (SELECT id FROM users WHERE username=$1)
    AND term=$2
    `
    db.any(dbQuery, [userId, term])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving rightofrefusal details from db')
            res.status(500).send(error)
        })
})

/**
 * Gets all the terms that the student can or has applied to
 * For populating the student dashboard from termapplication table
 * 
SELECT term.id as seq, term.term, student, submitted, availability, approval, explanation, incanada, wantstoteach
FROM term LEFT JOIN 
(SELECT * FROM termapplication WHERE student IN (SELECT id FROM users WHERE username='jane')) AS termapplication
ON term.id = termapplication.term
WHERE term.visible = true
 */
app.get("/api/student/applications/available/:userId", (req, res) => {
    const userId = getUser.getUser(req)
    const dbQuery = `
    SELECT term.id AS term, term.term AS termname, student, submitted, availability, approval, explanation, incanada, wantstoteach
    FROM term LEFT JOIN 
    (SELECT * FROM termapplication WHERE student IN (SELECT id FROM users WHERE username=$1)) AS termapplication
    ON term.id = termapplication.term
    WHERE term.visible = true    
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
    WHERE student IN (SELECT id FROM users WHERE username=$1)
    AND term=$2
    `
    db.any(dbQuery, [userId, term])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving termapplication details from db')
            res.status(500).send(error)
        })
})

/**
 * Get the courses within a term that the student has and can apply to
 * Gets existing applications if they exist
 * For populating the application page with courses
`
SELECT code, name, description, grade, interest, qualification
FROM 
(SELECT * FROM course WHERE id IN 
    (SELECT course FROM section WHERE term=3)
) AS course
LEFT JOIN 
(SELECT * FROM application WHERE student IN (SELECT id FROM users WHERE username='jane') 
    AND term=3) AS application
ON application.course = course.id
`

SELECT code, name, description, grade, interest, qualification
FROM 
(SELECT * FROM course 
    WHERE course.id IN (SELECT course FROM section WHERE term=2)) AS course
LEFT JOIN
(SELECT * FROM application 
    WHERE student IN (SELECT id FROM users WHERE username='jane') AND term=2) AS application
ON application.course = course.id
 */
app.get("/api/student/applications/:term/:userId", (req, res) => {
    const userId = getUser.getUser(req)
    const term = req.params.term
    const dbQuery = `
    SELECT course.id as code, code as codename, name, description, grade, interest, qualification
    FROM 
    (SELECT * FROM course 
        WHERE course.id IN (SELECT course FROM section WHERE term=$2)) AS course
    LEFT JOIN 
    (SELECT * FROM application 
        WHERE student IN (SELECT id FROM users WHERE username=$1) AND term=$2) AS application
    ON application.course = course.id
    `
    db.any(dbQuery, [userId, term])
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error retrieving application info on courses from db for term:', term)
            res.status(500).send(error)
        })
})

/** 
 * Posts student changes to specific course applications
 * `
INSERT INTO application(student, course, term, interest, qualification) 
VALUES ((SELECT id FROM users WHERE username='johndoe'), 
    '3214', 'F23', 4, 4)
ON CONFLICT (student, course, term)
DO UPDATE SET interest=4, qualification=4
WHERE application.student=(SELECT id FROM users WHERE username='johndoe')
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
    VALUES ((SELECT id FROM users WHERE username=$1), 
        $2, $3, $4, $5)
    ON CONFLICT (student, course, term)
    DO UPDATE SET interest=$4, qualification=$5
    WHERE application.student=(SELECT id FROM users WHERE username=$1)
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
            res.status(400).send(error)
        })
})

/** 
 * Termapplication changes post endpoint
 * `
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
    VALUES ((SELECT id FROM users WHERE username=$1), 
        $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (student, term)
    DO UPDATE SET submitted=$3, availability=$4,
    approval=$5, explanation=$6, incanada=$7, wantstoteach=$8
    WHERE termapplication.student=(SELECT id FROM users WHERE username=$1)
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
            res.status(400).send(error)
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
        SELECT code AS course, letter, term FROM section 
        INNER JOIN course ON course=course.id
        WHERE id = $1
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
 * ADMIN ENDPOINT
 * Get all db table names
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
            res.status(400).send(error)
        })
})

/**
 * ADMIN ENDPOINT
 * Get all column names of a particular table
 */
app.get("/api/admin/table/:tableName", (req, res) => {
    const tableName = req.params.tableName
    const dbQuery = `
    SELECT table_name, column_name, is_nullable
    FROM information_schema.columns 
    WHERE table_name=$1
    `
    // const dbQuery = `
    // SELECT * FROM `+ tableName + ` LIMIT 1
    // `
    db.any(dbQuery, tableName)
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log('error fetching table info for table:', tableName)
            res.status(400).send(error)
        })
})

// app.post("/api/admin/overwrite", (req, res) => {
//     const userId = getUser.getUserFromBody(req)
//     db.any('SELECT usertype FROM users WHERE username=$1', userId)
//         .then((data) => {
//             if (!(data.length === 1 && data[0].usertype === 'admin')) {
//                 console.log('unauthorized request!')
//                 res.status(403).send('Unauthorized!')
//                 return
//             }
//             const tableName = req.body.tableName
//             const rows = req.body.rows
//             const cols = req.body.columns.split(',')
//             dbQuery = "BEGIN; "
//             dbQuery += 'DELETE FROM ' + tableName + '; '
//             dbQuery += 'INSERT INTO ' + tableName + '(' + cols + ') VALUES '
//             for (const [idx, row] of Object.entries(rows)) {
//                 if (row) {
//                     const split = row.trim().split(',')
//                     for (const idx in split) {
//                         split[idx] = "'" + split[idx] + "'"
//                     }
//                     const joined = split.join(',')
//                     dbQuery += '(' + joined + '),'
//                 }
//             }
//             dbQuery = dbQuery.slice(0, dbQuery.lastIndexOf(','))
//             dbQuery += "; END;"
//             console.log(dbQuery)
//             db.any(dbQuery)
//                 .then((data) => {
//                     res.json(data)
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     res.status(500).send(error)
//                 })
//         })
//         .catch((error) => {
//             console.log(error)
//             res.status(403).send(error)
//         })

// })


/**
 * ADMIN ENDPOINT
 * For updating the ROFT table using 
`
INSERT INTO rightofrefusal (student, course, term)
SELECT u.id, c.id, t.id FROM 
(SELECT 1 AS n, id FROM users WHERE username='jane') AS u JOIN 
(SELECT 1 AS n, id FROM course WHERE code='2030') AS c ON u.n = c.n JOIN
(SELECT 1 AS n, id FROM term WHERE term='F23') AS t ON t.n = c.n
ON CONFLICT DO NOTHING
RETURNING u.id AS username, c.id AS course, t.id AS term
;

INSERT INTO rightofrefusal (student, course, term)
SELECT u.id, c.id, t.id FROM 
(SELECT id FROM users WHERE username='jane') AS u JOIN 
(SELECT id FROM course WHERE code='2030') AS c ON TRUE JOIN
(SELECT 1 AS n, id FROM term WHERE term='W22') AS t ON t.n = c.n
ON CONFLICT DO NOTHING;

INSERT INTO rightofrefusal (student, course, term)
SELECT student.id, course.id, term.id 
FROM users, course, term
WHERE student.studentid=5
AND course.code='2030'
AND term.term='F23'
ON CONFLICT DO NOTHING
RETURNING student, course, term;
;

 */


app.post("/api/admin/rofr", (req, res) => {
    const userId = getUser.getUserFromBody(req)
    db.any('SELECT usertype FROM users WHERE username=$1', userId)
        .then((data) => {
            if (!(data.length === 1 && data[0].usertype === 'admin')) {
                console.log('unauthorized request!')
                res.status(403).send('Unauthorized!')
                return
            }

            const rows = req.body.rows

            db.tx(t => {
                return async.map(rows, (item) => {
                    const dbQuery = `
                    INSERT INTO rightofrefusal (student, course, term)
                    SELECT student.id, course.id, term.id 
                    FROM users, course, term
                    WHERE student.studentid=5
                    AND course.code='2030'
                    AND term.term='F23'
                    ON CONFLICT DO NOTHING
                    RETURNING student, course, term;
                    `
                    return t.any(dbQuery)
                })
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                res.status(500).send(error)
            })

            // Verified logic
        })
})

/**
 * ADMIN ENDPOINT
 * This endpoint is for admin to upsert to DB via csv. 
 */
app.post("/api/admin/upsert", (req, res) => {
    const userId = getUser.getUserFromBody(req)
    db.any('SELECT usertype FROM users WHERE username=$1', userId)
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
                        if (split[idx] == '') {
                            split.splice(idx, 1)
                        }
                        else {
                            split[idx] = "'" + split[idx] + "'"
                        }
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
                    return
                })
        })
        .catch((error) => {
            res.status(403).send(error)
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