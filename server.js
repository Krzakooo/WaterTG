var express = require("express")
var app = express()
var fs = require("fs")
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;

app.use(express.static('static')) // serwuje stronę index.html
app.use(express.static('static/js3D'))

app.get("/hex", function (req, res) {
   console.log("aaa")
   res.sendFile(__dirname + '/static/js3D/3d.html');

})
var configData
app.post("/save", function (req, res){
   configData = req.body
   console.log(JSON.stringify(configData))
   res.send({})
})
app.post("/load", function (req, res){
   res.send(JSON.stringify(configData))
})

app.listen(PORT, function () {
   console.log("start serwera na porcie " + PORT)
})