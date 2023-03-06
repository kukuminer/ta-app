const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();


const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:docker@host.docker.internal:5432/testdb");

db.any('SELECT now()', [])
.then((data) =>  {
    console.log('SQL Connection established at ', data)
})
.catch((error) => {
    console.log('SQL ERROR:\n', error)
});

app.get("/db", (req, res) => {
    db.any('SELECT now()', [])
    .then((data) =>  {
        console.log('psql res: ', data)
        res.json({data: data});
    })
    .catch((error) => {
        console.log('psql err: ', error)
        res.json({uhoh: 'stinky'});
    });
})

app.get("/api", (req, res) => {
    res.json({message: "Hello noodle!"});
});

app.listen(PORT, () => {
    console.log(`SERVER listening on ${PORT}`);
});