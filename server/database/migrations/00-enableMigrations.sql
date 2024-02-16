CREATE TABLE IF NOT EXISTS migrations (
    id serial NOT NULL,
    filename text NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (filename)
);