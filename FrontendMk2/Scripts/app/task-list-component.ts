import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import "./rxjs-operators";

import { Customer, Task, Job } from "./model";
import { QueueService } from "./queue-service";
import { UserService } from "./user-service";

@Component({
    selector: 'task-listing',
    template: `<div>
    <h2>Full Task List</h2>
<ul>
<li *ngFor='let task of taskList' (click)='viewDetail(customer)'>
Name: {{task.customer.name}}<br/>
job Name: {{task.job.name}}<br/>
Customer Notes: {{task.customerNotes}}
<br/> Status: {{task.taskStatus}}
<br/> Balance: {{task.balance}}
</li>
</ul>`,
    providers: [QueueService]
})
export class TaskListComponent {
    taskList: Task[];
    errorMessage: string;
    mode = 'Observable';

    constructor(
        private queueService: QueueService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.queueService.getTasks().then(
            tasks => this.taskList = tasks,
            error => this.errorMessage = <any>error);
    }

    goBack(): void {
        this.location.back();
    }
}