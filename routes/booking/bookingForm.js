const express = require("express");
const axios = require("axios");

const router = express.Router();

const Booking = require("../../models/booking/booking");
const RegisteredUser = require("../../models/registeredUsers");

router.post("/", async (req, res) => {
  console.log(req.body);

  const data = req.body;

  try {
    //###Task 1:  fill the actualData according to fields from frontend

    ///## including the room selection details
    let companions = [];
    if (data.companion1) companions.push(data.companion1);
    if (data.companion2) companions.push(data.companion2);
    if (data.companion3) companions.push(data.companion3);

    const actualData = {
      purpose: data.purpose,
      name: `${data.firstName} ${data.lastName}`,
      designation: data.designation,
      address: data.address,
      phone: data.phNumber,
      email: data.email,
      guestHouseSelected: data.guestHouseSelected,
      roomsSelected: data.roomsSelected,
      companions: companions,
      startDate: data.arrivalDate,
      endDate: data.departureDate,
      startTime: data.startTime,
      endTime: data.endTime,
      roomBooker: !Boolean(data.isAdmin)
        ? {
            isAdmin: false,
            name: data.PersonName,
            dept: data.PersonDept,
            phone: data.PersonPhone,
            email: data.PersonEmail,
            address: data.PersonAddress,
          }
        : {
            isAdmin: true,
            email: data.AdminEmail,
          },
    };

    const newBooking = new Booking(actualData);
    const finalBooking = await newBooking.save();

    res
      .status(200)
      .json({
        message: `New booking ${finalBooking._id} created successfully...`,
      });

    if (!data.isAdmin) {
      const registeredUsers = await RegisteredUser.find({}).populate("user");
      const user = registeredUsers.filter(
        (user) => user.user.email === actualData.roomBooker.email
      );
      await RegisteredUser.updateOne(
        {
          _id: user[0]._id,
        },
        {
          $push: { bookingHistory: finalBooking._id },
        }
      );

      const isStudent = data.PersonDept;
      if (!isStudent) {
        await axios.post(`${process.env.REMOTE_URL}/email/booking/adminNotification`,
       {
            actualData,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (isStudent) {
        await axios.post(`${process.env.REMOTE_URL}/email/booking/hod`,
          {
            bookingId: finalBooking._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  } catch (err) {
    console.log({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
