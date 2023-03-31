const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const proxy = require("./proxy");
const cors = require("cors");

const app = express();
app.use(express.json({ extended: true }));
app.use(cors());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));

const PORT = config.get("part") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.use("/api", proxy);

    app.listen(PORT, () => {
      console.log(`Кайрат сервер работает ${PORT}`);
    });
  } catch (error) {
    console.log("server error ", error.message);
    process.exit(1);
  }
}

start();
