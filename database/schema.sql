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
    firstname varchar(100) NOT NULL,
    lastname varchar(100) NOT NULL,
    email varchar(200) NOT NULL,
    usertype usertype NOT NULL, -- admin/professor/student
    username text NOT NULL,

    -- UNIQUE (email,username),
    -- UNIQUE (email),
    UNIQUE (username),
    PRIMARY KEY (id)
);

CREATE TYPE pool AS ENUM ('unit 1', 'unit 2');

CREATE TABLE student (
    id int NOT NULL,
    studentid int NOT NULL,
    pool pool,

    PRIMARY KEY (id),
    UNIQUE (studentid),
    FOREIGN KEY (id) references users(id)
);

CREATE TABLE course (
    id serial NOT NULL,
    code varchar(10) UNIQUE NOT NULL,
    name text,
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
    course int NOT NULL,
    letter varchar(4) NOT NULL,
    term varchar(10) NOT NULL,
    profid int NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (course, letter, term),
    FOREIGN KEY (course) references course(id),
    FOREIGN KEY (profid) references professor(id),
    FOREIGN KEY (term) references term(term)
);

CREATE TABLE application (
    id serial NOT NULL,
    student int NOT NULL,
    course int NOT NULL,
    term varchar(10) NOT NULL, 

    grade int,
    interest int,
    qualification int,

    PRIMARY KEY (id),
    UNIQUE (student, course, term),
    FOREIGN KEY (student) references student(id),
    FOREIGN KEY (course) references course(id),
    FOREIGN KEY (term) references term(term)
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

    submitted boolean DEFAULT false,

    term varchar(10),
    availability int NOT NULL,
    approval boolean,
    explanation text,
    inCanada boolean,
    wantsToTeach boolean,

    PRIMARY KEY (id),
    UNIQUE (student, term),
    FOREIGN KEY (student) references student(id),
    FOREIGN KEY (term) references term(term)
);

CREATE TABLE rightofrefusal (
    student int UNIQUE NOT NULL,
    course int NOT NULL,

    PRIMARY KEY (student),
    FOREIGN KEY course references course(id),
    FOREIGN KEY student references student(id)
)

CREATE TABLE term(
    term varchar(10) UNIQUE NOT NULL,
    visible bool NOT NULL,
    
    PRIMARY KEY (term)
)