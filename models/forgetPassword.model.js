const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        // unique: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    token: {
        type: String,
        required: true,
        // default: false,
    },
    verified:{
        type:String,
        enum:['1', '0']
    }
});

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

module.exports = ForgetPassword;
