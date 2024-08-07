require("dotenv").config();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const userService = require("../services/userService");
const { generateOTP, sendOTPEmail } = require("../utils/otpUtils");
const appEmail = process.env.APP_EMAIL;
const appPassword = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: appEmail,
    pass: appPassword,
  },
});

module.exports = {
  async initiateOTPVerification(req, res) {
    const email = req.body.email;

    try {
      const user = await userService.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          msg: "User not found",
        });
      }

      const otp = generateOTP();
      user.otp = otp;
      await user.save();

      const mailOptions = {
        from: appEmail,
        to: email,
        subject: "Signup OTP Verification",
        html: fs.readFileSync(
          path.resolve(__dirname, "../mailing_objects/signup_otp.html"),
          "utf8"
        ),
        attachments: [
          {
            filename: "logo.png",
            path: `${__dirname}\\..\\mailing_objects\\logo.png`,
            cid: "logo1.xyz",
          },
        ],
      };

      mailOptions.html = mailOptions.html.replace("${otp}", otp);

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Failed to send OTP:", error);
          return res.status(500).json({
            msg: "Failed to send OTP",
          });
        }

        res.json({
          msg: "OTP sent successfully",
        });
      });
    } catch (error) {
      console.error("Error initiating forgot password:", error);
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  async initiateForgotPassword(req, res) {
    const email = req.body.email;

    try {
      const user = await userService.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          msg: "User not found",
        });
      }

      const otp = generateOTP();
      user.otp = otp;
      await user.save();

      const mailOptions = {
        from: appEmail,
        to: email,
        subject: "Forgot Password OTP",
        html: fs.readFileSync(
          path.resolve(__dirname, "../mailing_objects/forgotPass.html"),
          "utf8"
        ),
        attachments: [
          {
            filename: "logo.png",
            path: `${__dirname}\\..\\mailing_objects\\logo.png`,
            cid: "logo1.xyz",
          },
        ],
      };

      mailOptions.html = mailOptions.html.replace("${otp}", otp);

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Failed to send OTP:", error);
          return res.status(500).json({
            msg: "Failed to send OTP",
          });
        }

        res.json({
          msg: "OTP sent successfully",
        });
      });
    } catch (error) {
      console.error("Error initiating forgot password:", error);
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  async verifyOTP(req, res) {
    const email = req.body.email;
    const otp = req.body.otp;
    const newPassword = req.body.newPassword;

    try {
      const user = await userService.verifyOTP(email, otp);

      if (!user) {
        return res.status(403).json({
          msg: "Invalid OTP",
        });
      }

      user.password = newPassword;
      user.otp = undefined;
      await user.save();

      res.json({
        msg: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
};
