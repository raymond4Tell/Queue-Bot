/**
 * Primary model classes; derived from the classes in JobQueue.cs.
 */
export class Task {
    authID: string;
    taskId: string;
    waitTime: TimeRanges;
    customer: Customer;
    deposit: number;
    job: Job;
    jobId: number;
    timeEnqueued: Date;
    timeOfExpectedService: Date;
    timePrice: number;
}
export class Customer {
    authID: string;
    name: string;
}
export class Job {
    jobId: number;
    length: TimeRanges;
    name: String;
}