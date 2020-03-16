const mongoose = require('mongoose');
// install a unqiue validator so we do not have the same user twice
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

// exporting the model
module.exports = mongoose.model('User', userSchema);