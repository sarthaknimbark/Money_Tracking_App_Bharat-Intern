var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/MoneyList')
  .then(() => console.log("Connected to Database"))
  .catch(err => console.log("Error connecting to the database: ", err));

var db = mongoose.connection;

db.on('error', (err) => console.log("Error in connecting to the Database: ", err));

app.post("/add", (req, res) => {
    if (!req.body ||!req.body.category_select ||!req.body.amount_input ||!req.body.info ||!req.body.date_input) {
        return res.status(400).send("Invalid request body.");
    }

    try {
        var category_select = req.body.category_select;
        var amount_input = req.body.amount_input;
        var info = req.body.info;
        var date_input = req.body.date_input;

        var data = {
            "Category": category_select,
            "Amount": amount_input,
            "Info": info,
            "Date": date_input
        };

        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                console.log("Error inserting record: ", err);
                return res.status(500).send("Error inserting record.");
            }
            console.log("Record Inserted Successfully");
            res.status(200).send("Record Inserted Successfully");
        });
    } catch (err) {
        console.log("Error processing request: ", err);
        res.status(500).send("Error processing request.");
    }
});

app.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://yourdomain.com");
    res.redirect('index.html');
});

app.listen(5501, () => {
    console.log("Listening on port 5501");
});