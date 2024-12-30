const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is invalid',
      error: error.message
    });
  }
};

module.exports = auth; 