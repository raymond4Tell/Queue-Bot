import { Task } from "./types/Model";

class JobQueueApi {
    static getAllJobs() {
        return fetch('api/Queue/Jobs').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static createTask(task: Task) {
      return  fetch('api/Queue/Tasks', {
          method: "POST",
          body: JSON.stringify(task),
          headers: {"Content-Type": "application/json"}
        }).then(response => {
                return response.json();
            }).catch(error => {
                return error;
            });
    }
}

export default JobQueueApi;  