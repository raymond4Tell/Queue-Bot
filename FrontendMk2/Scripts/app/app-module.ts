import './rxjs-operators';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MyApp } from './queue';
import { QueueService } from "./queue-service";
import { UserService } from "./user-service";
import { LoginComponent } from "./login-component";
import { possibleRoutes, appRouterProviders } from "./app-routes";
import { AppComponent } from "./app-component";
import { TaskDetailComponent } from "./task-detail-component";
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        RouterModule.forRoot(possibleRoutes)
    ],
    declarations: [MyApp, LoginComponent, AppComponent, TaskDetailComponent],
    providers: [QueueService, UserService],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }