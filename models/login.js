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
}
});


const Login = new mongoose.model("Login", loginSchema);

module.exports = Login;