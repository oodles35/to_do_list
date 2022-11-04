const joi = require('joi');

class Validator {
  /**
   * @description validate userDetail by described joi rules
   * @param userDetail having all user detail which is to be validated
   */
  validateUser = (userDetail) => {
    const userValidationRule = joi.object({
      firstName: joi.string().required(),
      lastName: joi.string(),
      email: joi.string().required(),
      password: joi.string().required(),
      confirmPassword: joi.string().required(),
    });
    return userValidationRule.validate(userDetail);
  }

}

module.exports = new Validator();