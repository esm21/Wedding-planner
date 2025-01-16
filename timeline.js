// Timeline and Task Management
class WeddingTimeline {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('weddingTasks')) || [];
        this.initializeEventListeners();
        this.renderTasks();
        this.renderCalendar();
    }

    initializeEventListeners() {
        // Add Task Button
        const addTaskBtn = document.querySelector('.btn-add-task');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                const modal = document.getElementById('addTaskModal');
                if (modal) modal.style.display = 'block';
            });
        }

        // Form Submission
        const taskForm = document.getElementById('addTaskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });
        }

        // Filters
        const statusFilter = document.getElementById('filterStatus');
        const categoryFilter = document.getElementById('filterCategory');
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterTasks());
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterTasks());

        // Close Modal
        const cancelBtn = document.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                const modal = document.getElementById('addTaskModal');
                if (modal) modal.style.display = 'none';
            });
        }
    }

    addTask() {
        const titleInput = document.getElementById('taskTitle');
        const descInput = document.getElementById('taskDescription');
        const dateInput = document.getElementById('taskDueDate');
        const categoryInput = document.getElementById('taskCategory');

        if (!titleInput || !dateInput || !categoryInput) return;

        const task = {
            id: Date.now(),
            title: titleInput.value,
            description: descInput ? descInput.value : '',
            dueDate: dateInput.value,
            category: categoryInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.renderCalendar();

        // Close modal and reset form
        const modal = document.getElementById('addTaskModal');
        const form = document.getElementById('addTaskForm');
        if (modal) modal.style.display = 'none';
        if (form) form.reset();
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.renderCalendar();
        }
    }

    filterTasks() {
        const statusFilter = document.getElementById('filterStatus');
        const categoryFilter = document.getElementById('filterCategory');

        if (!statusFilter || !categoryFilter) return;

        let filteredTasks = this.tasks;

        if (statusFilter.value !== 'all') {
            filteredTasks = filteredTasks.filter(task => 
                statusFilter.value === 'completed' ? task.completed : !task.completed
            );
        }

        if (categoryFilter.value !== 'all') {
            filteredTasks = filteredTasks.filter(task => 
                task.category === categoryFilter.value
            );
        }

        this.renderTaskList(filteredTasks);
    }

    renderTasks() {
        this.renderTaskList(this.tasks);
        this.renderTimeline();
    }

    renderTaskList(tasks) {
        const taskList = document.querySelector('.task-list');
        if (!taskList) return;

        taskList.innerHTML = tasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(task => `
                <div class="task-card ${task.completed ? 'completed' : ''}">
                    <div class="task-info">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <span class="task-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div class="task-actions">
                        <button onclick="weddingTimeline.toggleTaskStatus(${task.id})">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                    </div>
                </div>
            `).join('');
    }

    renderTimeline() {
        const timeline = document.querySelector('.timeline-view');
        if (!timeline) return;

        timeline.innerHTML = this.tasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(task => `
                <div class="timeline-item">
                    <div class="timeline-date">
                        ${new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div class="timeline-content">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                    </div>
                </div>
            `).join('');
    }

    renderCalendar() {
        const calendar = document.querySelector('.calendar-view');
        if (!calendar) return;

        const currentDate = new Date();
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        calendar.innerHTML = `
            <div class="calendar-header">
                <h2>${monthStart.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}</h2>
            </div>
            <div class="calendar-grid">
                ${this.generateCalendarDays(currentDate)}
            </div>
        `;
    }

    generateCalendarDays(date) {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        
        let calendarHtml = `
            <div class="calendar-weekdays">
                <div>Sun</div><div>Mon</div><div>Tue</div>
                <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div class="calendar-days">
        `;

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarHtml += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
            const tasksForDay = this.tasks.filter(task => 
                new Date(task.dueDate).toDateString() === currentDate.toDateString()
            );

            calendarHtml += `
                <div class="calendar-day ${tasksForDay.length ? 'has-tasks' : ''}">
                    ${day}
                    ${tasksForDay.length ? `<span class="task-count">${tasksForDay.length}</span>` : ''}
                </div>
            `;
        }

        calendarHtml += '</div>';
        return calendarHtml;
    }

    saveTasks() {
        localStorage.setItem('weddingTasks', JSON.stringify(this.tasks));
    }
}

// Initialize Timeline
const weddingTimeline = new WeddingTimeline(); 
