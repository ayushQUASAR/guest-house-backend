const express = require("express");
const Booking = require("../models/booking/booking");
const Calendar = require("../models/calendar");

const router = express.Router();

router.get("/", async (req,res) => {
    try {
        const dates = await Calendar.find({});
        res.json(dates);
    }
    catch(err) {
        res.json({message: err.message})
    }
})


const data = [
    {
    startDate : new Date(2023, 10, 11),
    endDate: new Date(2023, 10, 13),
    roomsSelected : 2,
    guestHouseSelected : 1
 },
 {
  startDate : new Date(2023, 10, 20),
  endDate: new Date(2023, 10, 23),
  roomsSelected : 6,
  guestHouseSelected: 2
},
{
  startDate: new Date(2023, 10, 18),
  endDate: new Date(2023, 10, 21),
  roomsSelected : 4,
  guestHouseSelected: 3
}, 
{
    startDate: new Date(2023, 10, 29),
    endDate: new Date(2023, 11, 2),
    roomsSelected: 4,
    guestHouseSelected: 1
}, 
{
    startDate: new Date(2023, 11, 31),
    endDate: new Date(2024, 0, 2),
    roomsSelected: 1,
    guestHouseSelected: 2
}];


router.get("/create",  async (req, res) => {
    // console.log('hello')
try {

   const data = await Booking.find({status: "approved"}, {startDate: 1, endDate: 1, roomsAllotted: 1, guestHouseAllotted: 1});

    for(let i = 0;i<data.length;i++) {
    
        let item = data[i];
        console.log(item.roomsAllotted);
   const repeatedItem = item.guestHouseAllotted === 1 ? {
    acBooked : item.roomsAllotted.length
} : item.guestHouseAllotted === 2 ?  {
    nonAc1Booked: item.roomsAllotted.length
} : {
    nonAc2Booked: item.roomsAllotted.length
}
        let start_date = new Date(item.startDate);
        let end_date = new Date(item.endDate);
        while(start_date<=end_date) {
           // find date in array 
           const calendarDates = await Calendar.find({});
   
           const x = start_date;
           const found = calendarDates.find((el) => new Date(el.date).getTime() === x.getTime());
           if(found) {
            await Calendar.updateOne({
                "date" : x
            }, {
                $inc : repeatedItem
            })
           }

           else {
            const new_item = new Calendar({
                date: x,
                 ...repeatedItem
            })

            await new_item.save();
        }
   
        start_date.setDate(start_date.getDate() +1);
        }
   
       }

       res.json("dates added to database");
}
catch(err) {
    res.json({message: err.message})
}

// const item = data[0];
//     try {
//        await Calendar.updateOne({
//             date : new Date(2023,11, 26),
//           }, {$setOnInsert: {acBooked: item.roomsSelected }}, {upsert: true});           

//           res.json({message : "Date added"});
// }
//     catch(err) {
//         res.json({message: err.message});
//     }
});


router.delete("/", async (req,res) => {
    try {
       
        await Calendar.deleteMany({});
       res.json({message: "Calendar Details Deleted Successfully"})
    } 
    catch(err) {
        res.json({message: err.message});
    }
})


module.exports = router;