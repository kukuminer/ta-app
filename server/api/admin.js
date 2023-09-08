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
    


}