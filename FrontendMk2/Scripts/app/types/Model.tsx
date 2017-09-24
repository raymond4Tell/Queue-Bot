import * as Moment from "moment";
export class Task {
	authId: string;
	taskId: string;
	waitTime: Moment.Duration;
	customer: Customer;
	deposit: number;
	timePrice: number;
	Balance: number;
	job: Job;
	jobId: number;
	timeEnqueued: number;
	timeOfExpectedService: number;
	taskStatus: number;
	customerNotes: string;
	adminNotes: string;
}
export class Customer {
	authId: string;
	name: string;
	requestedJobs: Task[];
}
export class Job {
	jobId: number;
	length: Moment.Duration;
	name: String;
	description: String;
}

export class QueueDTO {
	machineBalance: number;
	bewt: Moment.Duration;
	internalQueue: Task[];
}