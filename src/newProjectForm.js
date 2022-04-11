import { pubsub } from "./pubsub";

export const newProjectForm = (() => {
  const modalOverlay = (() => {
    const div = document.createElement('div');
    div.setAttribute('id', 'modal-overlay');
    div.setAttribute('class', 'modal-overlay');

    return div
  })();

  const newProjectForm = (() => {
    const container = document.createElement('div');
    container.setAttribute('id', 'modal-container');
    container.setAttribute('class', 'modal-container');

    container.innerHTML = `
      <form action="#" id="new-project-form" class="new-project-form">
        <h2>New Project</h2>
        <p class="project-name-container">
          <label for="project-name">Name:</label>
          <input type="text" id="project-name" name="name">
        </p>
        <p class="project-deadline-container">
          <label for="deadline">Deadline:</label>
          <input type="date" id="deadline" name="deadline">
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
    modalOverlay.classList.toggle('active');
    newProjectForm.classList.toggle('active');
  }

  // const renderForm = () => {
  //   modalOverlay.classList.add('active');
  //   newProjectForm.classList.add('active');
  // } 

  // const hideForm = () => {
  //   modalOverlay.classList.remove('active');
  //   newProjectForm.classList.remove('active');
  // }

  const insertForm = () => document.querySelector('.wrapper').appendChild(newProjectForm);
  const insertOverlay = () => document.querySelector('.wrapper').appendChild(modalOverlay);

  // pubsub.subscribe('newProjectBtnClicked', renderForm)
  pubsub.subscribe('newProjectBtnClicked', toggleFormVisibility)

  // newProjectForm.querySelector('#cancel-btn').addEventListener('click', hideForm)
  newProjectForm.querySelector('#cancel-btn').addEventListener('click', toggleFormVisibility)


  return {
    insertOverlay,
    insertForm
  }
})();