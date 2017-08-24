import * as React from "react";
import { QuestionsBox } from "./QuestionsBox";
import { Question } from "../types/Question";
export interface QuestionList {
	questionList: Question[];
}

export interface NewQuestion {
	value: string
}

export class QuestionField extends React.Component<QuestionList, NewQuestion> {
	constructor(props) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(event) {
		this.setState({ value: event.target.value });
		alert('Your favorite flavor is: ' + event.target.value);
	}

	handleSubmit(event) {
		alert('Your favorite flavor is: ' + this.state.value);
		event.preventDefault();
	}

	render() {
		return <div className="LargeQuestionField">
			<div className="RequiredQuestions">
				{this.props.questionList.filter(question => question.Required).map(question =>
					<QuestionsBox key={question.QuestionId} Options={question.Options} Text={question.Text} Required={question.Required} 
					QuestionId={question.QuestionId} />
				)}
			</div>
			<div className="OptionalQuestions">
				{this.props.questionList.filter(question => !question.Required).map(question =>
					<QuestionsBox key={question.QuestionId} Options={question.Options} Text={question.Text} Required={question.Required}
						QuestionId={question.QuestionId} />
				)}
			</div>
		</div>;
	}
}