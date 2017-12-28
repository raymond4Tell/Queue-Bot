import jobQueueAPI from '../JobQueueAPI';
export default function jobsReducer(state = [], action) {
    switch (action.type) {
        case "LOAD_JOBS_SUCCESS":
            return action.jobs;
        default:
            return state;
    }
}
export function loadJobs() {
    return function (dispatch) {
        return jobQueueAPI.getAllJobs().then(jobList => {
            dispatch(loadJobsSuccess(jobList));
        }).catch(error => {
            throw (error);
        });
    };
}

// TODO: Add nice enum for action types.
export function loadJobsSuccess(jobList) {
    return { type: "LOAD_JOBS_SUCCESS", jobs: jobList};
}