const todoText = document.getElementById("todoText");
const todoDate = document.getElementById("todoDate");
const todoList = document.getElementById("todoList");
const filter = document.getElementById("filter");
const darkToggle = document.getElementById("darkToggle");
const addBtn = document.getElementById("addBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) document.body.classList.add("dark");

addBtn.addEventListener("click", addTodo);
filter.addEventListener("change", renderTodos);
darkToggle.addEventListener("click", toggleDarkMode);

todoText.addEventListener("keydown", e => {
    if (e.key === "Enter") addTodo();
});

todoList.addEventListener("click", handleListClick);
todoList.addEventListener("change", handleListChange);
todoList.addEventListener("blur", handleListBlur, true);

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", darkMode);
}

function addTodo() {
    if (!todoText.value || !todoDate.value) return;

    todos.push({
        id: Date.now(),
        text: todoText.value.trim(),
        date: todoDate.value,
        completed: false
    });

    todoText.value = "";
    todoDate.value = "";
    saveAndRender();
}

function handleListClick(e) {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (e.target.matches(".delete")) {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
    }
}

function handleListChange(e) {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);

    if (e.target.matches(".complete")) {
        todo.completed = e.target.checked;
        saveAndRender();
    }

    if (e.target.matches(".date-input")) {
        todo.date = e.target.value;
        saveAndRender();
    }
}

function handleListBlur(e) {
    if (!e.target.matches(".todo-text")) return;

    const li = e.target.closest("li");
    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);

    if (e.target.innerText.trim() !== "") {
        todo.text = e.target.innerText.trim();
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    const filtered = todos.filter(todo => {
        if (filter.value === "today") return todo.date === today;
        if (filter.value === "upcoming") return todo.date > today;
        if (filter.value === "overdue") return todo.date < today;
        return true;
    });

    if (filtered.length === 0) {
        todoList.innerHTML = `<div class="empty">No tasks found, Let's add a new one </div>`;
        return;
    }

    filtered.forEach(todo => {
        const li = document.createElement("li");
        li.dataset.id = todo.id;
        if (todo.completed) li.classList.add("completed");

        li.innerHTML = `
            <div>
                <input type="checkbox" class="complete" ${todo.completed ? "checked" : ""}>
                <span class="todo-text" contenteditable="true">${todo.text}</span>
                <input type="date" class="date-input" value="${todo.date}">
            </div>
            <div class="actions">
                <button class="delete">🗑</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

renderTodos();
