document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    deleteAllBtn.addEventListener('click', () => {
        localStorage.removeItem('tasks');
        localStorage.removeItem('completedTasks');
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';
    });

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const listItem = createTaskItem(taskText);
            taskList.appendChild(listItem);
            newTaskInput.value = '';
            saveTasks();
        }
    }

    function createTaskItem(taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        const taskButtons = document.createElement('div');
        taskButtons.className = 'task-buttons';

        const doneBtn = document.createElement('button');
        doneBtn.textContent = 'Done';
        doneBtn.className = 'done-btn';
        doneBtn.addEventListener('click', () => {
            moveToCompleted(listItem, taskText);
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', () => {
            taskList.removeChild(listItem);
            saveTasks();
        });

        taskButtons.appendChild(doneBtn);
        taskButtons.appendChild(removeBtn);
        listItem.appendChild(taskButtons);
        return listItem;
    }

    function moveToCompleted(listItem, taskText) {
        taskList.removeChild(listItem);
        const completedItem = document.createElement('li');
        completedItem.textContent = taskText;
        completedTaskList.appendChild(completedItem);
        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(item => item.textContent.replace(/DoneRemove$/, '').trim());
        const completedTasks = Array.from(completedTaskList.children).map(item => item.textContent.trim());
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        tasks.forEach(task => {
            const listItem = createTaskItem(task);
            taskList.appendChild(listItem);
        });

        completedTasks.forEach(task => {
            const completedItem = document.createElement('li');
            completedItem.textContent = task;
            completedTaskList.appendChild(completedItem);
        });
    }
});
