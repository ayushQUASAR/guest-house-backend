const express = require('express');
const router = express.Router();

const guestHouse = require('../models/guestHouse');


router.post('/', async (req,res) => {
    // create all guestHouses
    try {
        const guestHouse1 = new guestHouse({guestHouseId: 1});
        const guestHouse2 = new guestHouse({guestHouseId: 2});
        const guestHouse3 = new guestHouse({guestHouseId: 3});

        await Promise.all[guestHouse1.save(), guestHouse2.save(), guestHouse3.save()];  


        res.json({message: "guest houses created successfully"});
    }
    catch(err) {
        console.log({message: err.message});
        res.status(500).json({message: err.message});
    }
})



//GET info regarding the guest houses 
router.get("/", async (req, res) => {
    try{
      const guestHouseDetails = await guestHouse.find({});
      res.status(200).json(guestHouseDetails);
    }
    catch(err) {
          console.log({message: err.message});
            res.status(500).json({message: err.message});
    }
})


//Get guesthouse by id 
router.get("/guestHouse/:id", async (req,res) => {
    const id = req.params.id;
    try {
      const guestHouseDetails = await guestHouse.find({guestHouseId: id});

      res.status(200).json(guestHouseDetails)
    }
    catch(err) {
        console.log({message: err.message});
        res.status(500).json({message: err.message});
  }
});


// update guesthouse room details 

router.put("/guesthouse/:id", async (req,res) => {
    const data = req.body;
    const id = req.params.id;
    try {
        await guestHouse.updateOne({
            guestHouseId: id,
        },
        {

        })
    }
    catch(err) {

    }
})

module.exports = router;