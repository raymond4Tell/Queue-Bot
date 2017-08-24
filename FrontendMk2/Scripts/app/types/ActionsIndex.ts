import { Scenario } from "./../types/Scenario";
import { Question } from "../Types/Question"

// CHUCK DO YOU WANT ANY MORE THINGS WE CAN DO TO YOUR THINGS?
// ...
// ...SAID THE ACTRESS TO THE BISHOP.
export enum TypeKeys {
	UPDATE_SCENARIO = "UPDATE_SCENARIO",
	CREATE_SCENARIO = "CREATE_SCENARIO",
	UPDATE_QUESTIONS = "UPDATE_QUESTIONS",
	OTHER_ACTION = "__any_other_action_type__"
}

export interface updateScenario {
	type: TypeKeys.UPDATE_SCENARIO,
	updatedScenario: Scenario

}

export interface createScenario {
	type: TypeKeys.CREATE_SCENARIO,
	newScenario: Scenario

}
export interface updateQuestionsList {
	type: TypeKeys.UPDATE_QUESTIONS,
	updatedQuestion: Question

}

export type ActionTypes =
	|updateQuestionsList
	| updateScenario
	| createScenario;