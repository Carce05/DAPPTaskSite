const taskForm = document.querySelector("#taskForm");

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

taskForm.addEventListener("submit", e => {
    e.preventDefault()
    const title = taskForm["title"].value;
    const description = taskForm["description"].value;


    App.createTask(title, description);
});