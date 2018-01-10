import * as actions from "./actions";
import jobQueueAPI from '../../JobQueueAPI';

function loadCurrentTasks() {
    return function (dispatch) {
        return jobQueueAPI.getallTasks().then(jobList => {
            dispatch(actions.loadTasksSuccess(jobList));
        }).catch(error => {
            throw (error);
        });
    };
}


function submitTask(task) {
    return function (dispatch) {
        return jobQueueAPI.createTask(task).then(newTask => {
            dispatch(actions.createTaskSuccess(newTask));
        }).catch(error => {
            throw (error);
        });
    };
}

function updateTask(task) {
    return function (dispatch) {
        return jobQueueAPI.update(task).then(newTask => {
            dispatch(actions.updateTaskSuccess(newTask));
        }).catch(error => {
            throw (error);
        });
    };
}

export {submitTask, loadCurrentTasks }