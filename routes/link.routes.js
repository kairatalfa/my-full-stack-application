const { Router } = require("express");
const config = require("config");
const shortId = require("shortid");
const Link = require("../models/link");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/generate", auth, async (rea, req) => {
  try {
    const baseUrl = config.get("baseUrl");
    const { from } = req.body;

    const code = shortId.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();
    res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({ message: "что то пашло не так, побробуйте снова " });
  }
});

router.get("/", auth, async (res, req) => {
  const links = await Link.find({ owner: req.user.userId });
  res.json(links);
  try {
  } catch (error) {
    res.status(500).json({ message: "что то пашло не так, побробуйте снова " });
  }
});

router.get("/:id", auth, async (res, req) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "что то пашло не так, побробуйте снова " });
  }
});

module.exports = router;
