const mongoose = require("mongoose")
const { authschema, User } = require("../model/model")
const router = require("../router/route");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res)=>{
    try{
        
        const { error } = authschema.validate(req.body);
        if (error){return res.status(400).json({ message: error.details[0].message });}
        const exisistinUser = await User.findOne({mail: req.body.mail});
        if (exisistinUser) { return res.status(409).json({message: "Email already exists." });}
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(hashedPassword)
    const userDetail = new User({ 
        name: req.body.name,
        mail: req.body.mail,
        password: hashedPassword,
    }); 


    await userDetail.save();
    return res.status(201).send({message:"User Registration success"});
    }catch(Err){
        return res.status(500).send({message:"Server error"});
    }
};

   


const signIn = async (req, res)=>{
    try{
        const { mail, password } = req.body;
        const users = await User.findOne({mail});
        function compass(password,pass){
            return bcrypt.compareSync(password, pass)
        }
        const dehash=compass(password,users.password)
        if (dehash==false) {
            return res.status(401).json({ message: "Invalid credentials." });
          }
        const token = jwt.sign( {mail : users.mail},"the_password"); 
        res.status(200).json({message:"login successfully",token})
    }catch(error){
        return res.status(500).send({message:"Server Error"});
    }
}

const getall = async (req, res)=>{
    try{
        const users = await User.find();
        res.status(200).send({users})
    }catch(error){
        return res.status(500).send({message:"Server Error"});
    }
}



module.exports={
    signUp,
    signIn,
    getall,
}