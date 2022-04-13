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

  const capitalise = (word) => {
    return word.substring(0, 1).toUpperCase() + word.substring(1)
  }

  const populateTaskModal = ({description, deadline, priority, isComplete, notes}) => {
    taskModal.querySelector('#task-description').textContent = description;
    taskModal.querySelector('#task-deadline').textContent = `Deadline: ${deadline}`;
    taskModal.querySelector('#task-status').textContent = `Status: ${isComplete ? 'Complete' : 'Incomplete'}`;
    taskModal.querySelector('#task-priority').textContent = `Priority: ${capitalise(priority)}`;
    taskModal.querySelector('#task-notes').textContent = notes;

    toggleModalVisibility();
  }

  const toggleModalVisibility = () => {
    document.querySelector('#modal-overlay').classList.toggle('active');
    taskModal.classList.toggle('active');
  }

  const insertTaskModal = () => document.querySelector('.wrapper').appendChild(taskModal)

  pubsub.subscribe('taskItemClicked', populateTaskModal);

  taskModal.querySelector('#go-back').addEventListener('click', toggleModalVisibility);

  return {
    insertTaskModal
  }

})();