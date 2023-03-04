DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS application CASCADE;

CREATE TABLE student (
    id int NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE course (
    code varchar(10) NOT NULL,
    PRIMARY KEY (code)
);

CREATE TABLE section (
    course varchar(10) NOT NULL,
    letter varchar(4) NOT NULL,


    PRIMARY KEY (course, letter),
    FOREIGN KEY (course) references course(code)
);

CREATE TABLE professor (
    id int NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE application (
    student int NOT NULL,
    course varchar(10) NOT NULL,
    PRIMARY KEY (student, course),
    FOREIGN KEY (student) references student(id)
);