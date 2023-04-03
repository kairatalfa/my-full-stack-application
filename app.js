const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");
const proxy = require("./proxy");
const cors = require("cors");

const app = express();

app.use(express.json({ extended: true }));
app.use(cors());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.router"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.json(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.__dirname, "cleint", "build", "index.html");
  });
}

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
