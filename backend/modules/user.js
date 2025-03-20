const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: { type: String, required: true },  // ✅ Username field added
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String },

    // googleId: String,

});

userSchema.plugin(passportLocalMongoose,{ usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
