const express = require("express");
const routeExp = express.Router();
const mongoose = require('mongoose');
const PdfDoneSchema = require("../models/PdfDone");
const fs = require("fs");
let allpdf ="";
let Bdfiles = [];
var version = [];
var fullname = "";
routeExp.route("/").get(function (req, res) {
  mongoose
  .connect("mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    UseNewUrlParser: true,
  })
  .then(async () => {
    // PdfDoneSchema.deleteMany({},()=>{
    //   console.log("All is removed");
    // })
  allpdf = await PdfDoneSchema.find();
  Bdfiles = [];
  version = [];
  for(i=0;i<allpdf.length;i++){
   Bdfiles.push(allpdf[i].name);
   version.push(allpdf[i].version);
   }
   res.render("home.html",{dones : allpdf, version: version, bdfls: Bdfiles});
  })
});

routeExp.route("/download").post(function (req, res) {
  console.log('mande')
  mongoose
    .connect(
      "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var pdfDone = {
        name: req.body.filename,
        treated_by: fullname.last_name,
        version: req.body.version,
      };
      if (Bdfiles.indexOf(req.body.filename) === -1) {
        await new PdfDoneSchema(pdfDone).save();
      } else {
        await PdfDoneSchema.findOneAndUpdate(
          { id: req.body.filename },
          { version: req.body.version }
        );
      }
      res.redirect("/");
    });
});

module.exports = routeExp;
