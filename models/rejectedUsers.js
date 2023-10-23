const mongoose = require("mongoose");
const User = require("./user/user");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     },
});

const RejectedUser = new mongoose.model("RejectedUser", schema);