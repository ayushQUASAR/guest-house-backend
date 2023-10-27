const express =  require("express");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");



dotenv.config();
const app = express();
const router = express.Router();



const Login = require("../models/login");


router.get("/admin", async (req, res) => {
try {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    if(hashedPassword === null) {
        throw new Error("hash could not be created");
    }

    const adminLogin = new Login({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
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

router.get("/admin/:id", async (req,res) => {
    const  id = req.params.id;
try {
    const admin = await Login.find({_id:id });
     if(admin.length === 0) {
        res.status(404).json({message: "no admin found, matching that id"});
     }

     res.status(200).json(admin);

}
catch(err) {
    res.status(500).json({message: err.message});
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
    console.log(loginData);
    try {
          const user = await Login.find({email: loginData.Email});
          console.log(user);
          if(user.length === 0) {
            console.log("email does not matches");
            res.status(401).json({message:  "email does not matches"});
          }
          else {
           const result =  await  bcrypt.compare(loginData.Password, user[0].password);
        // const result = loginData.Password === user.password;
 
           if(result === false) {
            console.log(`not valid ${user[0].isAdmin ? "admin" : "user" }`);
                  res.status(403).json({message: `not valid ${user[0].isAdmin ? "admin" : "user" }`});
           }
           else{
            console.log(`${user[0].isAdmin ? "Admin" : "User"} login successful`);
            res.status(200).json({message: `${user[0].isAdmin ? "Admin" : "User"} login successful`, isAdmin: user[0].isAdmin,id: user[0]._id});
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