const express = require("express");
const axios = require('axios');


const BookingApproval = require("../../models/booking/bookingApproval");
const Booking = require("../../models/booking/booking");


const router = express.Router();

router.get("/", async (req, res) => {
   try {
      const approvals = await BookingApproval.find({});
      res.json(approvals);
   }
   catch (err) {
      res.json({ message: err.message })
   }
})

router.delete("/", async (req, res) => {
   try {
      await BookingApproval.deleteMany({});
      res.json({ message: "Booking Approvals Deleted Successfully" });
   }
   catch (err) {
      res.json({ message: err.message })
   }
})

router.post("/", async (req, res) => {
   const data = req.body;


   // info regarding approval

   const actualData = data.status === 'reject' ? {
      booking: data.booking,
      // accept or reject
      status: 'reject',
      rejectionReason: data.reason,
   } : {
      booking: data.booking,
      status: 'accept',
      roomsAllotted: data.roomsAllotted,
      guestHouseAllotted: data.guestHouseAllotted,
      paymentDeadline: data.paymentDeadline
   }
  
   const newBookingApproval = new BookingApproval(actualData);

   try {

      // save new approval 
      const approvalDetails = await newBookingApproval.save();
      console.log(approvalDetails)
      // if approved => find booking from booking id and update the status to approved...
      if (actualData.status === 'accept') {
         await Booking.updateOne(
            //filter
            { _id: actualData.booking },
            //item to be updated
            {
               status: 'approved',
               roomsAllotted: actualData.roomsAllotted,
               guestHouseAllotted: actualData.guestHouseAllotted
            }
         );


         res.json({ message: `Booking ${actualData.booking} approved successfully` });



         await approvalDetails.populate('booking');
         console.log(approvalDetails);


         await Promise.all([
            axios.put(`http://localhost:3000/guestHouse/room/allot`, {
               roomsAllotted: actualData.roomsAllotted,
               guestHouseAllotted: actualData.guestHouseAllotted
            }, {
               headers: {
                  "Content-Type": "application/json"
               }
            }),
            axios.post('http://localhost:3000/email/booking/sendApprovalNotification', {
               booking: approvalDetails,
            }, {
               headers: {
                  "Content-Type": 'application/json'
               }
            }),
            // axios.get("http://localhost:3000/calendar/create"),
         ])

  
      }

      // if not approved => remove from booking and add to rejected 
      else if (actualData.status === "reject") {
         await Booking.updateOne({
            _id: actualData.booking
         }, {
            status: "rejected"
         });

         res.json({ message: `Booking ${actualData.booking} rejected successfully` });
      }
   }
   catch (err) {
      console.log({ message: err.message });
      res.status(500).json({ message: err.message })
   }
});

module.exports = router;