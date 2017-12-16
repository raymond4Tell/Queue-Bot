import jobQueueAPI from '../JobQueueAPI';

export function loadJobs() {
    return function (dispatch) {
        return jobQueueAPI.getAllJobs().then(jobList => {
            dispatch(loadJobsSuccess(jobList));
        }).catch(error => {
            throw (error);
        });
    };
}

export function submitTask(task) {
    return function (dispatch) {
        return jobQueueAPI.createTask(task).then(newTask => {
            dispatch(createTaskSuccess(newTask));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createTaskSuccess(newTask) {
    return { type: "ADD_TASK", newTask: newTask };
}

// TODO: Add nice enum for action types.
export function loadJobsSuccess(jobList) {
    return { type: "LOAD_JOBS_SUCCESS", jobs: jobList};
}