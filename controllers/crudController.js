const fs = require("fs");

const Demo = require("../Models/Demo");

const { validationResult } = require("express-validator");
const path = require("path");

exports.getIndex = (req, res, next) => {
  res.render("includes/header", {
    pageTitle: "Welcome in our app",
  });
};

/* get add
 */

exports.getAdd = (req, res, next) => {
  res.render("add", {
    pageTitle: "Add product to our database",
    emailErr: "",
    csvFileErr: "",
    emailValue: "",
    id: "",
  });
};

/* post add post edit
 */
exports.postAdd = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("add", {
      pageTitle: "Add product to database",
      emailErr: errors.array().find((e) => e.param == "email")
        ? errors.array().find((e) => e.param == "email").msg
        : "",
      csvFileErr: "",
      emailValue: "",
      id: req.body.id ? req.body.id : "",
    });
  }

  if (!req.body.id) {
    const file = req.file;

    if (!file) {
      return res.render("add", {
        pageTitle: "Add product to database",
        emailErr: "",
        csvFileErr: "Please enter a valid file",
        emailValue: "",
        id: "",
      });
    }

    fs.readFile(file.path, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }

      const thisDemo = new Demo({ email: req.body.email, csvFileData: data });
      thisDemo
        .save()
        .then((success) => {
          console.log("Data saved successfully ");
          res.redirect("/get");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    const file = req.file;
    Demo.findOne({ id: req.body.id })
      .then((data) => {
        console.log(data);
        data.email = req.body.email;
        if (file) {
          fs.readFile(file.path, "utf8", (err, fileData) => {
            if (err) {
              return console.log(err);
            }
            data.csvFileData = fileData;
          });
        }
        data.save().then((success) => {
          console.log("Product update successfully");
          res.redirect("/get");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getAll = (req, res, next) => {
  Demo.find()
    .then((data) => {
      res.render("fetch", {
        pageTitle: "Read All our collection",
        demos: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.geteditDemo = (req, res, next) => {
  const demoId = req.param.demoId;

  Demo.findOne({ id: demoId })
    .then((demo) => {
      if (!demo) {
        return console.log("Id does not valid please enter a valid id");
      }
      console.log(demo.email);
      res.render("add", {
        pageTitle: "Edid this Item ",
        emailErr: "",
        csvFileErr: "",
        emailValue: demo.email,
        id: demo._id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteItem = (req, res, next) => {
  const itemId = req.param.itemId;

  Demo.deleteOne({ id: itemId }, (err) => {
    if (err) {
      res.status(404).json({ message: "Failed" });
    }
    res.status(200).json({ message: "success" });
  });
};

exports.login = (req, res, next) => {
  req.session.isAuth = true;
  req.session.save((err) => {
    if (err) {
      return console.log("error occoured");
    }
    console.log("session saved");
    res.redirect("/");
  });
};

exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return console.log("can not delete the sesion");
      }

      console.log("session deleted");
      res.redirect("/");
    });
  }
};
