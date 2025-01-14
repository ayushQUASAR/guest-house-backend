const mongoose = require('mongoose');


const guestHouseSchema = new mongoose.Schema({
guestHouseId: {
    type: Number,
    required: true,
    min: 1,
    max: 3, 
},

noOfRooms: {
    type: Number,
    default: 10,
},

rooms: {
    type: [Boolean],
    default: new Array(10).fill(false)
},

roomPrice:{
    type : Number,
    default: 300
},


roomType: {
    type: String,
    default: "AC",
}

}, { timestamps: true });

//based on id (guest house schema will get )
guestHouseSchema.pre('save', function (next) {
    if(this.guestHouseId === 1) {
        this.noOfRooms = 10;
        this.roomPrice = 1000;
        this.rooms = new Array(10).fill(false);
    }

    if(this.guestHouseId === 2) {
        this.noOfRooms = 12;
        this.roomPrice = 300;
        this.rooms = new Array(12).fill(false);
    }

    if(this.guestHouseId === 3) {
        this.noOfRooms = 8;
        this.roomPrice = 300;
        this.rooms = new Array(8).fill(false);
    }

    // continue with save operation
    next();
})

const guestHouse = new mongoose.model("GuestHouse", guestHouseSchema);

module.exports = guestHouse;