import AS from "express-async-handler";

function applicant({ app, db, pgp }) {
  app.get(
    "/api/applicant/seniority",
    AS(async (req, res) => {
      const userId = res.locals.userid;
      const dbQuery = `SELECT seniority 
      FROM seniority 
      INNER JOIN applicant ON applicant.employeeid = seniority.employeeid
      INNER JOIN users ON users.id = applicant.id
      WHERE username=$1`;
      db.oneOrNone(dbQuery, [userId])
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log("error retrieving seniority from db");
          res.status(500).send(error);
        });
    })
  );

  app.get(
    "/api/applicant/profile",
    AS(async (req, res) => {
      const id = res.locals.userid;
      const dbQuery = `
        SELECT studentNum, employeeId, pool FROM applicant 
        WHERE id IN (SELECT id FROM users WHERE username=$1)
        `;
      db.oneOrNone(dbQuery, [id])
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log("Error fetching applicant info from DB:", error);
          res.status(500).send(error);
        });
    })
  );

  /**
   * Posts applicant info to DB
   */
  app.post(
    "/api/applicant/update",
    AS(async (req, res) => {
      const id = res.locals.userid;
      const r = req.body.state;
      r.username = id;
      r.studentnum = r.studentnum || null;
      r.employeeid = r.employeeid || null;
      const idQuery = "SELECT id FROM users WHERE username=$1";

      // const postQuery = `
      //     INSERT INTO applicant(id, studentNum, employeeId, pool)
      //     VALUES ($1, $2, $3, $4)
      //     ON CONFLICT (id) DO UPDATE
      //     SET studentNum=$2, employeeid=$3, pool=$4
      //     WHERE applicant.id=$1
      // `
      db.any(idQuery, [id])
        .then((data) => {
          if (data.length !== 1) throw new Error("Not 1 user found in DB!");
          const uid = data[0].id;
          r.id = uid;

          const colSet = new pgp.helpers.ColumnSet(
            ["id", "studentnum", "employeeid", "pool"],
            { table: "applicant" }
          );
          const postQuery =
            pgp.helpers.insert(r, colSet) +
            ' ON CONFLICT ("id") DO UPDATE SET ' +
            colSet.assignColumns({ from: "EXCLUDED", skip: "id" });

          db.any(postQuery)
            .then((data) => {
              res.status(200).send();
            })
            .catch((error) => {
              console.log("error posting to applicant table:", error);
              res.status(500).send(error);
            });
        })
        .catch((error) => {
          console.log("some unknown error with applicant update");
          res.status(500).send(error);
        });
    })
  );

  /**
   * Gets right of first refusal table info
   */
  app.get(
    "/api/applicant/refusal/:term",
    AS(async (req, res) => {
      const userId = res.locals.userid;
      const term = req.params.term;
      const dbQuery = `
    SELECT applicant, course, term FROM rightofrefusal
    WHERE applicant IN (SELECT studentnum FROM applicant WHERE studentnum=$1)
    AND term=$2
    `;
      db.any(dbQuery, [userId, term])
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log("error retrieving rightofrefusal details from db");
          res.status(500).send(error);
        });
    })
  );

  /**
     * Gets all the terms that the applicant can or has applied to
     * For populating the applicant dashboard from termapplication table
     * 
    SELECT term.id as seq, term.term, applicant, submitted, availability, approval, explanation, incanada, wantstoteach
    FROM term LEFT JOIN 
    (SELECT * FROM termapplication WHERE applicant IN (SELECT id FROM users WHERE username='jane')) AS termapplication
    ON term.id = termapplication.term
    WHERE term.visible = true
    */
  app.get(
    "/api/applicant/termapplications",
    AS(async (req, res) => {
      getAvailableApplications(res.locals.userid)
        .then(async (ret) => {
          // for (var a = 0; a < ret.length; a++) {
          //   const funding = await getFunding(res.locals.userid, ret[a].term);
          //   ret[a] = { ...funding, ...ret[a] };
          // }
          // console.log(ret);
          res.json(ret);
        })
        .catch((error) => {
          console.log("applicant application fetch error:", error);
          res.status(500).send(error);
        });
    })
  );

  // Gets all the applications that are available for this user
  async function getAvailableApplications(userId, term = null) {
    const dbQuery = `
SELECT 
term.id AS term, 
term.term AS termname, 
termapplication.applicant, 
submitted, 
COALESCE(termapplication.availability, funding, 4) AS availability,
approval, 
explanation, 
incanada, 
wantstoteach,
funding
FROM term
LEFT JOIN applicant ON applicant.id IN (SELECT id FROM users WHERE username=$1)
LEFT JOIN termapplication ON ( 
    termapplication.applicant=applicant.id
    AND term.id = termapplication.term
)
LEFT JOIN applicantfunding ON (
    term.id = applicantfunding.term AND
    applicant.studentnum = applicantfunding.studentnum
)
WHERE term.visible = true
`;
    // AND section.term NOT IN (SELECT term FROM termapplication)
    try {
      const ret = await db.any(dbQuery, userId);
      if (term !== null) {
        return ret.filter((i) => "" + i.term === "" + term);
      }
      return ret;
    } catch (error) {
      console.log("error retrieving available applications from db");
      return error;
    }
  }

  app.get(
    "/api/applicant/termapplication/:term",
    AS(async (req, res) => {
      const userId = res.locals.userid;
      const term = req.params.term;
      // const dbQuery = `
      //   SELECT submitted, availability, approval, explanation, incanada, wantstoteach, term.term AS termname, term.id AS term
      //   FROM termapplication
      //   INNER JOIN term
      //   ON term.id = termapplication.term
      //   WHERE applicant IN (SELECT id FROM users WHERE username=$1)
      //   AND termapplication.term=$2
      //   `;
      // db.any(dbQuery, [userId, term])
      getAvailableApplications(userId, term)
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log("error retrieving termapplication details from db");
          res.status(500).send(error);
        });
    })
  );

  /**
   * Get the courses within a term that the applicant has and can apply to
   * Gets existing applications if they exist
   * For populating the application page with courses
   */
  app.get(
    "/api/applicant/applications/:term/",
    AS(async (req, res) => {
      const userId = res.locals.userid;
      const term = req.params.term;
      const dbQuery = `
SELECT DISTINCT
course.id as code, 
code as codename, 
name, 
description, 
grade, 
interest, 
qualification, 
section.campus
FROM course JOIN section ON course.id=section.course 
LEFT JOIN application ON (
    application.applicant IN (SELECT id FROM users WHERE username=$1) AND 
    application.term=section.term AND
    application.course = course.id AND
    application.campus=section.campus)
WHERE section.term=$2 ORDER BY section.campus, course.code`;
      db.any(dbQuery, [userId, term])
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log(
            "error retrieving application info on courses from db for term:",
            term
          );
          res.status(500).send(error);
        });
    })
  );

  /**
   * Function to get the funding info for a given userid + term combo
   */
  async function getFunding(userId, term) {
    const dbQuery = `
    SELECT funding FROM applicantfunding 
    JOIN applicant ON applicantfunding.studentnum=applicant.studentnum
    JOIN users ON applicant.id=users.id
    WHERE users.username=$1 AND applicantfunding.term=$2`;
    try {
      const ret = await db.oneOrNone(dbQuery, [userId, term]);
      return ret;
    } catch (error) {
      console.log(
        "error getting funding info for userId " +
          userId +
          " and term " +
          term +
          ": ",
        error
      );
      return error;
    }
  }

  /**
   * Function to pull forward any existing application
   */
  async function newApplication(req, res) {
    const userId = res.locals.userid;
    const r = req.body;
    // console.log(r);
    const ret = await db.tx(async (t) => {
      // locks the users table
      await t.oneOrNone(
        "SELECT * FROM users WHERE username=$1 FOR NO KEY UPDATE",
        [userId]
      );
      const termApps = await getAvailableApplications(userId, r.term);

      const check = termApps.filter((el) => {
        return parseInt(el.term) === parseInt(r.term);
      })?.[0];

      if (check?.submitted === null && check?.explanation === null) {
        // console.log("a new one!");
        // console.log(termApps);
        const termAppQuery = `
        SELECT applicant, $2 AS term, availability, explanation
        FROM termapplication
        JOIN users ON applicant=users.id
        WHERE username=$1
        AND termapplication.term<$2
        ORDER BY termapplication.term DESC
        LIMIT 1`;
        const termApp = await t.oneOrNone(termAppQuery, [userId, r.term]);

        const coursesQuery = `
        SELECT DISTINCT ON (course, campus) applicant, course, $2 AS term, interest, qualification, campus
        FROM application JOIN users
        ON applicant=users.id 
        WHERE username=$1
        AND term<$2
        ORDER BY course, campus, term DESC
        `;
        const courses = await t.any(coursesQuery, [userId, r.term]);
        // console.log(courses);

        const funding = await getFunding(userId, r.term);
        if (funding && termApp) termApp.availability = funding.funding;

        if (!!termApp) {
          const termAppInsert = pgp.helpers.insert(
            termApp,
            null,
            "termapplication"
          );
          t.none(termAppInsert);
        }
        if (!!courses && courses.length > 0) {
          const coursesInsert = pgp.helpers.insert(
            courses,
            Object.keys(courses[0]),
            "application"
          );
          t.none(coursesInsert);
        }
        return 201;
      }
      return 200;
    });
    return ret;
  }

  /**
   * Post to magically pull forward this applicants
   * most recent application details from previous
   * terms
   */
  app.post(
    "/api/applicant/term/new",
    AS(async (req, res) => {
      try {
        const stat = await newApplication(req, res);
        // console.log(stat);
        res.status(stat).send();
      } catch (error) {
        console.log("error pulling new term forward: ", error);
        res.status(500).send(error);
      }
    })
  );

  /**
   * Post to magically pull forward this applicants
   * most recent application details from previous
   * terms
   */
  // app.post("/api/applicant/term/new", (req, res) => {
  //   const userId = res.locals.userid;
  //   const r = req.body;
  //   console.log(r);
  //   const newterm = r?.term;
  //   if (!r?.availability && !r?.explanation) {
  //     console.log("a new one!");
  //     db.tx(async (t) => {
  //       const termAppQuery = `
  //       SELECT availability, explanation
  //       FROM termapplication
  //       JOIN users ON applicant=users.id
  //       WHERE username=$1
  //       AND term<$2
  //       ORDER BY term DESC
  //       LIMIT 1`;
  //       const termApp = await t.oneOrNone(termAppQuery, [userId, r.term]);
  //       console.log(termApp);

  //       const coursesQuery = `
  //       SELECT DISTINCT ON (course) course, interest, qualification
  //       FROM application JOIN users
  //       ON applicant=users.id
  //       WHERE username=$1
  //       AND term<$2
  //       ORDER BY course, term DESC;
  //       `;
  //       const courses = await t.any(coursesQuery, [userId, r.term]);
  //       console.log(courses);
  //     });
  //   }
  // });

  const MAX_RATING = 5;
  const MIN_RATING = 1;
  /**
   * Posts applicant changes to specific course applications
   * The request is safe because of DB restrictions
   */
  app.post(
    "/api/applicant/application",
    AS(async (req, res) => {
      const r = req.body;

      r.interest = Math.max(Math.min(MAX_RATING, r.interest ?? 2), MIN_RATING);
      r.qualification = Math.max(
        Math.min(MAX_RATING, r.qualification ?? 2),
        MIN_RATING
      );
      const userId = res.locals.userid;
      const dbQuery = `
    INSERT INTO application(applicant, course, term, interest, qualification, campus) 
    VALUES ((SELECT id FROM users WHERE username=$1), 
        $2, $3, $4, $5, $6)
    ON CONFLICT (applicant, course, term, campus)
    DO UPDATE SET interest=$4, qualification=$5
    WHERE application.applicant=(SELECT id FROM users WHERE username=$1)
    AND application.course=$2
    AND application.term=$3
    AND application.campus=$6
    RETURNING application.interest, application.qualification
    `;
      db.any(dbQuery, [
        userId,
        r.course,
        r.term,
        r.interest,
        r.qualification,
        r.campus,
      ])
        .then((data) => {
          if (data.length !== 1)
            throw new Error("Could not add application to db");
          res.json(data);
        })
        .catch((error) => {
          console.log("db application upsert error: ", error);
          res.status(400).send(error);
        });
    })
  );

  /**
   * Termapplication changes post endpoint
   * Also includes data validation
   */
  app.post(
    "/api/applicant/termapplication",
    AS(async (req, res) => {
      const r = req.body;

      // Data validation
      r.availability = Math.max(Math.min(4, r.availability), 0);
      r.explanation = r.explanation?.substring(0, 1000) ?? "";
      r.submitted = r.submitted === null ? false : r.submitted;

      const userId = res.locals.userid;
      const dbQuery = `
    INSERT INTO termapplication(applicant, term, submitted, availability, approval, explanation, incanada, wantstoteach)
    VALUES ((SELECT id FROM users WHERE username=$1), 
        $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (applicant, term)
    DO UPDATE SET submitted=$3, availability=$4,
    approval=$5, explanation=$6, incanada=$7, wantstoteach=$8
    WHERE termapplication.applicant=(SELECT id FROM users WHERE username=$1)
    AND termapplication.term=$2
    RETURNING submitted, availability, approval, explanation, incanada, wantstoteach
    `;
      db.any(dbQuery, [
        userId,
        r.term,
        r.submitted,
        r.availability,
        r.approval,
        r.explanation,
        r.incanada,
        r.wantstoteach,
      ])
        .then((data) => {
          if (data.length !== 1)
            throw new Error("Could not add termapplication to DB");
          res.json(data);
        })
        .catch((error) => {
          console.log("db termapplication upsert error: ", error);
          res.status(400).send(error);
        });
    })
  );
}

export { applicant };
