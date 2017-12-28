import * as types from "./types";

function createTaskSuccess(newTask) {
    return { type: types.ADD_TASK, newTask: newTask };
}

function loadTasksSuccess(jobList) {
    return { type: types.LOAD_TASKS_SUCCESS, newQueue: jobList };
}

export {createTaskSuccess, loadTasksSuccess}