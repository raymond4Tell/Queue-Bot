import { Task } from "./types/Model";

class JobQueueApi {
    static getAllJobs() {
        return fetch('api/Queue/Jobs').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static create(task: Task): void {
        fetch('api/Queue/Tasks', {
            method: "POST", body: JSON.stringify(task)
        }).then(response => {
                return response.json();
            }).catch(error => {
                return error;
            });
    }
}

export default JobQueueApi;  