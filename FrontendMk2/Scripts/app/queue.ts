import { Component } from "angular2/core"
import { MyModel } from "./model"

@Component({
    selector: `my-app`,
    template: `<div>Hello from </div>`
})
class MyApp {
    model = new MyModel();
    getCompiler() {
        return this.model.compiler;
    }
}