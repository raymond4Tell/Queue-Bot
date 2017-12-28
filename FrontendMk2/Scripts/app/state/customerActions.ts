// This action/reducer/such taken from https://github.com/alexnm/re-ducks

import jobQueueAPI from '../JobQueueAPI';
export default function customerReducer(state = [], action) {
    switch (action.type) {
        case "LOAD_JOBS_SUCCESS":
            return action.jobs;
        default:
            return state;
    }
}
export function loadCustomers() {
    return function (dispatch) {
        return jobQueueAPI.getCustomers().then(jobList => {
            dispatch(loadJobsSuccess(jobList));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadJobsSuccess(jobList) {
    return { type: "LOAD_JOBS_SUCCESS", jobs: jobList };
}