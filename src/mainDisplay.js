import { pubsub } from "./pubsub";

export const mainDisplay = (() => {
  // const newProjectBtnHTML = `<button id="new-project-btn" class="new-project-btn">New Project &#43;</button>`;

  const createMainDisplayHTML = () => {
    const mainContainer = document.createElement('main');
    mainContainer.classList.add('main-container');

    mainContainer.innerHTML = `
      <h2 id="main-heading" class="main-heading"></h2>
      <ul id="list" class="list"></ul>
    `

    return mainContainer
  }

  const requestSingleProject = (ev) => {
    // ev.stopPropagation();

    const id = ev.target.localName == 'p' 
      ? ev.target.parentElement.getAttribute('id')
      : ev.target.getAttribute('id');

    pubsub.publish('singleProjectRequested', id);
  }

  const renderProjectList = (projectData) => {
    const heading = document.getElementById('main-heading');
    const listContainer = document.getElementById('list');

    listContainer.innerHTML = '';
    heading.textContent = projectData.heading;
    listContainer.setAttribute('class', 'list multiple-projects');

    projectData.elements.forEach(node => {
      if (node.localName == 'li') {
        node.addEventListener('click', requestSingleProject)
      }
      
      listContainer.appendChild(node)
    });

    // if (projectData.button) listContainer.appendChild(projectData.button)
  }

  const renderSingleProject = (data) => {
    const heading = document.getElementById('main-heading');
    const listContainer = document.getElementById('list');

    heading.textContent = data.heading;

    listContainer.innerHTML = '';
    listContainer.setAttribute('class', 'list single-project');
    listContainer.appendChild(data.button);
  }

  const render = () => {
    document.querySelector('.wrapper').appendChild(createMainDisplayHTML());

    pubsub.publish('mainDisplayRendered');
  };
  

  pubsub.subscribe('projectListBuilt', renderProjectList);
  pubsub.subscribe('singleProjectBuilt', renderSingleProject)

  return {
    render
  }
})()