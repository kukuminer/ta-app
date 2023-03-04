CREATE TABLE applicants (
    id int PRIMARY KEY,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL
    course_pref
);