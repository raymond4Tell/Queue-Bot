import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';

import { QueueService } from "./queue-service";
import { UserService } from "./user-service";
import { AppComponent } from "./app-component";
import { LoginComponent } from "./login-component";
import { possibleRoutes, appRouterProviders } from "./app-routes";
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        RouterModule.forRoot(possibleRoutes)
    ],
    declarations: [AppComponent, LoginComponent],
    providers: [appRouterProviders, QueueService, UserService],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
