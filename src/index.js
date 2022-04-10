import './styles/style.css'

import { sidebar } from './sidebar';
import { mainDisplay } from './mainDisplay';
import { projectsModule } from './projectsModule';
import { builderModule } from './builderModule';
import { pubsub } from './pubsub';

const controller = (() => {
  const currentTab = 'today';

  sidebar.render();
  mainDisplay.render();
})()

document.querySelectorAll('.checkbox').forEach(checkbox => {
  checkbox.addEventListener('click', (e) => {
    let parent = e.target.parentElement;

    parent.classList.toggle('complete')
  })
})

const newTaskForm = (() => {
  const newTaskFormContainer = document.createElement('li');

  newTaskFormContainer.classList.add('task-form-container');
  newTaskFormContainer.innerHTML = `
    <form action="#" method="post" class="new-task-form">
      <p class="description-container">
        <label for="description">Task:</label>
        <input type="text" name="description" id="description" class="new-task-input">
      </p>
      <p class="deadline-container">
        <label for="deadline">Deadline:</label>
        <input type="time" name="deadline" id="deadline" class="new-task-input">
      </p>
      <button type="button" id="add-task" class="form-btn add">Add</button>
      <button type="button" id="cancel" class="form-btn cancel">Cancel</button>
    </form>
  `

  // const render = (parent, target) => parent.insertBefore(newTaskFormContainer, target);

  const render = (newTaskBtn) => {
    console.log(newTaskBtn);
    const prevElement = newTaskBtn.previousElementSibling;

    // continue with this - form renders wrong, will need to change style rules

    // if (prevElement.classList.contains('task-form-container')) return

    if (!prevElement) {
      newTaskBtn.parentElement.insertBefore(newTaskFormContainer, newTaskBtn)
    }

  }
  

  pubsub.subscribe('newTaskBtnClicked', render)

  return {
    render
  }
})();



function showNewTaskForm(ev) {
  const prevElement = ev.target.previousElementSibling;

  if (prevElement.classList.contains('task-form-container')) return

  newTaskForm.render(prevElement.parentElement, ev.target);
}

// const newTaskBtn = document.getElementById('new-task-btn');

// newTaskBtn.addEventListener('click', showNewTaskForm);