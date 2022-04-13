import { pubsub } from "./pubsub";

export const mainDisplay = (() => {
  const mainDisplaySkeleton = (() => {
    const mainContainer = document.createElement('main');
    mainContainer.classList.add('main-container');

    mainContainer.innerHTML = `
      <h2 id="main-heading" class="main-heading"></h2>
      <p id="deadline-container" class="small"></p>
      <ul id="list" class="list"></ul>
    `

    return mainContainer
  })();

  // btns do not change and are inserted into DOM dynamically

  const newProjectBtn = (() => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'new-project-btn');
    btn.setAttribute('class', 'new-project-btn');
    btn.innerHTML = 'New Project &#43;';

    btn.addEventListener('click', (ev) => pubsub.publish('newProjectBtnClicked', ev.target))

    return btn
  })();

  const newTaskBtn = (() => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'new-task-btn');
    btn.setAttribute('class', 'new-task-btn');
    btn.innerHTML = 'New Task &#43;'

    btn.addEventListener('click', (ev) => pubsub.publish('newTaskBtnClicked', ev.target));

    return btn
  })();

  const mainHeading = mainDisplaySkeleton.querySelector('#main-heading');
  const listContainer = mainDisplaySkeleton.querySelector('#list');
  let currentProject;

  const requestSingleProject = (ev) => {
    const id = ev.target.localName == 'p' 
      ? ev.target.parentElement.getAttribute('id')
      : ev.target.getAttribute('id');

    pubsub.publish('singleProjectRequested', id);
  }

  const toggleComplete = (ev) => {
    ev.target.parentElement.classList.toggle('complete');
    const projectName = document.querySelector('#main-heading').textContent;
    const taskDescription = ev.target.nextElementSibling.textContent;

    pubsub.publish('completeToggled', [projectName, taskDescription]);
  }

  const renderProjectList = (projectData) => {
    mainHeading.textContent = projectData.heading;
    listContainer.innerHTML = '';
    listContainer.setAttribute('class', 'list multiple-projects');

    projectData.projectsInfo.forEach(project => {
      const li = document.createElement('li');
      li.setAttribute('class', 'list-item project');
      li.setAttribute('id', project.name)

      li.innerHTML = `
        <p class="project-name">${project.name}</p>
      `

      if (project.deadline) {
        li.innerHTML += `<p class="project-deadline small">Due: ${project.deadline}</p>`
      }

      li.addEventListener('click', requestSingleProject);
      listContainer.appendChild(li);
    })

    if (projectData.heading != 'Week') listContainer.appendChild(newProjectBtn);
  }

  const renderSingleProject = (project) => {
    mainHeading.textContent = project.name;
    listContainer.innerHTML = '';
    listContainer.setAttribute('class', 'list single-project');

    if (project.deadline) mainDisplaySkeleton.querySelector('#deadline-container').textContent = `Due: ${project.deadline}`;

    project.tasks.forEach(task => {
      const li = document.createElement('li');
      // console.log(task);
      task.isComplete ? li.setAttribute('class', 'list-item task complete') : li.setAttribute('class', 'list-item task');

      li.innerHTML = `
        <div class="checkbox"></div>
        <p class="task-name">${task.description}</p>
        <p class="task-deadline">${task.deadline ? task.deadline : 'Anytime'}</p>
        <p class="task-priority ${task.priority}"></p>
      `

      li.querySelector('.checkbox').addEventListener('click', toggleComplete);

      // li.addEventListener('click', (e) => {
      //   if (e.target.classList.contains('checkbox')) return 

      //   const taskDescription = e.target.localName == li 
      //     ? e.target.querySelector('.task-name').textContent
      //     : e.target.closest('li').querySelector('.task-name').textContent

        
      //   const task = currentProject.getTask(taskDescription)

      //   console.log(task);
      // })

      listContainer.appendChild(li);
    })

    currentProject = project;
    listContainer.appendChild(newTaskBtn);
  }

  const renderNewTask = (formDataObj) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item task');

    li.innerHTML = `
      <div class="checkbox"></div>
      <p class="task-name">${formDataObj.description}</p>
      <p class="task-deadline">${formDataObj.deadline ? formDataObj.deadline : 'Anytime'}</p>
      <p class="task-priority ${formDataObj.priority}"></p>
    `

    // li.querySelector('.checkbox').addEventListener('click', (e) => e.target.parentElement.classList.toggle('complete'));
    li.querySelector('.checkbox').addEventListener('click', toggleComplete);

    listContainer.insertBefore(li, listContainer.lastElementChild);
    currentProject.addTask(formDataObj.description, formDataObj.deadline, formDataObj.priority, formDataObj.notes);
    currentProject.saveToLocalStorage();
  }

  const render = () => {
    document.querySelector('.wrapper').appendChild(mainDisplaySkeleton);

    pubsub.publish('mainDisplayRendered');
  };
  

  pubsub.subscribe('projectsRetrieved', renderProjectList);
  pubsub.subscribe('singleProjectRetrieved', renderSingleProject);
  pubsub.subscribe('newTaskFormSubmitted', renderNewTask)

  return {
    render
  }
})()