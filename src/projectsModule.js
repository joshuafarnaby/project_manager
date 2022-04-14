import { pubsub } from "./pubsub";
import { generateUniqueID } from "./utilities";
import { getAllLocalStorageKeys } from "./utilities";

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
        const newTask = Task(description, deadline, priority, notes, isComplete, id);
        this.tasks.push(newTask);

        return newTask
      },
      getTask(taskID) {
        return this.tasks.filter(task => task.id == taskID)[0];
      },
      editTask({ taskID, description, deadline, isComplete, priority, notes }) {
        const taskToEdit = this.getTask(taskID);
        taskToEdit.description = description;
        taskToEdit.deadline = deadline;
        taskToEdit.isComplete = JSON.parse(isComplete);
        taskToEdit.priority = priority;
        taskToEdit.notes = notes;

        console.log(taskToEdit);
        this.saveToLocalStorage();
        pubsub.publish('taskEdited', taskToEdit);
      },
      deleteTask(taskID) {
        const taskToDelete = this.tasks.filter(task => task.id == taskID)[0];

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

  const getProject = (id) => [...projects, ...weekdays].filter(project => project.id == id)[0];

  const sendProjectSummary = (heading, projectList) => {
    pubsub.publish('projectsRetrieved', { 
      heading, 
      projectsInfo: projectList.map(project => {
        return { name: project.name, deadline: project.deadline, id: project.id }
      })});
  }

  const sendSingleProject = (id) => pubsub.publish('singleProjectRetrieved', getProject(id));
  const sendTaskItem = ({ projectID, taskID }) => pubsub.publish('taskItemRetrieved', getProject(projectID).getTask(taskID))

  const sendDefaultProject = () => {
    const date = new Date;
    let day = date.getDay();

    day == 0 ? day = 6 : day -= 1;

    pubsub.publish('singleProjectRetrieved', weekdays[day]);
  }

  const createNewProject = ({ name, deadline, type }) => {
    const formatDeadline = deadline ? 
      deadline.split('-').reverse().join('-') :
      null

    const newProject = Project({ name, type, deadline: formatDeadline });

    projects.push(newProject)
    newProject.saveToLocalStorage();
    pubsub.publish('singleProjectRetrieved', newProject);
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') sendProjectSummary('All Projects', projects);
    if (tabName == 'week') sendProjectSummary('Week', weekdays);
    if (tabName == 'today') sendDefaultProject();
  }

  const addNewTask = ({ description, deadline, priority, notes, projectID, isComplete }) => {
    const project = getProject(projectID);
    const newTask = project.addTask({ description, deadline, priority, notes, isComplete});

    project.saveToLocalStorage();
    pubsub.publish('newTaskAdded', newTask);
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

  const updateTaskCompleteState = ({ projectID, taskID }) => {
    const project = getProject(projectID);
    const task = project.getTask(taskID);

    task.isComplete = !task.isComplete
    project.saveToLocalStorage();
  }

  const deleteTask = ({ projectID, taskID }) => getProject(projectID).deleteTask(taskID);

  const editTask = (formDataObj) => {
    getProject(formDataObj.projectID).editTask(formDataObj);
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
  pubsub.subscribe('newTaskFormSubmitted', addNewTask);
  pubsub.subscribe('completeToggled', updateTaskCompleteState);
  pubsub.subscribe('taskItemClicked', sendTaskItem);
  pubsub.subscribe('deleteTaskBtnClicked', deleteTask);
  pubsub.subscribe('editTaskFormSubmitted', editTask)
})();