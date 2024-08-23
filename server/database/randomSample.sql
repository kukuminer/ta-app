
INSERT INTO termapplication (applicant, submitted, term, availability, explanation, incanada)
SELECT id, true, 4, floor(random()*4) + 1, random()::text, true 
FROM users WHERE usertype='applicant'
ON CONFLICT DO NOTHING
-- (
--     SELECT row_number() OVER () AS rnum, users.* FROM users
--     WHERE usertype='applicant'
-- ) AS tbl
-- JOIN 
-- (
--     SELECT generate_series(1,500) AS rrn, floor(random()*4) + 1 AS rand
-- ) AS randoms
-- ON rnum = rand
-- ON CONFLICT do NOTHING

INSERT INTO users (firstname, lastname, email, usertype, username)
SELECT 
    CHR(floor(random()*26)::int + 65), 
    CHR(floor(random()*26)::int + 97),
    (floor(random()*100) + 100)::text || '@yorku.ca',
    'applicant',
    floor(random()*1000)+1000
FROM (
    SELECT generate_series(1,200) AS rn
) AS randoms
ON CONFLICT DO NOTHING


-- (SELECT generate_series(1,1000) AS id, floor(random()*4 AS num)) AS tbl

-- SELECT * FROM
-- (
--     SELECT row_number() OVER () AS rnum, users.* FROM users
--     WHERE usertype='applicant'
-- ) AS tbl
-- JOIN 
-- (
--     SELECT generate_series(1,20) AS rrn, floor(random()*4) + 1 AS rand
-- ) AS randoms
-- ON rnum = rand
-- ORDER BY rand 