const mongoose = require("mongoose");

const otherSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
         required: true,
    },
    name : {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
    }
    ,
    deptt: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    }
});



const Other = new mongoose.model("Other", otherSchema);