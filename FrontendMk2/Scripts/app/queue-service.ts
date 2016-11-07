import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import './rxjs-operators';
import { Task, Job, QueueDTO, Customer } from "./model"

@Injectable()
export class QueueService {
    private taskUrl = 'api/Queue/Tasks';
    private jobUrl = 'api/Queue/Jobs';
    private dashUrl = 'api/Queue/Queue';

    private headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("auth_token")
    });

    constructor(private http: Http) { }

    getTasks(): Promise<Task[]> {
        return this.http.get(this.taskUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getJobs(): Promise<Job[]> {
        return this.http.get(this.jobUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getTask(id: string): Promise<Task> {
        const url = `${this.taskUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getQueueStatus(): Promise<QueueDTO> {
        return this.http.get(this.dashUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    update(task: Task): Promise<Task> {
        const url = `${this.taskUrl}/${task.taskId}`;
        return this.http
            .put(url, JSON.stringify(task), { headers: this.headers })
            .toPromise()
            .then(() => task)
            .catch(this.handleError);
    }

    create(task: Task): void {
        this.http.post(this.taskUrl, JSON.stringify(task), { headers: this.headers }).toPromise()
            .then(this.extractData)
            .catch(this.handleError);

    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}