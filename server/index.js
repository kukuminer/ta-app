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
    db.any('SELECT * from application', [])
    .then((data) =>  {
        console.log('psql res: ', data)
        res.json({data: data});
    })
    .catch((error) => {
        console.log('psql err: ', error)
        res.json({error: error});
    });
});

app.get("/api/dashboard/:userid", (req, res) => {
    id = req.params.userid;
    console.log("request received! - ", id)
    // SELECT usertype FROM users WHERE id = $1
    db.any("SELECT usertype FROM person WHERE id = $1", id)
    .then((data) => {
        if(data.length > 1) throw new Error("Retrieved more than one user??")
        res.json({"usertype": data[0]});
    })
    .catch((error) => {
        console.log('error retrieving usertype from db')
        res.json({error: error})
    })

})

//do via form
app.post("/db", (req, res) => {
    db.any('SELECT now()', [])
    .then((data) => {
        console.log('posting at: ', data)
        res.json({response: data});
    })
    .catch((error) => {
        console.log('psql err: ', error)
        res.json({error: error});
    })
});

app.get("/api", (req, res) => {
    console.log("Connection from", req.headers.host)
    res.json({message: "Backend connection established"});
});

app.listen(PORT, () => {
    console.log(`SERVER listening on ${PORT}`);
});