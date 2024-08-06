INSERT INTO users(firstname, lastname, email, usertype, username) VALUES
('Liran', 'Z', 'liranz@yorku.ca', 'admin', 'kuku'),
('Jonatan', 'S', 'jonatan@yorku.ca', 'instructor', 'jonatan'),
('John', 'D', 'john@yorku.ca', 'applicant', 'johndoe'),
('Michael', 'B', 'mike@yorku.ca', 'instructor', 'mikeb'),
('Jane', 'E', 'jane@yorku.ca', 'applicant', 'jane'),
('Unit', 'Two student', 'bing@bong.ca', 'applicant', 'unittwo');

INSERT INTO applicant(id, studentNum, pool)
SELECT id, REPEAT((id % 10)::varchar(9), 9), 'unit 1' FROM users WHERE userType = 'applicant';

UPDATE applicant SET pool = 'unit 2' WHERE id=6;


INSERT INTO term(id, term, visible) VALUES
(2, 'F23', true),
(3, 'W24', true),
(1, 'S23', false),
(4, 'S24', true);

INSERT INTO course (code, name, description) VALUES 
('EECS2030', 'intro to OOP', 'oop intro'), 
('EECS2011', 'algorithms', 'algo text'), 
('EECS3214', 'networks', 'network hover text'),
('EECS4080', 'project course', 'this is the project course description'),
('EECS1001', 'intro course', '1001 haha');

INSERT INTO instructor(id) 
SELECT (id) FROM users WHERE userType = 'instructor';

INSERT INTO section(course, letter, term, profid, campus) VALUES 
('1', 'A', 2, '2', 'Keele'), 
('1', 'B', 2, '4', 'Keele'),
('1', 'Z', 3, '2', 'Keele'), 
('2', 'A', 2, '2', 'Keele'),
('2', 'B', 2, '4', 'Keele'),
('3', 'C', 2, '4', 'Keele'),
('4', 'A', 3, '4', 'Keele'),
('4', 'B', 3, '4', 'Markham'),
('5', 'Z', 4, '4', 'Keele'),
('4', 'B', 4, '4', 'Markham');

-- INSERT INTO termapplication(applicant, term, availability, approval, explanation, incanada, wantstoteach, submitted) VALUES
-- ('3', 2, 4, true, 'i want to TA', true, true, false),
-- ('3', 1, 3, true, 'i wanted to TA', true, true, true),
-- ('5', 2, 4, true, 'jane want teach', true, true, true),
-- ('6', 2, 2, true, 'multline\nmultiline\nline 3 \n<b>HELLO</b>', true, true, true);

-- INSERT INTO application(applicant, course, term, interest, qualification) VALUES 
-- ('3', '1', 2, 3, 3), 
-- ('3', '2', 2, 3, 2),
-- ('5', '1', 2, 4, 4),
-- ('3', '1', 1, 2, 2),
-- ('6', '1', 2, 2, 2);

-- INSERT INTO assignment(applicant, section)
-- VALUES (3, 1)
-- ON CONFLICT (applicant, section)
-- DO UPDATE SET pref = 50, note = 'good applicant'
-- WHERE id = 1;

INSERT INTO rightofrefusal(applicant, course, term) VALUES
(3, 1, 3),
(5, 2, 3),
(3, 3, 2),
(3, 2, 2);

INSERT INTO applicantfunding(studentnum, term, funding) 
SELECT studentnum, 4, studentnum::int8 % 5 FROM applicant;

CREATE VIEW ApplicationView AS 
SELECT applicant, username, course, code, application.term as termid, 
term.term, interest, qualification
FROM application JOIN users ON applicant=users.id 
JOIN course ON application.course=course.id 
JOIN term ON application.term=term.id;

CREATE VIEW SectionView AS
SELECT 
    section.id as sectionid,
    section.course as courseid,
    course.code as code,
    section.letter,
    section.term as termid,
    term.term as term,
    term.visible as visible,
    section.profid as profid,
    users.username as prof
FROM section JOIN course ON section.course = course.id
JOIN term ON section.term = term.id
JOIN users ON section.profid = users.id;