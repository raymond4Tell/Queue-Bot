import * as QBot from "../../types/Model";
import * as moment from "moment";
import * as types from "./types";

/*
 * State shape:
 * tasks: [
      QBot.Task
 * ]
 */

// I mean, granted, all of these do the same thing, but I'm putting them in separate actions for logging's sake.
export default function taskReducer(state = [], action) {
    switch (action.type) {
        case types.ADD_TASK:
            return [ ...state, ...action.newQueue ];
        case types.LOAD_TASKS_SUCCESS:
            return [ ...state, ...action.newQueue ];
        case types.UPDATE_TASK:
            return [ ...state, ...action.newQueue ];
        default:
            return state;
    }
}