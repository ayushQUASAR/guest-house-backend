const mongoose = require("mongoose");
const Room = require("./room");

const schema = new mongoose.Schema({
    room : {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
}, { timestamps: true });

const AvailableRoom = new mongoose.model("AvailableRoom", schema);

