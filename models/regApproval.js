const mongoose = require("mongoose");
const express =require('express');
const User = require("./user/user");


const approveRegSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    
}, { timestamps: true });


const RegApproval  = new mongoose.model("RegApproval", approveRegSchema);

module.exports = RegApproval;