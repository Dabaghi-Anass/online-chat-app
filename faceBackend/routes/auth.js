const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = req.body.email;
    if (!user) return;
    const userExist = await User.findOne({ email: user });
    if (!userExist) return res.send(false);
    const pass = userExist.password;
    const verified = bcrypt.compare(pass, req.body.password);
    if (!verified) return res.send(false);
    const { _id, fullName, gender, email, age, phone, description } = userExist;
    const token = jwt.sign(
      { _id, fullName, gender, email, age, phone, description },
      "jwt-key"
    );
    res.send(token).status(200);
  } catch (err) {
    res.send(false);
  }
});

module.exports = router;
