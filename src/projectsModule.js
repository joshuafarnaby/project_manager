import { pubsub } from "./pubsub";

function Project(name, deadline = null) {
  this.name = name;
  this.deadline = deadline;
  this.tasks = [];

  this.addTask = function (description, deadline) {
    this.tasks.push(new Task(description, deadline))
  }
}

function Task(description, deadline) {
  this.description = description;
  this.deadline = deadline;
  this.isComplete = false;
}

const project1 = new Project('Very boring work project', '24-04-2022')

const monday = new Project('Monday');
const tuesday = new Project('Tuesday');
const wednesday = new Project('Wednesday');
const thursday = new Project('Thursday');
const friday = new Project('Friday');
const saturday = new Project('Saturday');
const sunday = new Project('Sunday');

monday.addTask('Go to the gym');
monday.addTask('Walk the dog', '16:00');
monday.addTask('Buy groceries', '12:00');
monday.addTask('Go for a run', '18:00');

wednesday.addTask('Feed the dragon', '15:00');
wednesday.addTask('Duel the neighbour', '16:00');
wednesday.addTask('Duel the other neighbour', '12:00');
wednesday.addTask('Find the ring', '18:00');


export const projectsModule = (() => {
  // const projects = [project1, project2, project3];
  const projects = [project1];
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
    const newProject = new Project(formDataObj.name, formatDeadline);

    projects.push(newProject)

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

  pubsub.subscribe('mainDisplayRendered', sendDefaultProject);
  pubsub.subscribe('tabChanged', handleTabChange);
  pubsub.subscribe('singleProjectRequested', sendSingleProject);
  pubsub.subscribe('newProjectFormSubmitted', createNewProject)
})();