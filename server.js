/**
 * Created by yevheniia on 31.10.18.
 */

// const express = require('express');
// const app = express();
// var bodyParser = require('body-parser');
// var fs  = require('fs');
//
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
//
// app.use(bodyParser.json({ limit:'100MB', type:'application/json'}));
// app.use(bodyParser.urlencoded({ limit:'100MB', extended: true }));
//
// function readJSONFile(filename, callback) {
//     fs.readFile(filename, function (err, data) {
//         if(err) {
//             callback(err);
//             return;
//         }
//         try {
//             callback(null, JSON.parse(data));
//         } catch(exception) {
//             callback(exception);
//         }
//     });
// }
//
// readJSONFile('./data/mydata.json', function (err, json) {
//     if(err) { throw err; }
//
//
//     app.post('/', function( req, res ) {
//
//         // var resp = {'text': 'ku-ku'};
//
//         var resp = json[1];
//
//
//         res.send( JSON.stringify(resp) );
//
//     });
//
//
// });
//
// app.listen(8000, () => console.log('Test node server on port 8000!'))



//ANOTHER-WAY
var _ = require("underscore");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var fs  = require('fs');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use(bodyParser.json({ limit:'100MB', type:'application/json'}));
// app.use(bodyParser.urlencoded({ limit:'100MB', extended: true }));
//
function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if(err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch(exception) {
            callback(exception);
        }
    });
}


// var json = '[{"user": "a", "age": 20}, {"user": "b", "age": 30}, {"user": "c", "age": 40}]';



var dataData;
readJSONFile('./data/mydata.json', function (err, json) {
    if (err) {
        throw err;
    }

    var filtered = _.where(json, {index: 2});
    var selected = _.sample(filtered, 2);

    app.post('/', function( req, res ) {

        // var resp = {'text': 'ku-ku'};

        var resp = selected;
        res.send( JSON.stringify(resp) );

    });   
    
});



app.listen(8000, () => console.log('Test node server on port 8000!'))


