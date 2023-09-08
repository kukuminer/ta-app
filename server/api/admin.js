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

}