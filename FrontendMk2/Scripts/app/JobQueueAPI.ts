import { Task } from "./types/Model";

class JobQueueApi {
    private static taskUrl = 'api/Queue/Tasks';
    private static jobUrl = 'api/Queue/Jobs';
    private static customerUrl = 'api/Queue/Customers';
    private static dashUrl = 'api/Queue/Queue';
    private static headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("auth_token")
    });

    static getAllJobs() {
        return fetch(this.jobUrl).then(response => response.json()
        ).catch(error => error);
    }

    static createTask(task: Task) {
        return fetch(this.taskUrl, {
            method: "POST",
            body: JSON.stringify(task),
            headers: this.headers
        })
            .then(response => response.json())
            .catch(error => error);
    }
    
    static getallTasks() {
        return fetch(this.taskUrl)
            .then(response => response.json())
            .catch(error => error);
    }

    static getCustomers() {
        return fetch(this.customerUrl)
            .then(response => response.json())
            .catch(error => error);
    }

    static getTask(id: string) {
        const url = `${this.taskUrl}/${id}`;
        return fetch(url)
            .then(response => response.json())
            .catch(error => error);
    }

    static getQueueStatus() {
        return fetch(this.dashUrl)
            .then(response => response.json())
            .catch(error => error);
    }

    static update(task: Task) {
        const url = `${this.taskUrl}/${task.taskId}`;
        return fetch(url, {
            method: "put",
            body: JSON.stringify(task),
            headers: this.headers
        })
            .then(response => response.json())
            .catch(error => error);
    }
}

export default JobQueueApi;  