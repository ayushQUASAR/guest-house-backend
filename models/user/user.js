const mongoose = require('mongoose');
const Ref = require('./ref');

const userSchema = new mongoose.Schema({
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
},
city: {
    type: String,
    required:true,
},
govtID: {
    type: number, 
    required: true,
},
userLogo: {
type: Buffer,
},
idProof: {
    type: Buffer, // image as string  
    required: true,
},

reference: {
  type: mongoose.Schema.Types.ObjectId,
  ref:'Ref',
}

});

const User = new mongoose.model("User", userSchema);
module.exports = User;


