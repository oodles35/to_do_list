const TaskServices = require('../services/task');
const helper = require('../middlewares/helper');

class TaskController {
  /**
   * @description add Task to database
   * @param {*} request takes Task in json formate
   * @param {*} response sends response from server
   */
  addTask = (request, response) => {
    console.log('TRACKED_PATH: Inside controller');
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    const TaskDetails = {
      status: request.body.status,
      description: request.body.description,
      userId: encodedBody.userId,
    };
    console.log('INVOKING: saveData method of services');
    TaskServices.saveTaskData(TaskDetails, (error, TaskResult) => {
      if (error) {
        console.log(`ERR001: getting Error to save ${error.message}`);
        response.send({
          success: false,
          status_code: 400,
          message: error.message,
        });
      } else {
        console.log('Task inserted successfully');
        response.send({
          success: true,
          status_code: 200,
          message: 'Task inserted successfully',
          data: TaskResult,
        });
        console.log('SUCCESS001: Task inserted successfully');
      }
    });
  };

  /**
   * @description Retrieve and return all tasks from the database.
   * @param {*} request does not take any parameter
   * @param {*} response sends response from server
   */
  findAllTasks = (request, response) => {
    console.log('TRACKED_PATH: Inside controller');
    const start = new Date();
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    TaskServices.retrieveAllTasks(encodedBody.userId, (error, TaskResult) => {
      if (error) {
        console.log(`Some error occurred while retrieving Tasks ${error.message}`);
        response.send({
          success: error.success,
          status_code: error.statusCode,
          message: error.message,
        });
      } else {
        console.log('SUCCESS002:All Tasks has been retrieved');
        response.send({
          success: TaskResult.success,
          status_code: TaskResult.statusCode,
          message: TaskResult.message,
          data: TaskResult.data,
        });
        console.log('Request took:', new Date() - start, 'ms');
      }
    });
  };

  /**
   * @description Retrieve and return Task associated with _id ,from the database.
   * @param {*} response sends response from server
   */
  findTaskByStatus = (request, response) => {
    console.log('TRACKED_PATH: Inside controller',request.query.status);
    TaskServices.retrieveTaskByStatus(
      request.query.status,
      (error, TaskResult) => {
        if (TaskResult === null) {
          response.send({
            success: false,
            status_code: 404,
            message: `Task not found with id ${request.query.status}`,
          });
          console.log(
            `ERR003: Task not found with id ${request.query.status}`,
          );
        } else {
          response.send({
            success: true,
            status_code: 200,
            message: 'data retrived',
            data: TaskResult,
          });
          console.log('SUCCESS003: Data retrieved');
        }
      },
    );
  };

  /**
   * @description update Task by _id
   * @param {*} request takes _id that is taskId
   * @param {*} response sends response from server
   */
   updateTaskByTaskId = (request, response) => {
    console.log('TRACKED_PATH: Inside controller');
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    TaskServices.updateTaskById(
      request.params.taskId,
      {
        status: request.body.status,
        description: request.body.description,
      },
      (error, taskResult) => {
        if (error) {
          response.send({
            success: false,
            status_code: 404,
            message: `Task not found with id ${request.params.taskId}`,
          });
          console.log(
            `ERR004: Task  not found with id ${request.params.taskId}`,
          );
        } else {
          response.send({
            success: true,
            status_code: 200,
            message: 'Task has been updated',
            updated_data: taskResult,
          });
          console.log('SUCCESS004: Task has been updated');
        }
      },
    );
  };

  /**
   * @description delete Task  by _id that is TaskId
   * @param {*} request takes _id that is TaskId
   * @param {*} response sends response from server
   */
  deleteTaskByTaskId = (request, response) => {
    console.log('TRACKED_PATH: Inside controller');
    const encodedBody = helper.getEncodedBodyFromHeader(request);
    TaskServices.removeTaskById(encodedBody.userId, request.params.taskId, (error, TaskResult) => {
      if (TaskResult === null) {
        response.send({
          success: false,
          status_code: 404,
          message: `Task not found with id ${request.params.taskId}`,
        });
        console.log(`ERR005: Task not found with id ${request.params.taskId}`);
      } else {
        response.send({
          success: true,
          status_code: 200,
          message: 'Task deleted successfully!',
        });
        console.log('SUCCESS004: Task deleted successfully!');
      }
    });
  }


  /**
   * @message delete Task with id whitch is setting isDeleted value true
   * @method removeTask is service class method
   * @param response is used to send the response
   */
  deleteTask = (req, res) => {
    const TaskID = req.params.TaskId;
    const encodedBody = helper.getEncodedBodyFromHeader(req);
    const { userId } = encodedBody;
    try {
      TaskServices.removeTask(userId, TaskID, (error, data) => (
        error
          ? (console.log(`Task not found with id ${TaskID}`),
            res.send({
              status_code: 404,
              message: `Task not found with id ${TaskID}`,
            }))
          : console.log('Task deleted successfully!'),
        res.send({
          status_code: 200,
          message: 'Task deleted successfully!',
        })
      ));
    } catch (error) {
      return (
        error.kind === 'ObjectId' || error.title === 'NotFound'
          ? (console.log(`could not found Task with id${TaskID}`),
            res.send({
              status_code: 404,
              message: `Task not found with id ${TaskID}`,
            }))
          : console.log(`Could not delete Task with id ${TaskID}`),
        res.send({
          status_code: 500,
          message: `Could not delete Task with id ${TaskID}`,
        })
      );
    }
  }
}

module.exports = new TaskController();
