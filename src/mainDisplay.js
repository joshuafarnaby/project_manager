import { pubsub } from "./pubsub";

export const mainDisplay = (() => {
  const newProjectBtnHTML = `<button id="new-project-btn" class="new-project-btn">New Project &#43;</button>`;

  const createMainDisplayHTML = () => {
    const mainContainer = document.createElement('main');
    mainContainer.classList.add('main-container');

    mainContainer.innerHTML = `
      <h2 id="main-heading" class="main-heading"></h2>
      <ul id="list" class="list"></ul>
    `

    return mainContainer
  }

  const renderProjectList = (projectData) => {
    const heading = document.getElementById('main-heading');
    const listContainer = document.getElementById('list');

    listContainer.innerHTML = '';
    heading.textContent = projectData.heading;
    listContainer.setAttribute('class', 'list multiple-projects');

    projectData.projectListItems.forEach(node => listContainer.appendChild(node));

    if (projectData.button) listContainer.appendChild(projectData.button)
  }

  const render = () => {
    const mainDisplayHTML = createMainDisplayHTML();

    document.querySelector('.wrapper').appendChild(mainDisplayHTML)
  }

  pubsub.subscribe('projectListBuilt', renderProjectList)

  return {
    render
  }
})()