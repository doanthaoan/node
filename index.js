const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const dBConnection = mysql.createConnection({
    "host": 'localhost',
    "user": "root",
    "password": "",
    "database": "test",
    "port": 3306
})

dBConnection.connect((err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log(`DB State: ${dBConnection.state}`);
})

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
    response.send("Hello world!");
})

app.get('/users', (req, res) => {
    const query = "SELECT * FROM users";
    dBConnection.query(query,[], (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(results);
        res.send({"data": results});
    })

})

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    // check id : VALIDATION

    // res.send(`ID = ${id}`);
    const query = `SELECT name, username, date FROM users WHERE id = ?`;
    dBConnection.query(query, [id], (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send({data: results});
    })
})

app.post('/users', (req, res) => {
    // console.log(req.body);
    // const name = req.body.name;
    // const username = req.body.username;
    // const password = req.body.password;

    const {name, username, password} = req.body;
    const date = new Date();
    // res.send(`Name : ${req.body.name}`);
    if(name && username && password) {
        const query = "INSERT INTO users (name, username, password, date) values (?, ?, ?, ?)";
        dBConnection.query(query, [name, username, password, date], (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            res.send({data: results});
        })
    } else {
        res.send("Phai nhap ca name username password");
    }
    
})
app.listen(8000, () => {console.log(`App is running at port 8000...`)});

