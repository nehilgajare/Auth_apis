import user from "../model/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signup = async(req,res)=>{
    try {
        
        const userData=new user(req.body);
        const {email}=userData;
        const existUser = await user.findOne({email});
        if(existUser){
            return res.status(400).json({message:"User already exist"})
        }
        const savedUser = await userData.save();
        res.status(200).json(savedUser)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const login =async(req,res)=>{
    try {
        const {email,password} = req.body;
        const userExist = await user.findOne({email});

        if(!userExist){
            return res.status(400).json({message:"User not exist"})
        }

        const isValidPassword = await bcrypt.compare(password,userExist.password);
        if(!isValidPassword){
            return res.status(401).json({message:"email or password invalid"})
        }

        const tokenExist = req.cookies.token;
        if(tokenExist){
            return res.status(400).json({message:"Already Login"})
        }

        const token = jwt.sign({userID:userExist._id},process.env.SECRET_KEY,{expiresIn:"1h"});

        res.cookie("token",token,{httpOnly:true,maxAge:3600000})
        res.status(200).json({message:"Login Successfully"})

    } catch (error) {
        res.status(500).json(console.log(error))
    }
}

export const logout = async(req,res)=>{
    try {
        const tokenExist = req.cookies.token;
        if(!tokenExist){
            return res.status(400).json({message:" Login Required"})
        }
        res.clearCookie("token");
        res.status(200).json({message:"Logout Successfully"})
    } catch (error) {
        res.status(500).json(console.log(error))
    }
}

export const update = async(req,res)=>{
    try {
        const id=req.params.id;
        const userExist = await user.findOne({_id:id})
        if(!userExist){
            res.status(400).json({message:" USer not exisst"})
        }
        if(req.body.password){
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(req.body.password,salt)
            req.body.password=hashedPassword
        }
        const updatedUser = await user.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(console.log(error))
    }
}