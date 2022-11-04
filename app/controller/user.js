const userServices = require('../services/user');
const Validator = require('../middlewares/inputValiation');

class UserControllers {
  /**
   * @description add user to database
   * @param {*} request in json formate
   * @param {*} response sends response from server
   */
  register = (request, response) => {
    console.log('TRACKED_PATH: Inside controller');
    const validatedRequestResult = Validator.validateUser(request.body);
    if (validatedRequestResult.error) {
      console.log('SCHEMAERROR: Request did not match with schema');
      response.send({
        success: false,
        status_code: 400,
        message: validatedRequestResult.error.details[0].message,
      });
      return;
    }

    const registrationDetails = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
    };

    if (request.body.password != request.body.confirmPassword) {
      response.send({
        success: false,
        status_code: 400,
        message: 'password does not match with confirm password',
      });
      return;
    }

    console.log('INVOKING: registerUser method of services');
    userServices.registerUser(
      registrationDetails,
      (error, registrationResult) => {
        error
          ? (console.log(error), response.send({
            success: false,
            status_code: 400,
            message: error,
          }))
          : (console.log('SUCCESS001: User registered successfully'), response.send({
            success: registrationResult.success,
            status_code: 200,
            message: registrationResult.message,
            data: registrationResult.data,
          }));
      },
    );
  };

  /**
   * @description login to database
   * @param {*} request
   * @param {*} response
   */
  login = (request, response) => {
    console.log('TRACKED_PATH: Inside controller', request.body);
    const start = new Date();
    const loginDetails = {
      email: request.body.email,
      password: request.body.password,
    };
    console.log(
      'INVOKING: getLoginCredentialAndCallForValidation method of login services',
    );
    userServices.validateAndLogin(
      loginDetails,
      (error, loginResult) => {
        error
          ? (console.log('getting error in login', error.message), response.send({
            success: error.success,
            statusCode: error.statusCode,
            message: error.message,
          }))
          : (console.log(loginResult.message), response.send({
            success: loginResult.success,
            statusCode: loginResult.statusCode,
            message: loginResult.message,
            token: loginResult.data,
          }));
      },
    );
    console.log('Request took:', new Date() - start, 'ms');
  };
}

module.exports = new UserControllers();