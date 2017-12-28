import * as QBot from "../../types/Model";
import * as moment from "moment";
import * as types from "./types";

/*
 * State shape:
 * tasks: [
    QBot.Task
 * ]
 */

export default function taskReducer(state = [], action) {
    switch (action.type) {
        case types.ADD_TASK:
            return [...state, action.newTask];
        case types.LOAD_TASKS_SUCCESS:
            return action.newQueue;
        default:
            return state;
    }
}