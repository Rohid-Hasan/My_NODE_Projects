const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const MongoSession = require("connect-mongodb-session")(session);

const crudRoutes = require("./routes/crudRoutes");
const mongoose = require("mongoose");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const store = new MongoSession({
  uri: "mongodb+srv://Rohed:Incorrect00@cluster0.6g4rd.mongodb.net/myFirstDatabase",
  collection: "session-storage",
});

app.use(
  session({
    secret: "my secret",
    cookie: { maxAge: 1000 * 60 * 60 },
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (req.session.isAuth) {
    req.isAuth = true;
  } else {
    req.isAuth = false;
  }

  next();
});

app.use((req, res, next) => {
  if (req.isAuth===true) {
    res.locals.isAuth = true;
  } else {
    res.locals.isAuth = false;
  }

  next();
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("csvFile"));
app.use(express.static(path.join(__dirname, "public")));

app.use(crudRoutes);

mongoose
  .connect(
    "mongodb+srv://Rohed:Incorrect00@cluster0.6g4rd.mongodb.net/myFirstDatabase"
  )
  .then((success) => {
    console.log("database connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
