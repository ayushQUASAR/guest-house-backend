const express = require("express");
const Image = require("../models/Image");
const router = express.Router();

router.get("/:id", async (req,res) => {
try {
   
   if(!req.params.id) {
      return res.status(400).json({message: "ID not found"});
   }

   const image = await Image.findById(req.params.id);

   return res.status(200).json({image});

} catch (error) {
   console.log("Image GET error:" , error.message);
   return res.json({message: "Error in finding image with this id"});
}
})

router.delete("/", async (req,res) => {
    try {
           await Image.deleteMany({});
           res.json({message: "Images Deleted Successfully"});
    }
    catch(err) {
 res.json({message: err.message})
    }
 })


module.exports = router;