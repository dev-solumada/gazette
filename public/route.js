const express = require("express");
const routeExp = express.Router();
const mongoose = require('mongoose');
const PdfDoneSchema = require("../models/PdfDone");
const SaveSchema = require("../models/Save");
const fs = require("fs");
const { route } = require("express/lib/application");
const Save = require("../models/Save");
let allpdf ="";
let Bdfiles = [];
var version = [];
var fullname = "";
const MONGOOSE_URL = "mongodb+srv://solumada:vbcFPNKhZk0vcpfI@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
routeExp.route("/").get(function (req, res) {
  console.log("this is work");
  // lire les fichie
  var saveList = [];
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      const saves = await SaveSchema.find();
      saves.forEach(async save => {
        if (save.filename.includes('--!')) {
          let d = save.filename.split('--!')[1].split('.')[0];
          let filedate = new Date(parseInt(d));
          let datenow = new Date(Date.now());
          let timeDiff = Math.abs(filedate.getTime() - datenow.getTime());
          var diffDays = timeDiff / (1000 * 3600 * 24); 
          // supprimer le fichier après 121 jours ou 4 mois
          if (diffDays > 121) {
            await new SaveSchema(save).delete();
          }
        }
      })
    }).catch(e => {
      console.log(e);
    }).finally(() => {
      
    });
    res.render("home.html",{dones : [], version: "null", bdfls: "null", saves: saveList});
});

routeExp.route("/download").post(function (req, res) {
  var filename = req.body.filename;
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var pdfDone = {
        name: filename,
        treated_by: fullname.last_name,
        version: req.body.version,
      };
      if (Bdfiles.indexOf(filename) === -1) {
        await new PdfDoneSchema(pdfDone).save();
      } else {
        await PdfDoneSchema.findOneAndUpdate(
          { id: filename },
          { version: req.body.version }
        );
      }
      res.send({status: 1});
    });
});


routeExp.route('/save').post(function(req, res) {
  var fs = require('fs');
  var oldfilename = req.body.oldfilename;
  var filename = `${req.body.filename}--!${Date.now()}.gs`;
  var fileContent = req.body.data;
  // save data
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var save = {
        filename: filename,
        data: fileContent
      };
      let re = new RegExp(".*"+oldfilename+".*");
      var findsave = await SaveSchema.findOne({"filename": re});
      if (findsave !== null) {
        await SaveSchema.findOneAndUpdate({"filename": re}, save);
      } else {
        await new SaveSchema(save).save();
      }
      res.send({status: 'ok', file: save});
    }).catch(e => {
      res.send({status: 'notok'});
    });
})

routeExp.route('/checksave').post(function(req, res) {
  var filename = req.body.filename;
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      let re = new RegExp(".*"+filename+".*");
      var save = await SaveSchema.find({"filename": re});
      if (save.length) 
        res.send({status: 'ok', file: save[0]})
      else
        res.send({status: 'notok', filename: null})
    }).catch(e => {
      res.send({status: 'notok', filename: null})
    });
})

module.exports = routeExp;
