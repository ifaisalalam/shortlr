module.exports = (req, res, next) => {
  const flash = req.session.flash || {};

  res.locals.flash = flash;
  res.locals.errors = flash.errors || {};
  req.session.flash = {errors: {}};

  next();
};
