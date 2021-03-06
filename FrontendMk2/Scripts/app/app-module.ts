﻿import './rxjs-operators';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';

import { Dashboard } from './queue';
import { QueueService } from "./queue-service";
import { UserService } from "./user-service";
import { LoginComponent } from "./login-component";
import { CustomerListComponent } from "./customer-component";
import { TaskListComponent } from "./task-list-component";
import { possibleRoutes, appRouterProviders } from "./app-routes";
import { AppComponent } from "./app-component";
import { TaskDetailComponent } from "./task-detail-component";
import { AddTaskComponent } from "./add-task-component";
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        MomentModule,
        RouterModule.forRoot(possibleRoutes)
    ],
    declarations: [Dashboard, LoginComponent, AppComponent, TaskDetailComponent, AddTaskComponent, CustomerListComponent, TaskListComponent],
    providers: [QueueService, UserService],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }