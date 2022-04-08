import './styles/style.css'

import { sidebar } from './sidebar'

sidebar.render()

document.querySelectorAll('.checkbox').forEach(checkbox => {
  checkbox.addEventListener('click', (e) => {
    let parent = e.target.parentElement;

    parent.classList.toggle('complete')
  })
})