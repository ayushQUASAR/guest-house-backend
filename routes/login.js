const express =  require("express");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const router = express.Router();



const Login = require("../models/login");


router.get("/admin", async (req, res) => {
try {
    // const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    const adminLogin = new Login({
        email: process.env.ADMIN_EMAIL,
        // password: hashedPassword,
        password: process.env.ADMIN_PASS,
        isAdmin: true
    });

    

    const AdminUser = await adminLogin.save();
       if(AdminUser === null) {
        throw new Error("admin not created");
       }
      
        //created new user
        console.log("admin created successfully");
        res.status(201).json({message:"admin created successfully"});
       
}
  
catch(err) {
    res.json({message: err.message});
}
});

router.get("/", async (req,res) => {
    try {
        const alllogins = await Login.find({});
        if(alllogins.length === 0) {
            console.log("No logins yet");
        }
        res.status(200).json(alllogins);
    }
    catch(err) {
res.json({message: err.message})
    }
})


router.post("/", async (req,res) => {
    const loginData = req.body;
    try {
          const user = await Login.find({email: loginData.email});
          if(user.length === 0) {
            console.log("email does not matches");
            res.status(401).json({message:  "email does not matches"});
          }
          else {

        //    const result =  await  bcrypt.compare(loginData.password, admin.password);
        const result = loginData.Password === user.password;
 
           if(result === false) {
            console.log("not valid user");
                  res.status(403).json({message: "not valid admin"});
           }
           else{
            console.log("user login successful");
            res.status(200).json({message: "User login successful"});
           }
          }
    }
    catch(err) {
        console.log({message: err.message});
             res.json({message: err.message});
    }
})


router.delete("/", async (req,res) => {
    try {
    const deletedLogins = await Login.deleteMany({});
    
        res.status(200).json({message:"Logins Deleted successfully"});
    
    }
    catch(err) {
        res.json({message: err.message})
    }
})



module.exports = router;