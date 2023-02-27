const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.set("strictQuery", false);
// database connection
mongoose.connect("mongodb://localhost:27017/wikiDB")
  .then(() => {
    console.log("database connected..");
  })
  .catch((err) => {
    console.log(err);
  });
// schema
const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});
// model
const Article = mongoose.model("Article", articleSchema);

////////////////////////////////Request targeting all Articles ///////////////////////////////
// GET
app.get("/articles", (req, res) => {
  Article.find({}, (err, foundArticles) => {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

// POST
app.post("/articles", (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save((err) => {
    if (!err) {
      res.send("Successful");
    } else {
      res.send(err);
    }
  });
});

// DELETE
app.delete("/articles", (req, res) => {
  Article.deleteMany({}, (err) => {
    if (!err) {
      res.send("Successfully Deleted all entry..");
    } else {
      res.send(err);
    }
  });
});

// Chainable Routes
// app.route("/articles")
//   .get((req, res) => {
//     Article.find({}, (err, foundArticles) => {
//       if (!err) {
//         res.send(foundArticles);
//       } else {
//         res.send(err);
//       }
//     });
//   })

//   .post((req, res) => {
//     const newArticle = new Article({
//       title: req.body.title,
//       content: req.body.content,
//     });

//     newArticle.save((err) => {
//       if (!err) {
//         res.send("Data Posted successfully..");
//       } else {
//         res.send(err);
//       }
//     });
//   })

//   .delete((req, res) => {
//     Article.deleteMany({}, (err) => {
//       if (!err) {
//         res.send("Successfully deleted..");
//       } else {
//         res.send(err);
//       }
//     });
//   });

////////////////////////////////Request targeting a specific Articles ///////////////////////////////

app.route("/articles/:articleTitle")
  .get((req, res) => {
    Article.find({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("Not found any article");
      }
    });
  })

  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Updated successfully..");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Updated Item..");
        } else {
          res.send(err);
        }
      }
    );
  })

.delete((req, res) => {
  Article.deleteOne({ title: req.params.articleTitle }, (err) => {
    if (!err) {
      res.send("Successfully deleted the article..");
    } else {
      res.send(err);
    }
  });
});





// server connected
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});