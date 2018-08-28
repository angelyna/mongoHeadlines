var express = require('express');
var cheerio = require('cheerio');
var request = require('request');

// Requiring all models
var db = require("../models");

var router = express.Router();

// Main router functionality
router.get("/", function (req, res) {
    // Grab all articles
    db.Article.find({}).then(function (dbArticle) {
        // Return the articles as a json object
        var hbsObject = {
            articles: dbArticle
        }
        res.render("home", hbsObject);
    }).catch(function (err) {
        // If an error occured, send it to the client
        res.json(err);
    });
});

router.get("/saved/", function (req, res) {
    // Grab all saved articles
    db.Article.find({ 'saved': true }).then(function (dbArticle) {
        // Return the articles as a json object
        var hbsObject = {
            articles: dbArticle
        }
        res.render("saved", hbsObject);
    }).catch(function (err) {
        res.json(err);
    });
})

router.get("/api/scrape/", function (req, res) {

    request("https://www.bankofcanada.ca", function (error, response, html) {
        if (error) {
            throw error;
        }
        // Loading the html into cheerio with the selector $
        var $ = cheerio.load(html);

        $(".media-heading").each(function (i, element) {

            // Empty array to store our results
            result = {};
            // Use cheerio's 'find' method to target the specific children of 'h3.media-heading'
            result.link = $(element).find("a").attr("href");

            result.title = $(element).children("a").text().replace(/(\t|\n|)/gm, "");

            result.summary = $(element).parent(".media-body").find("span.media-excerpt").text();

            result.category = $(element).find("a").attr("data-content-type");

            result.published = $(element).children("span.media-date").text();

            result.timeStamp = $(element).children('span').text();

            // console.log(result);

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log("err");
                });
        });
        res.redirect("/");
    });
});

router.get("/api/articles", function (req, res) {
    // Grab all articles and return as JSON
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

router.get("/api/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

router.post("/api/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.delete("/api/articles/:id", function (req, res) {
    db.Note.remove({ _id: req.params.id }).then(function () {
        db.Article.findOneAndUpdate({ note: req.params.id }, { note: null }, { new: true }).then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
    });
});

router.post("/api/articles/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

router.post("/api/articles/unsave/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;

