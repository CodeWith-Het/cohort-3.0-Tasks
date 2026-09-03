const multer = require("multer")

// upload on local system
// const storage = multer.diskStorage({
//     destination: (req,file,cb) => {cb(null,"upload/")},
//     filename: (req, file, cb) => {
//         cb(null,file.originalname)
//     }
// })

// upload on server
const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

module.exports = upload