function handleStatus(e) {
  const id = e.target.closest("#task").dataset.id;
  const index = todoList.findIndex((task) => task.id === parseInt(id))
  todoList[index].isCompleted = e.target.checked;

  updateLocalStorage()
  renderTasks()
}

document.querySelectorAll("#status").forEach((item) => {
  item.addEventListener("click", handleStatus)
})