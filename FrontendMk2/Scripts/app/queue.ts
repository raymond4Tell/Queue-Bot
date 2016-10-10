import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, Job, Customer } from "./model";
import "./rxjs-operators";
import { QueueService } from "./queue-service"


@Component({
    selector: 'queue-listing',
    template: `<ul>
<li *ngFor='let task of queueList' (click)='viewDetail(task)'>
taskID: {{task.taskId}}<br/>
Customer: {{task.customer.name}}<br/>
jobId: {{task.job.jobId}}
</li>
</ul>`,
    providers: [QueueService]
})
export class MyApp implements OnInit {
    constructor(
        private router: Router,
        private queueService: QueueService) { }
    queueList: Task[];
    errorMessage: string;
    mode = 'Observable';

    ngOnInit() { this.getQueue(); }

    getQueue() {
        this.queueService.getHeroes().then(
            heroes => this.queueList = heroes,
            error => this.errorMessage = <any>error);
    }
    viewDetail(task: Task): void {
        let link = ['/detail', task.taskId];
        this.router.navigate(link);
    }
};