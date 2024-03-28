const express = require("express");

const router = express.Router();

const Booking = require("../../models/booking/booking");
const Refund = require("../../models/refund/refund");
const Transaction = require("../../models/transaction");
const { CLIENT_CODE, STAGING_REFUND_URL } = require("../../config/env.config");
const { encrypt } = require("../../utils");
const axios = require("axios");

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


router.get("/initiateRefund", async (req,res)=> {
const {clientTxnId, message} = req.query;

if(!clientTxnId || !message) {
    return res.status(400).message({message: "client Txn id or message not found"});
}
try {
    
    const existingTransaction = await Transaction.findOne({clientTxnId});

    if(!existingTransaction) {
        return res.status(404).json({message: "Transaction not found"})
    }

    if(!existingTransaction.status !== 'success') {
      return res.status(403).json({message: "Unauthorized Request"});
    }


    const {amount,  spTxnId } = existingTransaction;
const stringforRequest = `clientCode=${CLIENT_CODE}&amount=${amount}&spTxnId=${spTxnId}&clientTxnId=${clientTxnId}&message=${message}`;

const encryptedStringForRequest = encrypt(stringforRequest);
console.log(encryptedStringForRequest);

const response = await axios.get(`${STAGING_REFUND_URL}?clientCode=${CLIENT_CODE}&refundQuery=${encryptedStringForRequest}`);

const data = response.data;
console.log(data);
} catch (error) {

    console.log(error);
    res.status(500).json({message: "could not perform refund. Check server logs for more details"})
}

});

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