const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: null,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
  },
},
  {
    timestamps: true,
    autoIndex: false,
  });

userSchema.set('versionKey', false);

userSchema.pre('save', async function (next) {
  this.password = await bycrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

class UserModel {
  /**
    * @description save request data to database
    * @param {*} registrationData holds data to be saved in json formate
    * @param {*} callback holds a function
   */
  register = (registrationData, callback) => {
    console.log('TRACKED_PATH: Inside model');
    this.checkMailExistenceInDb(registrationData, (error, result) => {
      if (error) {
        error = {
          success: false,
          statusCode: 500,
          message: `internal server error ${error}`,
        };
        callback(error, null);
      } else if (result[0] != null) {
        result = {
          success: false,
          statusCode: 409,
          message: 'Email id already exist',
        };
        callback(null, result);
      }
      else {

        const userRegistration = new User(registrationData);
        userRegistration.save((error, registrationResult) => {
          if (error) {
            error = error;
            callback(error, null);
          } else {
            callback(null, registrationResult);
          }
        });
      }
    })

  }

  /**
   * @description find email id in database and return data associated with id
   * @param {*} signUpData holds login credentials
   * @param {*} callback holds a function
  */
  checkMailExistenceInDb = (signUpData, callback) => {
    const { email } = signUpData;
    User.find({ email: `${email}` }, (error, userExistence) => {
      (error) ? callback(error, null) : callback(null, userExistence);
    });
  }

  /**
    * @description find email id in database and validate
    * @param {*} loginCredential holds login credentials
    * @param {*} callback holds a function
   */
  getDetailOfGivenEmailId = (loginCredential, callback) => {
    const { email } = loginCredential;
    User.find({ email: `${email}` }, (error, loginResult) => {
      (error) ? callback(error, null) : callback(null, loginResult);
    });
  }

  /**
   * @description find email id in database and validate using promises
   * @param {*} email holds email id
  */
  checkEmailExistenceInDb = (email) => new Promise((resolve, reject) => {
    User.find({ email: `${email}` }, (error, emailResult) => {
      if (error) {
        return reject(error);
      }
      return resolve(emailResult);
    });
  })

}

module.exports = new UserModel();
