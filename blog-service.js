const { rejects } = require("assert");
const { resolve } = require("path");
const Sequelize = require('sequelize');
const { gte } = Sequelize.Op;

var sequelize = new Sequelize("SenecaDDB", "DucPhongMa", "A9BjXbGJw2EK", {
    host: 'ep-bold-wave-42353042-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});
var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});


//Load data to array
module.exports.initialize = () => {
    return new Promise((resolve,reject) => {
        sequelize.sync()
            .then(resolve('database synced successfully'))
            .catch(reject('unable to sync the database'));
    })
}

//get Post and Category Array
module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
		Post.findAll()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

module.exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
		Post.findAll({
                where: {
                    published: true
                }
             })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
		Category.findAll()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

//Add a new post
module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (prop in postData) {
            if(postData[prop] == ""){
                postData[prop] = null;
            }
        }
        postData.postDate = new Date();
        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then(function (post) {
            resolve(post)
        }).catch(function(){
            reject("unable to create post");
        });
    });
    
}

//Query
module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
		Post.findAll({
                where: {
                    category: category
                }
             })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
		Post.findAll({
                where: {
                    id: id
                }
             })
            .then(data => {
                resolve(data[0]);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

module.exports.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
		Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
             }
            })    
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
		Post.findAll({
                where: {
                    published: true,
                    category: category
                }
             })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("no results returned");
            });
	});
}

module.exports.addCategory = (categoryData) => {
    return new Promise((resolve,reject) => {
        for (var i in categoryData) {
            if (categoryData[i] == "") { categoryData[i] = null; }
        }
        
        Category.create(categoryData) 
        .then(() => {
            resolve("created Category successfully!!!");
        }).catch(err => {
            reject("unable to create Category");
        });
    })
}

module.exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        Category.destroy({
                where: {
                        id: id
                }
        }).then(() => {
                resolve("deleted");
        }).catch(err => {
                reject("Error!!!");
        });
    });
}

module.exports.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.destroy({
                where: {
                        id: id
                }
        }).then(() => {
                resolve("deleted");
        }).catch(err => {
                reject("Error!!!");
        });
    });
}