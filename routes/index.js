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

router.post('/create/shorturl', csrf, (req, res, next) => {
  res.send({
    body: 'Hello'
  })
});

module.exports = router;
