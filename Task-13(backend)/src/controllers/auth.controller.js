import userModel from './../models/user.model.js';
import bcrypt from "bcrypt"

export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body
    
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:"all field are required"
            })
        }

        const userExisting = await userModel.findOne({email})

        if (userExisting) {
            return res.status(409).json({
                success:true,
                message: "user already exist",
            })
        }

        const hashedPassword = await bcrypt.hash(password,12)

        const user = await userModel.create({
            name,
            email,
            password:hashedPassword
        })

        res.status(201).json({
            success:true,
            message:"User successfully created",
            data:user
        })

    } catch (error) {
        console.error("error from user Register ", error)
        return res.status(500).json({
           message:"Internal server error"
       }) 
    }
}

export const userLogin = async (req, res) => {
    try {
        const {name,email,password}=req.body

        const user = await userModel.findOne({
            $or:[{email:email},{name:name}]
        }).select("+password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message:"user not found, please register first"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message:"Invalid Password"
            })
        }

        res.status(200).json({
            success: true,
            message: "User Successfully login",
            data:user
        })


    } catch (error) {
        console.error("error from user login ",error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}