import * as QBot from "../../types/Model";

// Look into using https://github.com/reactjs/reselect to simplify some of this.
const getActiveTasks = (tasks: QBot.Task[]): QBot.Task[] => (tasks.filter(task => task.taskStatus == 0));
const getSortedTasks = (tasks: QBot.Task[]): QBot.Task[] => tasks.sort((taskA, taskB) => taskA.timeEnqueued - taskB.timeEnqueued);

// compose them together into a single selector
export const getActiveSortedTasks = state => getSortedTasks(getActiveTasks(state.tasks));