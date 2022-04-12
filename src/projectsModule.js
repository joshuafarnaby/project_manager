import { pubsub } from "./pubsub";

export const projectsModule = (() => {
  const Project = (name, type = 'custom', deadline = null) => {
    const Task = (description, deadline, priority, notes, isComplete = false) => {
      return {
        description,
        deadline,
        priority,
        notes,
        isComplete
      }
    }
  
    return {
      name,
      type,
      tasks: [],
      deadline,
      addTask(description, deadline, priority, notes) {
        this.tasks.push(Task(description, deadline, priority, notes))

        console.log(this);
      },
      saveToLocalStorage() {
        localStorage.setItem(this.name, JSON.stringify({
          name: this.name,
          deadline: this.deadline,
          type: this.type,
          tasks: this.tasks
        }));
      }
    }
  }

  const projects = [];
  const weekdays = [
    Project('Monday', 'default'),
    Project('Tuesday', 'default'),
    Project('Wednesday', 'default'),
    Project('Thursday', 'default'),
    Project('Friday', 'default'),
    Project('Saturday', 'default'),
    Project('Sunday', 'default')
  ];

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
    const newProject = Project(formDataObj.name, 'custom', formatDeadline == '' ? null : formatDeadline);

    projects.push(newProject)
    newProject.saveToLocalStorage();
    pubsub.publish('singleProjectRetrieved', newProject)
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') sendProjectSummary('All Projects', projects);
    if (tabName == 'week') sendProjectSummary('Week', weekdays);
    if (tabName == 'today') sendDefaultProject();
  }

  const loadCustomProjects = (projectList) => {
    projectList.forEach(project => {
      const newProject = Project(project.name, project.deadline)

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

    for (let i = 0; i < window.localStorage.length; i++) {
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