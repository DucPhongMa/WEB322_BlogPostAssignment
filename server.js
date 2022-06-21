/*********************************************************************************
*  WEB322 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _____Duc Phong Ma____Student ID: __137015194__ Date: __June 16th, 2022_
*
*  Online (Heroku) URL: https://agile-savannah-70325.herokuapp.com/
*
********************************************************************************/ 
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require('path');
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const exphbs = require('express-handlebars');

const blog = require('./blog-service');

const app = express();

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

cloudinary.config({
    cloud_name: 'ducphongma',
    api_key: '498383367889173',
    api_secret: 'lKeb6Eu_atx1zsLWDJo1b2y_4co',
    secure: true
});

app.use(express.static('public'));

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.redirect("/about");
});

app.get('/about',(req,res) => {
    res.render("about");
});


app.get('/blog',(req,res) => {
    blog.getPublishedPosts()
         .then((data) => {
             res.json(data);
         })
         .catch((err) => {
             res.json(err);
         })
});

//Display and Query Post 
app.get('/posts', (req,res) => {
    if(req.query.category){
        blog.getPostsByCategory(req.query.category)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            })
    }
    else if(req.query.minDate){
        blog.getPostsByMinDate(req.query.minDate)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            })
    }
    else {
        blog.getAllPosts()
            .then((data) => {
                res.json(data);
             })
            .catch((err) => {
                res.json(err);
             })
    }
    
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

const upload = multer();

app.post('/posts/add',  upload.single("featureImage"), (req,res) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                    reject(error);
                    }
                }
            );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;

        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blog.addPost(req.body)
                .then(() => {
                res.redirect("/posts");
        });
    });
});

app.get('/posts/add',(req,res) => {
    res.sendFile(path.join(__dirname+'/views/addPost.html'));
});

app.get('/post/:value', (req,res) => {
    blog.getPostById(req.params.value)
        .then((data) => {
            res.json({data});
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
