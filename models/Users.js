const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
    },
    firstName: { type: String, required: [true] },
    middleName: { type: String },
    lastName: { type: String, required: [true] },
    email: { type: String, required: [true] },
    email_verified: { type: Boolean, default: false },
    password: { type: String, required: [true] },
    birthDate: { type: Date },
    otp: { type: String },
    books_issued: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    book_issue_history: [
      {
        book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        issue_date: { type: Date },
        return_date: { type: Date },
      },
    ],
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    collection: "UserInfo",
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

var User = mongoose.model("User", UserSchema);

module.exports = User;