import { pubsub } from "./pubsub";

export const mainDisplay = (() => {
  const createMainDisplayHTML = () => {
    const mainContainer = document.createElement('main');
    mainContainer.classList.add('main-container');

    mainContainer.innerHTML = `
      <h2 id="main-heading" class="main-heading"></h2>
      <ul id="list" class="list"></ul>
    `

    return mainContainer
  }

  const render = () => {
    const mainDisplayHTML = createMainDisplayHTML();

    document.querySelector('.wrapper').appendChild(mainDisplayHTML)
  }

  return {
    render
  }
})()