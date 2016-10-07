System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MyModel, Task, Customer, Job;
    return {
        setters:[],
        execute: function() {
            MyModel = (function () {
                function MyModel() {
                    this.compiler = "TypeScript";
                }
                return MyModel;
            }());
            exports_1("MyModel", MyModel);
            Task = (function () {
                function Task() {
                }
                return Task;
            }());
            exports_1("Task", Task);
            Customer = (function () {
                function Customer() {
                }
                return Customer;
            }());
            exports_1("Customer", Customer);
            Job = (function () {
                function Job() {
                }
                return Job;
            }());
            exports_1("Job", Job);
        }
    }
});
//# sourceMappingURL=model.js.map