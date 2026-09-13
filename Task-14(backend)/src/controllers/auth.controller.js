import userModel from './../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

export const userRegister =async (req,res) => {
 try {
    const {name,email,password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message:"All feild are required"
      })   
     }

     const userExisting = await userModel.findOne({name,email})

     if (userExisting) {
         return res.status(401).json({
             message:"User is existing this email or username"
         })
     }

     const hashedPassword = await bcrypt.hash(password,12)

     const user = await userModel.create({
         name,
         email,
         password:hashedPassword
     })

     res.status(201).json({
         success: true,
         message: "User successfully register",
         data:user
     })
     
 } catch (error) {
    console.error("error from user register ",error)
     return res.status(500).json({
        message:"Internal server error"
    })
 }   
}

export const userLogin = async (req, res) => {
  try {
      const { name, email, password } = req.body
      
      const user = await userModel.findOne({
          $or:[{name:name},{email:email}]
      })

      if (!user) {
          return res.status(404).json({
              success: false,
              message:"User not found, please register first"
          })
      }

      const isPasswordCorrect = await bcrypt.compare(password,user.password)

      if (!isPasswordCorrect) {
          return res.status(401).json({
              success: false,
              message: "Invalid password",
          })
      }

      const token = jwt.sign({
          id:user._id
      },process.env.JWT_SECRET,{expiresIn:"5h"})

      res.cookie("token", token,{
          httpOnly: true,
          secure:process.env.NODE_ENV ==="development",
          samesite: process.env.NODE_ENV === "development" ? "lex" : "none",
          maxAge:24*60*60*1000 //24 hours
      })

      res.status(200).json({
          success: true,
          message: "User successfully login",
          data:user
      })


  } catch (error) {
    console.error("error from user login: ",error)
      return res.status(500).json({
        message:"Internal server error"
    })
  }   
}