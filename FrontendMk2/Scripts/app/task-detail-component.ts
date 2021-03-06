﻿//TODO: Get this hooked into AuthGuard, so you can only edit a task if you're an admin or owner of that task.
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
<div class='col-md-3'>
<label >
<select  [(ngModel)]="selectedJob" name="job">
<option *ngFor='let job of jobList' [ngValue]="job">
{{job.name}}
</option></select>
{{selectedJob.description}}
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
    //Only needed because the select list above can't work on task.job directly. :(
    selectedJob: Job;
    errorMessage: string;

    constructor(
        private queueService: QueueService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.selectedJob = new Job();
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id: string = params['id'];
            this.queueService.getTask(id)
                .then(
                task => { this.task = task; },
                error => this.errorMessage = <any>error
                );
        });

        this.queueService.getJobs().then(
            jobs => { this.jobList = jobs; this.selectedJob = jobs[2]; },
            error => this.errorMessage = <any>error);
    }

    save(): void {
        this.task.job = this.selectedJob;
        this.task.jobId = this.selectedJob.jobId;
        this.queueService.update(this.task)
            .then(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}