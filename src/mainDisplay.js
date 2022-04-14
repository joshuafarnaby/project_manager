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

  const requestSingleProject = (ev) => {
    const id = ev.target.localName == 'p' 
      ? ev.target.parentElement.getAttribute('data-project-id')
      : ev.target.getAttribute('data-project-id');

    pubsub.publish('singleProjectRequested', id);
  }

  const toggleComplete = (ev) => {
    ev.target.parentElement.classList.toggle('complete');
    const projectID = ev.target.closest('ul').getAttribute('data-project-id');
    const taskID = ev.target.closest('li').getAttribute('data-task-id');

    pubsub.publish('completeToggled', { projectID, taskID });
  }

  const renderProjectList = (projectData) => {
    mainHeading.textContent = projectData.heading;
    document.getElementById('deadline-container').textContent = '';
    listContainer.innerHTML = '';
    listContainer.setAttribute('class', 'list multiple-projects');
    listContainer.removeAttribute('data-project-id');

    projectData.projectsInfo.forEach(project => {
      const li = document.createElement('li');
      li.setAttribute('class', 'list-item project');
      li.setAttribute('data-project-id', project.id);

      li.innerHTML = `<p class="project-name">${project.name}</p>`

      if (project.deadline) li.innerHTML += `<p class="project-deadline small">Due: ${project.deadline}</p>`

      li.addEventListener('click', requestSingleProject);
      listContainer.appendChild(li);
    })

    if (projectData.heading != 'Week') listContainer.appendChild(newProjectBtn);
  }

  const createTaskElement = ({ description, deadline, priority, isComplete, id }) => {
    const li = document.createElement('li');
    li.setAttribute('class', isComplete ? 'list-item task complete' : 'list-item task');
    li.setAttribute('data-task-id', id);

    li.innerHTML = `
      <div class="checkbox"></div>
      <p class="task-name">${description}</p>
      <p class="task-deadline">${deadline}</p>
      <p class="task-priority ${priority}"></p>
    `

    li.querySelector('.checkbox').addEventListener('click', toggleComplete);
    li.addEventListener('click', sendTaskIDToExpand)

    return li
  }

  const sendTaskIDToExpand = (ev) => {
    if (ev.target.classList.contains('checkbox')) return 

    pubsub.publish('taskItemClicked', {
      projectID: ev.target.closest('ul').getAttribute('data-project-id'),
      taskID: ev.target.localName == 'li'
      ? ev.target.getAttribute('data-task-id')
      : ev.target.closest('li').getAttribute('data-task-id')
    });
  }

  const renderSingleProject = (project) => {
    mainHeading.textContent = project.name;
    listContainer.innerHTML = '';
    listContainer.setAttribute('class', 'list single-project');
    listContainer.setAttribute('data-project-id', project.id)

    if (project.deadline) mainDisplaySkeleton.querySelector('#deadline-container').textContent = `Due: ${project.deadline}`;

    project.tasks.forEach(task => listContainer.appendChild(createTaskElement(task)))

    listContainer.appendChild(newTaskBtn);
  }

  const updateTaskItem = ({ id, description, deadline, isComplete, priority }) => {
    const taskItem = listContainer.querySelector(`[data-task-id='${id}']`);

    taskItem.querySelector('.task-name').textContent = description;
    taskItem.querySelector('.task-deadline').textContent = deadline;
    taskItem.querySelector('.task-priority').setAttribute('class', `task-priority ${priority}`);
    isComplete ? taskItem.classList.add('complete') : taskItem.classList.remove('complete')
  }

  const renderNewTask = (newTask) => listContainer.insertBefore(createTaskElement(newTask), listContainer.lastElementChild);

  const deleteTask = ({ taskID }) => listContainer.removeChild(listContainer.querySelector(`[data-task-id='${taskID}']`));

  const render = () => {
    document.querySelector('.wrapper').appendChild(mainDisplaySkeleton);
    pubsub.publish('mainDisplayRendered');
  };
  
  pubsub.subscribe('projectsRetrieved', renderProjectList);
  pubsub.subscribe('singleProjectRetrieved', renderSingleProject);
  pubsub.subscribe('newTaskAdded', renderNewTask);
  pubsub.subscribe('deleteTaskBtnClicked', deleteTask);
  pubsub.subscribe('taskEdited', updateTaskItem);

  return {
    render
  }
})()