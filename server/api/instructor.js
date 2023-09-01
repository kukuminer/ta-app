module.exports = function ({ app, db, pgp }) {

    /** 
     * For populating the instructor dashboard
     */
    app.get("/api/professor/courses/:userId", (req, res) => {
        const id = res.locals.userid
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

}