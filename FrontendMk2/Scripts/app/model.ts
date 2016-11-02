/**
 * Primary model classes; derived from the classes in JobQueue.cs.
 */
export class Task {
    authId: string;
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
    authId: string;
    name: string;
}
export class Job {
    jobId: number;
    length: TimeRanges;
    name: String;
}