INSERT INTO users(firstname, lastname, email, usertype, username) VALUES
('Liran', 'Z', 'liranz@yorku.ca', 'admin', 'kuku'),
('Jonatan', 'S', 'jonatan@yorku.ca', 'professor', 'jonatan'),
('John', 'D', 'john@yorku.ca', 'student', 'johndoe'),
('Michael', 'B', 'mike@yorku.ca', 'professor', 'mikeb'),
('Jane', 'E', 'jane@yorku.ca', 'student', 'jane');

INSERT INTO student(id, studentid)
SELECT id, id FROM users WHERE userType = 'student';

INSERT INTO course (code, name, description) 
VALUES ('2030', 'intro to OOP', 'oop intro'), 
('2011', 'algorithms', 'algo text'), 
('3214', 'networks', 'network hover text');

INSERT INTO professor(id) 
SELECT (id) FROM users WHERE userType = 'professor';

INSERT INTO section(course, letter, term, isCurrent, profid)
VALUES ('1', 'A', 'F23', true, '2'), 
('1', 'B', 'F23', true, '4'),
('1', 'Z', 'W24', false, '2'), 
('2', 'A', 'F23', true, '2'),
('2', 'B', 'F23', true, '4'),
('3', 'C', 'F23', true, '4');

SELECT (course, letter) 
FROM section 
WHERE profid=2 and isCurrent=true;

INSERT INTO application(student, course, term, grade, interest, qualification) 
VALUES ('3', '1', 'F23', 90, 3, 3), 
('3', '2', 'F23', 80, 3, 2),
('5', '1', 'F23', 100, 4, 4),
('3', '1', 'W24', 50, 2, 2);

-- INSERT INTO assignment(student, section)
-- VALUES (3, 1)
-- ON CONFLICT (student, section)
-- DO UPDATE SET pref = 50, note = 'good student'
-- WHERE id = 1;

INSERT INTO termapplication(student, term, availability, approval, explanation, incanada, wantstoteach, iscurrent, submitted)
VALUES ('3', 'F23', 12, true, 'i want to TA', true, true, true, false),
('3', 'F22', 9, true, 'i wanted to TA', true, true, false, true),
('5', 'F23', 11, true, 'jane want teach', true, true, true, true);