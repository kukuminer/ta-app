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
    course varchar(10) NOT NULL,
    letter varchar(4) NOT NULL,
    term varchar(10) NOT NULL,
    profid varchar()

    PRIMARY KEY (course, letter, term),
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
    pref int, -- instructor provided
    note text, -- instructor provided
    assigned int, -- admin provided

    PRIMARY KEY (id),
    FOREIGN KEY (student) references student(id)
    FOREIGN KEY (course) references 
);
