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
            return routesEnum.HOME
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
const history = createHistory();

// THE WORK:
export enum routesEnum {
    HOME = "HOME",
    TASK = "TASK",
    TASKLIST = "TASKLIST",
    NEWTASK = "NEWTASK"
}
const routesMap = {
    HOME: '/home',      // action <-> url path
    TASK: '/task/:id',  // :id is a dynamic segment
    NEWTASK: "/newtask"
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

const rootComponents = {
    [routesEnum.HOME]: <ConnectedDashboard />,
    [routesEnum.TASKLIST]: <ConnectedDashboard />,
    [routesEnum.NEWTASK]: <ConnectedNewTask />
}

const App = ({ pageType, onClick }) => {
    return <div>
        <a onClick={onClick}>Task List</a>
        <Header />
        <span>{pageType}</span>
        {
            rootComponents[pageType]
        }
    </div>
};
const mapStateToProps = ({ pageType }) => ({ pageType });
const mapDispatchToProps = (dispatch) => ({
    onClick: () => dispatch({ type: routesEnum.TASKLIST })
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