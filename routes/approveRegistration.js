const express = require("express");
const router = express.Router();
const User = require("../models/user/user");
const RegApproval = require("../models/regApproval");
const RegisteredUser = require("../models/registeredUsers");
const RejectedUser = require("../models/rejectedUsers");
const Ref = require("../models/user/ref");



router.post("/", async (req,res) => {
      const approvalInfo = req.body;
      const final = {
        user: approvalInfo.userId,
        status: approvalInfo.status,
      }

      try {
        const approval = new RegApproval(final);
        const newApproval = await approval.save();
        
        if(newApproval === null) {
            throw new Error("approval info not added");
        }


        if(newApproval.status === "accept") {
            const user = new RegisteredUser(newApproval.user);
            const registeredUser = await user.save();


            if(registeredUser === null) {
                throw new Error("registered user not added");
            }

            // add registered User to the his reference
           const ref = await Ref.update({_id: registeredUser.reference}, {$push: {refFrom: registeredUser._id}});

           if(ref === null) {
           throw new Error("ref not added");
        }
        }

        else {
            const user = new RejectedUser(newApproval.user);
            const rejectedUser = await user.save();

             const deleted_user = await User.deleteOne({_id: newApproval.user});
             if(deleted_user!== null) {
                res.status(200).json({message: "User deleted successfully"});
             }
             else {
              res.json({message: "user could not be deleted.."});
             }
        }


      }

      catch(err) {
console.log({reg_approval_route: err.message})
      }


})

module.exports = router;