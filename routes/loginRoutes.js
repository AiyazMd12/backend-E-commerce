const express = require("express");
const app = express();
const loginController = require("../controller/loginController");

app.post(
    "/signup",
    loginController.signup
);

app.post(
    "/signup/verify",
    loginController.verifySignup
);

app.post(
    "/signin",
    loginController.signin
);

app.post(
    "/signin/verify",
    loginController.verifySignin
);

module.exports = app;