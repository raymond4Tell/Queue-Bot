import * as React from "react";
import * as QBot from "../types/Model";
import Link from "redux-first-router-link";
import { connect, Dispatch, Provider } from "react-redux";
import * as moment from "moment";
import Moment from "react-moment";

export interface NewTaskFormProps {
    createTask: any
}

type NewTaskState = {
    newTask: QBot.Task
};

class NewTaskForm extends React.Component<NewTaskFormProps, NewTaskState> {
    state: NewTaskState = {
        newTask: {
            timeEnqueued: moment.now(),
            customer: {
                name: "Alfred",
                authId: "klkjlk",
                requestedJobs: []
            },
            authId: "",
            jobId: 1,
            job: {
                jobId: 1,
                length: moment.duration({ hours: 1 }),
                description: "asdfadfkl",
                name: "sdasdfkjlkk"
            },
            taskId: "asdfasdfasdf",
            taskStatus: 1,
            waitTime: moment.duration({ hours: 1 }),
            deposit: 0,
            timePrice: 0,
            timeOfExpectedService: moment.now(),
            Balance: 0,
            customerNotes: "",
            adminNotes: ""
        }
    };

    handleIncrement = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ newTask: { ...this.state.newTask, [name]: value } });
        //this.props.createTask(this.state.newTask);
    };

    sendTask = () => {
        this.setState({ newTask: { ...this.state.newTask } });
        this.props.createTask(this.state.newTask);
    }

    render() {
        const { handleIncrement } = this;
        const { createTask } = this.props;
        return <div>
            <h2>New Task</h2>
            <label >Task ID
                <input type="text" name="taskId" onChange={this.handleIncrement} value={this.state.newTask.taskId} />
            </label>
            <label>Time Price
                <input type="number" name="timePrice" onChange={this.handleIncrement} value={this.state.newTask.timePrice} />
            </label>
            <button> Back </button >
            <button onClick={this.sendTask}> Save</button >
        </div>;
    }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({

    createTask: (newTask) => dispatch({
        type: "ADD_TASK",
        newTask: newTask
    })
});
export const ConnectedNewTask = connect(null, mapDispatchToProps)(NewTaskForm);