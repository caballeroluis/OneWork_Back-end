const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    expiryDate: Date,
});
  
refreshTokenSchema.statics.createToken = async function (user) {
    let expiredAt = new Date();
  
    expiredAt.setSeconds(
      expiredAt.getSeconds() + config.jwtRefreshExpiration
    );
  
    let _token = uuidv4();
  
    let _object = new this({
      token: _token,
      user: user._id,
      expiryDate: expiredAt.getTime(),
    });
  
    let RefreshToken = await _object.save();
  
    return RefreshToken.token;
};
  
refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

const refreshToken = mongoose.model("refreshToken", refreshTokenSchema);

module.exports = refreshToken;