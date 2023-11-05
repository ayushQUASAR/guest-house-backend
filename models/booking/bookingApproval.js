const mongoose =require("mongoose");
const Booking = require("./booking")


const schema = new mongoose.Schema({
booking: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref:'Booking',
},
status: {
   type: String,
   required: true,
   enum: ["accept", "reject"]
},

roomsAllotted: {
   type: [Number],
   default: []
},
guestHouseAllotted:{
   type:  Number
}
});



const BookingApproval = new mongoose.model("BookingApproval", schema);

module.exports = BookingApproval;