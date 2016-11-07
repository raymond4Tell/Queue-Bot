import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';

import { Dashboard } from './queue';
import { QueueService } from "./queue-service";
import { UserService } from "./user-service";
import { LoginComponent } from "./login-component";
import { possibleRoutes, appRouterProviders } from "./app-routes";


@Component({
    selector: 'my-app',
    template: ` <h1>{{title}}</h1><nav>
    <a routerLink="/dashboard" routerLinkActive="active" >Dashboard</a>
    <a routerLink="/newTask" routerLinkActive="active" >Create New Task</a>
     </nav>
<router-outlet></router-outlet>`
})
export class AppComponent { title = "Queue Listing"; }