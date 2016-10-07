System.register(['@angular/core', "./model", "./rxjs.operator", "./queue-service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, model_1, queue_service_1;
    var MyApp;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (_1) {},
            function (queue_service_1_1) {
                queue_service_1 = queue_service_1_1;
            }],
        execute: function() {
            MyApp = (function () {
                function MyApp(queueService) {
                    this.queueService = queueService;
                    this.model = new model_1.MyModel();
                    this.mode = 'Observable';
                }
                MyApp.prototype.ngOnInit = function () { this.getQueue(); };
                MyApp.prototype.getCompiler = function () {
                    return this.model.compiler;
                };
                MyApp.prototype.getQueue = function () {
                    var _this = this;
                    this.queueService.getHeroes().then(function (heroes) { return _this.queueList = heroes; }, function (error) { return _this.errorMessage = error; });
                };
                MyApp = __decorate([
                    core_1.Component({
                        selector: "my-app",
                        template: "<div>Hello from {{getCompiler()}} \n<span *ngFor='let task of queueList'>{{task.authID}}</span>\n</div>",
                        providers: [queue_service_1.QueueService]
                    }), 
                    __metadata('design:paramtypes', [queue_service_1.QueueService])
                ], MyApp);
                return MyApp;
            }());
            exports_1("MyApp", MyApp);
            ;
        }
    }
});
//# sourceMappingURL=queue.js.map