import * as React from "react";
import { QueueDTO } from "../types/Model";
import { StoreState } from "./../Index";
import Link from "redux-first-router-link";

export const Dashboard = (currentQueue: QueueDTO) => {
	return <div>
		<div className="col-md-3" >BEWT: {currentQueue.bewt}</div>
		<div className="col-md-3" >Current Balance: {currentQueue.machineBalance}</div>
		<ul>
			{currentQueue.internalQueue.map(task =>
				<li className='list-group-item'  >
					taskID: {task.taskId}<br />
					Customer: {task.customer.name}<br />
					Job: {task.job.name}<br />
					TimePrice: {task.timePrice} <br />
					Went on Queue: {task.timeEnqueued}<br />
					Balance: {task.Balance}<br />
					jobId: {task.job.jobId}
				</li>)
			}
		</ul>
	</div >;
}
