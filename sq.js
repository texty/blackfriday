/**
 * Created by yevheniia on 01.11.18.
 */
var express = require('express');
var app = express();

// For receiving JSON in posts
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// For the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/mydb.db');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// var db = new sqlite3.Database('./mydb.db3');

// Create Table
// db.serialize(function() {
//     db.run("CREATE TABLE IF NOT EXISTS Users (Name TEXT, Age INTEGER)");
// });
//
// db.serialize(function() {
//     db.run("INSERT into Users(Name,Age) VALUES ('Mushtaq',24)");
//     db.run("INSERT into Users(Name,Age) VALUES ('Fazil',23)");
// });

// db.serialize(function () {
//     db.all("select name from sqlite_master where type='table'", function (err, tables) {
//         console.log(tables);
//     });
// });

app.post('/', function( req, res, next ) {
        db.serialize(function() {
            db.all("SELECT * FROM leboutique WHERE id IN (SELECT DISTINCT id FROM leboutique ORDER BY RANDOM() LIMIT 50)",
                function(err,rows){
                if(err)
                    {
                        console.log(err);
                    }
                    else {
                        console.log(rows);
                        res.send(rows);
                        next();


            }
        })
    });
});


app.listen(8000);
