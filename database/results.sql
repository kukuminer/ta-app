COPY (
    SELECT
        u.firstname,
        u.lastname,
        u.email,
        u.username,
        a.studentNum,
        a.employeeId,
        a.pool,
        ta.submitted,
        ta.availability,
        ta.explanation,
        c.code,
        c.name,
        s.letter,
        COALESCE(ap.interest, 2) AS interest,
        COALESCE(ap.qualification, 2) AS qualification,
        ui.firstname AS proffirstname,
        ui.lastname AS proflastname,
        asg.pref,
        asg.note
    FROM
        term t
        JOIN termapplication ta ON ta.term = t.id
        JOIN users u ON ta.applicant = u.id
        JOIN applicant a ON u.id = a.id
        JOIN section s ON s.term = t.id
        JOIN course c ON c.id = s.course
        LEFT JOIN application ap ON ap.applicant = ta.applicant AND ap.term = ta.term AND ap.course = s.course
        LEFT JOIN users ui ON ui.id = s.profid
        LEFT JOIN assignment asg ON asg.applicant = ta.applicant AND asg.section = s.id
    WHERE
        t.term = '2024W'
    ORDER BY
        u.lastname,
        u.firstname,
        COALESCE(ap.interest, 2) DESC,
        COALESCE(ap.qualification, 2) DESC,
        c.code,
        s.letter
) TO STDOUT WITH CSV HEADER;
