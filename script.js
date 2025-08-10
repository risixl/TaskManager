document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const countElement = document.getElementById('count');
  const clearBtn = document.getElementById('clearBtn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({
        id: Date.now(),
        text,
        completed: false
      });
      taskInput.value = '';
      saveTasks();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
  }

  function toggleTask(id) {
    tasks = tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
  }

  function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });
    
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskItem.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;
      
      taskItem.querySelector('input').addEventListener('change', () => toggleTask(task.id));
      taskItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
      
      taskList.appendChild(taskItem);
    });
    
    countElement.textContent = tasks.filter(t => !t.completed).length;
  }

  // Event Listeners
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  clearBtn.addEventListener('click', clearCompleted);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  renderTasks();
});