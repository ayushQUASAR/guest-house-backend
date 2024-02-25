const mongoose = require("mongoose");

const otherSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
    }
    ,
    dept: {
        type: String,
        required: true,
    },
    phone: {
        type:Number,
max: [9999999999, "Phone no. must be 10 digit"],
min: [1000000000, "Phone no. must be 10 digit"], 
        required: true
    }
}, { timestamps: true });



const Other = new mongoose.model("other", otherSchema);

module.exports = Other;