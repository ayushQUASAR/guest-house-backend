const express = require("express");
const router = express.Router();

router.get("/:id", (req,res) => {
res.sendFile(`${process.cwd()}/uploads/${req.params.id}`);
})

module.exports = router;