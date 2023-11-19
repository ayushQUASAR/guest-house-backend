const express = require("express");
const Image = require("../models/Image");
const router = express.Router();

router.get("/:id", (req,res) => {
res.sendFile(`${process.cwd()}/uploads/${req.params.id}`);
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