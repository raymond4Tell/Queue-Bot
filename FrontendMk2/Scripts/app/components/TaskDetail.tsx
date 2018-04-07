import * as React from "react";
import * as QBot from "../types/Model"; 
import Link from "redux-first-router-link";
import { connect } from 'react-redux';
import Moment from "react-moment";


const TaskDetail = (chosenTask: QBot.Task) => <div className='list-group-item' key={chosenTask.taskId} >
    Customer: {chosenTask.customer.name}<br />
    Job: {chosenTask.job.name}<br />
    Went on Queue: {chosenTask.timeEnqueued}<br />
    Balance: {chosenTask.balance}<br />
    jobId: {chosenTask.jobId}
</div>

const mapStateToProps = (state) => ({
   chosenTask: state.location.task
});
export const ConnectedTaskDetail = connect(mapStateToProps)(TaskDetail);