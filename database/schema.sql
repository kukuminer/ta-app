DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS assignment CASCADE;

CREATE TYPE usertype AS ENUM ('admin', 'professor', 'student');

CREATE TABLE users ( -- user is reserved :(
    id serial NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    usertype usertype NOT NULL, -- admin/prof/student

    PRIMARY KEY (id)
);

CREATE TABLE student (
    id int NOT NULL,
    studentid int NOT NULL,
    pool varchar(3), -- UTA or GTA

    PRIMARY KEY (id),
    FOREIGN KEY (id) references users(id)
);

CREATE TABLE course (
    id serial NOT NULL,
    code varchar(10) UNIQUE NOT NULL,
    description text,

    PRIMARY KEY (id)
);

INSERT INTO course (code) 
VALUES ('2030'), ('2011'), ('3214');

CREATE TABLE professor (
    id int NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (id) references users(id)
);

CREATE TABLE section (
    id serial NOT NULL,
    course varchar(20) NOT NULL,
    letter varchar(4) NOT NULL,
    term varchar(10) NOT NULL,
    isCurrent boolean NOT NULL,
    profid int NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (course, letter, term),
    FOREIGN KEY (course) references course(code),
    FOREIGN KEY (profid) references professor(id)
);

INSERT INTO section(course, letter, term, isCurrent, profid)
VALUES ('2030', 'A', 'F23', true, '2'), ('2030', 'Z', 'W24', true, '2');
SELECT (course, letter) 
FROM section 
WHERE profid=1 and isCurrent=true;

CREATE TABLE application (
    id serial NOT NULL,
    student int NOT NULL,
    course varchar(10) NOT NULL,
    term varchar(10) NOT NULL, 

    grade int,
    interest int,
    qualification int,

    PRIMARY KEY (id),
    FOREIGN KEY (student) references student(id),
    FOREIGN KEY (course) references course(code)
);

CREATE TABLE assignment (
    id serial NOT NULL,
    student int NOT NULL,
    section int NOT NULL,

    pref int, -- instructor provided
    note text, -- instructor provided
    assigned int, -- admin provided
    FOREIGN KEY (student) references student(id),
    FOREIGN KEY (section) references section(id)
);


INSERT INTO users(firstname, lastname, email, usertype) VALUES
('Liran', 'Z', 'liranz@yorku.ca', 'admin'),
('Jonatan', 'S', 'jonatan@yorku.ca', 'professor'),
('John', 'D', 'john@yorku.ca', 'student');

INSERT INTO professor(id) 
SELECT (id) FROM users WHERE userType = 'professor';

INSERT INTO section()