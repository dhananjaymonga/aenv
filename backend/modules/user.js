const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: { type: String, required: true },  // ✅ Username field added
    email: { type: String, required: true, unique: true },
    googleId: String,

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
