﻿import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch, Provider } from "react-redux";
import Link from "redux-first-router-link";
import { NOT_FOUND, connectRoutes } from "redux-first-router";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import createHistory from 'history/createBrowserHistory';
import { Header } from "./components/Header";
import { ConnectedNewTask } from "./components/NewTask";
import { ConnectedDashboard } from "./components/Dashboard";
import { Job, Task, QueueDTO, Customer } from "./types/Model";
import * as moment from "moment";
import thunk from 'redux-thunk';
import { loadJobs } from "./state/jobActions";
import { taskOperations } from "./state/tasks";

"using strict";

export const pageTypeReducer = (state = null, action = { type: "", payload: { id: "" } }) => {
    switch (action.type) {
        case routesEnum.HOME:
        case NOT_FOUND:
            return null
        case routesEnum.TASK:
            return action.payload.id;
        case routesEnum.QUESTIONS:
            return "QUESTIONS!"
        default:
            return state
    }
};

const BEWT: moment.Duration = moment.duration({ hours: 2, minutes: 20, seconds: 40 });


// TODO: Pull these reducers out into their own files in the folder I created for them.
const bewt = (state = BEWT, action) => {
    switch (action.type) {
        case "NEW_BEWT":
            return action.BEWT;
        default:
            return state;
    }
}

function machineBalance(state = 25.6, action) {
    switch (action.type) {
        case "NEW_BALANCE":
            return action.balance;
        default:
            return state;
    }
}
const history = createHistory();

// THE WORK:
enum routesEnum {
    HOME = "HOME",
    TASK = "TASK",
    TASKLIST = "TASKLIST",
    QUESTIONS = "QUESTIONS"
}
const routesMap = {
    HOME: '/home',      // action <-> url path
    TASK: '/task/:id',  // :id is a dynamic segment
    QUESTIONS: "/questions"
};

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap);
// and you already know how the story ends:
import tasks from "./state/tasks";
import jobs from "./state/jobActions";
const rootReducer = combineReducers({
    location: reducer, pageType: pageTypeReducer, tasks, bewt,
    machineBalance, jobs
});
const middlewares = applyMiddleware(middleware, thunk);
const store = createStore(rootReducer, compose(enhancer, middlewares));

const testQueue: QueueDTO = { bewt: BEWT, machineBalance: 0, internalQueue: [] };
const App = ({ pageType, onClick }) => {
    return <div>
        <a onClick={onClick}>Butts</a>
        <Header />
        {
			/* This ought to be a hash table or something, keyed off of pageType, but
			that doesn't play well with the current "shape" for pageType.
			This also does need to be a single expression, if/else if/else blocks are not allowed. */
            pageType == "QUESTIONS!"
                ? <ConnectedDashboard {...testQueue } />
                : !isNaN(pageType) && null != pageType ? <ConnectedNewTask />
                    : <h1>HOME PAGe</h1>
        }
    </div>
};
const mapStateToProps = ({ pageType }) => ({ pageType });
const mapDispatchToProps = (dispatch) => ({
    onClick: () => dispatch({ type: routesEnum.TASK, payload: { id: 5 } })
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

store.dispatch(loadJobs());
store.dispatch(taskOperations.loadCurrentTasks());
ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('mainContent')
);