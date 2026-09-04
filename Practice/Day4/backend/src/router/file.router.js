const express = require("express");
const upload = require("../config/multer");

const router = express.Router();

router.post("/", upload.single("images"), (req, res) => {
  try {
    const body = req.body;
    const file = req.file;

    console.log(body);
    console.log(file);

    res.status(200).json({
      success: true,
      message: "file successfully uploaded"
    });

  } catch (error) {
    console.error("error from uploading file", error);

    res.status(500).json({
      success: false,
      message: "internal server error"
    });
  }
});

module.exports = router;