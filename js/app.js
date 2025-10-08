const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Cargar tareas desde LocalStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();

// Agregar nueva tarea
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
        todos.push({ text: task, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});

// Guardar tareas en LocalStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Renderizar tareas
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button onclick="toggleComplete(${index})">✔️</button>
                <button onclick="deleteTodo(${index})">❌</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Marcar tarea como completada
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Eliminar tarea
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// Hacer funciones accesibles globalmente
window.toggleComplete = toggleComplete;
window.deleteTodo = deleteTodo;
