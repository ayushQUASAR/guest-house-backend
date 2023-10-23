const mongoose = require("mongoose");
const User = require('./user/user');
const Booking =  require('./booking/booking')



const schema = new mongoose.Schema({
    user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },
    bookingHistory: {
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        default:[],
        ref : "Booking"
    }
});

const RegisteredUser = new mongoose.model("RegisteredUser", schema);

module.exports = RegisteredUser;
