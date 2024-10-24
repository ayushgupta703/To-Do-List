document.addEventListener('DOMContentLoaded', function () {
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const categoryInput = document.getElementById('category');
    const deadlineInput = document.getElementById('deadline');
    const priorityInput = document.getElementById('priority');
    const filterAllButton = document.getElementById('filter-all');
    const filterCompletedButton = document.getElementById('filter-completed');
    const filterUncompletedButton = document.getElementById('filter-uncompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks(filter = "all") {
        taskList.innerHTML = '';
        let filteredTasks = tasks.filter(task => {
            if (filter === "completed") return task.completed;
            if (filter === "uncompleted") return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <div class="task-info">
                    <span class="task-text ${task.completed ? 'complete' : ''}">${task.text}</span>
                    <span class="task-details">Category: ${task.category}, Due: ${task.deadline}, Priority: ${task.priority}</span>
                </div>
                <button class="edit-task">Edit</button>
                <button class="delete-task">X</button>
            `;

            taskItem.querySelector('.task-text').addEventListener('click', function () {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });

            taskItem.querySelector('.delete-task').addEventListener('click', function () {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks(filter);
            });

            taskItem.querySelector('.edit-task').addEventListener('click', function () {
                const newText = prompt('Edit task:', task.text);
                if (newText) {
                    task.text = newText;
                    saveTasks();
                    renderTasks(filter);
                }
            });

            taskList.appendChild(taskItem);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskButton.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            text: taskText,
            category: categoryInput.value,
            deadline: deadlineInput.value,
            priority: priorityInput.value,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        newTaskInput.value = '';
    });

    filterAllButton.addEventListener('click', function () {
        renderTasks('all');
    });

    filterCompletedButton.addEventListener('click', function () {
        renderTasks('completed');
    });

    filterUncompletedButton.addEventListener('click', function () {
        renderTasks('uncompleted');
    });

    renderTasks();
});
