import { pubsub } from "./pubsub";

function Project(name, deadline = null) {
  this.name = name;
  this.deadline = deadline;
  this.tasks = [];

  this.addTask = function (description, deadline) {
    this.tasks.push(new Task(description, deadline))
  }

  this.saveToLocalStorage = function () {
    const saveData = {
      name: this.name,
      deadline: this.deadline,
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

// const project1 = new Project('Very boring work project', '24-04-2022');

const monday = new Project('Monday');
const tuesday = new Project('Tuesday');
const wednesday = new Project('Wednesday');
const thursday = new Project('Thursday');
const friday = new Project('Friday');
const saturday = new Project('Saturday');
const sunday = new Project('Sunday');

// monday.addTask('Go to the gym');
// monday.addTask('Walk the dog', '16:00');
// monday.addTask('Buy groceries', '12:00');
// monday.addTask('Go for a run', '18:00');

// wednesday.addTask('Feed the dragon', '15:00');
// wednesday.addTask('Duel the neighbour', '16:00');
// wednesday.addTask('Duel the other neighbour', '12:00');
// wednesday.addTask('Find the ring', '18:00');


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
    const newProject = new Project(formDataObj.name, formatDeadline == '' ? null : formatDeadline);

    projects.push(newProject)

    newProject.saveToLocalStorage();

    pubsub.publish('singleProjectRetrieved', newProject)
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') {
      sendProjectSummary('All Projects', projects);
    } else if (tabName == 'week') {
      sendProjectSummary('Week', weekdays)
    } else {
      sendDefaultProject();
    }
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
    
    savedProjects.forEach(project => {
      const newProject = new Project(project.name, project.deadline)

      project.tasks.forEach(task => {
        newProject.addTask(task.description, task.deadline, task.isComplete)
      })

      projects.push(newProject);
    })
  }

  loadSavedProjects();

  pubsub.subscribe('mainDisplayRendered', sendDefaultProject);
  pubsub.subscribe('tabChanged', handleTabChange);
  pubsub.subscribe('singleProjectRequested', sendSingleProject);
  pubsub.subscribe('newProjectFormSubmitted', createNewProject)
})();