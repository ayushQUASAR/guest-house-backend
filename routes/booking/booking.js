const mongoose = require('mongoose');
const express  = require("express");
const router = express.Router();
const Booking = require("../../models/booking/booking");
const RejectedBooking = require('../../models/booking/rejectedBooking');
const RegisteredUser = require('../../models/registeredUsers');


router.use("/register", require("./bookingForm"));


// GET all the booking
router.get("/", async (req,res) => {
      try {
         const bookings = await Booking.find({});

         res.status(200).json(bookings);
      }
      catch(err) {
        console.log(err.message);
        res.status(500).json({message: err.message})
      }
});


// GET bookings by ID 
router.get("/:id", async (req,res) => {
    const id = req.params.id;
try {
   const booking = await Booking.find({_id: id});
    
   res.status(200).json(booking);
   
}
catch(err) {
    console.log(err.message);
    res.status(500).json({message: err.message})
  }
});


// GET pending or registered or rejected booking 
router.get('/approved/:approvalType', async (req,res) => {
    const approvalType = req.params.approvalType;
try{
    if(approvalType === 'pending' || approvalType === 'approved') {
   
        const booking = await Booking.find({status: approvalType});
        res.status(200).json(booking);  
  }
    else if (approvalType === 'rejected') {
          const booking = await RejectedBooking.find({});
          res.status(200).json(booking);
    }
  }
    catch(err) {
      console.log(err.message);
      res.status(500).json({message: err.message})
    }
});



// DELETE FOR (BOOKING CANCELLATION): delete the booking and remove from booking history
router.delete("/:id", async (req,res) => {
  const id = req.params.id;
try {
  const y = await Booking.findOneAndDelete({_id: id});
    // update the Registered user's booking history
   await RegisteredUser.updateOne(
      {'user.email': y[0].roomBooker.email}, {
      $pullAll: {
          bookingHistory: id,
      },
  });
}

catch(err) {
  console.log({message: err.message});
  res.status(500).json({message: err.message})
}
});

module.exports = router;