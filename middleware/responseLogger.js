const responseLogger = async (req, res, next) => {
  const chalk = (await import("chalk")).default;
  
  // Only attach logger for specific admin routes
  if (req.originalUrl.includes('/api/admin')) {
    const oldSend = res.send;
    res.send = function (data) {
      let action, color;
      
      switch(req.method) {
        case 'POST':
          action = "Added a product";
          color = chalk.green;
          break;
        case 'PUT':
          action = "Updated a product";
          color = chalk.yellow;
          break;
        case 'DELETE':
          action = "Deleted a product";
          color = chalk.red;
          break;
      }
      
      if (action) {
        console.log(color(`${action} | Status: ${res.statusCode}`));
      }
      
      return oldSend.apply(res, arguments);
    };
  }
  
  next();
};

module.exports = responseLogger; 