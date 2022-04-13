import './styles/style.css'

import { sidebar } from './sidebar';
import { mainDisplay } from './mainDisplay';
import { projectsModule } from './projectsModule';
import { newTaskForm } from './newTaskForm';
import { newProjectForm } from './newProjectForm';
import { pubsub } from './pubsub';

const modalOverlay = (() => {
  const div = document.createElement('div');
  div.setAttribute('id', 'modal-overlay');
  div.setAttribute('class', 'modal-overlay');

  const insertOverlay = () => document.querySelector('.wrapper').appendChild(div);

  // return div
  return {
    insertOverlay
  }
})();

sidebar.render();
mainDisplay.render();
// newProjectForm.insertOverlay();
newProjectForm.insertForm();
modalOverlay.insertOverlay()
