// create web server
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const { body, validationResult } = require('express-validator');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// create connection to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comment'
});

// connect to mysql
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// run the server at port 8080
var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
})

// get all comments
app.get('/comments', function (req, res) {
    connection.query('select * from comments', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
})

// get comment by id
app.get('/comments/:id', function (req, res) {
    connection.query('select * from comments where id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
})

// delete comment by id
app.delete('/comments/:id', function (req, res) {
    connection.query('delete from comments where id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end('Record has been deleted!');
    });
})

// add new comment
app.post('/comments', [
    body('name').not().isEmpty().trim().escape(),
    body('email').not().isEmpty().trim().escape(),
    body('comment').not().isEmpty().trim().escape()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var params = req.body;
        connection.query('INSERT INTO comments SET ?', params, function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    } else {
        res.status(422).json({ errors: errors.array() });
    }
})

// update comment by id
app.put('/comments