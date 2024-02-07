const express = require("express");

const router = express.Router();

const Booking = require("../../models/booking/booking");

router.post("/makepayment", async (req, res) => {
    const data = req.body;

    try {

        if (data.paymentStatus == "success") {
            // update booking status
            const bookingDetails = await Booking.findByIdAndUpdate(
                data.booking_id,
                { status: "paid" },
                { new: true}
            );

            console.log(bookingDetails);

            res.status(200).json({
                message: `Payment for ${data.booking_id} done successfully...`,
            });
        }

        else {
            res.status(200).json({
                message: `Payment for ${data.booking_id} failed...`,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
);

router.get("/", async (req, res) => {
    try {
        const bookingDetails = await Booking.find({ status: "paid" });
        res.json(bookingDetails);
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;