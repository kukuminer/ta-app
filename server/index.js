const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();


const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var board = Array(9).fill(null);
var xTurn = true;

// const {Pool, Client} = require("pg");
// const client = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: PORT,
// });

// client.connect()
// .then(() => {
//     client.query('SELECT now()', (err, res) => {
//         console.log(res.rows)
//         client.end()
//     });
// });

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
        res.json({poopoo: 'stinky'});
    });
})

app.get("/api", (req, res) => {
    res.json({message: "Hello noodle!"});
});

app.listen(PORT, () => {
    console.log(`SERVER listening on ${PORT}`);
});