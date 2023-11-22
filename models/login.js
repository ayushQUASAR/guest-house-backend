const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
email: {
type: String,
required: true,
unique: true,
},
password: {
type: String,
required: true,
}, 
isAdmin : {
    type: Boolean,
    required: true,
    default: false,
},
isMainAdmin:  {
    type: Boolean,
    required: true,
    default: false,
}
}, { timestamps: true });


const Login = new mongoose.model("Login", loginSchema);

module.exports = Login;