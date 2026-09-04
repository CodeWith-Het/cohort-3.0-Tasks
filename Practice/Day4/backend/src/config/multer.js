const multer = require("multer")

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,"upload/")
//     },
//     filename: (req, file, cb) => {
//         cb(null,Date.now()+file.originalname)
//     }
// })

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

module.exports = upload