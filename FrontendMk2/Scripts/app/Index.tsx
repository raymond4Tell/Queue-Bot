import * as React from "react";
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
        case routesEnum.TASKLIST:
            return routesEnum.TASKLIST
        case routesEnum.TASK:
            return routesEnum.TASK
        case routesEnum.NEWTASK:
            return routesEnum.NEWTASK;
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

function currentTask(state = "", action) {
    switch (action.type) {
        case "TASK":
            return action.payload.taskID;
        default:
            return state;
    }
}
const history = createHistory();

// THE WORK:
export enum routesEnum {
    HOME = "HOME",
    TASK = "TASK",
    TASKLIST = "TASKLIST",
    NEWTASK = "NEWTASK"
}
//TODO: Move this out into its own file.
const routesMap = {
    TASKLIST: {
        path: '/home', thunk: (dispatch, getState) => {
            const { tasks } = getState();

            if (tasks.length)
                return;
            dispatch(taskOperations.loadCurrentTasks());
        }
    },  // action <-> url path
    TASK: {
        path: '/task/:taskID',
        thunk: (dispatch, getState) => {
            const { location: { payload: { taskID } }, tasks } = getState();

            if (tasks.find(function (element) { return element.taskID = currentTask; }))
                return;
            dispatch(taskOperations.loadSingleTask(taskID));
        }
    },
    NEWTASK: "/newtask"
};

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap);
// and you already know how the story ends:
import tasks from "./state/tasks";
import jobs from "./state/jobActions";
import { ConnectedTaskDetail } from "./components/TaskDetail";
import JobQueueApi from "./JobQueueAPI";
const rootReducer = combineReducers({
    location: reducer, pageType: pageTypeReducer, tasks, bewt,
    machineBalance, jobs, currentTask
});
const middlewares = applyMiddleware(middleware, thunk);
const store = createStore(rootReducer, compose(enhancer, middlewares));

const rootComponents = {
    [routesEnum.HOME]: <ConnectedDashboard />,
    [routesEnum.TASK]: <ConnectedTaskDetail />,
    [routesEnum.TASKLIST]: <ConnectedDashboard />,
    [routesEnum.NEWTASK]: <ConnectedNewTask />
}

const App = ({ pageType }) => {
    return <div>
        <Header />
        <span>{pageType}</span>
        {
            rootComponents[pageType]
        }
    </div>
};
const mapStateToProps = ({ pageType }) => ({ pageType });

const AppContainer = connect(mapStateToProps)(App);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('mainContent')
);