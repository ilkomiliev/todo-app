const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoStatus = document.getElementById("todo-status");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-toggle-icon");
const todoLists = {
    new: document.getElementById("todo-list-new"),
    wip: document.getElementById("todo-list-wip"),
    done: document.getElementById("todo-list-done")
};

const todos = [];
const statusLabels = {
    new: "New",
    wip: "WIP",
    done: "Done"
};

function applyTheme(isDark) {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDarkInitial = savedTheme ? savedTheme === "dark" : prefersDark;
applyTheme(isDarkInitial);

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
});

function renderTodos() {
    Object.values(todoLists).forEach((list) => {
        list.innerHTML = "";
    });

    todos.forEach((todo, index) => {
        const listItem = document.createElement("li");
        listItem.className = "todo-item";

        const content = document.createElement("div");
        content.className = "todo-item-content";

        const header = document.createElement("div");
        header.className = "todo-item-header";

        const text = document.createElement("span");
        text.textContent = todo.text;

        const badge = document.createElement("span");
        badge.className = `todo-status-badge status-${todo.status}`;
        badge.textContent = statusLabels[todo.status];

        header.append(text, badge);
        content.append(header);

        const actions = document.createElement("div");
        actions.className = "todo-item-actions";

        const statusSelect = document.createElement("select");
        statusSelect.setAttribute("aria-label", `Status for ${todo.text}`);

        Object.entries(statusLabels).forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            option.selected = todo.status === value;
            statusSelect.append(option);
        });

        statusSelect.addEventListener("change", (event) => {
            todos[index].status = event.target.value;
            renderTodos();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            todos.splice(index, 1);
            renderTodos();
        });

        actions.append(statusSelect, deleteButton);
        listItem.append(content, actions);
        todoLists[todo.status].append(listItem);
    });

    Object.entries(todoLists).forEach(([status, list]) => {
        if (list.children.length > 0) {
            return;
        }

        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent = `No ${statusLabels[status].toLowerCase()} tasks.`;
        list.append(emptyMessage);
    });
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const todoText = todoInput.value.trim();
    if (!todoText) {
        todoInput.focus();
        return;
    }

    todos.push({
        text: todoText,
        status: todoStatus.value
    });
    todoInput.value = "";
    todoStatus.value = "new";
    todoInput.focus();
    renderTodos();
});

renderTodos();