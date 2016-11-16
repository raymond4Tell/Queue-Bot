import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer, Task, Job } from "./model";
import "./rxjs-operators";
import { QueueService } from "./queue-service"


@Component({
    selector: 'queue-listing',
    template: `
<ul>
<li *ngFor='let customer of customerList' (click)='viewDetail(customer)'>
Name: {{customer.name}}<br/>
jobId: {{customer.authId}}
<ul><li *ngFor='let task of customer.requestedJobs'>
{{task.job.name}}
</li></ul>
</li>
</ul>`,
    providers: [QueueService]
})
export class CustomerListComponent implements OnInit {
    constructor(private router: Router,
        private queueService: QueueService) { }

    customerList: Customer[];
    taskList: Task[]
    errorMessage: string;
    mode = 'Observable';

    ngOnInit() {
        this.queueService.getCustomers().then(
            tasks => {
                this.customerList = tasks;
                this.queueService.getTasks().then(
                    tasks => {
                        this.customerList.forEach(
                            (value) => {
                                value.requestedJobs = tasks.filter((element) => element.customer.authId == value.authId)
                            });
                    },
                    error => this.errorMessage = <any>error);
            },
            error => this.errorMessage = <any>error);
    }

    //viewDetail(task: Task): void {
    //    let link = ['/detail', task.taskId];
    //    this.router.navigate(link);
    //}
};