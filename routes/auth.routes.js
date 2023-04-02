const { Router } = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const router = Router();

// api/auth/register
router.post(
  "/register",
  [
    check("email", "некоррекный emil").isEmail(),
    check("password", "минимальное длина пароля 6 символов").isLatLong({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log(req.body, "boody");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "некоррекный данные при регистрации",
        });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Такой пользователь уже сушествует" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "Пользователь создан" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "что то пашло не так, побробуйте снова " });
    }
  }
);
// api/auth/login
router.post(
  "/login",
  [
    check("email", "введите корректный email").normalizeEmail().isEmail(),
    check("password", "введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "некоррекный данные при регистрации",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "польвователь не найден" });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "не верный пароль побробуйте снова" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } catch (error) {
      res
        .status(500)
        .json({ message: "что то пашло не так, побробуйте снова " });
    }
  }
);
module.exports = router;
