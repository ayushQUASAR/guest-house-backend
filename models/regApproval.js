const mongoose = require("mongoose");
const User = require("./user/user")

const approveRegSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum:["accept", "reject"]
    },
    
});


const RegApproval  = new mongoose.model("RegApproval", approveRegSchema);

module.exports = RegApproval;