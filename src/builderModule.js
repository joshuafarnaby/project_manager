import { pubsub } from "./pubsub";

export const builderModule = (() => {
  const buildNewProjectBtn = () => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'new-project-btn');
    btn.setAttribute('class', 'new-project-btn');
    btn.innerHTML = 'New Project &#43;';

    return btn
  }

  const newProjectBtn = buildNewProjectBtn()

  const buildProjectList = (projectData) => {
    projectData.projectListItems = projectData.projectNames.map(name => {
      const li = document.createElement('li');
      const p = document.createElement('p');

      li.setAttribute('class', 'list-item project');
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


  const sendProjectList = (projectData) => pubsub.publish('projectListBuilt', buildProjectList(projectData))

  pubsub.subscribe('projectsRetrieved', sendProjectList)
})();