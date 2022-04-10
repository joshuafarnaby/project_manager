import { pubsub } from "./pubsub";

export const projectsModule = (() => {
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


  const projects = [project1, project2, project3];

  const sendAllProjects = () => {
    // const projectNames = projects.map(project => project.name)

    pubsub.publish('projectNamesRetrieved', projects.map(project => project.name))
  }

  const handleTabChange = (tabName) => {
    if (tabName == 'projects') {
      sendAllProjects();
    }
  }

  pubsub.subscribe('tabChanged', handleTabChange)
})();