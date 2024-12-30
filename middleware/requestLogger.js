const requestLogger = async (req, res, next) => {
  const chalk = (await import("chalk")).default;
  
  // Only log non-GET requests and skip logging static files
  if (req.method !== "GET") {
    console.log(chalk.blue(`${req.method} ${req.originalUrl}`));
  }
  
  next();
};

module.exports = requestLogger;
