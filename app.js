const express = require("express");
const app = express();
const exhbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://kartikmishra:MqeDDiBH1tnkmxKb@cluster0-li4tw.mongodb.net/vidjot-devdb?retryWrites=true&w=majority",
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("MongoDB connected successfuly....");
  })
  .catch(err => {
    console.log("Mongodb connection error: " + err);
  });

app.engine(
  "handlebars",
  exhbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./models/Ideas");
const Idea = mongoose.model("Ideas");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: "Please add a title"
    });
  }
  if (!req.body.details) {
    errors.push({
      text: "Please add a details"
    });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      console.log("Idea inserted successfuly: " + idea);
      res.redirect("/ideas");
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
