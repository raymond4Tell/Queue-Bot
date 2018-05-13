import * as React from "react";
import * as QBot from "../types/Model";
import Link from "redux-first-router-link";
import { connect, Dispatch, Provider } from "react-redux";
import * as moment from "moment";
import Moment from "react-moment";
import { taskOperations } from "../state/tasks/";

export interface NewTaskFormProps {
    createTask: any,
    jobList: QBot.Job[],
    customerList: QBot.Customer[]
}

type NewTaskState = {
    newTask: QBot.Task
};

class NewTaskForm extends React.Component<NewTaskFormProps, NewTaskState> {
    state: NewTaskState = {
        newTask: QBot.emptyTask
    };

    handleIncrement = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ newTask: { ...this.state.newTask, [name]: value } });
    };

    // TODO: Add better validation, here and server-side.
    sendTask = () => {
        this.props.createTask(this.state.newTask);
    }

    render() {
        const { handleIncrement } = this;
        const { createTask, jobList, customerList } = this.props;
        return <div>
            <h2>New Task</h2>
            <fieldset>
                {jobList.map(job =>
                    <label key={job.jobId} >
                        Name: {job.name}<br />
                        duration: {job.length}
                        <input type="radio" value={job.jobId} name="jobId" onChange={this.handleIncrement}
                            checked={this.state.newTask.jobId == job.jobId} />
                    </label>
                )
                }
            </fieldset>
            // TODO: Make this into an "insert current details here, or insert new details" sort of thing.
            <label>Customer AuthID
                <select value={this.state.newTask.authId} name="authId" onChange={this.handleIncrement}>
                    {customerList.map(customer =>
                        <option key={customer.authId} value={customer.authId} > { customer.name } </option>)}
                </select>
                </label>
           
            <label>Time Price
                <input type="number" name="timePrice" onChange={this.handleIncrement} value={this.state.newTask.timePrice} />
            </label>
            <button> Back </button >
            <button onClick={this.sendTask}> Save</button >
        </div>;
    }
}

const mapStateToProps = (state) => ({ jobList: state.jobs, customerList: state.customers });
const mapDispatchToProps = (dispatch) => ({
    createTask: (newTask) => {
        dispatch(taskOperations.submitTask(newTask));
        dispatch({ type: "TASKLIST" });
    }
});
export const ConnectedNewTask = connect(mapStateToProps, mapDispatchToProps)(NewTaskForm);