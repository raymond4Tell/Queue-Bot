import * as React from "react";
import * as QBot from "../types/Model";
import Link from "redux-first-router-link";
import { connect, Dispatch, Provider } from "react-redux";
import * as moment from "moment";
import Moment from "react-moment";
import { taskOperations } from "../state/tasks/";

export interface NewTaskFormProps {
    createTask: any,
    jobList: QBot.Job[]
}

type NewTaskState = {
    newTask: QBot.Task
};

class NewTaskForm extends React.Component<NewTaskFormProps, NewTaskState> {
    state: NewTaskState = {
        // Really ought to do this with `newTask : new QBot.Task()`, but CBA to add a proper constructor to that type.
        newTask: {
            timeEnqueued: moment.now(),
            customer: {
                name: "Alfred",
                authId: "klkjlk",
                requestedJobs: []
            },
            authId: "klkjlk",
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
    };

    // TODO: Add better validation, here and server-side.
    sendTask = () => {
        this.props.createTask(this.state.newTask);
    }

    render() {
        const { handleIncrement } = this;
        const { createTask, jobList } = this.props;
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
            <label >Task ID
                <input type="text" name="authId" onChange={this.handleIncrement} value={this.state.newTask.authId} />
            </label>
            <label>Time Price
                <input type="number" name="timePrice" onChange={this.handleIncrement} value={this.state.newTask.timePrice} />
            </label>
            <button> Back </button >
            <button onClick={this.sendTask}> Save</button >
        </div>;
    }
}

const mapStateToProps = (state) => ({ jobList: state.jobs });
const mapDispatchToProps = (dispatch) => ({
    createTask: (newTask) => dispatch(taskOperations.submitTask(newTask))
});
export const ConnectedNewTask = connect(mapStateToProps, mapDispatchToProps)(NewTaskForm);