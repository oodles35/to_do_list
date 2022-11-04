const jwt = require('jsonwebtoken');
require('dotenv').config();
const atob = require('atob');

class Helper {
  /**
   * @description it genrate the token
   */
  genrateToken = (user) => {
    const token = jwt.sign(
      {
        username: user.name,
        userId: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      },
    );
    return token;
  };

/**
 * @description this function return encodedbody from given token
 */
  getEncodedBodyFromHeader = (request) => {
    const token = request.headers.authorization.split('Bearer ')[1];
    const encodedBody = JSON.parse(atob(token.split('.')[1]));
    return encodedBody;
  }

  /**
   * @description this function verify the token
   */
  verifyToken = (request, response, next) => {
    try {
      const token = request.headers.authorization.split('Bearer ')[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      request.userData = decode;
      next();
    } catch (error) {
      response.send({
        success: false,
        status_code: 400,
        message: 'Authentication failed',
      });
    }
  };
}

module.exports = new Helper();