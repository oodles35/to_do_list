const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  { 
    description: {
      type: String,
      required: true,
    },
    status: {
        type: String,
      }, 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },  
  },
  {
    timestamps: true,
  },
);

TaskSchema.set('versionKey', false);

console.log('inside model');
const Task = mongoose.model('Task', TaskSchema);

class TaskModel {
  /**
   * @description save request Task data to database
   * @param {*} taskData holds data to be saved in json formate
   * @param {*} callback holds a function
   */
  saveTask = (taskData, callback) => {
    console.log('TRACKED_PATH: Inside model');
    const task = new Task(taskData);
    task.save((error, taskResult) => {
      error ? callback(error, null) : callback(null, taskResult);
    });
  };

  /**
   * @description retrive all Task data from database
   *@param {*} userId will contain user Object id
   * @param {*} callback holds a function
   */
  getAllTasks = (userId, callback) => {
    console.log('TRACKED_PATH: Inside model');
    Task.find({ userId }, (error, taskData) => {
      error ? callback(error, null) : callback(null, taskData);
    });
  };

  /**
   * @description retrive one Task data from database
   * @param {*} greetingID holds _id that is Task id
   * @param {*} callback holds a function
   */
  getTaskByStatus = (status, callback) => {
    console.log('TRACKED_PATH: Inside model');
    Task.find({"status" : {$regex : status}},(error, taskResult) => {
        error ? callback(error, null) : (
          callback(null, taskResult));
      });
  };

  /**
   * @description remove Task data from database
   * @param {*} taskData holds _id that is Task  id
   * @param {*} callback holds a function
   */
  deleteTaskByTaskId = (taskData, callback) => {
    console.log('TRACKED_PATH: Inside model');
    Task.findByIdAndDelete(taskData, (error, taskResult) => {
      error ? callback(error, null) : callback(null, taskResult);
    });
  }

  /**
   * @description update Task  data existed in database
   * @param {*} TaskId holds _id that is Task  id
   * @param {*} dataToUpdate takes data to be upadated in json formate
   * @param {*} callback holds a function
   */
  updateTaskByTaskId = (taskId, dataToUpdate, callback) => {
    console.log('TRACKED_PATH: Inside model');
    Task.findByIdAndUpdate(
      taskId,
      dataToUpdate,
      { new: true },
      (error, taskResult) => {
        error ? callback(error, null) : callback(null, taskResult);
      },
    );
  }

  /**
   * @description remove Task temporary by setting isdeleted flag true
   * @param {*} TaskID
   * @param {*} callback
   */
  removeTask = (TaskID, callback) => {
    Task.findByIdAndUpdate(
      TaskID, { isDeleted: true }, { new: true },
      callback,
    );
  };

  /**
  * @description retrive all Task data from database
  *@param {*} searchDetail will contain user Object id and search title
  */
  getTasks = async (searchDetail) => {
    try {
      let user = searchDetail.userId;
      let field = searchDetail.title;
      console.log('TRACKED_PATH: Inside model');
      const result = await Task.find({ userId: { $eq: user }, title: { $regex: field, $options: '$i' } });
      return result;
    } catch (error) {
      return error;
    }
  };
}

module.exports = new TaskModel();