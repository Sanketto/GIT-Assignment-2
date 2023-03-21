const mongooose = require('mongoose');

const blogSchema = new mongooose.Schema({
    // Your code goes here
    name: String,
    email: String,
    password: String,
    post: [{
        title: String,
        comment: String,
        image: String
    }]
})

const Blog = mongooose.model('users', blogSchema);

module.exports = Blog;