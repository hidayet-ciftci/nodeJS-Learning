// middleware/logger.js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // bir sonraki middleware'e geç
}

module.exports = logger;
