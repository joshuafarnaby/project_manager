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

  const renderProjectList = (nodeList) => {
    document.getElementById('main-heading').textContent = 'All Projects';
    document.getElementById('list').setAttribute('class', 'list multiple-projects');

    nodeList.forEach(node => document.getElementById('list').appendChild(node));

    // document.getElementById('list').innerHTML += (newProjectBtnHTML);
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