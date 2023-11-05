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
        type: String,
        required: true
    }
}, { timestamps: true });



const Other = new mongoose.model("other", otherSchema);

module.exports = Other;