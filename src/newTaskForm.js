import { pubsub } from "./pubsub";

export const newTaskForm = (() => {
  const newTaskForm = (() => {
    const container = document.createElement('li');
    container.classList.add('task-form-container');
    container.innerHTML = `
      <form action="#" method="post" class="new-task-form">
        <p class="description-container">
          <label for="description">Task:</label>
          <input type="text" name="description" id="description" class="new-task-control">
        </p>
        <p class="deadline-container">
          <label for="deadline">Deadline:</label>
          <input type="time" name="deadline" id="deadline" class="new-task-control">
        </p>
        <p class="priority-container">
          <label for="priority">Priority:</label>
          <select name="priority" id="priority" class="new-task-control">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </p>
        <p class="notes-container">
          <label for="notes">Notes:</label>
          <textarea name="notes" id="notes" class="new-task-control"></textarea>
       </p>
        <button type="submit" id="add-task" class="form-btn add">Add</button>
        <button type="button" id="cancel" class="form-btn cancel">Cancel</button>
      </form>
    `

    return container
  })();

  const hideNewTaskForm = (ev) => {
    newTaskForm.querySelectorAll('.new-task-control').forEach(control => control.value = '');

    ev.target.closest('#list').removeChild(newTaskForm);
  };

  const addNewTask = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target.closest('form'));
    const formDataObj = {};

    for (let entry of formData.entries()) {
      // rudimentary form validation - will be fleshed out
      if (!entry[1]) return

      formDataObj[entry[0]] = entry[1];
    }

    pubsub.publish('newTaskFormSubmitted', formDataObj);

    hideNewTaskForm(ev);
  }

  const render = (newTaskBtn) => newTaskBtn.parentElement.insertBefore(newTaskForm, newTaskBtn);

  pubsub.subscribe('newTaskBtnClicked', render);

  newTaskForm.querySelector('#cancel').addEventListener('click', hideNewTaskForm);
  newTaskForm.querySelector('#add-task').addEventListener('click', addNewTask)

  return {
    render
  }
})();