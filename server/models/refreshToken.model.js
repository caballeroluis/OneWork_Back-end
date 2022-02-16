const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    token: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    }
});

const refreshTokenModel = mongoose.model("refreshToken", refreshTokenSchema);

module.exports = refreshTokenModel;