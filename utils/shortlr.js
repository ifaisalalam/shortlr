const firestore = require('./firestore')();
const lang = require('../config/lang');

const collection = 'shortLinks';

const generateShortLink = (shortLink = '') => {
  if (shortLink === '') {
    return require('crypto')
      .randomBytes(((Math.random() * 4) + 2))
      .toString('hex');
  }

  return shortLink;
};

const getLongUrl = async shortLink => {
  const docRef = firestore.collection(collection).doc(shortLink);

  const doc = await docRef.get();

  return new Promise((resolve, reject) => {
    if (doc.exists) {
      const longUrl = doc.data().longUrl;
      return resolve(longUrl);
    }

    const errorCode = lang.messages.errors.shortUrl.NOT_FOUND.code;
    const errorText = lang.messages.errors.shortUrl.NOT_FOUND.text;

    const error = new Error(errorText);
    error.name = errorCode;
    error.status = 404;

    return reject(error);
  })
};

const saveShortLink = async (shortLink, longUrl) => {
  const docRef = firestore.collection(collection).doc(shortLink);

  return await firestore.runTransaction(t => {
    return t.get(docRef)
      .then(doc => {
        if (! doc.exists) {
          const value = {
            shortLink,
            longUrl,
            hitCount: "0" // String: to prevent integer overflow.
          };

          t.set(docRef, value);
          return Promise.resolve(lang.messages.success.createShortUrl);
        } else {
          const errorCode = lang.messages.errors.validation.shortUrl.NOT_AVAILABLE.code;
          const errorText = lang.messages.errors.validation.shortUrl.NOT_AVAILABLE.text;

          const error = new Error(errorText);
          error.name = errorCode;

          throw error;
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
  });
};

module.exports = {
  getLongUrl,
  saveShortLink,
  generateShortLink
};
