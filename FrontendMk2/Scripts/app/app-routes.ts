import { RouterModule, provideRoutes, Routes } from '@angular/router';
import { MyApp } from "./queue";
import { TaskDetailComponent } from "./task-detail-component";
import { LoginComponent } from "./login-component";
//import { AppComponent } from "./app-component";

export const possibleRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: MyApp },
    { path: 'detail/:id', component: TaskDetailComponent },
    { path: 'login', component: LoginComponent }
];

export const appRouterProviders = [
    provideRoutes(possibleRoutes)
];