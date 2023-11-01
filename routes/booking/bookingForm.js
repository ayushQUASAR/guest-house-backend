const express = require('express');
const axios = require("axios");


const router = express.Router();

const Booking = require("../../models/booking/booking");
const RegisteredUser = require('../../models/registeredUsers');


router.post("/",  async (req,res) => {


    const data = req.body;

    try {

       //###Task 1:  fill the actualData according to fields from frontend

       ///## including the room selection details 
       let companions =[];
       if(data.companion1)  companions.push(data.companion1);
       if(data.companion2)  companions.push(data.companion2);
       if(data.companion3)  companions.push(data.companion3);

                
         const actualData = {
    kind: data.visitType,
    purpose: data.purpose,
    name: `${data.firstName} ${data.lastName}`,
    designation: data.designation,
    address: data.address,
    phone: data.phNumber,
    email: data.email,
    guestHouseSelected :data.guestHouseSelected,
    roomSelected: data.roomSelected,
    companions: companions,
    startDate: data.arrivalDate,
    // startTime: data.arrivalTime,
    endDate: data.departureDate,
    // endTime: data.departureTime,
    bookingFor: data.bookingFor,
     roomBooker: {
      // random fields
        name: "hey",
        designation:"testing",
        dept: "this",
        phone: "923452355",
        email: "dhimanmridul91@gmail.com",
        address: "Baijnath, Himachal",
    }
    }
    const newBooking = new Booking(actualData);
         await newBooking.save();


         res.status(200).json({message:`New booking ${newBooking._id} created successfully...`});
//###Task 2: add the booking id to the booking history of Registered User...
// Here, you need to find the Registered User using roomBooker's email and then update it's booking history.
// const x = await RegisteredUser.updateOne({
//   'user.email' : actualData.roomBooker.email
// }, 
// {
//   $push : {bookingHistory: newBooking._id}
// });

const registeredUsers = await RegisteredUser.find({}).populate('user');
const user = registeredUsers.filter((user) => user.user.email === actualData.roomBooker.email);
await RegisteredUser.updateOne({
  _id: user[0]._id
},
{
  $push : {bookingHistory : newBooking._id}
}
)


// const xx = await x.findOne();




//###Task 3: send the email to admin, regarding the booking form, work in bookingEmail.js
await axios.post("http://localhost:4000/email/booking/adminNotification", {
      actualData
    }
      , {
      headers :{
        "Content-Type" : "application/json"
      }
});


    }

    catch(err) {
          console.log({message: err.message});
          res.status(500).json({message: err.message});
    }
})

module.exports = router;