const express = require("express")
const upload = require("../config/multer")

const router = express.Router()

router.post("/",upload.single("image"), (req, res) => {

    const body = req.body
    const file = req.file
    console.log(body)
    console.log(file)

    try {
        res.status(201).json({
            success: true,
            message:"File successfully uploaded"
       }) 
    } catch (error) {
        console.error("error form file uploading ",error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

module.exports = router