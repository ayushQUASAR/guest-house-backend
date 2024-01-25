const mongoose = require('mongoose');
const express  = require("express");
const axios = require("axios")


const router = express.Router();
const Booking = require("../../models/booking/booking");
const RegisteredUser = require('../../models/registeredUsers');
const guestHouse = require('../../models/guestHouse');



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

    const possibleBookingOptions = ['pending', 'approved', "cancelled", "rejected", "upcoming"]
try{
    if(approvalType === 'pending' || approvalType === 'approved' || approvalType === 'cancelled' || approvalType === 'rejected' || approvalType === 'upcoming') {
        if(approvalType === 'upcoming') {
          if(req.query) {
            const {guestHouse} = req.query;
            // booked room in that guest house 
            const currentDate = new Date();
           const bookings =   await Booking.find({
            status: "approved",
             guestHouseSelected: guestHouse,
             startDate: {$gte: currentDate }
            },  {startDate: 1, endDate: 1, name: 1, email: 1, roomsAllotted: 1 });
          
           const finalBooking = [];
           bookings.forEach((booking) => {
         

            for(let roomId of booking.roomsAllotted) {
              let newBooking  = {
                checkInDate: booking.startDate,
                checkOutDate: booking.endDate,
                name: booking.name,
                email: booking.email,
                  roomId
              }

              finalBooking.push(newBooking);
            }
            
           })

           return res.status(200).json(finalBooking);
                         
          }
         
        }


        const booking = await Booking.find({status: approvalType});
        res.status(200).json(booking);  
  }
else {
  throw new Error("arrival type not allowed");
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
  const y = await Booking.findByIdAndUpdate(id, {
    status: 'cancelled'
  }, {
    new: true
  });

  
  // make booking status cancelled

console.log(y);
// update the info in guesthouse collection

res.json({message: "Booking Cancelled Successfully..."});


  const rooms = y.roomsAllotted;
  const guestHouses = y.guestHouseAllotted;

  for(let i = 0;i<rooms.length;i++) {
       const incObject = {};
       incObject[`rooms.${rooms[i]-1}`] = true;
        await guestHouse.updateOne({
              guestHouseId: guestHouses
        }, {
         $set:  incObject
        });
  }



    // update the Registered user's booking history if booking cancelled
        const registeredUsers = await RegisteredUser.find({}).populate('user');
      const user =   registeredUsers.filter((user) => user.user.email === y.roomBooker.email);


   await RegisteredUser.updateOne(
      {_id: user[0]._id}, {
      $pull: {
          bookingHistory: id,
      },
  });


}

catch(err) {
  console.log({message: err.message});
  res.status(500).json({message: err.message})
}
});



router.delete("/", async (req, res) => {
try {
await Booking.deleteMany({});

res.json({message: "All Bookings deleted Successfully"})
}
catch(err) {
res.json({message: err.message})
}
})

module.exports = router;
