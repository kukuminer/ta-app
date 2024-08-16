CREATE TABLE IF NOT EXISTS seniority (
    id SERIAL NOT NULL,
    employeeid varchar(9) NOT NULL,
    seniority float NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (employeeid)
)