import { pubsub } from "./pubsub";

function Project(name, deadline = null) {
  this.name = name;
  this.deadline = deadline;
}

const project1 = {
  name: 'Project 1',
  deadline: '24-04-2022'
}

const project2 = {
  name: 'Project 2',
  deadline: '14-05-2022'
}

const project3 = {
  name: 'Project 3',
  deadline: '01-06-2022'
}


const monday = new Project('Monday');
const tuesday = new Project('Tuesday');
const wednesday = new Project('Wednesday');
const thursday = new Project('Thursday');
const friday = new Project('Friday');
const saturday = new Project('Saturday');
const sunday = new Project('Sunday');


export const projectsModule = (() => {
  const projects = [project1, project2, project3];
  // const projects = [];
  const weekdays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];

  const getProject = (id) => [...projects, ...weekdays].filter(project => project.name == id)[0];

  const sendAllProjects = (heading, projectList) => {
    pubsub.publish('projectsRetrieved', { heading, elements: projectList.map(project => project.name)});
  }

  const sendSingleProject = (id) => pubsub.publish('singleProjectRetrieved', getProject(id));
  
  const handleTabChange = (tabName) => {
    if (tabName == 'projects') {
      sendAllProjects('All Projects', projects);
    } else if (tabName == 'week') {
      sendAllProjects('Week', weekdays)
    }
  }

  pubsub.subscribe('tabChanged', handleTabChange);
  pubsub.subscribe('singleProjectRequested', sendSingleProject)
})();