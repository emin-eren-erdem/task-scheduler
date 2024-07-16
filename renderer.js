const { ipcRenderer } = require('electron');

document.getElementById('addTaskForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskTime = document.getElementById('taskTime').value;
    console.log('Form submitted with task name and time:', taskName, taskTime);
    await ipcRenderer.invoke('add-task', { name: taskName, time: taskTime });
    document.getElementById('taskName').value = '';
    document.getElementById('taskTime').value = '';
    loadTasks();
});

ipcRenderer.on('task-executed', (event, taskId) => {
    console.log('Task executed:', taskId);
    ipcRenderer.invoke('mark-task-completed', taskId).then(loadTasks);
});

async function loadTasks() {
    console.log('Loading tasks...');
    const tasks = await ipcRenderer.invoke('get-tasks');
    console.log('Tasks loaded:', tasks);
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
      ${task.name} - ${task.time}
      <span class="badge ${task.completed ? 'badge-success' : 'badge-danger'}">${task.completed ? 'Completed' : 'Pending'}</span>
    `;
        taskList.appendChild(li);
    });
}

loadTasks();

// Dark/Light Mode Toggle
const toggleModeButton = document.getElementById('toggleMode');
toggleModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    toggleModeButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});
