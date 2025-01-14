document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log
    
    // Initialize predefined elements first
    initializePredefinedElements();
    
    // Setup event listeners first
    setupEventListeners();
    
    // Handle URL parameter navigation
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        showSection(section);
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
    } else {
        // If no section specified, show civil section by default
        showSection('civil');
    }
    
    // Load saved details
    const savedDate = localStorage.getItem('weddingDate');
    const savedGuests = localStorage.getItem('totalGuests');
    if (savedDate) document.getElementById('wedding-date').value = savedDate;
    if (savedGuests) document.getElementById('total-guests').value = savedGuests;

    updateBudget();

    // Update countdown on landing page if we're on index.html
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const weddingDate = localStorage.getItem('wedding-date');
        if (weddingDate) {
            const today = new Date();
            const wedding = new Date(weddingDate);
            const diffTime = wedding - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            countdownElement.textContent = diffDays > 0 ? diffDays : 0;
        }
    }

    // Update planning progress on landing page
    const progressBar = document.getElementById('planning-progress');
    if (progressBar) {
        const completedTasks = localStorage.getItem('completed-tasks') || 0;
        const totalTasks = localStorage.getItem('total-tasks') || 1;
        const progress = (completedTasks / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }

    // Initialize planning section
    updateWeddingCountdown();
    
    // Add task button handler
    document.getElementById('add-task').addEventListener('click', () => {
        const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
        taskModal.show();
    });

    // Task filter handler
    document.getElementById('task-status-filter').addEventListener('change', function() {
        const status = this.value;
        const tasks = document.querySelectorAll('.timeline-item');
        tasks.forEach(task => {
            if (status === 'all' || task.dataset.status === status) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    });

    // Update countdown when wedding date changes
    const weddingDateInput = document.getElementById('wedding-date');
    if (weddingDateInput) {
        weddingDateInput.addEventListener('change', updateWeddingCountdown);
    }
});
