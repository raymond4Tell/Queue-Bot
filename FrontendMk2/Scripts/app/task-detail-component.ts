import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import "./rxjs-operators";

import { Task } from "./model";
import { QueueService } from "./queue-service";

@Component({
    selector: 'my-task-detail',
    template: `<div *ngIf="task">
    <h2> {{task.job.name }} details! </h2>
    <div>    <label>id: </label>{{task.taskId}}</div>
    <div>
    <label>name: </label>
    <input [(ngModel)]='task.authID' placeholder= "name" />
    </div>
    <button (click)="goBack()"> Back </button>
    </div>`,
})
export class TaskDetailComponent implements OnInit {
    task: Task;

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
    }

    //save(): void {
    //    this.queueService.update(this.task)
    //        .then(() => this.goBack());
    //}

    goBack(): void {
        this.location.back();
    }
}