//Elementos del Dom
const taskName = document.querySelector('input[name=taskName]');
const submit = document.querySelector('input[type=submit]');
const description = document.querySelector('textarea');
const importance = document.querySelector('select');

const form = document.querySelector('form');
const body = document.querySelector('body');
const fragment = document.createDocumentFragment();
const editFragment = document.createDocumentFragment();
let editTemplate = document.getElementById('editTemplate').content;
const template = document.querySelector('template').content;

let totalTasks = 0;
let count = 0;
let color = 'green';

//Valores de los inputs
let taskNameValue = '';
let taskDescriptionValue = '';
let importanceValue = importance.value;

//Escuchamos los inputs
taskName.addEventListener('change', e => {
    taskNameValue = e.target.value;
});
description.addEventListener('change', e => {
    taskDescriptionValue = e.target.value;
});
importance.addEventListener('change', e => {
    importanceValue = e.target.value;
})

const clearValues = () => {
    taskName.value = '';
    description.value = '';
    taskNameValue = '';
    taskDescriptionValue = '';
}

const spanColor = (span, value) => {
    if (value == 'Medium'){
        span.style.color = '#444'
    }
    else {
        span.style.color = '#d3d3d3'
    }
}

const selectStyle = value => {
    if(value == 'Low'){
        return '#227c2e'
    }
    else if (value == 'Medium'){
        return '#b6ce2f'
    }
    else {
        return '#b12020'
    }
}

const renderTask = (taskN, desc, imp) => {
    totalTasks++;
    count++;
    template.querySelector('div').setAttribute('id', `task${count}`);
    if (taskN !== '')
        template.querySelector('h2').textContent = taskN;
    else 
        template.querySelector('h2').textContent = `Task ${totalTasks}`
    if (desc !== '')
        template.querySelector('p').textContent = desc;
    else 
        template.querySelector('p').textContent = 'No description';
    template.querySelector('span').textContent = `Importance : ${imp}`;
    let span = template.querySelector('span');
    template.querySelector('button[name=delete]').setAttribute('id', `delete${count}`)
    color = selectStyle(imp);
    span.style.backgroundColor = color;
    spanColor(span, imp)
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
    body.appendChild(fragment);
}

const changeNumberTasks = tasks => {
    const header = document.querySelector('header');
    header.textContent = `Total Tasks: ${tasks}`
}

submit.addEventListener('click', e => {
    renderTask(taskNameValue, taskDescriptionValue, importanceValue);
    clearValues();
    e.preventDefault();
    changeNumberTasks(totalTasks);
})

const editTask = task => {
    editTemplate.querySelector('input[name=taskName').value = task.querySelector('h2').textContent;
    editTemplate.querySelector('textarea').value = task.querySelector('p').textContent;
    editTemplate.querySelector('select').value = task.querySelector('span').textContent;
    const clone = editTemplate.cloneNode(true)
    editFragment.appendChild(clone)
    body.appendChild(editFragment);
}

const removeChild = child => {
    body.removeChild(child)
}

const confirmRemoveTask = taskToRemove => {
    const confirmRemove = confirm(`Do you want to remove this task? (${taskToRemove.querySelector('h2').textContent})`);
    if (confirmRemove){
        removeChild(taskToRemove);
        totalTasks--;
        changeNumberTasks(totalTasks);
    }
}

const confirmChangeTask = (task) => {
    const taskChanged = document.getElementById('editCard')
    task.querySelector('h2').textContent = taskChanged.querySelector('input[name=taskName]').value;
    task.querySelector('p').textContent = taskChanged.querySelector('textarea').value;
    let imp = taskChanged.querySelector('select').value;
    task.querySelector('span').textContent = `Importance : ${imp}`;
    let span = task.querySelector('span');
    color = selectStyle(imp);
    span.style.backgroundColor = color;
    spanColor(span, imp)
    removeChild(taskChanged)
}

body.addEventListener('click', e => {
    if (e.path[0].localName == 'button' || e.path[0].localName == 'input'){
        if (e.path[2].classList.contains('task')){
            task = e.path[2];
        }
        let button = e.path[0];
        if (button.getAttribute('class') == 'delete'){
            confirmRemoveTask(task);
        }
        else if (button.getAttribute('class') == 'edit'){
            editTask(task);
        }
        else if (button.getAttribute('value') == 'Confirm Change'){
            e.preventDefault();
            confirmChangeTask(task);
        }
    }
    else if (e.path[0].localName == 'img'){
        let editCard = e.path[1];
        removeChild(editCard);
    }
})