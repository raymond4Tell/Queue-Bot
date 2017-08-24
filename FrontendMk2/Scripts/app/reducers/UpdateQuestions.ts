import * as ActionList from "./../types/ActionsIndex"
import { StoreState } from "./../Index";
export const updateQuestions = (state: StoreState, action: ActionList.ActionTypes) => {
	switch (action.type) {
		case ActionList.TypeKeys.UPDATE_QUESTIONS:
			return { ...state, questionList: action.updatedQuestion };
		default:
			return state;
	}
}