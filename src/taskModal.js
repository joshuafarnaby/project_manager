import { pubsub } from "./pubsub";

export const taskModalModule = (() => {
  // const taskModal = (() => {
  //   const modalContainer = document.createElement('div');
  //   modalContainer.setAttribute('class', 'modal-container task-modal');

  //   modalContainer.innerHTML = `
  //     <h2 id="task-description"></h2>
  //     <p id="task-deadline"></p>
  //     <p id="task-status"></p>
  //     <p id="task-priority"></p>
  //     <p>Notes:</p>
  //     <div class="notes">
  //       <p id="task-notes"></p>
  //     </div>
  //     <div class="task-modal-btns-container">
  //       <button id="go-back" class="task-modal-btn back">Go back</button>
  //       <button id="edit-task" class="task-modal-btn edit">Edit Task</button>
  //       <button id="delete-task" class="task-modal-btn delete">Delete Task</button>
  //     </div>
  //   `

  //   return modalContainer
  // })();

  const taskModal = (() => {
    const modalContainer = document.createElement('form');
    modalContainer.setAttribute('class', 'modal-container task-modal edit-task');

    modalContainer.innerHTML = `
      <p>
        <label for="task-description" class="label large">Task:</label>
        <input type="text" name="task-description" id="task-description" class="edit-task-control" disabled>
      </p>
      <p>
        <label for="task-deadline" class="label large">Deadline:</label>
        <input type="time" name="task-deadline" id="task-deadline" class="edit-task-control" disabled>
      </p>
      <p>
        <label for="task-status" class="label large">Status:</label>
        <select name="isComplete" id="task-status" class="edit-task-control" disabled>
          <option value="true">Complete</option>
          <option value="false">Incomplete</option>
        </select>
      </p>
      <p>
        <label for="task-priority">Priority:</label>
        <select name="priority" id="task-priority" class="edit-task-control" disabled> 
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </p>
      <p class="column">
        <label for="task-notes">Notes:</label>
        <textarea name="notes" id="task-notes" class="new-task-control" disabled></textarea>
      </p>
      <div class="task-modal-btns-container">
        <button id="go-back" type="button" class="task-modal-btn back">Go back</button>
        <button id="edit-task" type="button" class="task-modal-btn edit">Edit Task</button>
        <button id="delete-task" type="button" class="task-modal-btn delete">Delete Task</button>
      </div>
    `

    return modalContainer
  })();

  const taskDescription = taskModal.querySelector('#task-description');
  const taskDeadline = taskModal.querySelector('#task-deadline');
  const taskStatus = taskModal.querySelector('#task-status');
  const taskPriority = taskModal.querySelector('#task-priority');
  const taskNotes = taskModal.querySelector('#task-notes');

  const capitalise = (word) => word.substring(0, 1).toUpperCase() + word.substring(1);

  const populateTaskModal = ({description, deadline, priority, isComplete, notes, id}) => {
    // taskDescription.textContent = description;
    taskDescription.value = description;
    taskDeadline.value = deadline;
    // taskStatus.textContent = `Status: ${isComplete ? 'Complete' : 'Incomplete'}`;
    taskStatus.value = isComplete;
    // taskPriority.textContent = `Priority: ${capitalise(priority)}`;
    taskPriority.value = priority;
    taskNotes.textContent = notes;
    taskModal.setAttribute('data-task-id', id)

    toggleModalVisibility();
  }

  const activateEditForm = () => {
    taskModal.querySelectorAll('input').forEach(input => input.disabled = false);
    taskStatus.disabled = false;
    taskPriority.disabled = false;
    taskNotes.disabled = false;

    taskDescription.classList.toggle('full-length')
    taskDescription.focus()
  }

  const deleteTask = () => {
    pubsub.publish('deleteTaskBtnClicked', {
      projectID: document.querySelector('ul#list').getAttribute('data-project-id'),
      taskID: taskModal.getAttribute('data-task-id')
    });

    toggleModalVisibility();
  }

  const toggleModalVisibility = () => {
    document.querySelector('#modal-overlay').classList.toggle('active');
    taskModal.classList.toggle('active');
  }

  const insertTaskModal = () => document.querySelector('.wrapper').appendChild(taskModal)

  pubsub.subscribe('taskItemRetrieved', populateTaskModal);

  taskModal.querySelector('#go-back').addEventListener('click', toggleModalVisibility);
  taskModal.querySelector('#edit-task').addEventListener('click', activateEditForm);
  taskModal.querySelector('#delete-task').addEventListener('click', deleteTask);

  return {
    insertTaskModal
  }

})();