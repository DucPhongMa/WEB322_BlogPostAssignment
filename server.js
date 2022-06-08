/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _____Duc Phong Ma____Student ID: __137015194__ Date: __June 8th, 2022_
*
*  Online (Heroku) URL: https://agile-savannah-70325.herokuapp.com/
*
********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require('path');
var blog = require('./blog-service');
var app = express();

app.use(express.static('public'));

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.redirect("/about");
});

app.get('/about',(req,res) => {
    res.sendFile(path.join(__dirname+'/views/about.html'));
});

console.log(__dirname)

app.get('/blog',(req,res) => {
    blog.getPublishedPosts()
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
             res.json(err);
         })
});

app.get('/posts', (req,res) => {
    blog.getAllPosts()
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
             res.json(err);
         })
});

app.get('/categories',(req,res) => {
    blog.getCategories()
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
             res.json(err);
         })
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname+'/views/error404.html'));
});
// setup http server to listen on HTTP_PORT
blog.initialize()
     .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Example app listening at http://localhost:${HTTP_PORT}`);
        });
     })
     .catch(err => {
         console.log(err);
     })
