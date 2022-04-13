import { pubsub } from "./pubsub";

export const newProjectForm = (() => {
  // const modalOverlay = (() => {
  //   const div = document.createElement('div');
  //   div.setAttribute('id', 'modal-overlay');
  //   div.setAttribute('class', 'modal-overlay');

  //   return div
  // })();

  const newProjectForm = (() => {
    const container = document.createElement('div');
    // container.setAttribute('id', 'modal-container');
    container.setAttribute('class', 'modal-container');

    container.innerHTML = `
      <form action="#" id="new-project-form" class="new-project-form">
        <h2>New Project</h2>
        <p class="project-name-container">
          <label for="project-name">Name:</label>
          <input type="text" id="project-name" name="name" class="new-project-control">
        </p>
        <p class="project-deadline-container">
          <label for="deadline">Deadline:</label>
          <input type="date" id="deadline" name="deadline" class="new-project-control">
        </p>
        <div class="btn-container">
          <button type="submit" id="add-btn" class="form-btn add" >Add Project</button>
          <button type="button" id="cancel-btn" class="form-btn cancel">Cancel</button>
        </div>
      </form>
    `

    return container
  })();

  const toggleFormVisibility = () => {
    document.querySelector('#modal-overlay').classList.toggle('active');
    newProjectForm.classList.toggle('active');
    newProjectForm.querySelector('#project-name').value = '';
    newProjectForm.querySelector('#deadline').value = '';
  }

  const addNewProject = (ev) => {
    ev.preventDefault();

    const fd = new FormData(ev.target.closest('form'));
    const formDataObj = {};

    for (let entry of fd.entries()) {
      formDataObj[entry[0]] = entry[1];
    }

    formDataObj.type = 'custom';

    pubsub.publish('newProjectFormSubmitted', formDataObj);
    toggleFormVisibility();
  }

  const insertForm = () => document.querySelector('.wrapper').appendChild(newProjectForm);
  // const insertOverlay = () => document.querySelector('.wrapper').appendChild(modalOverlay);

  pubsub.subscribe('newProjectBtnClicked', toggleFormVisibility)


  newProjectForm.querySelector('#cancel-btn').addEventListener('click', toggleFormVisibility)
  newProjectForm.querySelector('#add-btn').addEventListener('click', addNewProject)

  return {
    // insertOverlay,
    insertForm
  }
})();