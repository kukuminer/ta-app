module.exports = function ({ app, db, pgp }) {


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

    app.post("/api/admin/section", (req, res) => {
        const rows = req.body.rows
        db.tx(async t => {
            let arr = []
            for (const item of rows) {
                const list = item
                console.log(list)
                const dbQuery = `
                WITH inserted AS (
                    INSERT INTO section (course, letter, term, profid)
                    SELECT course.id, $2, term.id, users.id
                    FROM course, term, users
                    WHERE course.code = $1
                    AND term.term = $3
                    AND users.username = $4
                    AND users.usertype = 'instructor'
                    ON CONFLICT DO NOTHING
                    RETURNING *
                )
                SELECT course.code, inserted.letter
                FROM inserted
                INNER JOIN course 
                ON inserted.course = course.id
                `

                arr.push(t.oneOrNone(dbQuery, list)
                    .then(data => {
                        return data
                    })
                    .catch(error => {
                        console.log('error pushing section line:', error)
                        return error
                    })
                )
            }
            return t.batch(arr)
        })
        .then(data => {
            console.log(data)
            res.status(200).send(data)
        })
        .catch(error => {
            console.log('error pushing section data:', error)
            res.status(500).send(error)
        })
    })

    /**
     * Admin ROFR endpoint
     */
    app.post("/api/admin/rofr", (req, res) => {
        const userId = res.locals.userid
        const usertype = res.locals.usertype
        // if (usertype !== 'admin') {
        //     console.log('unauthorized request!')
        //     res.status(403).send('Unauthorized!')
        // }

        // db.any('SELECT usertype FROM users WHERE username=$1', userId)
        //     .then((data) => {
        //         if (!(data.length === 1 && data[0].usertype === 'admin')) {
        //             console.log('unauthorized request!')
        //             res.status(403).send('Unauthorized!')
        //             return
        //         }

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
    // })

    /**
     * ADMIN ENDPOINT
     * This endpoint is for admin to upsert to DB via csv. 
     */
    app.post("/api/admin/upsert", (req, res) => {
        const userId = res.locals.userid
        // db.any('SELECT usertype FROM users WHERE username=$1', userId)
        //     .then((data) => {
        //         if (!(data.length === 1 && data[0].usertype === 'admin')) {
        //             console.log('unauthorized request!')
        //             res.status(403).send('Unauthorized!')
        //             return
        //         }

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
    //         .catch((error) => {
    //             res.status(400).send(error)
    //         })
    // })

}
