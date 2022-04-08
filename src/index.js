import './styles/style.css'

import { sidebar } from './sidebar'

sidebar.render()

// let navBtns = document.querySelectorAll('.nav-btn');

// function addClickedClass(button) {
//   button.parentElement.querySelector('.clicked').classList.remove('clicked');
//   button.classList.add('clicked')

// }

// function loadContent(e) {
//   if (e.target.classList.contains('clicked')) return

//   addClickedClass(e.target)
// }

// navBtns.forEach(navBtn => {
//   navBtn.addEventListener('click', loadContent)
// })