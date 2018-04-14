import * as React from "react";
import * as QBot from "../types/Model";
import { taskSelectors } from "../state/tasks";
import Link from "redux-first-router-link";
import { connect } from 'react-redux';
// TODO: Find better way to display the BEWT with some measure of precision.
export const Dashboard = (currentQueue: QBot.QueueDTO) => {
    const { bewt, machineBalance, internalQueue } = currentQueue;
    return <div>
        <div className="col-md-3" >BEWT:  {bewt.humanize()} </div>
        <div className="col-md-3" >Current Balance: {machineBalance}</div>
        <ul>
            {internalQueue.map(task =>
                <SingleTask key={task.taskId} {...task} />
            )
            }
        </ul>
    </div >;
}
export const SingleTask = (task: QBot.Task) =>
    <Link to={`/task/${task.taskId}`} >
        <li className='list-group-item' key={task.taskId} >
            Customer: {task.customer.name}<br />
            Job: {task.job.name}<br />
            Went on Queue: {task.timeEnqueued}<br />
            Expected Service: {task.timeOfExpectedService}<br />
            Balance: {task.balance}<br />
            TaskId: {task.taskId}
        </li></Link>

const mapStateToProps = (state) => ({
    internalQueue: taskSelectors.getActiveSortedTasks(state),
    bewt: state.bewt,
    machineBalance: state.machineBalance
});

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);