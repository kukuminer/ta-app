import AS from "express-async-handler";

export { instructor };
function instructor({ app, db, pgp }) {
  /**
   * For populating the instructor dashboard
   */
  app.get(
    "/api/instructor/courses",
    AS(async (req, res) => {
      const id = res.locals.userid;
      // SELECT id, course, letter, term
      // FROM section
      // WHERE profid IN (SELECT id FROM users WHERE username=$1)
      const dbQuery = `
    SELECT 
    section.id,
    course.code as course,
    section.letter as letter,
    section.campus as campus,
    term.term as term,
    term.id as termid,
    section.profid as profid
    FROM section JOIN course ON section.course = course.id
    JOIN term ON section.term = term.id
    JOIN users ON section.profid = users.id
    WHERE profid IN (SELECT id FROM users WHERE username=$1)
    AND term.visible = true
    ORDER BY term.term DESC, course.code ASC, section.letter ASC
    `;

      db.any(dbQuery, [id])
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log("error retrieving prof sections from db");
          res.status(500).send(error);
        });
    })
  );

  /**
   * For populating the professor section view
   */
  app.get(
    "/api/instructor/:sectionId",
    AS(async (req, res) => {
      const id = res.locals.userid;
      // const course = req.params.course
      // const letter = req.params.letter
      const sectionId = req.params.sectionId;
      const dbQuery = `
      SELECT 
      section.id as sectionId, 
      users.id as userId, 
      users.firstname, 
      users.lastname, 
      application.grade, 
      COALESCE(application.interest, 2) AS interest,
      COALESCE(application.qualification, 2) AS qualification,
      application.campus,
      assignment.pref, 
      assignment.note, 
      applicant.pool,
      termapplication.availability,
      termapplication.explanation,
      termapplication.incanada,
      seniority.seniority
  FROM
      section
      INNER JOIN termapplication ON termapplication.term = section.term
      INNER JOIN users ON termapplication.applicant=users.id
      INNER JOIN applicant ON applicant.id=users.id
      LEFT JOIN application ON (
          application.applicant = termapplication.applicant AND
          application.term = termapplication.term AND
          application.course = section.course AND
          application.campus = section.campus)
      LEFT JOIN assignment ON users.id = assignment.applicant AND section.id = assignment.section
      LEFT JOIN seniority ON applicant.employeeid=seniority.employeeid
  WHERE section.id = $1
  AND profid IN (SELECT id FROM users WHERE username = $2)
  AND termapplication.submitted is true
  AND termapplication.availability > 0
      `;
      db.any(dbQuery, [sectionId, id])
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log("error retrieving prof section info from db");
          res.status(500).send(error);
        });
    })
  );

  /**
   * Gets the notes from other profs
   */
  app.get(
    "/api/instructor/others/:sectionId",
    AS(async (req, res) => {
      const sectionId = req.params.sectionId;
      const dbQuery = `SELECT 
        applicant,
        pref,
        note,
        letter,
        firstname AS profname,
        lastname AS proflast
      FROM assignment 
      JOIN section ON assignment.section = section.id
      JOIN course ON section.course = course.id
      JOIN users ON section.profid = users.id
      WHERE course.id IN (
        SELECT course.id FROM section
        JOIN course ON section.course = course.id
        WHERE section.id = $1
      )
      AND section.term IN (
        SELECT term FROM section WHERE id = $1
      )
      AND section.id <> $1`;
      db.any(dbQuery, [sectionId])
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          console.log("error retrieving other instructor notes!");
          res.status(500).send(err);
        });
    })
  );

  /**
   * For updating prof preference and note
   */
  app.post(
    "/api/instructor/assignment",
    AS(async (req, res) => {
      /*
        INSERT INTO assignment(applicant, section, pref, note)
        VALUES (3, (SELECT id FROM section WHERE profid=2 AND id=1), 1, 'eebe')
        ON CONFLICT (applicant, section)
        DO UPDATE SET pref = 1, note = 'eeb'
        WHERE assignment.applicant = 3 
        AND assignment.section in (SELECT id FROM section WHERE profid=4 AND id=1)
        RETURNING assignment.id
         */
      const dbQuery = `
    INSERT INTO assignment(applicant, section, pref, note)
    VALUES ($1, 
        (SELECT id 
        FROM section 
        WHERE profid IN (SELECT id FROM users WHERE username=$5) 
        AND id=$2), 
        $3, 
        $4)
    ON CONFLICT (applicant, section)
    DO UPDATE SET pref = $3, note = $4
    WHERE assignment.applicant = $1 
    AND assignment.section in 
        (SELECT id FROM section 
            WHERE profid IN (SELECT id FROM users WHERE username=$5) 
            AND id=$2)
    RETURNING assignment.applicant, assignment.pref, assignment.note
    `;
      const r = req.body;
      const userId = res.locals.userid;
      db.any(dbQuery, [
        r.studentNum,
        r.sectionId,
        r.pref.toLowerCase(),
        r.note,
        userId,
      ])
        .then((data) => {
          if (data.length !== 1) throw new Error("Bad auth");
          res.json(data);
        })
        .catch((error) => {
          console.log("db assignment upsert error: ", error);
          res.status(500).send(error);
        });
    })
  );
}
