const Recaptcha = require('express-recaptcha').RecaptchaV3;

const recaptchaKey = process.env.RECAPTCHA_SITE_KEY;
const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
const recaptchaOptions = {
  callback: 'cb'
};

const recaptcha = new Recaptcha(recaptchaKey, recaptchaSecret, recaptchaOptions);

module.exports = recaptcha;
