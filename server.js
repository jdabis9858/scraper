var cheerio = require("cheerio")
var axios = require("axios")
var express = require("express")
var mongoose = require("mongoose")


var app = express()



// Database configuration
// var databaseUrl = "scraperdb";
// var collections = ["scrapedNews"];

mongoose.connect("mongodb://localhost/scraperdb", { useNewUrlParser: true });
// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
    res.send("Hello world");
});




app.get("/scrape", function(req, res) {
    
    // // Ma ke a request via axios for the news section of `ycombinator`
    // axios.get("http://www.espn.com/").then(function(response) {
    //   // Load the html body from axios into cheerio
    //   var $ = cheerio.load(response.data);
  
    //   console.log("RESPONSE: ", response.data);
    //   // For each element with a "title" class
    //   $(".headlineStack__list").each(function(i, element) {
    //     // Save the text and href of each link enclosed in the current element
    //     var result = {}
    //     result.headline = $(this).children("a").text();
    //     console.log("---------------------")
    //     console.log(result)
  
    //     // If this found element had both a title and a link
    // db.Article.create(result) 
    //     .then(function(dbArticle){
    //         console.log(dbArticle)
    //     })
    //     .catch(function(err) {
    //         // If an error occurred, send it to the client
    //         return res.json(err);
    //       });
    //     }
    //   )
    // });
    axios.get("https://www.irishtimes.com/news/ireland").then(function(response) {
        // use cheerio and save the HTML to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //iterate through the HTML finding the .span4 class to get the data we want for each article
        $(".span4").each(function(i, element) {
          //empty object for pushing the article data
          var result = {};
          //save the article headline
          result.headline = $(this)
            .find(".h2")
            .text()
            .trim();
          //save the summary
          result.summary = $(this)
            .find("p")
            .children("a")
            .text()
            .trim();
          //complete the partially provided link to the article
          let concatLink =
            "https://www.irishtimes.com" +
            $(this)
              .children("a")
              .attr("href")
              .trim();

              console.log(result)
          //save the link to the object
          result.link = concatLink;
          //the source property allows to sort the data once retrieved from the DB
          result.source = "times";
          //insert the newly created article object into the Mongo DB
          db.Article
            .create(result)
            .then(function(dbArticle) {
              console.log("Times Scrape Complete!");
            })
            .catch(function(err) {
              console.log("times Error!");
            });
        }); //end span4.each
      }); //end IrishTimes axios
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
    

        app.listen(3000, function () {
            console.log("App running on port 3000!");
        });
