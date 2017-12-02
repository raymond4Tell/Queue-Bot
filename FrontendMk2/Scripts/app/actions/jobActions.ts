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
// TODO: Add nice enum for everything.
export function loadJobsSuccess(jobList) {
    return { type: "LOAD_JOBS_SUCCESS", jobs: jobList};
}