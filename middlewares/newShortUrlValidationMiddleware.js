const validator = require('validator');
const lang = require('../config/lang');
const blacklist = require('../config/blacklist');

const validateLongUrl = (longUrl, req) => {
  const hasValidLength = validator.isLength(longUrl, {
    max: 2000
  });

  if (! hasValidLength) {
    req.session.flash.errors.longUrl = lang.messages.errors.validation.longUrl.INVALID_LENGTH.text;
    return false;
  }

  const isValidUrl = validator.isURL(longUrl);

  if (! isValidUrl) {
    req.session.flash.errors.longUrl = lang.messages.errors.validation.longUrl.INVALID_URL.text;
    return false;
  }

  return true;
};

const addProtocolIfNotPresent = longUrl => {
  if (! /^(?:f|ht)tps?\:\/\//.test(longUrl)) {
    return 'http:\/\/' + longUrl;
  }

  return longUrl;
};

const validateShortLink = (shortUrl, req) => {
  if (shortUrl === '') {
    return true;
  }

  const hasValidLength = validator.isLength(shortUrl, {
    min: 2,
    max: 20
  });

  if (! hasValidLength) {
    req.session.flash.errors.shortUrl = lang.messages.errors.validation.shortUrl.INVALID_LENGTH.text;
    return false;
  }

  const isAlphanumeric = validator.isAlphanumeric(req.shortlr.shortLink, 'en-US');
  if (! isAlphanumeric) {
    req.session.flash.errors.shortUrl = lang.messages.errors.validation.shortUrl.NOT_ALPHA_NUM.text;
    return false;
  }

  let notBlacklisted = true;
  for (const word of blacklist.blacklisted.shortLinks) {
    if (word === shortUrl) {
      notBlacklisted = false;
      break;
    }
  }

  if (! notBlacklisted) {
    req.session.flash.errors.shortUrl = lang.messages.errors.validation.shortUrl.BLACKLISTED.text;
    return false;
  }

  return true;
};

module.exports = (req, res, next) => {
  req.shortlr = {};

  req.shortlr.shortLink = (req.body.short_url || '').toLowerCase().trim();
  req.shortlr.longUrl = req.body.long_url || '';

  const isValidShortUrl = validateShortLink(req.shortlr.shortLink, req);
  const isValidLongUrl = validateLongUrl(req.shortlr.longUrl, req);

  req.shortlr.longUrl = addProtocolIfNotPresent(req.shortlr.longUrl);

  req.shortlr.validated = isValidShortUrl && isValidLongUrl;

  next();
};
