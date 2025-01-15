const addBtn = document.querySelector("#add-button")
const taskForm = document.querySelector("dialog")
const closeDialog = document.querySelector("#close-button")

function handleAddTask(){
  taskForm.showModal()
}

function handleCloseDialog(){
  taskForm.close()
}

addBtn.addEventListener("click", handleAddTask)
closeDialog.addEventListener("click", handleCloseDialog)