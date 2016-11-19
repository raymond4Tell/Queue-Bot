//TODO: Get this hooked into AuthGuard, so you can only edit a task if you're an admin or owner of that task.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import "./rxjs-operators";

import { Task, Job } from "./model";
import { QueueService } from "./queue-service";

@Component({
    selector: 'my-task-detail',
    template: `<div *ngIf="task">
    <h2>{{task.customer.name}} / {{task.job.name }}</h2>
<form>
       <label>id: {{task.authID}}</label>
<div class='form-group row'>
<div class='col-md-2' *ngFor='let job of jobList' >
<label >
Name: {{job.name}}<br/>
jobId: {{job.length}}
<input type="radio" [value]="job.jobId" [(ngModel)]="task.jobId" name='jobId' />
</label></div>
</div>
<div class='form-group'>
    <label>Time Value: 
    <input [(ngModel)]='task.timePrice' placeholder= "5" name='timePrice' class='form-control' /></label></div>
    <button (click)="goBack()"> Back </button>
  <button (click)="save()">Save</button></form>
    </div>`,
})
export class TaskDetailComponent implements OnInit {
    task: Task;
    jobList: Job[];
    errorMessage: string;

    constructor(
        private queueService: QueueService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id: string = params['id'];
            this.queueService.getTask(id)
                .then(
                task => this.task = task
                );
        });

        this.queueService.getJobs().then(
            jobs => this.jobList = jobs,
            error => this.errorMessage = <any>error);
    }

    save(): void {
        this.task.job = this.jobList.find(value => value.jobId == this.task.jobId);
        this.queueService.update(this.task)
            .then(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}