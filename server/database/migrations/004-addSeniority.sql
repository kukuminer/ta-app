CREATE TABLE IF NOT EXISTS unit2seniority (
    id SERIAL NOT NULL,
    employeeid varchar(9) NOT NULL,
    seniority float NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (employeeid)
)