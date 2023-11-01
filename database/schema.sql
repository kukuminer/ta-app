DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS applicant CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS instructor CASCADE;
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS assignment CASCADE;
DROP TABLE IF EXISTS termApplication CASCADE;
DROP TABLE IF EXISTS rightofrefusal CASCADE;
DROP TABLE IF EXISTS term CASCADE;
DROP TYPE IF EXISTS usertype CASCADE;

CREATE TYPE usertype AS ENUM ('admin', 'instructor', 'applicant');

CREATE TABLE users ( -- user is reserved :(
    id serial NOT NULL,
    firstname varchar(100) NOT NULL,
    lastname varchar(100) NOT NULL,
    email varchar(200) NOT NULL,
    usertype usertype NOT NULL, -- admin/instructor/applicant
    username text NOT NULL,

    -- UNIQUE (email,username),
    -- UNIQUE (email),
    UNIQUE (username),
    PRIMARY KEY (id)
);

CREATE TYPE pool AS ENUM ('unit 1', 'unit 2');

CREATE TABLE applicant (
    id int NOT NULL,
    studentNum varchar(9),
    employeeId varchar(9),
    pool pool NOT NULL,
    -- seniority,

    PRIMARY KEY (id),
    UNIQUE (studentNum),
    FOREIGN KEY (id) references users(id) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE instructor (
    id int NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (id) references users(id) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE course (
    id serial UNIQUE NOT NULL,
    code varchar(10) UNIQUE NOT NULL,
    name text,
    description text,

    PRIMARY KEY (id)
);

CREATE TABLE term (
    id serial UNIQUE NOT NULL, --Also intended to be used as a sequence number
    term varchar(10) UNIQUE NOT NULL,
    visible bool NOT NULL,
    
    PRIMARY KEY (id)
);

CREATE TABLE section (
    id serial UNIQUE NOT NULL,
    course int NOT NULL,
    letter varchar(4) NOT NULL,
    term int NOT NULL,
    profid int NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (course, letter, term),
    FOREIGN KEY (course) references course(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (profid) references instructor(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (term) references term(id) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE termapplication (
    id serial NOT NULL,
    applicant int NOT NULL,

    submitted boolean DEFAULT false,

    term int,
    availability int NOT NULL,
    approval boolean,
    skills text,
    explanation text,
    inCanada boolean,
    wantsToTeach boolean,

    PRIMARY KEY (id),
    UNIQUE (applicant, term),
    FOREIGN KEY (applicant) references applicant(id) ON UPDATE cascade ON DELETE cascade, 
    FOREIGN KEY (term) references term(id) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE application (
    id serial NOT NULL,
    applicant int NOT NULL,
    course int NOT NULL,
    term int NOT NULL, 

    grade int,
    interest int,
    qualification int,

    PRIMARY KEY (id),
    UNIQUE (applicant, course, term),
    -- FOREIGN KEY (applicant) references applicant(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (course) references course(id) ON UPDATE cascade ON DELETE cascade,
    -- FOREIGN KEY (term) references term(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (applicant, term) references termapplication(applicant, term) ON UPDATE cascade ON DELETE cascade
);

CREATE TYPE preference AS ENUM('no preference', 'acceptable', 'requested', 'critical');

CREATE TABLE assignment (
    id serial NOT NULL,
    applicant int NOT NULL,
    section int NOT NULL,

    pref preference, -- instructor provided
    note text, -- instructor provided
    assigned int, -- admin provided
    PRIMARY KEY (id),
    UNIQUE (applicant, section),
    FOREIGN KEY (applicant) references applicant(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (section) references section(id) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE rightofrefusal (
    applicant varchar(9) NOT NULL,
    course int NOT NULL,
    term int NOT NULL,

    PRIMARY KEY (applicant, course, term),
    -- FOREIGN KEY (applicant) references applicant(studentNum) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (course) references course(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (term) references term(id) ON UPDATE cascade ON DELETE cascade
);

