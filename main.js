const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');
const schedule = require('node-schedule');

let mainWindow;

function createWindow() {
    console.log('Creating main window...');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.on('closed', function () {
        console.log('Main window closed');
        mainWindow = null;
    });
}

app.on('ready', () => {
    console.log('App is ready');
    createWindow();
    scheduleAllTasks();
});

app.on('window-all-closed', function () {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    console.log('App activated');
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('add-task', async (event, task) => {
    console.log('Adding task:', task);
    await Database.addTask(task);
    scheduleTask(task);
});

ipcMain.handle('get-tasks', async () => {
    console.log('Getting tasks...');
    const tasks = await Database.getTasks();
    console.log('Tasks:', tasks);
    return tasks;
});

ipcMain.handle('mark-task-completed', async (event, taskId) => {
    console.log('Marking task as completed:', taskId);
    await Database.markTaskAsCompleted(taskId);
});

function scheduleTask(task) {
    console.log('Scheduling task:', task);
    schedule.scheduleJob(task.time, () => {
        console.log(`Executing task: ${task.name}`);
        mainWindow.webContents.send('task-executed', task.id);
        // Add actual task execution code here
    });
}

async function scheduleAllTasks() {
    console.log('Scheduling all tasks...');
    const tasks = await Database.getTasks();
    tasks.forEach(scheduleTask);
}
