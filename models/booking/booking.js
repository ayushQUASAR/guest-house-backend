const mongoose  = require("mongoose");
const Room = require("../room")

const bookingSchema = new mongoose.Schema({
    
    kind :{
     type:String,
    //  required: true,
     enum:["official", "unofficial"]
    }, 

    purpose: {
        type: String,
         required: true,
        },

     name: {
        type: String,
        required: true,
    },

    designation: {
          type: String,
          required :true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
        type: String,
        required: true,
    },
    email: {
        type:String, 
        required: true,
    },

    companions: {
        type: [String],
    },

    startDate: {
        type: Date,
        // required: true,
    },

    startTime: {
         type: String,
        //  required: true,
    },

    endDate: {
        type: Date,
        // required: true,
    },

    endTime: {
        type: String, 
        // required: true,
    },

    status: {
        type: String,
        required: true,
        enum: ['approved', 'pending','hodPending', 'cancelled', 'rejected', 'checkedOut', 'refunded', 'paid'],
        default: 'pending'
    },
   
    bookingFor: {
         type: String,
    },


   guestHouseSelected :{
        type: Number
   },

   roomsSelected :{
         type: Number
   },

   roomsAllotted: {
           type: [Number],
           default : []
   },
  
   guestHouseAllotted: {
          type: Number
   },
 
    roomBooker: {
        isAdmin : {
          type: Boolean, 
          default: false,
        },
        isStudent : {
           type: Boolean
        },
        idProof: {
            type: String
        },
        name: {
            type: String,
            //  required: true
        },
        designation:{
            type: String, 
            // required: true
        },
        dept: {
            type: String,
            // required: true
        },
        phone: {
            type: String,
            // required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            //  required: true,
        }
    }
}, { timestamps: true });

const Booking = new mongoose.model("Booking", bookingSchema);
module.exports = Booking;