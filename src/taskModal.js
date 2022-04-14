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
    `

    return modalContainer
  })();

  // <div class="task-modal-btns-container">
  //   <button id="go-back" type="button" class="task-modal-btn back">Go back</button>
  //   <button id="edit-task" type="button" class="task-modal-btn edit">Edit Task</button>
  //   <button id="delete-task" type="button" class="task-modal-btn delete">Delete Task</button> 
  // </div>

  const taskModalBtns = (() => {
    const container = document.createElement('div');
    container.setAttribute('class', 'task-modal-btns-container');

    container.innerHTML = `
      <button id="go-back" type="button" class="task-modal-btn back">Go back</button>
      <button id="edit-task" type="button" class="task-modal-btn edit">Edit Task</button>
      <button id="delete-task" type="button" class="task-modal-btn delete">Delete Task</button> 
    `

    return container
  })()

  const editFormBtns = (() => {
    const container = document.createElement('div');
    container.setAttribute('class', 'task-modal-btns-container');

    container.innerHTML = `
      <button id="submit-edit-btn" type="button" class="task-modal-btn submit">Submit Changes</button>
      <button id="cancel-edit" type="button" class="task-modal-btn cancel-edit">Cancel Edit</button>
    `

    return container
  })()

  const taskDescription = taskModal.querySelector('#task-description');
  const taskDeadline = taskModal.querySelector('#task-deadline');
  const taskStatus = taskModal.querySelector('#task-status');
  const taskPriority = taskModal.querySelector('#task-priority');
  const taskNotes = taskModal.querySelector('#task-notes');

  const populateTaskModal = ({description, deadline, priority, isComplete, notes, id}) => {
    taskDescription.value = description;
    taskDeadline.value = deadline;
    taskStatus.value = isComplete;
    taskPriority.value = priority;
    taskNotes.textContent = notes;
    taskModal.setAttribute('data-task-id', id)
    taskModal.appendChild(taskModalBtns);

    toggleModalVisibility();
  }

  const toggleInputDisabledState = () => {
    taskModal.querySelectorAll('input').forEach(input => input.disabled = !input.disabled);
    taskStatus.disabled = !taskStatus.disabled;
    taskPriority.disabled = !taskPriority.disabled;
    taskNotes.disabled = !taskNotes.disabled;
    taskDescription.classList.toggle('full-length');
  }

  const activateEditForm = () => {
    toggleInputDisabledState();
    taskDescription.focus()

    taskModal.removeChild(taskModalBtns);
    taskModal.appendChild(editFormBtns);
  }

  const deactivateEditForm = () => {
    toggleInputDisabledState();
    taskDescription.blur()

    taskModal.removeChild(editFormBtns);
    taskModal.appendChild(taskModalBtns);
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

  taskModalBtns.querySelector('#go-back').addEventListener('click', toggleModalVisibility);
  taskModalBtns.querySelector('#edit-task').addEventListener('click', activateEditForm);
  taskModalBtns.querySelector('#delete-task').addEventListener('click', deleteTask);

  editFormBtns.querySelector('#cancel-edit').addEventListener('click', deactivateEditForm)

  return {
    insertTaskModal
  }

})();