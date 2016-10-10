import { AppComponent } from "./app-component";
import { MyApp } from "./queue";
import { AppModule } from "./app-module";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);