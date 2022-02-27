import dragula from "dragula";

import { Status, statusMap, Task } from "./Task";
import { TaskCollection } from "./TaskCollection";

export class TaskRenderer {
  constructor(
    private readonly todoList: HTMLElement,
    private readonly doingList: HTMLElement,
    private readonly doneList: HTMLElement
  ) {}

  append(task: Task) {
    const { taskEl, deleteButtonEl } = this.render(task);

    this.todoList.append(taskEl);

    return { deleteButtonEl };
  }
  remove(task: Task) {
    const taskEl = document.getElementById(task.id);
    if (!taskEl) return;

    if (task.status === statusMap.todo) {
      this.todoList.removeChild(taskEl);
    }

    if (task.status === statusMap.doing) {
      this.doingList.removeChild(taskEl);
    }

    if (task.status === statusMap.done) {
      this.doneList.removeChild(taskEl);
    }
  }
  subscribeDragAndDrop(
    onDrop: (el: Element, sibling: Element | null, sewStatus: Status) => void
  ) {
    dragula([this.todoList, this.doingList, this.doneList]).on(
      "drop",
      (el, target, _source, sibling) => {
        let newStatus: Status = statusMap.todo;

        if (target.id === "doingList") newStatus = statusMap.doing;
        if (target.id === "doneList") newStatus = statusMap.done;

        onDrop(el, sibling, newStatus);
      }
    );
  }
  getId(el: Element) {
    return el.id;
  }
  private render(task: Task) {
    const taskEl = document.createElement("div");
    const spanEl = document.createElement("span");
    const deleteButtonEl = document.createElement("button");

    taskEl.id = task.id;
    taskEl.classList.add("task-item");

    spanEl.textContent = task.title;
    deleteButtonEl.textContent = "削除";

    taskEl.append(spanEl, deleteButtonEl);

    return { taskEl, deleteButtonEl };
  }

  // 各statusのリストに対してrenderListを呼び出して画面描画
  renderAll(taskColleciotn: TaskCollection) {
    const todoTasks = this.renderList(
      taskColleciotn.filter(statusMap.todo),
      this.todoList
    );
    const doingTasks = this.renderList(
      taskColleciotn.filter(statusMap.doing),
      this.doingList
    );
    const doneTasks = this.renderList(
      taskColleciotn.filter(statusMap.doing),
      this.doneList
    );

    return [...todoTasks, ...doingTasks, ...doneTasks];
  }

  // 渡されたtasksのHTML要素を生成
  private renderList(tasks: Task[], listEl: HTMLElement) {
    if (tasks.length === 0) return [];

    const taskList: Array<{
      task: Task;
      deleteButtonEl: HTMLButtonElement;
    }> = [];

    tasks.forEach((task) => {
      const { taskEl, deleteButtonEl } = this.render(task);
      listEl.append(taskEl);
      taskList.push({ task, deleteButtonEl });
    });

    return taskList;
  }
}
