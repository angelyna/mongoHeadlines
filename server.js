var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/controller.js");

// mongoose.connect(MONGODB_URI);
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bankofcanadanews";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Database configuration
mongoose.connect('mongodb://localhost/bankofcanadanews');
var mong = mongoose.connection;

mong.on('error', function (err) {
    console.log('Mongoose Error: ', err);
});

mong.once('open', function () {
    console.log('Mongoose connection successful.');
});

app.use(routes);

app.listen(PORT, function () {
    console.log("App running on PORT:" + PORT);
});