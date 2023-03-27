DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS application CASCADE;

CREATE TABLE student (
    id serial NOT NULL,
    studentid int NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    pool varchar(3), -- UTA or GTA

    PRIMARY KEY (id),
);

CREATE TABLE course (
    id serial NOT NULL,
    code varchar(10) UNIQUE NOT NULL,
    description text,

    PRIMARY KEY (id)
);

CREATE TABLE section (
    id serial UNIQUE NOT NULL,
    course varchar(10) NOT NULL,
    letter varchar(4) NOT NULL,
    term varchar(10) NOT NULL,
    profid int NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (course, letter, term),
    FOREIGN KEY (course) references course(code),
    FOREIGN KEY (profid) references professor(id)
);

CREATE TABLE professor (
    id serial NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE application (
    id serial NOT NULL,
    student int NOT NULL,
    course varchar(10) NOT NULL,
    term varchar(10) NOT NULL, 

    grade int,
    interest int,
    qualification int,

    PRIMARY KEY (id),
    FOREIGN KEY (student) references student(id)
    FOREIGN KEY (course) references course(code)
);

CREATE TABLE assignment (
    id serial NOT NULL,
    student int NOT NULL,
    section int NOT NULL,

    pref int, -- instructor provided
    note text, -- instructor provided
    assigned int, -- admin provided
);

CREATE TYPE usertype AS ENUM ('admin', 'professor', 'student');

CREATE TABLE users (
    id serial NOT NULL,
    userclass usertype NOT NULL -- admin/prof/student
);
