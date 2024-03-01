const express = require("express");

const router = express.Router();

const Booking = require("../../models/booking/booking");
const Refund = require("../../models/refund/refund");

router.post("/", async (req, res) => {
    const data = req.body;
console.log("Data: ", data);
    // info regarding refund
    const actualData = {
        booking: data.booking,
        name: data.name,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        IFSC: data.IFSC,
    };

    const newRefund = new Refund(actualData);

    try {
        // save new refund
        const refundDetails = await newRefund.save();
        console.log(refundDetails);

        // update booking status
        const bookingDetails = await Booking.findByIdAndUpdate(
            data.booking,
            { status: "refunded" }
        );

        res.status(200).json({
            message: `Refund ${refundDetails._id} created successfully...`,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
}
);


router.get("/:bookingId",  async (req,res) => {
    const bookingId = req.params.bookingId;

    if(!bookingId) {
        return res.status(404).json({message:"Booking ID not found"});
    }

    try {

        const refundBookingDetails = await Refund.findOne({booking: bookingId}).populate('booking');
        if(!refundBookingDetails) {
         return res.status(404).json({message: "Booking has not been refunded yet..."});
        }

      return res.status(200).json(refundBookingDetails);
        
        
    } catch (error) {
        console.log("Error in GET /refund/:id route: ", error.message);
       return  res.status(500).json({message: "Could not fetch refund details"});
    }


})
router.get("/", async (req, res) => {
    try {
        const refunds = await Refund.find({}).populate("booking");
        res.json(refunds);
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;