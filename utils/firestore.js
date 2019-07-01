const {Firestore} = require('@google-cloud/firestore');

const config = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
  keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS
};

module.exports = (options = {}) => new Firestore({
  ...config,
  ...options
});
