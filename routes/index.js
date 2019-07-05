const express = require('express');
const router = express.Router();
const csrf = require('csurf')();
const lang = require('../config/lang');

const recaptcha = require('../utils/recaptcha');
const shortUrlValidationMiddleware = require('../middlewares/newShortUrlValidationMiddleware');

const shortlr = require('../utils/shortlr');

router.get('/', csrf, recaptcha.middleware.render, (req, res, next) => {
  res.render('index', {
    title: process.env.APP_TITLE || 'shortlr.com | URL Shortener',
    csrfToken: req.csrfToken(),
    recaptchaKey: process.env.RECAPTCHA_SITE_KEY || ''
  });
});

router.post('/create/short-url', csrf, recaptcha.middleware.verify, shortUrlValidationMiddleware, (req, res, next) => {
  if (! req.recaptcha.error && req.shortlr.validated) {
    const shortLink = shortlr.generateShortLink(req.shortlr.shortLink);
    const longUrl = req.shortlr.longUrl;

    shortlr.saveShortLink(shortLink, longUrl)
      .then(() => {
        res.redirect(`/success/${shortLink}`);
      })
      .catch(err => {
        if (err.name === lang.messages.errors.validation.shortUrl.NOT_AVAILABLE.code) {
          req.session.flash.errors.shortUrl = err.message;
        }
        else {
          req.session.flash.errors.shortUrl = lang.messages.errors.createShortUrl.ERROR_UNKNOWN.text;
        }

        res.redirect('/');
      });
  } else {
    req.session.flash.errors.recaptcha = !! req.recaptcha.error;
    return res.redirect('/');
  }
});

router.get('/success/:code', (req, res, next) => {
  const data = {
    shortLink: (process.env.APP_URL || 'https://shortlr.com/') + req.params.code
  };

  res.render('success', data);
});

router.get('/:shortLink', (req, res, next) => {
  shortlr.getLongUrl(req.params.shortLink)
    .then(longUrl => {
      return res.redirect(longUrl);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
