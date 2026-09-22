// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelector(".filters");

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task) => {

        const li = document.createElement("li");
        li.className = "task";
        li.dataset.id = task.id;

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit";
        editButton.dataset.action = "edit";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.dataset.action = "delete";

        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

// Add a new task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

// Add button event
addBtn.addEventListener("click", addTask);

// Press Enter to add task
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// Event delegation for task actions
taskList.addEventListener("click", function(event) {

    const taskElement = event.target.closest(".task");

    if (!taskElement) {
        return;
    }

    const taskId = Number(taskElement.dataset.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    // Complete / uncomplete task
    if (event.target.classList.contains("task-text")) {

        task.completed = !task.completed;

        saveTasks();

        displayTasks();

        return;
    }

    // Edit task
    if (event.target.dataset.action === "edit") {

        const newText = prompt("Edit task:", task.text);

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();

            displayTasks();
        }

        return;
    }

    // Delete task
    if (event.target.dataset.action === "delete") {

        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();

        displayTasks();
    }

});

// Filter buttons
filters.addEventListener("click", function(event) {

    if (!event.target.dataset.filter) {
        return;
    }

    currentFilter = event.target.dataset.filter;

    displayTasks();
});

// Display tasks when page loads
displayTasks();