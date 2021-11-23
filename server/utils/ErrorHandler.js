module.exports = (err, req, res, next) => { 
  console.error(err);
  const { message, status } = err;
  res.status(status || 500).json([{ message }]);
};
