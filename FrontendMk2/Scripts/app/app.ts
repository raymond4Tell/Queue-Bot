import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from '@angular/http';

import { MyApp } from './queue';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule
    ],
    declarations: [MyApp],
    bootstrap: [MyApp]
})
export class AppModule { }
