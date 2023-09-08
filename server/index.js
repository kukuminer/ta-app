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

require('./middleware/auth')({app, db, pgp})
require('./api/applicant')({app, db, pgp})
require('./api/instructor')({app, db, pgp})

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
    const id = res.locals.userid
    const r = req.body.state
    r.username = id

    const usertypeQuery = 'SELECT usertype FROM users WHERE username=$1'

    const colSet = new pgp.helpers.ColumnSet(
        ['username', 'firstname', 'lastname', 'email', 'usertype'],
        { table: 'users' }
    )

    db.any(usertypeQuery, [id])
        .then((data) => {
            // If the user doesn't exist, default applicant
            var usertype = 'applicant'
            if (data.length === 1) {
                usertype = data[0].usertype
            }
            // Then post with proper usertype
            r.usertype = usertype
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
//     const userId = res.locals.userid
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
INSERT INTO rightofrefusal (applicant, course, term)
SELECT u.id, c.id, t.id FROM 
(SELECT 1 AS n, id FROM users WHERE username='jane') AS u JOIN 
(SELECT 1 AS n, id FROM course WHERE code='2030') AS c ON u.n = c.n JOIN
(SELECT 1 AS n, id FROM term WHERE term='F23') AS t ON t.n = c.n
ON CONFLICT DO NOTHING
RETURNING u.id AS username, c.id AS course, t.id AS term
;

INSERT INTO rightofrefusal (applicant, course, term)
SELECT u.id, c.id, t.id FROM 
(SELECT id FROM users WHERE username='jane') AS u JOIN 
(SELECT id FROM course WHERE code='2030') AS c ON TRUE JOIN
(SELECT 1 AS n, id FROM term WHERE term='W22') AS t ON t.n = c.n
ON CONFLICT DO NOTHING;

INSERT INTO rightofrefusal (applicant, course, term)
SELECT applicant.studentNum, course.id, term.id 
FROM applicant, course, term
WHERE applicant.studentNum='3'
AND course.code='EECS2011'
AND term.term='F23'
ON CONFLICT DO NOTHING
RETURNING applicant, course, term;
;

 */


app.post("/api/admin/rofr", (req, res) => {
    const userId = res.locals.userid
    db.any('SELECT usertype FROM users WHERE username=$1', userId)
        .then((data) => {
            if (!(data.length === 1 && data[0].usertype === 'admin')) {
                console.log('unauthorized request!')
                res.status(403).send('Unauthorized!')
                return
            }

            const rows = req.body.rows

            db.tx(async t => {
                let arr = []
                for (const item of rows) {
                    const list = item
                    if (list.length == 3) {
                        for (var idx in list) {
                            list[idx] = list[idx].trim()
                        }
                        const dbQuery = `
                            INSERT INTO rightofrefusal (applicant, course, term)
                            SELECT $1, course.id, term.id 
                            FROM course, term
                            WHERE course.code=$2
                            AND term.term=$3
                            ON CONFLICT DO NOTHING
                            RETURNING applicant, course, term;
                        `
                        arr.push(t.oneOrNone(dbQuery, list)
                            .then(data => {
                                return data
                            })
                            .catch(error => {
                                console.log('error pushing rofr line:', error)
                                return error
                            }))

                    }
                }
                return t.batch(arr)
            })
                .then(data => {
                    res.status(200).send(data)
                })
                .catch(error => {
                    console.log('error pushing rofr data:', error)
                    res.status(500).send(error)
                })
        })
})

/**
 * ADMIN ENDPOINT
 * This endpoint is for admin to upsert to DB via csv. 
 */
app.post("/api/admin/upsert", (req, res) => {
    const userId = res.locals.userid
    db.any('SELECT usertype FROM users WHERE username=$1', userId)
        .then((data) => {
            if (!(data.length === 1 && data[0].usertype === 'admin')) {
                console.log('unauthorized request!')
                res.status(403).send('Unauthorized!')
                return
            }

            const tableName = new pgp.helpers.TableName(req.body.tableName)
            const rows = req.body.rows
            const constr = req.body.constraints.split(',')
            const cols = req.body.columns.split(',')

            db.tx(async t => {
                let arr = []
                for (const item of rows) {
                    if (item.join(',').length > 0) {
                        const colSet = new pgp.helpers.ColumnSet(cols, { table: tableName })
                        var tbl = {}
                        for (const idx in item) {
                            tbl[cols[idx]] = item[idx]
                        }


                        const dbQuery = pgp.helpers.insert(tbl, colSet) +
                            ' ON CONFLICT (' + constr + ') DO UPDATE SET ' +
                            colSet.assignColumns({ from: 'EXCLUDED', skip: constr })

                        arr.push(t.any(dbQuery)
                            .then(data => {
                                return data
                            })
                            .catch(error => {
                                console.log('error upsert at row: ' + item, error)
                            })
                        )

                    }
                }
                return t.batch(arr)
            })
                .then(data => {
                    res.status(200).send(data)
                })
                .catch(error => {
                    console.log('error upsert:', error)
                    res.status(500).send(error)
                })
        })
        .catch((error) => {
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