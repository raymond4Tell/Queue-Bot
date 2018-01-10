import * as types from "./types";
import * as QBot from "../../types/Model";
const normalizeTasks = (taskList: QBot.Task[]) => {
    var taskObject = {};
    taskList.forEach(function (element) {
        taskObject[element.taskId] = element;
    });
    return taskObject;
}

function createTaskSuccess(newTask) {
    return { type: types.ADD_TASK, newQueue: newTask };
}

function updateTaskSuccess(newTask) {
    return { type: types.UPDATE_TASK, newQueue: newTask };
}

function loadTasksSuccess(jobList) {
    return { type: types.LOAD_TASKS_SUCCESS, newQueue: jobList };
}

export { createTaskSuccess, loadTasksSuccess, updateTaskSuccess }