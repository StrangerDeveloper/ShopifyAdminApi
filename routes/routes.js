const express = require('express');
const userModel = require('../models/user');

const router = express.Router();

router.post('/registerUser', async (req, res)=>{
    const data = userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        store_location: req.body.store_location,
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