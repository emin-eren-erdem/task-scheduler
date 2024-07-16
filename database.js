const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tasks.db');

db.serialize(() => {
    console.log('Creating tasks table if not exists...');
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    name TEXT,
    time TEXT,
    completed INTEGER DEFAULT 0
  )`);
});

module.exports = {
    addTask: (task) => {
        console.log('Inserting task into database:', task);
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO tasks (name, time, completed) VALUES (?, ?, ?)");
            stmt.run(task.name, task.time, 0, function (err) {
                if (err) {
                    console.error('Error inserting task:', err);
                    reject(err);
                } else {
                    console.log('Task inserted successfully');
                    resolve();
                }
            });
            stmt.finalize();
        });
    },
    getTasks: () => {
        console.log('Fetching all tasks from database...');
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM tasks", (err, rows) => {
                if (err) {
                    console.error('Error fetching tasks:', err);
                    reject(err);
                } else {
                    console.log('Tasks fetched successfully:', rows);
                    resolve(rows);
                }
            });
        });
    },
    markTaskAsCompleted: (taskId) => {
        console.log('Marking task as completed:', taskId);
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?");
            stmt.run(taskId, function (err) {
                if (err) {
                    console.error('Error marking task as completed:', err);
                    reject(err);
                } else {
                    console.log('Task marked as completed');
                    resolve();
                }
            });
            stmt.finalize();
        });
    }
};
