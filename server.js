
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news_db";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
	useMongoClient: true
});

 app.get("/scrape", function(req, res){

	axios.get("https://www.washingtonpost.com/business/technology/").then(function(response) {
		var $ = cheerio.load(response.data);

		$(".story-body h3").each(function(i, element){
			var result = {};

			result.title = $(this).children().text();
			result.link = $(this).children().attr("href");	
			result.summary = $(this).parent().next().children().text();	

			db.Article.create(result)
			.then(function(dbArticle){

				console.log(dbArticle);
			})
			.catch(function(err){
				return res.json(err);
			});

		});

		res.send("Scrape Complete");
	});
 });

app.get("/articles", function(req, res){

	db.Article.find({})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

app.get("/articles/:id", function(req, res){
	db.Article.findOne({ _id: req.params.id })
		.populate("comment")
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

app.post("/articles/:id", function(req, res){

	db.Comment.create(req.body)
	  .then(function(dbComment){

	  	return db.Comment.findOneAndUpdate({_id: req.params.id}, { comment: dbComment._id}, {new: true});

	  })
	  .then(function(dbComment){
	  	res.json(dbComment);
	  })
	  .catch(function(err){
	  	res.json(err);
	  });
});



app.listen(PORT, function(){

	console.log("App running on port: " + PORT);
});

