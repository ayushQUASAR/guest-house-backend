const mongoose = require('mongoose');


const guestHouseSchema = new mongoose.Schema({
guestHouseId: {
    type: Number,
    required: true,
    min: 1,
    max: 3, 
},
noOfRooms: Number,
rooms:[Boolean],
roomPrice:Number,
roomType: {
    type: String,
    enum: ['Non AC', 'AC']
}

});

//based on id (guest house schema will get )
guestHouseSchema.pre('save', () => {
    if(this.guestHouseId === 1) {
        this.no_of_rooms = 10;
        this.roomPrice = 1200;
        this.roomType = 'AC';
        this.rooms = new Array(10).fill(false);
    }

    if(this.guestHouseId === 2) {
        this.no_of_rooms = 12;
        this.roomPrice = 300;
        this.roomType = 'Non AC';
        this.rooms = new Array(12).fill(false);
    }

    if(this.guestHouseId === 3) {
        this.no_of_rooms = 8;
        this.roomPrice = 300;
        this.roomType = "Non AC";
        this.rooms = new Array(8).fill(false);
    }
})

const guestHouse = new mongoose.model("GuestHouse", guestHouseSchema);

module.exports = guestHouse;