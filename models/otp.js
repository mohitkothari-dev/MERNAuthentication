const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    email: {type: String, required: true},
    code: {type: String},
    expireIn: {type: Number},
}, {
    timestamps:true
});

const Otp = mongoose.model("otp", otpSchema,"otp");    //it'll automatically create collection(s)
module.exports = Otp;