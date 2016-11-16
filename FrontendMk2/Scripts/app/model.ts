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
    requestedJobs: Task[];
}
export class Job {
    jobId: number;
    length: TimeRanges;
    name: String;
}

export class QueueDTO {
    machineBalance: number;
    bewt: TimeRanges;
    internalQueue: Task[];
}