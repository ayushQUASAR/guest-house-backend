const express = require("express");
const axios = require('axios');


const BookingApproval = require("../../models/booking/bookingApproval");
const Booking = require("../../models/booking/booking");
const RejectedBooking = require("../../models/booking/rejectedBooking");

const router = express.Router();

router.post("/", async (req,res) => {
   const data = req.body;

   // info regarding approval
   const actualData = {
    booking: "",
    // accept or reject
    status: ""
   }

// create new instance of booking approval model
   const newBookingApproval = new BookingApproval(actualData);

   try {

    // save new approval 
     const approvalDetails =   await newBookingApproval.save();

       // if approved => find booking from booking id and update the status to approved...
     if(actualData.status === 'accept') {
             const booking  = await Booking.updateOne(
                //filter
                {_id: actualData.booking},
                //item to be updated
                {status: 'approved'}
                );   
                

//### Task 4: Room providing logic

//### Task 5: Send approval and room details to user as well as visitor using email...
if(approvalDetails.populated('booking') === null) await approvalDetails.populate('booking');
await axios.post('http://localhost:4000/email/booking/sendApprovalNotification', {
       booking: approvalDetails.booking,
}, {
   headers: {
      "Content-Type": 'application/json'
   }
});



     res.json({message: `Booking ${actualData.booking} approved successfully`});
   }

   // if not approved => remove from booking and add to rejected 
   else if(data.status === "reject") {
          const deletedBooking = await Booking.deleteOne({_id: actualData.booking});
          
          //add to rejected booking
          const rejectedBooking = new RejectedBooking({
            booking: actualData.booking,
          });

          await rejectedBooking.save();

          res.json({message: `Booking ${actualData.booking} rejected successfully`});   
   }
}
   catch(err) {
    console.log({message: err.message});
    res.status(500).json({message: err.message})
   }
});

module.exports = router;