// Using mongoose to create a post model
// import mongoose 
const mongoose = require('mongoose');

// setting schema by creating an object, fields and types of data will go inside it 
const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true}
});

// exporting the model
module.exports = mongoose.model('Post', postSchema);