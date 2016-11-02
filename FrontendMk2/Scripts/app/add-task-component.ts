import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import "./rxjs-operators";

import { Customer, Task, Job } from "./model";
import { QueueService } from "./queue-service";
import { UserService } from "./user-service";
// AddCustomer(Customer customer, Job job, double timeValue)
@Component({
    selector: 'add-task-form',
    template: `<div>
    <h2>New Task</h2>
<h3>Select a service</h3>

<label *ngFor='let job of jobList' >
Name: {{job.name}}<br/>
jobId: {{job.length}}
<input type="radio" value={{job.jobId}} [(ngModel)]="task.jobId" />
</label>
    <h3>Enter your Customer data</h3>    <label>Customer name: 
<input type="text" [(ngModel)]="task.customer.name" />
</label>
    <label>Customer AuthID: 
<input type="text" [(ngModel)]="task.customer.authId" />
</label>
    <label>Customer name: 
<input type="number" [(ngModel)]="task.timePrice" />
</label>
<button (click)="goBack()"> Back </button>
  <button (click)="save()">Save</button>
    </div>`,
})
export class AddTaskComponent {
    task: Task;
    jobList: Job[];
    errorMessage: string;

    constructor(
        private queueService: QueueService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.task = new Task();
        this.task.customer = new Customer();
        this.task.job = new Job();
        this.task.authId = sessionStorage.getItem('auth_token');

        this.queueService.getJobs().then(
            jobs => this.jobList = jobs,
            error => this.errorMessage = <any>error);
    }

    save(): void {
        this.queueService.create(this.task);
        //this.goBack();
    }

    goBack(): void {
        this.location.back();
    }
}