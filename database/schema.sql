DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS assignment CASCADE;
DROP TABLE IF EXISTS termApplication CASCADE;

CREATE TYPE usertype AS ENUM ('admin', 'professor', 'student');

CREATE TABLE users ( -- user is reserved :(
    id serial NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    usertype usertype NOT NULL, -- admin/professor/student

    PRIMARY KEY (id)
);

CREATE TABLE student (
    id int NOT NULL,
    studentid int NOT NULL,
    pool varchar(3), -- UTA or GTA

    PRIMARY KEY (id),
    UNIQUE (studentid),
    FOREIGN KEY (id) references users(id)
);

CREATE TABLE course (
    id serial NOT NULL,
    code varchar(10) UNIQUE NOT NULL,
    description text,

    PRIMARY KEY (id)
);

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

CREATE TABLE application (
    id serial NOT NULL,
    student int NOT NULL,
    course varchar(10) NOT NULL,
    term varchar(10) NOT NULL, 

    grade int,
    interest int,
    qualification int,

    PRIMARY KEY (id),
    UNIQUE (student, course, term),
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
    PRIMARY KEY (id),
    UNIQUE (student, section),
    FOREIGN KEY (student) references student(id),
    FOREIGN KEY (section) references section(id)
);

CREATE TABLE termapplication (
    id serial NOT NULL,
    student int NOT NULL,

    term varchar(10),
    availability int NOT NULL,
    approval boolean,
    explanation text,
    inCanada boolean,
    wantsToTeach boolean,

    isCurrent boolean, -- Set by admin, if none are current, student can submit a new submission.

    PRIMARY KEY (id),
    UNIQUE (student, term),
    FOREIGN KEY (student) references student(id)
);