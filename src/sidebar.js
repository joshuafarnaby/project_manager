import calToday from './assets/icons/calendar-today.svg' 
import calWeek from './assets/icons/calendar-week.svg'
import list from './assets/icons/clipboard-list-outline.svg'

import { pubsub } from './pubsub';

export const sidebar = (() => {
  const _labels = ['Today', 'Week', 'Projects'];
  const _icons = [calToday, calWeek, list];

  const getCurrentDate = () => {
    const date = new Date();

    return date.toDateString().substring(4)
  }

  const createSidebarHTML = () => {
    let container = document.createElement('nav');
    container.classList.add('sidebar-container');

    container.innerHTML =  `
      <h2 id="current-date" class="current-date">${getCurrentDate()}</h2>
      <div class="nav-btns-container">
        <button id="today" class="nav-btn clicked"><img src=${_icons[0]}>${_labels[0]}</button>
        <button id="week" class="nav-btn"><img src=${_icons[1]}>${_labels[1]}</button>
        <button id="projects" class="nav-btn"><img src=${_icons[2]}>${_labels[2]}</button>
      </div>
    `

    return container
  }

  const initiateTabChange = (ev) => {
    if (ev.target.classList.contains('clicked')) return

    const tab = ev.target.id;

    ev.target.parentElement.querySelector('.clicked').classList.remove('clicked');
    ev.target.classList.add('clicked')

    pubsub.publish('tabChanged', tab);
  }

  const render = () => {
    const sidebarHTML = createSidebarHTML();

    sidebarHTML.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', initiateTabChange)
    })

    document.querySelector('.wrapper').appendChild(sidebarHTML);
  }

  return {
    render
  }
})();