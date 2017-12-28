import * as QBot from "../../types/Model";

function isTaskActive(task: QBot.Task) {
    return task.taskStatus == 0;
}

export { isTaskActive };