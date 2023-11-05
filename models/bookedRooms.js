const mongoose = require('mongoose');
const User = require('./user/user');
const Room = require('./room')

const schema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
      },
      room: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Room'
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type:Date,
        required: true,
      }
}, { timestamps: true });

const BookedRoom = new mongoose.model("BookedRoom", schema);