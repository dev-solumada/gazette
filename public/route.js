const express = require("express");
const routeExp = express.Router();
const mongoose = require('mongoose');
const PdfDoneSchema = require("../models/PdfDone");
const fs = require("fs");
let allpdf ="";
let Bdfiles = [];
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
  for(i=0;i<allpdf.length;i++){
   Bdfiles.push(allpdf[i].name);
   }
   res.render("home.html",{dones : allpdf});
  })
});
routeExp.route("/download").post(function (req, res) {
  mongoose
  .connect("mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    UseNewUrlParser: true,
  })
  .then(async () => {
    
    var pdfDone = {
      name : req.body.filename,
      treated_by : "Person"
    }
    if (Bdfiles.indexOf(req.body.filename) === -1){
      await new PdfDoneSchema(pdfDone).save();
    } 
    res.redirect("/");
  })
});

module.exports = routeExp;
