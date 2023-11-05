const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    
        // type: String,
        // required: true,
        // unique: true,
     },
}, { timestamps: true });

const RejectedUser = new mongoose.model("RejectedUser", schema);

module.exports = RejectedUser;