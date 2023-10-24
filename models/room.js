const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_id: {
    type:Number,
    required: true,
  },
    roomType: {
        type: String,
        required: true,
        enum: ['STD', 'DLX'] 
    },
     guestHouse: {
      type: String,
       required: true,
     },
});


const Room = new mongoose.model("Room", roomSchema);
module.exports = Room;