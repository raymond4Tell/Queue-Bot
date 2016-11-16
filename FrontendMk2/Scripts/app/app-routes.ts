import { RouterModule, provideRoutes, Routes } from '@angular/router';
import { Dashboard } from "./queue";
import { TaskDetailComponent } from "./task-detail-component";
import { AddTaskComponent } from "./add-task-component";
import { LoginComponent } from "./login-component";
import { CustomerListComponent } from "./customer-component";

export const possibleRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'customers', component: CustomerListComponent },
    { path: 'detail/:id', component: TaskDetailComponent },
    { path: 'newTask', component: AddTaskComponent },
    { path: 'login', component: LoginComponent }
];

export const appRouterProviders = [
    provideRoutes(possibleRoutes)
];