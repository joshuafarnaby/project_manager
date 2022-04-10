import { pubsub } from "./pubsub";

export const builderModule = (() => {
  const buildNewProjectBtn = () => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'new-project-btn');
    btn.setAttribute('class', 'new-project-btn');
    btn.innerHTML = 'New Project &#43;';

    return btn
  }

  const newProjectBtn = buildNewProjectBtn()

  const buildProjectList = (nameArray) => {
    const nodes = [];

    nameArray.forEach(name => {
      const li = document.createElement('li');
      const p = document.createElement('p');

      li.setAttribute('class', 'list-item project');
      p.setAttribute('class', 'project-name');
      p.textContent = name

      li.appendChild(p);

      nodes.push(li)
    })

    nodes.push(newProjectBtn);

    return nodes
  }


  const sendProjectList = (nameArray) => pubsub.publish('projectListBuilt', buildProjectList(nameArray))

  pubsub.subscribe('projectNamesRetrieved', sendProjectList)
})();