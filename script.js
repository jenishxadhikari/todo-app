// DOM Element
const todoTaskDisplay = document.querySelector('#displayTodoTask')
const completedTaskDisplay = document.querySelector('#displayCompletedTask')
const addTaskButton = document.getElementById('addTask')
const taskDialog = document.querySelector('dialog')
const closeDialogButton = document.getElementById('closeDialog')
const taskForm = document.querySelector('form')
const taskOptions = document.getElementById('taskOptions')
const priorityOptions = document.getElementById('priorityOptions')

// Local Storage Data
const todoList = JSON.parse(localStorage.getItem('todoList')) || []
const completedList = JSON.parse(localStorage.getItem('completedList')) || []

// Initial Display
if (todoList.length > 0 || completedList.length > 0) {
  renderTasks()
}

// Helper Functions
function updateLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList))
  localStorage.setItem('completedList', JSON.stringify(completedList))
}

function renderTasks() {
  const filterValue = taskOptions.value

  todoTaskDisplay.innerHTML = ''
  completedTaskDisplay.innerHTML = ''

  switch (filterValue) {
    case 'completed':
      renderCompletedTask()
      break
    case 'incomplete':
      renderTodoTasks()
      break
    default:
      renderTodoTasks()
      renderCompletedTask()
  }
  document.querySelectorAll('#status').forEach((btn) => {
    btn.addEventListener('click', handleStatus)
  })
  document.querySelectorAll('#delete').forEach((btn) => {
    btn.addEventListener('click', handleDelete)
  })
  document.querySelectorAll('#edit').forEach((btn) => {
    btn.addEventListener('click', handleEdit)
  })
}

function renderTodoTasks() {
  todoTaskDisplay.innerHTML = ''
  todoList.forEach((task) => {
    let priority = Array.from(priorityOptions.options).find(
      (option) => option.value === task.priority
    ).text
    todoTaskDisplay.innerHTML += `
      <div class="flex tasks-center justify-between gap-2" id="task" data-id=${
        task.id
      }>
        <div class="flex tasks-center gap-2 md:gap-3">
          <input type="checkbox" value="true" class="size-5 md:size-6" id="status" ${
            task.isCompleted && 'checked'
          }>
          <p class="max-w-prose text-sm text-pretty md:text-base ${
            task.isCompleted && 'line-through'
          }" id="title">${task.title}</p>
        </div>
        <div class="flex tasks-center gap-4 shrink-0 md:gap-6">
          <p class="text-xs underline underline-offset-2 md:text-sm">${
            task.dueDate
          }</p>
          <span>${priority}</span>
          <button id="edit">✏️</button>
          <button id="delete">❌</button>
        </div>
      </div>
    `
  })
}

function renderCompletedTask() {
  completedTaskDisplay.innerHTML = ''
  completedList.forEach((task) => {
    completedTaskDisplay.innerHTML += `
      <div class="flex tasks-center justify-between gap-2" id="task" data-id=${
        task.id
      }>
        <div class="flex tasks-center gap-2 md:gap-3">
          <input type="checkbox" value="true" class="size-5 md:size-6" id="status" ${
            task.isCompleted && 'checked'
          }>
          <p class="max-w-prose text-sm text-pretty md:text-base ${
            task.isCompleted && 'line-through'
          }" id="title">${task.title}</p>
        </div>
        <div class="flex tasks-center gap-4 shrink-0 md:gap-6">
          <p class="text-xs underline underline-offset-2 md:text-sm">${
            task.dueDate
          }</p>
        </div>
      </div>
    `
  })
}

// Event Handlers
function handleAddTask() {
  taskDialog.showModal()
}

function handleCloseDialog() {
  taskForm.reset()
  taskDialog.close()
}

function handleSubmit(e) {
  e.preventDefault()

  const randomId = Math.floor(Math.random() * 100)
  const editId = taskForm.dataset.editId
  const newTask = {
    id: (editId && parseInt(editId)) || randomId,
    title: e.target.title.value,
    dueDate: e.target.date.value,
    priority: e.target.priorityOptions.value,
    isCompleted: false,
  }

  if (editId) {
    const index = todoList.findIndex((task) => task.id === parseInt(editId))
    todoList[index] = newTask
  } else {
    todoList.push(newTask)
  }

  taskForm.dataset.editId = ''
  updateLocalStorage()
  taskForm.reset()
  taskDialog.close()
  renderTasks()
}

function handleDelete(e) {
  const id = e.target.closest('#task').dataset.id
  const index = todoList.findIndex((task) => task.id === parseInt(id))
  todoList.splice(index, 1)

  updateLocalStorage()
  renderTasks()
}

function handleEdit(e) {
  const id = e.target.closest('#task').dataset.id
  const index = todoList.findIndex((task) => task.id === parseInt(id))
  const currentTask = todoList[index]

  taskDialog.showModal()
  taskForm.title.value = currentTask.title
  taskForm.date.value = currentTask.dueDate
  taskForm.priorityOptions.value = currentTask.priority

  taskForm.dataset.editId = currentTask.id
}

function handleStatus(e) {
  const id = e.target.closest('#task').dataset.id
  const TIndex = todoList.findIndex((task) => task.id === parseInt(id))
  const CIndex = completedList.findIndex((task) => task.id === parseInt(id))

  if (
    (TIndex != -1 && !todoList[TIndex].isCompleted) ||
    (CIndex && !completedList[CIndex].isCompleted)
  ) {
    todoList[TIndex].isCompleted = true
    e.target.checked = true
    completedList.push(todoList[TIndex])
    todoList.splice(TIndex, 1)
  } else {
    completedList[CIndex].isCompleted = false
    e.target.checked = false
    todoList.push(completedList[CIndex])
    completedList.splice(CIndex, 1)
  }

  updateLocalStorage()
  renderTasks()
}

// Event Listeners
addTaskButton.addEventListener('click', handleAddTask)
closeDialogButton.addEventListener('click', handleCloseDialog)
taskForm.addEventListener('submit', handleSubmit)
taskOptions.addEventListener('change', renderTasks)
