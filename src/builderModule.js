import { pubsub } from "./pubsub";

export const builderModule = (() => {
  const buildNewProjectBtn = () => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'new-project-btn');
    btn.setAttribute('class', 'new-project-btn');
    btn.innerHTML = 'New Project &#43;';

    return btn
  }

  const buildNewTaskBtn = () => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'new-task-btn');
    btn.setAttribute('class', 'new-task-btn');
    btn.innerHTML = 'New Task &#43;'

    return btn
  }

  const newProjectBtn = buildNewProjectBtn();
  const newTaskBtn = buildNewTaskBtn()

  const buildProjectList = (projectData) => {
    projectData.projectListItems = projectData.projectNames.map(name => {
      const li = document.createElement('li');
      const p = document.createElement('p');

      li.setAttribute('class', 'list-item project');
      li.setAttribute('id', name)
      p.setAttribute('class', 'project-name');
      p.textContent = name

      li.appendChild(p);

      return li
    });

    delete projectData.projectNames

    if (projectData.heading == 'All Projects') {
      projectData.button = newProjectBtn;
    }

    return projectData;
  }

  const buildSingleProject = (project) => { 
    return {heading: project.name, button: newTaskBtn } 
  };


  const sendProjectList = (projectData) => pubsub.publish('projectListBuilt', buildProjectList(projectData))
  const sendSingleProject = (project) => pubsub.publish('singleProjectBuilt', buildSingleProject(project))

  pubsub.subscribe('projectsRetrieved', sendProjectList);
  pubsub.subscribe('singleProjectRetrieved', sendSingleProject)
})();