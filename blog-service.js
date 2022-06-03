const { rejects } = require("assert");
const fs = require("fs"); 
const { resolve } = require("path");
var blog = require('./blog-service');
var posts = require('./data/posts.json');

var postArray = [];
var categoriesArray = [];
module.exports.initialize = () => {
    let promise = new Promise((resolve, rejects) => {
        try {
            fs.readFile('./data/posts.json', 'utf8', (err, data) => {
                if (err) throw err;
                postArray = JSON.parse(data);
            });     
            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err) throw err;
                categoriesArray = JSON.parse(data);
            });     
        }
        catch(ex){
            rejects({message : "unable to read file"});
        }
        resolve("Successful!!!");
    })
    return promise;
}

module.exports.getAllPosts = () => {
    let promise = new Promise((resolve, rejects) => {
       if(postArray.length === 0){
           rejects({message : "no results returned"})
       }
       else{
           resolve(postArray)
       }
      
    })
    return promise;
}

module.exports.getPublishedPosts = () => {
    let promise = new Promise((resolve, rejects) => {
       if(postArray.length === 0){
           rejects({message : "no results returned"})
       }
       else{
           let publishedPosts = []
           postArray.forEach(post => {
               if(post.published === true){
                publishedPosts.push(post);
               }
           })

           resolve(publishedPosts)
       }
    })
    return promise;
}

module.exports.getCategories = () => {
    let promise = new Promise((resolve, rejects) => {
        if(categoriesArray.length === 0){
            rejects({message : "no results returned"})
        }
        else{
            resolve(categoriesArray)
        }  
     })
     return promise;
}