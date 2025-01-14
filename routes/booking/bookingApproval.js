require("dotenv").config();

const express = require("express");


const axios = require('axios');


const BookingApproval = require("../../models/booking/bookingApproval");
const Booking = require("../../models/booking/booking");
const { REMOTE_URL } = require("../../config/env.config");



const router = express.Router();

router.get("/", async (req, res) => {
   try {
      const approvals = await BookingApproval.find({}).populate("booking", "startDate endDate");
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
      startDate: data.booking.startDate,
      endDate: data.booking.endDate
   } : {
      booking: data.booking,
      status: 'accept',
      roomsAllotted: data.roomsAllotted,
      guestHouseAllotted: data.guestHouseAllotted,
      paymentDeadline: data.paymentDeadline,
      startDate: data.booking.startDate,
      endDate: data.booking.endDate
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
            axios.put(`${REMOTE_URL}/guestHouse/room/allot`, {
               roomsAllotted: actualData.roomsAllotted,
               guestHouseAllotted: actualData.guestHouseAllotted,
               startDate: actualData.startDate,
               endDate: actualData.endDate
            }, {
               headers: {
                  "Content-Type": "application/json"
               }
            }),
            axios.post(`${REMOTE_URL}/email/booking/sendApprovalNotification`, {
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
         await axios.post(`${REMOTE_URL}/email/booking/sendRejectionNotification`, {
            booking: approvalDetails,
         }, {
            headers: {
               "Content-Type": 'application/json'
            }
         })
      }
   }
   catch (err) {
      console.log({ message: err.message });
      res.status(500).json({ message: err.message })
   }
});

module.exports = router;