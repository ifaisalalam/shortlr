module.exports = (req, res, next) => {
  res.locals.oldInput = (req.session.oldInput = req.session.oldInput || {});
  req.session.oldInput = {
    ...req.body,
    ...req.query
  };

  next();
};
