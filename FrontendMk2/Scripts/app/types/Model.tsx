import * as Moment from "moment";
export class Task {
	authId: string;
	taskId: string;
	waitTime: Moment.Duration;
	customer: Customer;
	deposit: number;
	timePrice: number;
	balance: number;
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

export const emptyTask: Task = {
    customer: {
        name: "",
        authId: "",
        requestedJobs: []
    },
    authId: "",
    taskId: "",
    waitTime: Moment.duration({ hours: 0 }),
    job: {
        name: "",
        jobId: 1,
        length: Moment.duration({ hours: 0 }),
        description: ""
    },
    deposit: 0,
    timePrice: 0,
    balance: 0,
    jobId: 1,
    timeEnqueued: 0,
    timeOfExpectedService: 0,
    taskStatus: 0,
    customerNotes: "",
    adminNotes: "",

}