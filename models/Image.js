const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required :true,
    //   unique: true,
    // },
        data: {
            type: Buffer,
            required: true,
        }
        ,
        contentType: {
            type: String, 
            required: true,
            default: "image/png",
            enum:["image/png", "image/jpeg", "image/jpg", "application/pdf"]
        }
  
});

const Image = new mongoose.model("Image", ImageSchema);

module.exports = Image;