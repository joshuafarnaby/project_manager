import './styles/style.css'

import { sidebar } from './sidebar';
import { mainDisplay } from './mainDisplay';
import { projectsModule } from './projectsModule';
import { newTaskForm } from './newTaskForm';
import { newProjectForm } from './newProjectForm';
import { pubsub } from './pubsub';

const controller = (() => {
  const currentTab = 'today';

  sidebar.render();
  mainDisplay.render();
  newProjectForm.insertOverlay();
  newProjectForm.insertForm();
})();