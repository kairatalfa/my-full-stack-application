const { Schema, model, Types } = require("mongoose");
const schema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  links: [{ type: Types.ObjectId, ref: "link" }],
});

module.exports = model("User", schema);
