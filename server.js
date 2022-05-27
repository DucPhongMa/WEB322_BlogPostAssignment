var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require('path')
var app = express();

app.use(express.static('public'));
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.redirect("/about");
});

app.get('/about',function(req,res){
    res.sendFile(path.join(__dirname+'/views/about.html'));
  });
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, () => {
    console.log(`Example app listening at http://localhost:${HTTP_PORT}`)
});