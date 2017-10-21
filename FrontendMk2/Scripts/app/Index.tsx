import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch, Provider } from "react-redux";
import Link from "redux-first-router-link";
import { NOT_FOUND, connectRoutes } from "redux-first-router";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import createHistory from 'history/createBrowserHistory';
import { Header } from "./components/Header";
import { ConnectedDashboard } from "./components/Dashboard";
import { Job, Task, QueueDTO, Customer } from "./types/Model";
import * as moment from "moment";

"using strict";

export const pageTypeReducer = (state = null, action = { type: "", payload: { id: "" } }) => {
	switch (action.type) {
		case routesEnum.HOME:
		case NOT_FOUND:
			return null
		case routesEnum.SCENARIO:
			return action.payload.id;
		case routesEnum.QUESTIONS:
			return "QUESTIONS!"
		default:
			return state
	}
};

const BEWT: moment.Duration = moment.duration({ hours: 2, minutes: 20, seconds: 40 });
const internalQueue: Task[] = [{
    timeEnqueued: moment.now(), customer: { name: "Alfred", authId: "klkjlk", requestedJobs: [] }, authId: "sadfasdf",
    job: { jobId: 1, length: moment.duration({ hours: 1 }), description: "asdfadfkl", name: "sdasdfkjlkk" }, taskId: "asdfasdfasdf",
    taskStatus: 1, waitTime: moment.duration({ hours: 3 }), deposit: 3, timePrice: 1.5, timeOfExpectedService: moment.now(), Balance: -4.1,
    jobId: 1, customerNotes: "", adminNotes: ""
}]
const testQueue: QueueDTO = { bewt: BEWT, machineBalance: 25.6, internalQueue: [] }
export const taskReducer = (state = internalQueue, action) =>
{
    switch (action.type) {
        case "ADD_TASK":
            return [...state, action.newTask];
        default:
            return state;
    }
}

const history = createHistory();

// THE WORK:
enum routesEnum {
	HOME = "HOME",
	SCENARIO = "SCENARIO",
	QUESTIONS = "QUESTIONS"
}
const routesMap = {
	HOME: '/home',      // action <-> url path
	SCENARIO: '/task/:id',  // :id is a dynamic segment
	QUESTIONS: "/questions"
};

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap);
// and you already know how the story ends:
const rootReducer = combineReducers({ location: reducer, pageType: pageTypeReducer, tasks: taskReducer });
const middlewares = applyMiddleware(middleware);
const store = createStore(rootReducer, compose(enhancer, middlewares));

const App = ({ pageType, onClick }) => {
	return <div>
		<Header />
		{
			/* This ought to be a hash table or something, keyed off of pageType, but
			that doesn't play well with the current "shape" for pageType.
			This also does need to be a single expression, if/else if/else blocks are not allowed. */
            pageType == "QUESTIONS!"
                ? <ConnectedDashboard {...testQueue } />
				: !isNaN(pageType) && null != pageType ? <h1>SCENARIO: {pageType}</h1>
					: <h1>HOME PAGe</h1>
		}
	</div>
};
const mapStateToProps = ({ pageType }) => ({ pageType });
const mapDispatchToProps = (dispatch) => ({
	onClick: () => dispatch({ type: 'USER', payload: { id: 5 } })
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
	<Provider store={store}>
		<AppContainer />
	</Provider>,
	document.getElementById('mainContent')
);