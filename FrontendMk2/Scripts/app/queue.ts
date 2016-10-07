import { Component, OnInit } from '@angular/core';
import { MyModel, Task, Job, Customer } from "./model";
import "./rxjs.operator"
import { QueueService } from "./queue-service"


@Component({
    selector: `my-app`,
    template: `<div>Hello from {{getCompiler()}} 
<span *ngFor='let task of queueList'>{{task.authID}}</span>
</div>`,
    providers: [QueueService]
})
export class MyApp implements OnInit {
    constructor(private queueService: QueueService) { }
    model = new MyModel();
    queueList: Task[];
    errorMessage: string;
    mode = 'Observable';

    ngOnInit() { this.getQueue(); }

    getCompiler(): string {
        return this.model.compiler;
    }
    getQueue() {
        this.queueService.getHeroes().then(
            heroes => this.queueList = heroes,
            error => this.errorMessage = <any>error);
    }
};