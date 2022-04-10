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

// const project1 = {
//   name: 'Project 1',
//   deadline: '24-04-2022'
// }

// const project2 = {
//   name: 'Project 2',
//   deadline: '14-05-2022'
// }

// const project3 = {
//   name: 'Project 3',
//   deadline: '01-06-2022'
// }

const project1 = new Project('Very boring work project', '24-04-2022')


const monday = new Project('Monday');
const tuesday = new Project('Tuesday');
const wednesday = new Project('Wednesday');
const thursday = new Project('Thursday');
const friday = new Project('Friday');
const saturday = new Project('Saturday');
const sunday = new Project('Sunday');

sunday.addTask('Go to the gym', '15:00');
sunday.addTask('Walk the dog', '16:00');
sunday.addTask('Buy groceries', '12:00');
sunday.addTask('Go for a run', '18:00');

wednesday.addTask('Feed the dragon', '15:00');
wednesday.addTask('Duel the neighbour', '16:00');
wednesday.addTask('Duel the other neighbour', '12:00');
wednesday.addTask('Find the ring', '18:00');

// console.log(monday);


export const projectsModule = (() => {
  // const projects = [project1, project2, project3];
  const projects = [project1];
  const weekdays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];

  const getProject = (id) => [...projects, ...weekdays].filter(project => project.name == id)[0];

  const sendAllProjects = (heading, projectList) => {
    pubsub.publish('projectsRetrieved', { heading, elements: projectList.map(project => project.name)});
  }

  const sendSingleProject = (id) => pubsub.publish('singleProjectRetrieved', getProject(id));

  const sendDefaultProject = () => {
    const date = new Date;
    
    let day = date.getDay();

    day == 0 ? day = 6 : day -= 1;

    pubsub.publish('singleProjectRetrieved', weekdays[day]);
  }
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') {
      sendAllProjects('All Projects', projects);
    } else if (tabName == 'week') {
      sendAllProjects('Week', weekdays)
    } else {
      sendDefaultProject();
    }
  }

  pubsub.subscribe('mainDisplayRendered', sendDefaultProject);
  pubsub.subscribe('tabChanged', handleTabChange);
  pubsub.subscribe('singleProjectRequested', sendSingleProject)
})();