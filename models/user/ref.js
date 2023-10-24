const mongoose = require("mongoose");
const User  = require("./user");
const Student = require("./student");
const Alumni = require('./alumni');
const Other = require("./other");
const Faculty = require("./faculty");

const refSchema  = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //      required: true,
    //      unique: true,
    // },
      refTo : {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'refType'
    },
        refType : {
            type: String,
            required: true,
            enum: ['Student', 'Alumni','Other','Faculty'],
        }, 
       
        refFrom : {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default : [],
        }
});

const Ref = new mongoose.model("Reference", refSchema);

module.exports = Ref;