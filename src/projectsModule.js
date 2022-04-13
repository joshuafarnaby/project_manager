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
      addTask(description, deadline, priority, notes, isComplete) {
        this.tasks.push(Task(description, deadline, priority, notes, isComplete))
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
    pubsub.publish('singleProjectRetrieved', newProject);
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') sendProjectSummary('All Projects', projects);
    if (tabName == 'week') sendProjectSummary('Week', weekdays);
    if (tabName == 'today') sendDefaultProject();
  }

  const loadCustomProjects = (projectList) => {
    projectList.forEach(project => {
      const newProject = Project(project.name, project.type, project.deadline)

      project.tasks.forEach(task => {
        newProject.addTask(task.description, task.deadline, task.priority, task.notes, task.isComplete)
      })

      projects.push(newProject);
    })
  }

  const loadDefaultProjects = (projectList) => {
    weekdays.forEach(day => {
      projectList.forEach(project => {
        if (day.name != project.name) return

        project.tasks.forEach(task => day.addTask(task.description, task.deadline, task.priority, task.notes, task.isComplete))
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

    // console.log(savedProjects);

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