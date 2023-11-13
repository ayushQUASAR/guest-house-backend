const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    date: {
        type : Date,
        unique: true
    },
    acBooked: {
        type: Number, 
        default : 0
    },
    nonAcBooked: {
        type: Number,
        default : 0
    }
}, {timestamps:true})

const Calendar = new mongoose.model("Calendar", calendarSchema);

module.exports = Calendar;