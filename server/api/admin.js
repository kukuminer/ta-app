const async = require("async");

module.exports = function ({ app, db, pgp }) {
  /**
   * ADMIN ENDPOINT
   * Gets all term table info
   */
  app.get("/api/admin/terms", (req, res) => {
    const dbQuery = "SELECT * FROM term";
    db.many(dbQuery)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log("error fetching term data from DB:", error);
        res.status(500).send(error);
      });
  });

  /**
   * ADMIN ENDPOINT
   * Get all db table names
   */
  app.get("/api/admin/tables", (req, res) => {
    const dbQuery = `
    SELECT tablename FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog'
    AND schemaname != 'information_schema'
    `;
    db.any(dbQuery)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log("error fetching table list from DB:", error);
        res.status(500).send(error);
      });
  });

  /**
   * ADMIN ENDPOINT
   * Get all column names of a particular table
   */
  app.get("/api/admin/table/:tableName", (req, res) => {
    const tableName = req.params.tableName;
    const dbQuery = `
    SELECT table_name, column_name, is_nullable
    FROM information_schema.columns 
    WHERE table_name=$1
    `;
    // const dbQuery = `
    // SELECT * FROM `+ tableName + ` LIMIT 1
    // `
    db.any(dbQuery, tableName)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log("error fetching table info for table:", tableName);
        res.status(500).send(error);
      });
  });

  app.get("/api/admin/table/export/:tableName", (req, res) => {
    const tableName = req.params.tableName;
    const dbQuery = "SELECT * FROM " + tableName;

    db.any(dbQuery)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.log("error fetching table data for table:", tableName);
        res.status(500).send(error);
      });
  });

  app.post("/api/admin/section", (req, res) => {
    const rows = req.body.rows;

    async
      .mapSeries(rows, async (row) => {
        return db.tx(async (t) => {
          const code = await t.oneOrNone(
            "SELECT id FROM course WHERE code=$1",
            row
          );
          if (!code) return { status: "fail", data: "No such course code" };
          const term = await t.oneOrNone(
            "SELECT id FROM term WHERE term=$3",
            row
          );
          if (!term) return { status: "fail", data: "No such term" };
          const instructor = await t.oneOrNone(
            "SELECT id FROM users WHERE username=$4 AND usertype IN ('instructor', 'admin')",
            row
          );
          if (!instructor)
            return { status: "fail", data: "No such instructor" };

          const dbQuery = `
                    INSERT INTO section (course, letter, term, profid)
                    SELECT course.id, $2, term.id, users.id
                    FROM course, term, users
                    WHERE course.code = $1
                    AND term.term = $3
                    AND users.username = $4
                    AND users.usertype IN ('instructor', 'admin')
                    ON CONFLICT (course, letter, term) DO UPDATE SET
                    profid = EXCLUDED.profid
                    RETURNING 'success' as status, 'Success' as data
                    `;
          const ret = await t.oneOrNone(dbQuery, row);
          return (
            ret ?? { status: "conflict", data: "Conflict with existing entry" }
          );
        });
      })
      .then((data) => {
        res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        console.log("error pushing section data:", error);
        res.status(500).send(error);
      });

    // db.tx(async t => {
    //     let arr = []
    //     for (const item of rows) {
    //         const list = item
    //         // console.log(list)
    //         const dbQuery = `
    //         WITH inserted AS (
    //             INSERT INTO section (course, letter, term, profid)
    //             SELECT course.id, $2, term.id, users.id
    //             FROM course, term, users
    //             WHERE course.code = $1
    //             AND term.term = $3
    //             AND users.username = $4
    //             AND users.usertype = 'instructor'
    //             ON CONFLICT DO NOTHING
    //             RETURNING *
    //         )
    //         SELECT course.code, inserted.letter, term.term, users.username
    //         FROM inserted
    //         INNER JOIN course
    //         ON inserted.course = course.id
    //         INNER JOIN term
    //         ON inserted.term = term.id
    //         INNER JOIN users
    //         ON inserted.profid = users.id
    //         `
    //         const codeQuery = 'SELECT id FROM course WHERE code=$1'
    //         const code = await t.oneOrNone(codeQuery, list)
    //         // console.log(code)
    //         // term, prof user
    //         if(!!code ) {
    //             arr.push(t.oneOrNone(dbQuery, list))
    //         }

    //         arr.push(t.oneOrNone(dbQuery, list)
    //             .then(data => {
    //                 if(!data)
    //                 return data
    //             })
    //             .catch(error => {
    //                 console.log('error pushing section line:', error)
    //                 return error
    //             })
    //         )
    //     }
    //     return t.batch(arr)
    // })
    // .then(data => {
    //     console.log(data)
    //     res.status(200).send(data)
    // })
    // .catch(error => {
    //     console.log('error pushing section data:', error)
    //     res.status(500).send(error)
    // })
  });

  /**
   * Admin ROFR endpoint
   */
  app.post("/api/admin/rofr", (req, res) => {
    const rows = req.body.rows;

    async
      .mapSeries(rows, async (row) => {
        return db.tx(async (t) => {
          const code = await t.oneOrNone(
            "SELECT id FROM course WHERE code=$2",
            row
          );
          if (!code) return { status: "fail", data: "No such course code" };
          const term = await t.oneOrNone(
            "SELECT id FROM term WHERE term=$3",
            row
          );
          if (!term) return { status: "fail", data: "No such term" };

          const dbQuery = `
                    INSERT INTO rightofrefusal (applicant, course, term)
                    SELECT $1, course.id, term.id 
                    FROM course, term
                    WHERE course.code=$2
                    AND term.term=$3
                    ON CONFLICT DO NOTHING
                    RETURNING 'success' as status, 'Success' as data;
                `;
          const ret = await t.oneOrNone(dbQuery, row);
          return (
            ret ?? { status: "conflict", data: "Conflict with existing entry" }
          );
        });
      })
      .then((data) => {
        res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        console.log("error pushing section data:", error);
        res.status(500).send(error);
      });

    // db.tx(async t => {
    //     let arr = []
    //     for (const item of rows) {
    //         const list = item
    //         if (list.length == 3) {
    //             for (var idx in list) {
    //                 list[idx] = list[idx].trim()
    //             }
    //             const dbQuery = `
    //                         INSERT INTO rightofrefusal (applicant, course, term)
    //                         SELECT $1, course.id, term.id
    //                         FROM course, term
    //                         WHERE course.code=$2
    //                         AND term.term=$3
    //                         ON CONFLICT DO NOTHING
    //                         RETURNING applicant, course, term;
    //                     `
    //             arr.push(t.oneOrNone(dbQuery, list)
    //                 .then(data => {
    //                     return data
    //                 })
    //                 .catch(error => {
    //                     console.log('error pushing rofr line:', error)
    //                     return error
    //                 }))

    //         }
    //     }
    //     return t.batch(arr)
    // })
    //     .then(data => {
    //         res.status(200).send(data)
    //     })
    //     .catch(error => {
    //         console.log('error pushing rofr data:', error)
    //         res.status(500).send(error)
    //     })
  });
  // })

  /**
   * ADMIN ENDPOINT
   * This endpoint is for admin to upsert to DB via csv.
   */
  app.post("/api/admin/upsert", (req, res) => {
    console.log(req.body);

    const tableName = new pgp.helpers.TableName(req.body.tableName);
    const rows = req.body.rows;
    const constr = req.body.constraints.split(",");
    const cols = req.body.columns.split(",");
    const colSet = new pgp.helpers.ColumnSet(cols, { table: tableName });

    async
      .mapSeries(rows, async (row) => {
        if (row.join(",").length > 0) {
          var tbl = {};
          for (const idx in row) {
            tbl[cols[idx]] = row[idx];
          }

          const dbQuery =
            pgp.helpers.insert(tbl, colSet) +
            // " RETURNING 'success' as status, 'Inserted' as data" +
            " ON CONFLICT (" +
            constr +
            ") DO UPDATE SET " +
            colSet.assignColumns({ from: "EXCLUDED", skip: constr }) +
            " RETURNING 'success' as status, 'Inserted/Updated' as data";

          return db.tx(async (t) => {
            try {
              return await t.oneOrNone(dbQuery);
            } catch (err) {
              return { status: "fail", data: err.message };
            }
          });
        }
      })
      .then((data) => {
        res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        console.log("error upsert", error);
        res.status(500).send(error);
      });

    // return
    // db.tx(async t => {
    //     let arr = []
    //     for (const item of rows) {
    //         if (item.join(',').length > 0) {
    //             const colSet = new pgp.helpers.ColumnSet(cols, { table: tableName })
    //             var tbl = {}
    //             for (const idx in item) {
    //                 tbl[cols[idx]] = item[idx]
    //             }

    //             const dbQuery = pgp.helpers.insert(tbl, colSet) +
    //                 ' ON CONFLICT (' + constr + ') DO UPDATE SET ' +
    //                 colSet.assignColumns({ from: 'EXCLUDED', skip: constr })

    //             arr.push(t.any(dbQuery)
    //                 .then(data => {
    //                     return data
    //                 })
    //                 .catch(error => {
    //                     console.log('error upsert at row: ' + item, error)
    //                 })
    //             )

    //         }
    //     }
    //     return t.batch(arr)
    // })
    //     .then(data => {
    //         res.status(200).send(data)
    //     })
    //     .catch(error => {
    //         console.log('error upsert:', error)
    //         res.status(500).send(error)
    //     })
  });
  //         .catch((error) => {
  //             res.status(400).send(error)
  //         })
  // })
};
