const bycrypt = require('bcryptjs');
// const EventEmitter = require('events');
const userModel = require('../models/user');
const jwtAuth = require('../middlewares/helper');
const helper = require('../middlewares/helper');
//const publish = require('../middlewares/publisher');
//const consume = require('../middlewares/consumer');

class UserServices {
  /**
    * @description extract json object from array
    * @param {*} objectInArray holds data having the array
    */
  extractObjectFromArray = (objectInArray) => {
    let returnObj = null;
    (objectInArray < 1) ? returnObj : returnObj = {
      name: objectInArray[0].name,
      _id: objectInArray[0]._id,
      password: objectInArray[0].password,
    };
    return returnObj;
  }

  /**
   * @description save request data to database using model methods
   * @param {*} registrationData holds data to be saved in json formate
   * @param {*} callback holds a function
  */
  registerUser = (registrationData, callback) => {
    console.log('TRACKED_PATH: Inside services');
    userModel.register(registrationData, async (error, registrationResult) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, registrationResult);
      }
    });
  }

  /**
   * @description validate credentials and return result accordingly to database using model methods
   * @param {*} loginCredentials holds data to be saved in json formate
   * @param {*} callback holds a function
  */
    validateAndLogin = (loginCredentials, callback) => {
        const { email } = loginCredentials;
        console.log('TRACKED_PATH: Inside services');
        userModel.getDetailOfGivenEmailId(loginCredentials, (error, loginResult) => {
          let loginFilteredResult = this.extractObjectFromArray(loginResult);
          if (error) {
            error = {
              success: false,
              statusCode: 500,
              message: error,
            };
            callback(error, null);
          } else if (loginFilteredResult == null) {
            loginFilteredResult = {
              success: false,
              statusCode: 404,
              message: 'email id does not exist',
            };
            callback(null, loginFilteredResult);
          } else {
            bycrypt.compare(loginCredentials.password, loginFilteredResult.password, (error, result) => {
              if (error) {
                error = {
                  success: false,
                  statusCode: 400,
                  message: 'Invalid password',
                };
                callback(error, null);
              } else if (result) {
                const token = jwtAuth.genrateToken(loginFilteredResult);
                console.log(`token genrated: ${token}`);
                loginFilteredResult = {
                  success: true,
                  statusCode: 200,
                  message: 'login successfull',
                  data: token,
                  user: loginResult,
                };
                callback(null, loginFilteredResult);
              } else {
                error = {
                  success: false,
                  statusCode: 400,
                  message: 'Invalid password',
                };
                callback(error, null);
              }
            });
          }
        });

















       // helper.getResponseFromRedis(KEY, (error, dataFromRedis) => {
          // if (error) {
          //   error = {
          //     success: false,
          //     statusCode: 500,
          //     message: error,
          //   };
          //   callback(error, null);
          // } else if (!dataFromRedis) {
          //   userModel.getDetailOfGivenEmailId(loginCredentials, (error, loginResult) => {
          //     let loginFilteredResult = this.extractObjectFromArray(loginResult);
          //     if (error) {
          //       error = {
          //         success: false,
          //         statusCode: 500,
          //         message: error,
          //       };
          //       callback(error, null);
          //     } else if (loginFilteredResult == null) {
          //       loginFilteredResult = {
          //         success: false,
          //         statusCode: resposnsCode.NOT_FOUND,
          //         message: 'email id does not exist',
          //       };
          //       callback(null, loginFilteredResult);
          //     } else {
          //       bycrypt.compare(loginCredentials.password, loginFilteredResult.password, (error, result) => {
          //         if (error) {
          //           error = {
          //             success: false,
          //             statusCode: resposnsCode.BAD_REQUEST,
          //             message: 'Invalid password',
          //           };
          //           callback(error, null);
          //         } else if (result) {
          //           const token = jwtAuth.genrateToken(loginFilteredResult);
          //           console.log(` token genrated: ${token}`);
          //           loginFilteredResult = {
          //             success: true,
          //             statusCode: resposnsCode.SUCCESS,
          //             message: 'login successfull',
          //             data: token,
          //             user: loginResult,
          //           };
    
          //           helper.setDataToRedis(KEY, loginFilteredResult),
          //             console.log('response comming from mongodb');
          //           callback(null, loginFilteredResult);
          //         } else {
          //           error = {
          //             success: false,
          //             statusCode: resposnsCode.BAD_REQUEST,
          //             message: 'Invalid password',
          //           };
          //           callback(error, null);
          //         }
          //       });
          //     }
          //   });
          // } else {
          //   console.log('response comming from redis');
          //   dataFromRedis = {
          //     success: true,
          //     statusCode: resposnsCode.SUCCESS,
          //     message: 'login successfull',
          //     data: dataFromRedis.data,
          //   };
          //   callback(null, dataFromRedis);
          // }
       // });
      }
}

module.exports = new UserServices();