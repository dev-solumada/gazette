const express = require("express");
const routeExp = express.Router();
const mongoose = require('mongoose');
const PdfDoneSchema = require("../models/PdfDone");
const fs = require("fs");
const { route } = require("express/lib/application");
let allpdf ="";
let Bdfiles = [];
var version = [];
var fullname = "";
routeExp.route("/").get(function (req, res) {
  // mongoose
  // .connect("mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  //   useUnifiedTopology: true,
  //   UseNewUrlParser: true,
  // })
  // .then(async () => {
    // PdfDoneSchema.deleteMany({},()=>{
    //   console.log("All is removed");
    // })
  // allpdf = await PdfDoneSchema.find();
  // Bdfiles = [];
  // version = [];
  // for(i=0;i<allpdf.length;i++){
  //  Bdfiles.push(allpdf[i].name);
  //  version.push(allpdf[i].version);
  //  }
  //  res.render("home.html",{dones : allpdf, version: version, bdfls: Bdfiles});
  // })

  // lire les fichie
  var saveList = [];
  var fs = require("fs");
  fs.mkdir('saves', { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdirSync('saves').forEach(function(file) {
    if (file.includes('.gs')) {
      let d = file.split('-')[1].split('.')[0];
      let filedate = new Date(parseInt(d));
      let datenow = new Date(Date.now());
      let timeDiff = Math.abs(filedate.getTime() - datenow.getTime());
      var diffDays = timeDiff / (1000 * 3600 * 24); 
      // supprimer le fichier après un jour
      if (diffDays > 121) {
        fs.unlinkSync('saves/'+file);
      }
    }
  });

  res.render("home.html",{dones : [], version: "null", bdfls: "null", saves: saveList});
});

routeExp.route("/download").post(function (req, res) {
  var filename = req.body.filename;
  mongoose
    .connect(
      "mongodb+srv://solumada:vbcFPNKhZk0vcpfI@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
  var filename = req.body.filename;
  var filepath = 'saves/' + filename;
  var fileContent = req.body.data;
  // verifier l'existence du fichier
  var file = fs.readdirSync('saves', { withFileTypes: true })
  .filter(dirent => dirent.isFile())
  .find(dirent => dirent.name.includes(filename.split('__')[0]));
  // delete file
  if (file) {
    fs.unlinkSync("saves/" + file.name);
  }
  fs.mkdir('saves', { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
    res.send({status: 'ok'})
  }); 

})

routeExp.route('/checksave').post(function(req, res) {
  var fs = require('fs');
  var filename = req.body.filename;
  var file =
  fs.readdirSync('saves', { withFileTypes: true })
  .filter(dirent => dirent.isFile())
  .find(dirent => dirent.name.includes(filename));
  if (file) {
    res.send({status: 'ok', filename: file.name})
  } else {
    res.send({status: 'notok', filename: null})
  }
  
})

module.exports = routeExp;
