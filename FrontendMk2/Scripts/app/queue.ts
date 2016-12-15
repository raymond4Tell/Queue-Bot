import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, QueueDTO } from "./model";
import "./rxjs-operators";
import { QueueService } from "./queue-service"


@Component({
    selector: 'queue-listing',
    template: `<div class="row" *ngIf="dashStatus">
<div class="col-md-3" >BEWT: {{dashStatus.bewt |amDuration:"hours"}}</div>
<div class="col-md-3" >Current Balance: {{dashStatus.machineBalance | currency:"USD":true }}</div>
</div>
<ul>
<li *ngFor='let task of queueList' (click)='viewDetail(task)'>
taskID: {{task.taskId}}<br/>
Customer: {{task.customer.name}}<br/>
Job: {{task.job.name}}<br/>
TimePrice: {{task.timePrice}} <br/>
Went on Queue: {{task.timeEnqueued | amDateFormat:"LTS" }}<br/>
Balance: {{task.balance| currency:"USD":true }}<br/>
jobId: {{task.job.jobId}}
</li>
</ul>`,
    providers: [QueueService]
})
export class Dashboard implements OnInit {
    constructor(private router: Router,
        private queueService: QueueService) { }

    queueList: Task[];
    dashStatus: QueueDTO;
    errorMessage: string;
    mode = 'Observable';

    ngOnInit() {
        this.queueService.getTasks().then(
            tasks => this.queueList = tasks,
            error => this.errorMessage = <any>error);

        this.queueService.getQueueStatus().then(
            result => this.dashStatus = result,
            error => this.errorMessage = <any>error);
    }

    viewDetail(task: Task): void {
        let link = ['/detail', task.taskId];
        this.router.navigate(link);
    }
};