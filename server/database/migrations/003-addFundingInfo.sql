CREATE TABLE IF NOT EXISTS applicantfunding (
    id serial NOT NULL,
    studentNum varchar(9) NOT NULL,
    term int NOT NULL,

    funding int,

    PRIMARY KEY (id),
    UNIQUE (studentNum, term),
    FOREIGN KEY (term) references term(id) ON UPDATE cascade ON DELETE cascade
)