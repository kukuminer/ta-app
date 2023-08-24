module.exports = function ({ app, db, pgp }) {
    // Gets applicant info from applicant table
    app.get("/api/applicant/:userId", (req, res) => {
        const id = res.locals.userid
        const dbQuery = `
        SELECT studentNum, employeeId, pool FROM applicant 
        WHERE id IN (SELECT id FROM users WHERE username=$1)
        `
        db.oneOrNone(dbQuery, [id])
            .then((data) => {
                res.json(data)
            })
            .catch((error) => {
                console.log("Error fetching applicant info from DB:", error)
                res.status(500).send(error)
            })
    })

    /**
     * Posts applicant info to DB
     */
    app.post("/api/applicant/update", (req, res) => {
        const id = res.locals.userid
        const r = req.body.state
        r.username = id
        r.studentnum = r.studentnum || null
        r.employeeid = r.employeeid || null
        const idQuery = 'SELECT id FROM users WHERE username=$1'

        // const postQuery = `
        //     INSERT INTO applicant(id, studentNum, employeeId, pool) 
        //     VALUES ($1, $2, $3, $4)
        //     ON CONFLICT (id) DO UPDATE
        //     SET studentNum=$2, employeeid=$3, pool=$4
        //     WHERE applicant.id=$1
        // `
        db.any(idQuery, [id])
            .then((data) => {
                if (data.length !== 1) throw new Error("Not 1 user found in DB!")
                const uid = data[0].id
                r.id = uid;

                const colSet = new pgp.helpers.ColumnSet(
                    ['id', 'studentnum', 'employeeid', 'pool'],
                    { table: 'applicant' }
                )
                const postQuery = pgp.helpers.insert(r, colSet) +
                    ' ON CONFLICT ("id") DO UPDATE SET ' +
                    colSet.assignColumns({ from: 'EXCLUDED', skip: 'id' })

                db.any(postQuery)
                    .then((data) => {
                        res.status(200).send()
                    })
                    .catch((error) => {
                        console.log("error posting to applicant table:", error)
                        res.status(500).send(error)
                    })
            })
    })

}