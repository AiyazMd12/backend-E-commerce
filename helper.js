const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "verifyuserofficial@gmail.com",
        pass: "wsdv megz vecp wzen",
      },
    });

    const mailOptions = {
      from: "verifyuserofficial@gmail.com",
      to: email,
      subject: subject,
      html: content,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err, "Email Sent Failed...");
      } else {
        console.log("Email Sent Successfully....");
      }
    });
  } catch (err) {
    console.log("Error in sendEmail: " + err);
  }
};

module.exports = exports;
