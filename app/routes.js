const userControllers = require('./controller/user');
const TaskController = require('./controller/task');
const helper = require('./middlewares/helper');

class Routes {
  routeToControllers = (app) => {

    /** *********************************************************************************
      * @description routes for user
      ********************************************************************************** */
    app.post('/register', userControllers.register);
    app.post('/login', userControllers.login);


    /** *********************************************************************************
        * @description routes for tasks
        ********************************************************************************** */
    // Create a task
    app.post('/addTask', helper.verifyToken, TaskController.addTask);

    // Retrieve all Tasks
    app.get('/allTasks', helper.verifyToken, TaskController.findAllTasks);

    // Delete a Task with TaskId
    app.delete('/tasks/delete/:taskId', helper.verifyToken, TaskController.deleteTaskByTaskId);

    // Retrieve a single Task with TaskId
    app.get('/filterTask/byStatus', helper.verifyToken, TaskController.findTaskByStatus);

    // Update a TaskModel with TaskId
    app.put('/updateTask/:taskId', helper.verifyToken, TaskController.updateTaskByTaskId);

  }
}

module.exports = new Routes();