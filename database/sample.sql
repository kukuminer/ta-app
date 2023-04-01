DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS assignment CASCADE;


INSERT INTO users(firstname, lastname, email, usertype) VALUES
('Liran', 'Z', 'liranz@yorku.ca', 'admin'),
('Jonatan', 'S', 'jonatan@yorku.ca', 'professor'),
('John', 'D', 'john@yorku.ca', 'student');

INSERT INTO student(id, studentid)
SELECT id, id FROM users WHERE userType = 'student';

INSERT INTO course (code) 
VALUES ('2030'), ('2011'), ('3214');

INSERT INTO professor(id) 
SELECT (id) FROM users WHERE userType = 'professor';

INSERT INTO section(course, letter, term, isCurrent, profid)
VALUES ('2030', 'A', 'F23', true, '2'), ('2030', 'Z', 'W24', false, '2'), ('2011', 'A', 'F23', true, '2');
SELECT (course, letter) 
FROM section 
WHERE profid=1 and isCurrent=true;

INSERT INTO application(student, course, term) 
VALUES ('3', '2030', 'F23'), ('3', '2011', 'F23');

