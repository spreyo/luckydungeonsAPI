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




app.post('/deposit', async (req, res, next) => {
    const username = req.body["username"];
    const amount = req.body.amount;
    const conn = await pool.getConnection();
    var curAmount = await conn.query(`SELECT amount
        FROM s22477_dungeons.vault
        WHERE username = "${username}"`);

    if (curAmount[0] == undefined) {
        await conn.query(`INSERT INTO s22477_dungeons.vault
            (username, amount)
            VALUES('${username}', ${amount});
            `)
        res.status(200).send(`${username}, ${amount}`);
        return;
    }


    await conn.query(`UPDATE s22477_dungeons.vault 
            SET amount = ${parseInt(curAmount[0]["amount"]) + parseInt(amount)}
            WHERE username = '${username}'`)

    res.status(200).send(`${username}, ${amount}`);
})

app.get('/test', (req, res, next) => {
    res.send("test");
})
app.delete('/delete/', (req, res) => {
})


app.listen(3001, () => {
    console.log('server running');
})