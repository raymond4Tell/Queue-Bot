import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import "./rxjs-operators";

import { Task } from "./model";
import { QueueService } from "./queue-service";
import { UserService } from "./user-service";

@Component({
    selector: 'add-task-form',
    template: `<div>
    <h2>{{task.customer.name}} / {{task.job.name }}</h2>
    <div>    <label>id: </label>{{task.authId}}</div>
    <div>
    <label>name: </label>
    <input #task.timePrice placeholder= "name" />
    </div>
    <button (click)="goBack()"> Back </button>
  <button (click)="save()">Save</button>
    </div>`,
})
export class AddTaskComponent {
    task: Task;

    constructor(
        private queueService: QueueService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.task = new Task();
        this.task.authID = sessionStorage.getItem('auth_token');
    }

    save(): void {
        this.queueService.update(this.task)
            .then(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}