const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./public/route.js");
const PORT = process.env.PORT || 8080;
const methodOverride = require("method-override");

app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

// Fichier static a utiliser
app.use(express.static("public"));
app.use(express.static('saves'));
app.use(express.static('public/assets/css'));
app.use(express.static('public/assets/js'));
app.use(express.static('public/assets/images'));
app.use(express.static('public/plateforme'));
// View de type html
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/public");

//app.use(express.static(__dirname + "/public"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: "50mb"}));
app.use("/", route);
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));


const server = app.listen(process.env.PORT || PORT, () => {
  const port = server.address().port;
  console.log(`Express is working on port ${port}`);
});
