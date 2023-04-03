const { Router } = require("express");
const router = Router();
const Link = require("../models/link");

router.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }
    res.status(404).json("Ссылка не найдено");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "что-то пошло не так, попробуйте снова далбаш" });
  }
});

module.exports = router;
