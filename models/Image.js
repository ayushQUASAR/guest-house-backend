const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required :true,
    //   unique: true,
    // },
        data: {
            type: String,
            required: true,
        }
        ,
        contentType: {
            type: String, 
            required: true,
            default: "image/png",
            enum:["image/png", "image/jpeg", "image/jpg", "application/pdf"]
        }
  
}, { timestamps: true });

const Image = new mongoose.model("Image", ImageSchema);

module.exports = Image;