const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const darkToggle = document.getElementById("darkToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Dark mode persistente
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

// Inicializar calendario
const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
  initialView: "dayGridMonth",
  height: 600,
  events: tasks.map(t => ({
    title: t.text,
    start: t.date ? `${t.date}T${t.time || "00:00"}` : undefined
  }))
});
calendar.render();

// Guardar y renderizar
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
  calendar.removeAllEvents();
  calendar.addEventSource(tasks.map(t => ({
    title: t.text,
    start: t.date ? `${t.date}T${t.time || "00:00"}` : undefined
  })));
}

// Renderizar tareas
function render() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="text-decoration:${task.completed ? "line-through" : "none"}">
        [${task.category}] ${task.text} ${task.date ? `(${task.date} ${task.time || ""})` : ""}
      </span>
      <div>
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Agregar tarea
taskForm.addEventListener("submit", e => {
  e.preventDefault();

  const task = {
    text: taskInput.value,
    category: categorySelect.value,
    date: dateInput.value || null,
    time: timeInput.value || null,
    completed: false
  };

  tasks.push(task);
  saveTasks();

  // Notificación segura
  if (task.date && task.time) {
    scheduleNotification(task);
  }

  taskForm.reset();
});

// Completar tarea
function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
}

// Eliminar tarea
function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
}

// Filtros
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Notificaciones
function scheduleNotification(task) {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(perm => {
    if (perm === "granted") {
      const taskDate = new Date(`${task.date}T${task.time}`);
      if (isNaN(taskDate)) return;

      const timeout = taskDate.getTime() - Date.now();
      if (timeout > 0) {
        setTimeout(() => {
          new Notification("Recordatorio", { body: task.text });
        }, timeout);
      }
    }
  });
}

render();
