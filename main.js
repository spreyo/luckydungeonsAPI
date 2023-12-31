var express = require('express');
var app = express();
const fs = require('fs')
const cors = require('cors');
const bodyParser = require('body-parser');
const e = require('express');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(cors())
const mariadb = require('mariadb');
const pool = mariadb.createPool({ host: "sql1.revivenode.com", user: "u22477_FRxzK4fT2t", password: ".nkMp!cl6AgY+vaDz86w+!qg" })


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
        await conn.end();
        res.status(200).send(`${username}, ${amount}`);
        return;
    }


    await conn.query(`UPDATE s22477_dungeons.vault 
            SET amount = ${parseInt(curAmount[0]["amount"]) + parseInt(amount)}
            WHERE username = '${username}'`)

    await conn.end();
    res.status(200).send(`${username}, ${amount}`);
})

app.post("/withdraw", async (req, res, next) => {
    const username = req.body["username"];
    const conn = await pool.getConnection();
    var amount = await conn.query(`SELECT amount
        FROM s22477_dungeons.vault
        WHERE username = "${username}"`);
    if (amount[0] == 0 || amount[0] == undefined) {
        res.status(200).send(0);
        return;
    }
    await conn.query(`UPDATE s22477_dungeons.vault 
    SET amount = 0
    WHERE username = '${username}'`);
    await conn.end();
    res.status(200).send(`${amount[0]["amount"]}`);

})

app.post("/changeToken", async (req, res, next) => {
    const username = req.body["username"];
    const token = req.body.token;
    const conn = await pool.getConnection();
    var userExists = await conn.query(`SELECT username
    FROM s22477_dungeons.vault
    WHERE username='${username}'`) == undefined ? false : true;
    if (!userExists) {
        conn.query(`INSERT INTO s22477_dungeons.vault
        (username, amount, token)
        VALUES('${username}', 0, '${token}');
        `)
        res.send(200);
        return;
    }
    console.log(userExists[0]);
    await conn.query(`UPDATE s22477_dungeons.vault
    SET token='${token}'
    WHERE username='${username}';`)
    await conn.end();
    res.send(200);

})

app.get("/login", async (req, res, next) => {
    const username = req.query.username;
    const conn = await pool.getConnection();
    const token = await conn.query(`SELECT token
    FROM s22477_dungeons.vault
    WHERE username='${username}' 
    `)
    await conn.end();
    res.status(200).send(token);
})

app.get("/diamonds", async (req, res, next) => {
    const username = req.query.username;
    const conn = await pool.getConnection();
    const amount = await conn.query(`SELECT amount
    FROM s22477_dungeons.vault
    WHERE username='${username}' 
    `)
    conn.end();
    res.status(200).send(amount);
})
app.delete("/diamonds", async (req, res, next) => {
    const username = req.query.username;
    const remove = req.query.amount;
    const conn = await pool.getConnection();
    var amount = await conn.query(`SELECT amount
    FROM s22477_dungeons.vault
    WHERE username = "${username}"`);
    amount = amount[0]["amount"]
    const sum = amount - remove >= 0 ? amount - remove : 0
    await conn.query(`UPDATE s22477_dungeons.vault
    SET amount='${sum}'
    WHERE username='${username}';`)
    await conn.end();
    res.send(200);
})
app.put("/diamonds", async (req, res, next) => {
    const username = req.query.username;
    const conn = await pool.getConnection();
    const amount = req.query.amount;
    await conn.query(`UPDATE s22477_dungeons.vault
    SET amount='${amount}'
    WHERE username='${username}';`)
    await conn.end();
    res.send(200);

})




app.listen(3001, () => {
    console.log('server running');
})