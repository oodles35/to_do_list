const TaskModel = require('../models/task');
const helper = require('../middlewares/helper');

class TaskServices {
 
  /**
   * @description save request data to database using model methods
   * @param {*} taskData holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  saveTaskData = (taskData, callback) => {
    console.log('TRACKED_PATH: Inside services');
    TaskModel.saveTask(taskData, (error, taskResult) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, taskResult);
      }
    });
  };

  /**
   * @description retrive all Task  data from database using model's mothod
   * @param {*} callback holds a function
   * @param {*} callback holds a function
   *
   */
  retrieveAllTasks = (userId, callback) => {
    console.log('TRACKED_PATH: Inside services');

    TaskModel.getAllTasks(userId, (error, taskResult) => {
        error
          ? (error = {
            success: false,
            statusCode: 500,
            message: error,
          }, callback(error, null)) : (
            console.log('comming from mongodb'),
            taskResult = {
              success: true,
              statusCode: 200,
              message: 'Tasks of current account has been retrieved',
              data: taskResult,
            },
            callback(null, taskResult));
      });
   };

  /**
   * @description retrive one Task  data from database using model's mothod
   * @param {*} TaskID holds _id that is Task id
   * @param {*} callback holds a function
   */
  retrieveTaskByStatus = (status, callback) => {
    console.log('TRACKED_PATH: Inside services');
    TaskModel.getTaskByStatus(status, (error, taskResult) => {
      error ? callback(error, null) : callback(null, taskResult);
    });
  };

  /**
   * @description remove Task  data from database using model's mothod
   * @param {*} TaskId holds _id that is Task id
   * @param {*}  userId holds user Object id
   * @param {*} callback holds a function
   */
  removeTaskById = (userId, TaskId, callback) => {
    console.log('TRACKED_PATH: Inside services');
    TaskModel.deleteTaskByTaskId(TaskId, (error, taskResult) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, taskResult);
      }
    });
  };

    /**
   * @description update Task  data existed in database, using model's mothod
   * @param {*} TaskId holds _id that is Task  id
   * @param {*} dataToUpdate takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
     updateTaskById = (taskId, dataToUpdate, callback) => {
      console.log('TRACKED_PATH: Inside services');
      TaskModel.updateTaskByTaskId(taskId, dataToUpdate, (error, taskResult) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, taskResult);
        }
      });
    }

  /**
   * @description Delete Task by id and return response to controller
   * @method removeTask is used to remove Task by ID
   * @param callback is the callback for controller
   */
  removeTask = (userId, taskID, callback) => TaskModel.removeTask(taskID, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = new TaskServices();