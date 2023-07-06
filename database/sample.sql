INSERT INTO users(firstname, lastname, email, usertype, username) VALUES
('Liran', 'Z', 'liranz@yorku.ca', 'admin', 'kuku'),
('Jonatan', 'S', 'jonatan@yorku.ca', 'professor', 'jonatan'),
('John', 'D', 'john@yorku.ca', 'student', 'johndoe'),
('Michael', 'B', 'mike@yorku.ca', 'professor', 'mikeb'),
('Jane', 'E', 'jane@yorku.ca', 'student', 'jane');

INSERT INTO term(id, term, visible) VALUES
(2, 'F23', true),
(3, 'W24', true),
(1, 'S23', false);

INSERT INTO student(id, studentid)
SELECT id, id FROM users WHERE userType = 'student';

INSERT INTO course (code, name, description) 
VALUES ('EECS2030', 'intro to OOP', 'oop intro'), 
('EECS2011', 'algorithms', 'algo text'), 
('EECS3214', 'networks', 'network hover text');

INSERT INTO professor(id) 
SELECT (id) FROM users WHERE userType = 'professor';

INSERT INTO section(course, letter, term, profid)
VALUES ('1', 'A', 2, '2'), 
('1', 'B', 2, '4'),
('1', 'Z', 3, '2'), 
('2', 'A', 2, '2'),
('2', 'B', 2, '4'),
('3', 'C', 2, '4');

SELECT (course, letter) 
FROM section 
WHERE profid=2 and isCurrent=true;

INSERT INTO application(student, course, term, grade, interest, qualification) 
VALUES ('3', '1', 2, 90, 3, 3), 
('3', '2', 2, 80, 3, 2),
('5', '1', 2, 100, 4, 4),
('3', '1', 3, 50, 2, 2);

-- INSERT INTO assignment(student, section)
-- VALUES (3, 1)
-- ON CONFLICT (student, section)
-- DO UPDATE SET pref = 50, note = 'good student'
-- WHERE id = 1;

INSERT INTO termapplication(student, term, availability, approval, explanation, incanada, wantstoteach, submitted)
VALUES ('3', 2, 12, true, 'i want to TA', true, true, false),
('3', 1, 9, true, 'i wanted to TA', true, true, true),
('5', 2, 11, true, 'jane want teach', true, true, true);


INSERT INTO rightofrefusal(student, course, term) VALUES
(3, 8, 3),
(3, 7, 3),
(5, 2, 3),
(3, 3, 2),
(3, 7, 2);

CREATE VIEW ApplicationView AS 
SELECT student, username, course, code, application.term as termid, 
term.term, interest, qualification
FROM application JOIN users ON student=users.id 
JOIN course ON application.course=course.id 
JOIN term ON application.term=term.id;