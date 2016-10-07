export class MyModel {
    compiler = "TypeScript";
}

export class Task {
    AuthID: string;
    TaskId: number;
    WaitTime: TimeRanges;
    customer: Customer;
    deposit: number;
    job: Job;
    jobId: number;
    timeEnqueued: Date;
    timeOfExpectedService: Date;
    timePrice: number;
}
export class Customer {
    AuthID: string;
    Name: string;
}
export class Job {
    JobId: number;
    Length: TimeRanges;
    Name: String;
}