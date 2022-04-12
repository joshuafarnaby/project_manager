import { pubsub } from "./pubsub";

function Project(name, type = 'custom', deadline = null) {
  this.name = name;
  this.deadline = deadline;
  this.type = type;
  this.tasks = [];

  this.addTask = function (description, deadline) {
    this.tasks.push(new Task(description, deadline))
  }

  this.saveToLocalStorage = function () {
    const saveData = {
      name: this.name,
      deadline: this.deadline,
      type: this.type,
      tasks: this.tasks
    }

    localStorage.setItem(this.name, JSON.stringify(saveData));
  }
}

function Task(description, deadline, isComplete = false) {
  this.description = description;
  this.deadline = deadline;
  this.isComplete = isComplete;
}

const monday = new Project('Monday', 'default');
const tuesday = new Project('Tuesday', 'default');
const wednesday = new Project('Wednesday', 'default');
const thursday = new Project('Thursday', 'default');
const friday = new Project('Friday', 'default');
const saturday = new Project('Saturday', 'default');
const sunday = new Project('Sunday', 'default');

export const projectsModule = (() => {
  const projects = [];
  const weekdays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];

  const getProject = (id) => [...projects, ...weekdays].filter(project => project.name == id)[0];

  const sendProjectSummary = (heading, projectList) => {
    pubsub.publish('projectsRetrieved', { 
      heading, 
      projectsInfo: projectList.map(project => {
        return { name: project.name, deadline: project.deadline }
      })});
  }

  const sendSingleProject = (id) => pubsub.publish('singleProjectRetrieved', getProject(id));

  const sendDefaultProject = () => {
    const date = new Date;
    let day = date.getDay();

    day == 0 ? day = 6 : day -= 1;

    pubsub.publish('singleProjectRetrieved', weekdays[day]);
  }

  const createNewProject = (formDataObj) => {
    const formatDeadline = formDataObj.deadline.split('-').reverse().join('-');
    const newProject = new Project(formDataObj.name, 'custom', formatDeadline == '' ? null : formatDeadline);

    projects.push(newProject)

    newProject.saveToLocalStorage();

    pubsub.publish('singleProjectRetrieved', newProject)
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') {
      sendProjectSummary('All Projects', projects);
    } else if (tabName == 'week') {
      sendProjectSummary('Week', weekdays);
    } else {
      sendDefaultProject();
    }
  }

  const loadCustomProjects = (projectList) => {
    projectList.forEach(project => {
      const newProject = new Project(project.name, project.deadline)

      project.tasks.forEach(task => {
        newProject.addTask(task.description, task.deadline, task.isComplete)
      })

      projects.push(newProject);
    })
  }

  const loadDefaultProjects = (projectList) => {
    weekdays.forEach(day => {
      projectList.forEach(project => {
        if (day.name != project.name) return

        project.tasks.forEach(task => day.addTask(task.description, task.deadline));
      })
    })
  }

  const getAllLocalStorageKeys = () => {
    const keys = [];

    for (let i = 0; i < window.localStorage.length; i ++) {
      keys.push(localStorage.key(i))
    }

    return keys
  }

  const loadSavedProjects = () => {
    const keys = getAllLocalStorageKeys(); 
    const savedProjects = keys.map(key => JSON.parse(window.localStorage.getItem(key)));

    loadDefaultProjects(savedProjects.filter(project => project.type == 'default'));
    loadCustomProjects(savedProjects.filter(project => project.type == 'custom'));
  }

  loadSavedProjects();

  pubsub.subscribe('mainDisplayRendered', sendDefaultProject);
  pubsub.subscribe('tabChanged', handleTabChange);
  pubsub.subscribe('singleProjectRequested', sendSingleProject);
  pubsub.subscribe('newProjectFormSubmitted', createNewProject)
})();