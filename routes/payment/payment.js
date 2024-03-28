const express = require("express");

const router = express.Router();
const axios = require('axios')

const Booking = require("../../models/booking/booking");
const { CLIENT_CODE, USER_NAME, USER_PASS, CHANNEL_ID, STAGING_GATEWAY_URL, REMOTE_URL, STAGING_TRANS_ENQUIRY_URL } = require("../../config/env.config");
const { randomStr, encrypt, decrypt } = require("../../utils");
const Transaction = require("../../models/transaction");






router.post("/makepayment", async (req, res) => {
    const data = req.body;

    try {     

        const existingBooking = await Booking.findById(data.booking_id);

        if(!existingBooking) {
            throw new Error("Booking not found");
        }

    let payerName = existingBooking.roomBooker.name;
    let payerEmail = existingBooking.roomBooker.email;
    let payerMobile = existingBooking.roomBooker.phone;
    let clientTxnId = randomStr(20, "12345abcde");
    let amount = 20;
    let clientCode = CLIENT_CODE;   
    let transUserName = USER_NAME;
    let transUserPassword = USER_PASS;
    const callbackUrl = `${REMOTE_URL}/getPgRes`;
    const channelId = CHANNEL_ID;
    const spURL = STAGING_GATEWAY_URL;
   
  
    let mcc = "5666";
    let transDate = new Date();
  
    let stringForRequest =
      "payerName=" +
      payerName +
      "&payerEmail=" +
      payerEmail +
      "&payerMobile=" +
      payerMobile +
      "&clientTxnId=" +
      clientTxnId +
      "&amount=" +
      amount +
      "&clientCode=" +
      clientCode +
      "&transUserName=" +
      transUserName +
      "&transUserPassword=" +
      transUserPassword +
      "&callbackUrl=" +
      callbackUrl +
      "&channelId=" +
      channelId +
      "&mcc=" +
      mcc +
      "&transDate=" +
      transDate;
  
    console.log("stringForRequest :: " + stringForRequest);
  
    let encryptedStringForRequest = encrypt(stringForRequest);
    console.log("encryptedStringForRequest :: " + encryptedStringForRequest);
  
    const formData = {
      spURL: spURL,
      encData: encryptedStringForRequest,
      clientCode: clientCode,
    };

    await Transaction.create({
      payerEmail,
      payerName,
      payerMobile,
      clientTxnId,
      amount,
      channelId,
      mcc,
      transDate
    });



    res.render(process.cwd() + "/pg-form-request.html", { formData: formData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
);



  router.get("/status", async (req,res)=> {
//d1dd5c1ac2ea3a1b5a3a
const {clientTxnId} = req.query;
if(!clientTxnId) {
  return res.status(400).message({message: "client Txn id or message not found"});
}
const statusTransEncData = encrypt(`clientCode=${CLIENT_CODE}&clientTxnId=${clientTxnId}`);

console.log(statusTransEncData);
const formData =  {
statusTransEncData,
clientCode: CLIENT_CODE
}

// res.render(process.cwd() + "/pg-transaction-enquiry-request.html", { formData: formData });
const response = await axios.post(`${STAGING_TRANS_ENQUIRY_URL}`, {
...formData
}, {
  headers: {
    "Content-Type": "application/json"
  }
});


const data = await response.data;

console.log(data);

const decryptedData = decrypt(data?.statusResponseData);
console.log(decryptedData);
// const decryptedResponse = decodeURIComponent(decryptedData.split("&")[1].split("=")[1])
// console.log(decryptedResponse);

let result = {};
 decryptedData.split("&").forEach((field)=> {
  const [key, value] = field.split("=");

  result = {
    ...result, 
    [key]: value
  }
})

console.log(result);
  });




router.get("/", async (req, res) => {
    try {
        const bookingDetails = await Booking.find({ status: "paid" });
        res.json(bookingDetails);
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get("/transactions", async (req,res)=> {
  try {
    const transactions = await Transaction.find({});

    res.json(transactions);
  } catch (error) {
    res.json({message: error.message})
  }
})

module.exports = router;