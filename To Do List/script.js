let tasks = [];
let taskIdCounter = 1;

const taskInput = document.getElementById('taskInput');
const todoList = document.getElementById('todoList'); 
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const clearAllBtn = document.getElementById('clearAllBtn');

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(task);
    taskInput.value = '';
    renderTasks();
    updateStats();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateStats();
}

function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        renderTasks();
        updateStats();
    }
}

function renderTasks() {
    todoList.innerHTML = ''; 

    if (tasks.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Add your first task above to get started!</p>
            </div>
        `;
        todoList.appendChild(emptyLi);
        clearAllBtn.style.display = 'none';
        return;
    }

    clearAllBtn.style.display = 'block';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''} new-item`;

        const checkbox = document.createElement('div');
        checkbox.className = `todo-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.onclick = () => toggleTask(task.id);

        const text = document.createElement('div');
        text.className = 'todo-text';
        text.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });

    setTimeout(() => {
        document.querySelectorAll('.new-item').forEach(item => {
            item.classList.remove('new-item');
        });
    }, 300);
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearAllBtn.addEventListener('click', clearAllTasks);

taskInput.focus();
updateStats();
