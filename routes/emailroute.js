const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailcontroller");

router.post("/", sendEmail);

module.exports = router;
