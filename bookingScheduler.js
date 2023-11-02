const cron = require("node-cron");
const Booking = require("./models/booking/booking");
const guestHouse = require("./models/guestHouse");



// schedule every day
cron.schedule("0 0 * * *", async () => {


    //1. update the status to Checked Out
    //2. change the guestHouse to default
    const currentDate = new Date();
    try{
   
    const checkedOutBookings = await Booking.find({status:"approved", endDate: {$lte: currentDate}});

for(const booking of checkedOutBookings) {
    await Booking.updateOne({
        _id: booking._id
    }, {
            status: "checkedOut"
    });
    
  const guestHouses = booking.guestHouseAllotted;
  const rooms = booking.roomAllotted;

  for(let i = 0;i<2;i++) {
    const setObj = {};
    setObj[`rooms.${rooms[i]-1}`] = false;
         await guestHouse.updateOne({
            guestHouseId: guestHouses[i]
         }, {
              $set : setObj
         });
  }

}
    
}

    catch(err) {
        console.log({message: err.message});
    }



})