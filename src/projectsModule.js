import { pubsub } from "./pubsub";
import { generateUniqueID } from "./utilities";

export const projectsModule = (() => {
  const Project = ({ name, type, deadline, id }) => {
    const Task = (description, deadline, priority, notes, isComplete, id) => {
      return {
        description,
        deadline,
        priority,
        notes,
        isComplete,
        id: id || generateUniqueID()
      }
    }
  
    return {
      name,
      type,
      deadline: deadline || null,
      id: id || generateUniqueID(),
      tasks: [],
      addTask({ description, deadline, priority, notes, isComplete, id }) {
        this.tasks.push(Task(description, deadline, priority, notes, isComplete, id));
      },
      getTask(taskDescription) {
        return this.tasks.filter(task => task.description == taskDescription)[0];
      },
      deleteTask(taskDescription) {
        const taskToDelete = this.tasks.filter(task => task.description == taskDescription)[0];

        this.tasks.splice(this.tasks.indexOf(taskToDelete), 1);
        this.saveToLocalStorage();
      },
      saveToLocalStorage() {
        localStorage.setItem(this.name, JSON.stringify({
          name: this.name,
          deadline: this.deadline,
          type: this.type,
          tasks: this.tasks,
          id: this.id
        }));
      }
    }
  }

  const projects = [];
  const weekdays = [
    Project({ name: 'Monday', type: 'default' }),
    Project({ name: 'Tuesday', type: 'default' }),
    Project({ name: 'Wednesday', type: 'default' }),
    Project({ name: 'Thursday', type: 'default' }),
    Project({ name: 'Friday', type: 'default' }),
    Project({ name: 'Saturday', type: 'default' }),
    Project({ name: 'Sunday', type: 'default' })
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

  const createNewProject = ({ name, deadline, type }) => {
    const formatDeadline = deadline.split('-').reverse().join('-');
    const newProject = Project(name, type, formatDeadline == '' ? null : formatDeadline);

    projects.push(newProject)
    newProject.saveToLocalStorage();
    pubsub.publish('singleProjectRetrieved', newProject);
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') sendProjectSummary('All Projects', projects);
    if (tabName == 'week') sendProjectSummary('Week', weekdays);
    if (tabName == 'today') sendDefaultProject();
  }

  const loadCustomProjects = (projectList) => {
    projectList.forEach(project => {
      const newProject = Project(project);

      project.tasks.forEach(task => newProject.addTask(task))
      projects.push(newProject);
    })
  }

  const loadDefaultProjects = (projectList) => {
    weekdays.forEach(day => {
      projectList.forEach(project => {
        if (day.name != project.name) return

        project.tasks.forEach(task => day.addTask(task));
      })
    })
  }

  const updateTaskCompleteState = (projectTask) => {
    const project = getProject(projectTask[0]);
    const task = project.tasks.filter(t => t.description == projectTask[1])[0];

    task.isComplete = !task.isComplete;
    project.saveToLocalStorage();
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
  pubsub.subscribe('newProjectFormSubmitted', createNewProject);
  pubsub.subscribe('completeToggled', updateTaskCompleteState)
})();