import * as React from "react";
import * as QBot from "../types/Model";
import Link from "redux-first-router-link";
import { connect } from 'react-redux';
import * as Moment from "moment";

var emptyTask: QBot.Task = {
    customer: { name: "Bob", authId: "asdfasdf", requestedJobs:[] },
    authId: "asdfasdf",
    taskId: "000-111",
    waitTime: Moment.duration({ hours: 2, minutes: 20, seconds: 40 }),
    job: { name: "Do something", jobId: 1, length: Moment.duration({ hours: 2, minutes: 20, seconds: 40 }), description:"Do a thing" },
    deposit: 0,
    timePrice: 5,
    balance: 0,
    jobId: 1,
    timeEnqueued: 122123,
    timeOfExpectedService: 100000,
    taskStatus: 1,
    customerNotes: "",
    adminNotes: "",

}

const TaskDetail = (chosenTask: QBot.Task) => <div className='list-group-item' key={chosenTask.taskId} >
    TASKDETAIL.
    Customer: {chosenTask.customer.name}<br />
    Job: {chosenTask.job.name}<br />
    Went on Queue: {chosenTask.timeEnqueued}<br />
    Balance: {chosenTask.balance}<br />
    jobId: {chosenTask.jobId}
</div>

const mapState = ({ currentTask, tasks }) => {
    const chosenTask = tasks.find(function (element) { return element.taskID = currentTask; });
    return chosenTask || emptyTask;
}
export const ConnectedTaskDetail = connect(mapState)(TaskDetail);