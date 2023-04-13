INSERT INTO users(firstname, lastname, email, usertype) VALUES
('Liran', 'Z', 'liranz@yorku.ca', 'admin'),
('Jonatan', 'S', 'jonatan@yorku.ca', 'professor'),
('John', 'D', 'john@yorku.ca', 'student'),
('Michael', 'B', 'mike@yorku.ca', 'professor'),
('Jane', 'E', 'jane@yorku.ca', 'student');

INSERT INTO student(id, studentid)
SELECT id, id FROM users WHERE userType = 'student';

INSERT INTO course (code, name, description) 
VALUES ('2030', 'intro to OOP', 'oop intro'), 
('2011', 'algorithms', 'algo text'), 
('3214', 'networks', 'network hover text');

INSERT INTO professor(id) 
SELECT (id) FROM users WHERE userType = 'professor';

INSERT INTO section(course, letter, term, isCurrent, profid)
VALUES ('2030', 'A', 'F23', true, '2'), 
('2030', 'B', 'F23', true, '4'),
('2030', 'Z', 'W24', false, '2'), 
('2011', 'A', 'F23', true, '2'),
('2011', 'B', 'F23', true, '4'),
('3214', 'C', 'F23', true, '4');

SELECT (course, letter) 
FROM section 
WHERE profid=2 and isCurrent=true;

INSERT INTO application(student, course, term, grade, interest, qualification) 
VALUES ('3', '2030', 'F23', 90, 75, 75), 
('3', '2011', 'F23', 80, 80, 80),
('5', '2030', 'F23', 100, 100, 100),
('3', '2030', 'W24', 50, 50, 50);

-- INSERT INTO assignment(student, section)
-- VALUES (3, 1)
-- ON CONFLICT (student, section)
-- DO UPDATE SET pref = 50, note = 'good student'
-- WHERE id = 1;

INSERT INTO termapplication(student, term, availability, approval, explanation, incanada, wantstoteach, iscurrent)
VALUES ('3', 'F23', 12, true, 'i want to TA', true, true, true),
('3', 'F22', 9, true, 'i wanted to TA', true, true, false),
('5', 'F23', 11, true, 'jane want teach', true, true, true);