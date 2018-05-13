// This action/reducer/such taken from https://github.com/alexnm/re-ducks

import jobQueueAPI from '../JobQueueAPI';
export default function customerReducer(state = [], action) {
    switch (action.type) {
        case "LOAD_CUSTOMERS_SUCCESS":
            return action.customers;
        default:
            return state;
    }
}
export function loadCustomers() {
    return function (dispatch) {
        return jobQueueAPI.getCustomers().then(jobList => {
            dispatch(loadCustomersSuccess(jobList));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCustomersSuccess(customerList) {
    return { type: "LOAD_CUSTOMERS_SUCCESS", customers: customerList };
}