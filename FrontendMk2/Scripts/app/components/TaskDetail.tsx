import * as React from "react";
import * as QBot from "../types/Model";
import Link from "redux-first-router-link";
import { connect } from 'react-redux';
import * as Moment from "moment";


const TaskDetail = (chosenTask: QBot.Task) => <div className='list-group-item' key={chosenTask.taskId} >
    Customer: {chosenTask.customer.name}<br />
    Job: {chosenTask.job.name}<br />
    Went on Queue: {chosenTask.timeEnqueued}<br />
    Status: {chosenTask.taskStatus}
    Admin Notes:{chosenTask.adminNotes}
    Customer Notes: {chosenTask.customerNotes}
    Balance: {chosenTask.balance}<br />
    jobId: {chosenTask.jobId}
</div>

const mapState = ({ currentTask, tasks }) => {
    const chosenTask: QBot.Task = tasks.find(function (element) { return element.taskID = currentTask; });
    return chosenTask || QBot.emptyTask;
}
export const ConnectedTaskDetail = connect(mapState)(TaskDetail);