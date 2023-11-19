const mongoose = require("mongoose");
const User = require("./user/user");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
        // type: String,
        // required: true,
        // unique: true,
     },
}, { timestamps: true });

const RejectedUser = new mongoose.model("RejectedUser", schema);

module.exports = RejectedUser;