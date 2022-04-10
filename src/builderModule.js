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

    btn.addEventListener('click', (ev) => pubsub.publish('newTaskBtnClicked', ev.target));

    return btn
  }

  const newProjectBtn = buildNewProjectBtn();
  const newTaskBtn = buildNewTaskBtn()

  const buildProjectList = (projectData) => {
    projectData.elements = projectData.elements.map(name => {
      const li = document.createElement('li');
      li.setAttribute('class', 'list-item project');
      li.setAttribute('id', name)

      li.innerHTML = `
        <p class="project-name">${name}</p>
      `

      return li
    });

    if (projectData.heading == 'All Projects') {
      projectData.elements.push(newProjectBtn);
    }

    pubsub.publish('projectListBuilt', projectData);
  }

  const buildSingleProject = (project) => { 
    return {
      heading: project.name,
      elements: project.tasks.map(task => {
        const li = document.createElement('li');
        li.setAttribute('class', 'list-item task');

        li.innerHTML = `
          <div class="checkbox"></div>
          <p class="task-name">${task.description}</p>
          <p class="task-deadline">${task.deadline}</p>
        `

        return li
      }).concat(newTaskBtn)
    }
  
    // return {heading: project.name, button: newTaskBtn } 
  };

  const sendSingleProject = (project) => pubsub.publish('singleProjectBuilt', buildSingleProject(project))

  pubsub.subscribe('projectsRetrieved', buildProjectList);
  pubsub.subscribe('singleProjectRetrieved', sendSingleProject)
})();