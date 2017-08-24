import * as React from "react";
import { Question } from "../types/Question";
export interface NewQuestion {
	value: string
}

export class QuestionsBox extends React.Component<Question, NewQuestion> {
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
		return <div className="singleQuestion">
			<input type="hidden" value={this.props.QuestionId} name="Id" />
			<label>Question Text
				<input type="text" value={this.props.Text} name="Text" /></label>
			<label>Required	<input type="checkbox" name="required" checked={this.props.Required} />
			</label>

			<select className="listOfAnswers" value={this.state.value} onChange={this.handleChange}>
				{this.props.Options.map(questionOption =>
					<option key={questionOption } value={questionOption }>{questionOption }</option>)
				}
			</select>
		</div>;
	}
}