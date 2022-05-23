const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
});

const User = mongoose.model("user", userSchema);    //it'll automatically create collection(s)
module.exports = User;