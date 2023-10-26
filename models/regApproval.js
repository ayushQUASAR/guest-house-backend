const mongoose = require("mongoose");
const express =require('express');



const approveRegSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
       
        
        // type: String,
        // required: true,
        // unique: true,
    },
    status: {
        type: String,
        required: true,
        enum:["accept", "reject"]
    },
    
});


const RegApproval  = new mongoose.model("RegApproval", approveRegSchema);

module.exports = RegApproval;