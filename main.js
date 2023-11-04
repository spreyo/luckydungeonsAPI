var express = require('express');
var app = express();
const fs = require('fs')
const cors = require('cors');
const bodyParser = require('body-parser');
const e = require('express');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const mariadb = require('mariadb');
const pool = mariadb.createPool({ host: "sql1.revivenode.com", user: "u22477_FRxzK4fT2t", password: ".nkMp!cl6AgY+vaDz86w+!qg" })


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.post('/deposit', (req, res, next) => {
    username = req.body["username"];
    amount = req.body.amount;
    console.log(username);
    res.status(200).send(username, amount);

})

app.get('/test', (req, res, next) => {
    res.send("test");
})
app.delete('/delete/', (req, res) => {
})


app.listen(3001, () => {
    console.log('server running');
})