const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomType: {
        type: String,
        required: true,
        enum: ['STD', 'DLX'] 
    },
     guestHouse: {
      type: String,
       required: true,
     },

     isBooked: {
      type :Boolean,
      required: true,
      default: false,
     },
     price: {
        type: Number,
        required: true,
     }
}, { timestamps: true });


const Room = new mongoose.model("Room", roomSchema);
module.exports = Room;