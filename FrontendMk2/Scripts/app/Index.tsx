import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch, Provider } from "react-redux";
import Link from "redux-first-router-link";
import { NOT_FOUND, connectRoutes } from "redux-first-router"
import { combineReducers, createStore, applyMiddleware, compose } from "redux"
import createHistory from 'history/createBrowserHistory'
import { Header } from "./components/Header";
import { QuestionsBox } from "./components/QuestionsBox";
import { QuestionField } from "./components/QuestionField";
import { Scenario } from "./types/Scenario";
import { Question } from "./types/Question";

"using strict";

export interface StoreState {
	jobList: Array<string>,
	scenarioList: Scenario[],
	questionList: Question[]
};

const testQuestion = {
	Text: "What is your favourite colour?",
	Required: true,
	QuestionId: "source",
	Options: ["red", "blue", "green"]
};
const listOfQuestions = [testQuestion, {
	Text: "Why is a raven like a writing desk?",
	Required: false,
	QuestionId: "carroll",
	Options: ["Because Poe wrote on both", "Because they are nevar put with the wrong end front", "Hiding behind the couch"]
}]


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

const history = createHistory();

// THE WORK:
enum routesEnum {
	HOME = "HOME",
	SCENARIO = "SCENARIO",
	QUESTIONS = "QUESTIONS"
}
const routesMap = {
	HOME: '/home',      // action <-> url path
	SCENARIO: '/scenario/:id',  // :id is a dynamic segment
	QUESTIONS: "/questions"
};

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap);
// and you already know how the story ends:
const rootReducer = combineReducers({ location: reducer, pageType: pageTypeReducer });
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
			? <QuestionField questionList={listOfQuestions} />
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