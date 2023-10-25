const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    bookingHistory: {
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    }
});

const RegisteredUser = new mongoose.model("RegisteredUser", schema);

module.exports = RegisteredUser;
