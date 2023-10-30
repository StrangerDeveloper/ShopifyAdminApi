const express = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/registerUser', async (req, res)=>{
    const saltPassword =  await bcrypt.genSalt(12);
    const securePassword =  await bcrypt.hash(req.body.password, saltPassword);
    const data = userModel({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        location_id: req.body.location_id,
        time_stamp: req.body.time_stamp ?? Date.now()
    });

    try{
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);

    }catch(error){
        res.status(400).json({message: error.message}); 
    }
});

router.get("/getUsers", async (req, res)=>{
    try{
        const data = await userModel.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.get('/login', async(req, res)=>{
    try {
        const user  = await userModel.findOne({email: req.body.email});
        if(user){
            const validatedPass = await bcrypt.compare(req.body.password, user.password);
            if(validatedPass){
                if(user.location_id == req.body.location_id){
                    res.json({success: true, message: "Successfuly Logged in!", data: user});
                }else{
                    res.status(400).json({ success:false, message: "location not found", data: {} }); 
                }

            }else{
                
                res.status(400).json({ success:false, message: "password doesn't match!", data: {} }); 
            }
        }else{
            res.status(400).json({ success:false, message: "User not found!", data: {} });   
        }
        
    } catch (error) {
        
    }
});


router.get('/getUserById/:id', async (req, res) => {
    try{
        const data = await userModel.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;