import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import './rxjs-operators';
import { Task } from "./model"

@Injectable()
export class QueueService {
    private queueUrl = 'api/queue/';

    private headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken")
    });

    constructor(private http: Http) { }

    getHeroes(): Promise<Task[]> {
        return this.http.get(this.queueUrl)
            .toPromise()
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