import { pubsub } from "./pubsub";

export const taskModalModule = (() => {
  const taskModal = (() => {
    const modalContainer = document.createElement('div');
    modalContainer.setAttribute('class', 'modal-container task-modal');

    modalContainer.innerHTML = `
      <h2 id="task-description"></h2>
      <p id="task-deadline"></p>
      <p id="task-status"></p>
      <p id="task-priority"></p>
      <p>Notes:</p>
      <div class="notes">
        <p id="task-notes"></p>
      </div>
      <div class="task-modal-btns-container">
        <button id="go-back" class="task-modal-btn back">Go back</button>
        <button id="edit-task" class="task-modal-btn edit">Edit Task</button>
        <button id="delete-task" class="task-modal-btn delete">Delete Task</button>
      </div>
    `

    return modalContainer
  })();

  const taskDescription = taskModal.querySelector('#task-description');
  const taskDeadline = taskModal.querySelector('#task-deadline');
  const taskStatus = taskModal.querySelector('#task-status');
  const taskPriority = taskModal.querySelector('#task-priority');
  const taskNotes = taskModal.querySelector('#task-notes');

  const capitalise = (word) => {
    return word.substring(0, 1).toUpperCase() + word.substring(1)
  }

  const populateTaskModal = ({description, deadline, priority, isComplete, notes}) => {
    taskDescription.textContent = description;
    taskDeadline.textContent = `Deadline: ${deadline}`;
    taskStatus.textContent = `Status: ${isComplete ? 'Complete' : 'Incomplete'}`;
    taskPriority.textContent = `Priority: ${capitalise(priority)}`;
    taskNotes.textContent = notes;

    toggleModalVisibility();
  }

  const deleteTask = (ev) => {
    pubsub.publish('deleteTaskBtnClicked', taskDescription.textContent);

    toggleModalVisibility();
  }

  const toggleModalVisibility = () => {
    document.querySelector('#modal-overlay').classList.toggle('active');
    taskModal.classList.toggle('active');
  }

  const insertTaskModal = () => document.querySelector('.wrapper').appendChild(taskModal)

  pubsub.subscribe('taskItemClicked', populateTaskModal);

  taskModal.querySelector('#go-back').addEventListener('click', toggleModalVisibility);
  taskModal.querySelector('#delete-task').addEventListener('click', deleteTask);

  return {
    insertTaskModal
  }

})();