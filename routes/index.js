const express = require('express');
const router = express.Router();
const csrf = require('csurf')();

/* GET home page. */
router.get('/', csrf, (req, res, next) => {
  res.render('index', {
    title: 'shortlr.com | URL Shortener',
    csrfToken: req.csrfToken()
  });
});

router.get('/test', (req, res, next) => {
  res.send({
    secret: process.env.APP_SECRET || 'no-secret',
    clientIp: req.connection.remoteAddress
  });
});

router.post('/create/shorturl', csrf, (req, res, next) => {
  res.send({
    body: 'Hello'
  })
});

module.exports = router;
