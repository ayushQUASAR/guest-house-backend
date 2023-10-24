const mongoose = require('mongoose');
const Ref = require('./ref');
const Image = require('../Image');

const userSchema = new mongoose.Schema({
    // _id: {
    //     type:  mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     unique: true,
    // },
name: {
    type: String,
    required: true,
},
phone: {
type:String,
required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
city: {
    type: String,
    required:true,
},
address: {
    type: String,
required: true,
},
govtID: {
    type: String, 
    required: true,
},
userLogo: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Image',
},
idProof: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Image',
},

reference: {
  type: mongoose.Schema.Types.ObjectId,
  ref:'Ref',
}

});

const User = new mongoose.model("User", userSchema);
module.exports = User;


