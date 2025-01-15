document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log

    // 1. Initialize predefined elements
    initializePredefinedElements();

    // 2. Setup all event listeners (navigation, buttons, inputs, etc.)
    setupEventListeners();

    // 3. Setup drag-and-drop drop zones (for tables and unassigned guests)
    setupDropZones();

    // 4. Set up special listeners or updates for the "tables" section
    //    Whenever the user navigates to the "tables" section, reinitialize the drop zones
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (this.getAttribute('data-section') === 'tables') {
                setTimeout(setupDropZones, 100); // Small delay to ensure DOM is ready
            }
        });
    });

    // 5. Handle URL parameter navigation
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');

    if (section) {
        showSection(section);

        // Update navigation highlighting
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

    // 6. Load saved details (date, guests) from localStorage
    const savedDate = localStorage.getItem('weddingDate');
    const savedGuests = localStorage.getItem('totalGuests');

    if (savedDate) document.getElementById('wedding-date').value = savedDate;
    if (savedGuests) document.getElementById('total-guests').value = savedGuests;

    updateBudget();

    // 7. Landing page-specific: update countdown
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

    // 8. Landing page-specific: update planning progress
    const progressBar = document.getElementById('planning-progress');
    if (progressBar) {
        const completedTasks = localStorage.getItem('completed-tasks') || 0;
        const totalTasks = localStorage.getItem('total-tasks') || 1;
        const progress = (completedTasks / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }

    // 9. Setup checklist listeners (for any checkboxes on the page)
    const checkboxes = document.querySelectorAll('.form-check-input');
    if (checkboxes.length > 0) {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateChecklistProgress);
        });
    }

    // 10. Countdown update for the wedding date
    updateWeddingCountdown();

    // 11. Update countdown when wedding date changes
    const weddingDateInput = document.getElementById('wedding-date');
    if (weddingDateInput) {
        weddingDateInput.addEventListener('change', updateWeddingCountdown);
    }

    // 12. Initialize guests section (if we are on that page)
    const guestsSection = document.getElementById('guests-section');
    if (guestsSection) {
        // Load saved guests from localStorage
        const savedGuestsData = JSON.parse(localStorage.getItem('wedding-guests') || '[]');

        // Populate guests table
        const tbody = document.querySelector('#guests-table tbody');
        if (tbody) {
            savedGuestsData.forEach(guest => {
                const row = tbody.insertRow();
                row.setAttribute('data-guest-id', guest.id);
                row.innerHTML = createGuestRowHTML(guest);
            });
        }

        // Populate unassigned guests area and tables
        const unassignedArea = document.getElementById('unassigned-guests');
        if (unassignedArea) {
            savedGuestsData.forEach(guest => {
                const guestElement = createGuestItem(guest.name, guest.id, guest.plusOnes);

                if (guest.tableId) {
                    // If the guest had an assigned table
                    const targetTable = document.querySelector(`.table-guests[data-table-id="${guest.tableId}"]`);
                    if (targetTable) {
                        const tableGuest = guestElement.cloneNode(true);
                        setupDragAndDrop(tableGuest);
                        targetTable.appendChild(tableGuest);
                    }
                } else {
                    // Otherwise, put them in unassigned
                    setupDragAndDrop(guestElement);
                    unassignedArea.appendChild(guestElement);
                }
            });
        }

        updateGuestCounts();
    }
});

// -------------------- CORE FUNCTIONS -------------------- //

function setupEventListeners() {
    console.log('Setting up event listeners...'); // Debug log

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section); // Debug log

            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            // Add active class to clicked link
            this.classList.add('active');
            showSection(section);
            history.pushState(null, '', `?section=${section}`);
        });
    });

    // Handle "Volver al Inicio" button if present
    const homeButton = document.querySelector('a[href="index.html"]');
    if (homeButton) {
        homeButton.addEventListener('click', function(e) {
            // Default behavior to go home
        });
    }

    // Add buttons event listeners - check for null
    const addCivilBtn = document.getElementById('add-civil-item');
    const addReligiousBtn = document.getElementById('add-religious-item');
    const addBanquetBtn = document.getElementById('add-banquet-item');
    const addGuestBtn = document.getElementById('add-guest');
    const addTableBtn = document.getElementById('add-table');

    if (addCivilBtn) addCivilBtn.addEventListener('click', () => addNewItem('civil'));
    if (addReligiousBtn) addReligiousBtn.addEventListener('click', () => addNewItem('religious'));
    if (addBanquetBtn) addBanquetBtn.addEventListener('click', () => addNewItem('banquet'));
    if (addGuestBtn) addGuestBtn.addEventListener('click', addGuest);
    if (addTableBtn) addTableBtn.addEventListener('click', addTable);

    // Budget calculator inputs
    const initialBudgetInput = document.getElementById('initial-budget');
    if (initialBudgetInput) {
        initialBudgetInput.addEventListener('input', updateBudget);
    }

    const saveDetailsBtn = document.getElementById('save-details');
    if (saveDetailsBtn) {
        saveDetailsBtn.addEventListener('click', saveBasicDetails);
    }

    // Planning tasks (Add Task, Save Task, Filter tasks)
    const addTaskBtn = document.getElementById('add-task');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', showTaskModal);
    }

    const saveTaskBtn = document.getElementById('save-task');
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', saveTask);
    }

    const taskStatusFilter = document.getElementById('task-status-filter');
    if (taskStatusFilter) {
        taskStatusFilter.addEventListener('change', filterTasks);
    }

    const taskTimelineFilter = document.getElementById('task-timeline-filter');
    if (taskTimelineFilter) {
        taskTimelineFilter.addEventListener('change', filterTasks);
    }

    // Guest filtering
    const guestSearchInput = document.getElementById('guest-search');
    if (guestSearchInput) {
        guestSearchInput.addEventListener('input', filterGuestsByName);
    }

    // Guest filtering by status
    const filterAllBtn = document.getElementById('filter-all');
    if (filterAllBtn) {
        filterAllBtn.addEventListener('click', () => filterGuests('all'));
    }
    const filterConfirmedBtn = document.getElementById('filter-confirmed');
    if (filterConfirmedBtn) {
        filterConfirmedBtn.addEventListener('click', () => filterGuests('Confirmado'));
    }
    const filterPendingBtn = document.getElementById('filter-pending');
    if (filterPendingBtn) {
        filterPendingBtn.addEventListener('click', () => filterGuests('Pendiente'));
    }

    // Import/Export guests
    const importGuestsBtn = document.getElementById('import-guests');
    if (importGuestsBtn) {
        importGuestsBtn.addEventListener('click', importGuests);
    }
    const exportGuestsBtn = document.getElementById('export-guests');
    if (exportGuestsBtn) {
        exportGuestsBtn.addEventListener('click', () => {
            alert('Funcionalidad de exportación en desarrollo');
        });
    }

    // Export to Excel/PDF
    const exportExcelBtn = document.getElementById('export-excel');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }

    const exportPdfBtn = document.getElementById('export-pdf');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPDF);
    }
}

function showSection(sectionId) {
    console.log('Showing section:', sectionId); // Debug log
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Scroll to top when changing sections
        window.scrollTo(0, 0);
        updateBudget();
    } else {
        console.error(`Section not found: ${sectionId}-section`);
    }
}

// -------------------- PREDEFINED ELEMENTS -------------------- //

function initializePredefinedElements() {
    console.log('Initializing predefined elements...'); // Debug log

    console.log('Checking tables existence:');
    console.log('#civil-table:', document.querySelector('#civil-table tbody'));
    console.log('#religious-table:', document.querySelector('#religious-table tbody'));
    console.log('#banquet-table:', document.querySelector('#banquet-table tbody'));

    const civilElements = [
        { category: 'Lugar de la ceremonia', items: [
            'Alquiler de espacio',
            'Tarifa del registro civil o juzgado',
            'Gastos de transporte'
        ]},
        { category: 'Documentación y trámites', items: [
            'Certificaciones y legalizaciones necesarias',
            'Tarifa de expedición de acta de matrimonio',
            'Tarifa de legalización (si aplica)'
        ]},
        { category: 'Oficial de la ceremonia', items: [
            'Tarifa del juez o funcionario',
            'Propina o regalo de agradecimiento'
        ]},
        { category: 'Decoración del espacio', items: [
            'Arreglos florales',
            'Sillas',
            'Alfombra o camino nupcial',
            'Estructuras decorativas'
        ]},
        { category: 'Vestimenta', items: [
            'Vestido de novia',
            'Accesorios novia',
            'Peluquería',
            'Traje de novio',
            'Accesorios novio'
        ]},
        { category: 'Música y sonido', items: [
            'Equipo de sonido',
            'Música en vivo o DJ',
            'Micrófonos'
        ]},
        { category: 'Papelería', items: [
            'Invitaciones',
            'Programas impresos',
            'Libro de firmas'
        ]},
        { category: 'Fotografía y video', items: [
            'Fotógrafo',
            'Videógrafo',
            'Sesión de fotos'
        ]},
        { category: 'Personal de apoyo', items: [
            'Coordinador de la ceremonia',
            'Personal de apoyo'
        ]},
        { category: 'Extras', items: [
            'Transporte para familiares',
            'Sombrillas o carpas al aire libre',
            'Calefacción o ventilación'
        ]}
    ];

    const religiousElements = [
        { category: 'Lugar de la ceremonia', items: [
            'Alquiler del templo',
            'Tarifa de reserva',
            'Gastos de transporte'
        ]},
        { category: 'Documentación y trámites', items: [
            'Actas de bautismo o certificaciones legales',
            'Tarifa de expedición de acta de matrimonio',
            'Curso de preparación matrimonial'
        ]},
        { category: 'Oficial de la ceremonia', items: [
            'Tarifa del sacerdote',
            'Propina o regalo de agradecimiento'
        ]},
        { category: 'Decoración del espacio', items: [
            'Arreglos florales',
            'Sillas y otros',
            'Alfombra o camino nupcial',
            'Estructuras decorativas'
        ]},
        { category: 'Vestimenta', items: [
            'Vestido de novia',
            'Accesorios novia',
            'Peluquería',
            'Traje de novio',
            'Accesorios novio',
            'Atuendos para testigos, pajes, etc'
        ]},
        { category: 'Música y sonido', items: [
            'Equipo de sonido',
            'Música en vivo o DJ',
            'Micrófonos'
        ]},
        { category: 'Papelería', items: [
            'Invitaciones',
            'Programas impresos',
            'Libro de firmas'
        ]},
        { category: 'Fotografía y video', items: [
            'Fotógrafo',
            'Videógrafo',
            'Sesión de fotos'
        ]},
        { category: 'Personal de apoyo', items: [
            'Coordinador de la ceremonia',
            'Personal de apoyo'
        ]},
        { category: 'Extras', items: [
            'Transporte para familiares',
            'Sombrillas o carpas al aire libre',
            'Calefacción o ventilación'
        ]}
    ];

    const banquetElements = [
        { category: 'Lugar del convite', items: [
            'Alquiler de espacio',
            'Servicios adicionales (iluminación, etc)'
        ]},
        { category: 'Catering', items: [
            'Menú de entrada, cóctel, aperitivo, buffet',
            'Menú principal',
            'Opciones vegetarianas y veganas',
            'Postres',
            'Buffet adicional, recena',
            'Tarta nupcial',
            'Degustación previa, pruebas'
        ]},
        { category: 'Bebidas', items: [
            'Bebidas alcohólicas',
            'Bebidas sin alcohol',
            'Barra libre o servicio de barra',
            'Otros'
        ]},
        { category: 'Música y entretenimiento', items: [
            'DJ o banda en vivo',
            'Equipo de sonido',
            'Luces y efectos especiales',
            'Karaoke',
            'Artistas o animadores'
        ]},
        { category: 'Decoración', items: [
            'Centros de mesa',
            'Arreglos florales',
            'Arcos o estructuras decorativas',
            'Iluminación decorativa (velas, luces colgantes...)',
            'Mantelería y servilletas',
            'Vajilla y cubertería',
            'Carteles',
            'Photobooth'
        ]},
        { category: 'Mobiliario', items: [
            'Mesas y sillas',
            'Sillas de ceremonia (si procede)',
            'Sofás y zonas lounge',
            'Alquiler de carpas y/o toldos'
        ]},
        { category: 'Transporte', items: [
            'Transporte para invitados (autobuses, etc)',
            'Transporte para novios (limusina, coche clásico...)',
            'Estacionamiento y parking'
        ]},
        { category: 'Servicios adicionales', items: [
            'Fotógrafo',
            'Videógrafo',
            'Servicio de drones',
            'Cabina de fotos',
            'Pirotecnia'
        ]},
        { category: 'Personal de servicio', items: [
            'Camareros',
            'Coordinador de eventos',
            'Seguridad',
            'Personal de limpieza',
            'Guardarropa'
        ]},
        { category: 'Detalles adicionales', items: [
            'Invitaciones impresas',
            'Regalos para los invitados',
            'Libro de firmas y otros recuerdos',
            'Menús impresos',
            'Mesas de dulces',
            'Puestos de comida'
        ]},
        { category: 'Seguros y permisos', items: [
            'Seguro de responsabilidad civil',
            'Permisos locales para música o pirotecnia'
        ]},
        { category: 'Primeros auxilios', items: [
            'Kit de primeros auxilios',
            'Paramédico (eventos muy grandes)'
        ]}
    ];

    // Clear existing table contents
    const sections = ['civil', 'religious', 'banquet'];
    sections.forEach(type => {
        const tbody = document.querySelector(`#${type}-table tbody`);
        console.log(`Processing ${type} table:`, tbody);
        if (!tbody) {
            console.error(`Table body not found for ${type}`);
            return;
        }
        tbody.innerHTML = '';

        // Initialize each section with its elements
        switch(type) {
            case 'civil':
                civilElements.forEach(category => addCategoryWithItems('civil', category));
                break;
            case 'religious':
                religiousElements.forEach(category => addCategoryWithItems('religious', category));
                break;
            case 'banquet':
                banquetElements.forEach(category => addCategoryWithItems('banquet', category));
                break;
        }
    });
}

function addCategoryWithItems(type, category) {
    const tbody = document.querySelector(`#${type}-table tbody`);

    // Add category header
    const categoryRow = tbody.insertRow();
    categoryRow.classList.add('table-secondary');
    categoryRow.innerHTML = `<td colspan="6"><strong>${category.category}</strong></td>`;

    // Add items
    category.items.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item}</td>
            <td contenteditable="true">0</td>
            <td contenteditable="true">0</td>
            <td>
                <select class="form-select">
                    <option>Pendiente</option>
                    <option>En curso</option>
                    <option>Terminado</option>
                    <option>No interesado</option>
                </select>
            </td>
            <td>
                <select class="form-select">
                    <option>Alta</option>
                    <option>Media</option>
                    <option>Baja</option>
                </select>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Eliminar</button>
            </td>
        `;
        attachBudgetListeners(row);
    });
}

// -------------------- BUDGET FUNCTIONS -------------------- //

function addNewItem(type) {
    const tbody = document.querySelector(`#${type}-table tbody`);
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>Nuevo elemento</td>
        <td contenteditable="true">0</td>
        <td contenteditable="true">0</td>
        <td>
            <select class="form-select">
                <option>Pendiente</option>
                <option>En curso</option>
                <option>Terminado</option>
                <option>No interesado</option>
            </select>
        </td>
        <td>
            <select class="form-select">
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
            </select>
        </td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Eliminar</button>
        </td>
    `;
    attachBudgetListeners(row);
    updateBudget();
}

function deleteRow(button) {
    button.closest('tr').remove();
    updateBudget();
}

function attachBudgetListeners(row) {
    const editableCells = row.querySelectorAll('[contenteditable="true"]');
    editableCells.forEach(cell => {
        cell.addEventListener('input', updateBudget);
        cell.addEventListener('blur', function() {
            let value = this.textContent.trim();
            if (value === '' || isNaN(value)) {
                this.textContent = '0';
            }
        });
    });
}

function updateBudget() {
    const initialBudget = parseFloat(document.getElementById('initial-budget').value) || 0;
    let totalEstimated = 0;
    let totalReal = 0;

    // Calculate totals for each section
    ['civil', 'religious', 'banquet'].forEach(section => {
        let sectionEstimated = 0;
        let sectionReal = 0;

        document.querySelectorAll(`#${section}-table tbody tr:not(.table-secondary)`).forEach(row => {
            const estimated = parseFloat(row.cells[1].textContent) || 0;
            const real = parseFloat(row.cells[2].textContent) || 0;
            sectionEstimated += estimated;
            sectionReal += real;
        });

        document.getElementById(`${section}-cost`).textContent = `${sectionEstimated.toFixed(2)} €`;
        totalEstimated += sectionEstimated;
        totalReal += sectionReal;
    });

    // Update summary
    document.getElementById('total-estimated').textContent = `${totalEstimated.toFixed(2)} €`;
    document.getElementById('total-real').textContent = `${totalReal.toFixed(2)} €`;
    document.getElementById('remaining-budget').textContent = `${(initialBudget - totalReal).toFixed(2)} €`;

    updateBudgetProgress();
    updatePriorityCosts();
}

function updateBudgetProgress() {
    const initialBudget = parseFloat(document.getElementById('initial-budget').value) || 0;
    const totalReal = parseFloat(document.getElementById('total-real').textContent) || 0;

    if (initialBudget > 0) {
        const percentage = (totalReal / initialBudget) * 100;
        const progressBar = document.getElementById('budget-progress');
        progressBar.style.width = `${Math.min(percentage, 100)}%`;
        progressBar.textContent = `${percentage.toFixed(1)}%`;

        // Update color based on percentage
        if (percentage > 100) {
            progressBar.classList.remove('bg-success', 'bg-warning');
            progressBar.classList.add('bg-danger');
        } else if (percentage > 80) {
            progressBar.classList.remove('bg-success', 'bg-danger');
            progressBar.classList.add('bg-warning');
        } else {
            progressBar.classList.remove('bg-warning', 'bg-danger');
            progressBar.classList.add('bg-success');
        }
    }
}

function updatePriorityCosts() {
    let highPriority = 0;
    let mediumPriority = 0;
    let lowPriority = 0;

    ['civil', 'religious', 'banquet'].forEach(section => {
        document.querySelectorAll(`#${section}-table tbody tr:not(.table-secondary)`).forEach(row => {
            const cost = parseFloat(row.cells[2].textContent) || 0;
            // The first <select> in the row is the "Estado", the second is "Prioridad"
            // so we can target them carefully or just querySelectorAll and index them.
            const selects = row.querySelectorAll('select');
            const prioritySelect = selects.length > 1 ? selects[1] : null;
            const priority = prioritySelect ? prioritySelect.value : 'Baja';

            switch(priority) {
                case 'Alta':
                    highPriority += cost;
                    break;
                case 'Media':
                    mediumPriority += cost;
                    break;
                case 'Baja':
                    lowPriority += cost;
                    break;
            }
        });
    });

    document.getElementById('high-priority-cost').textContent = `${highPriority.toFixed(2)} €`;
    document.getElementById('medium-priority-cost').textContent = `${mediumPriority.toFixed(2)} €`;
    document.getElementById('low-priority-cost').textContent = `${lowPriority.toFixed(2)} €`;
}

// -------------------- GUESTS FUNCTIONS -------------------- //

function addGuest() {
    const guestCount = document.querySelectorAll('#guests-table tbody tr').length + 1;
    const guestName = `Invitado ${guestCount}`;
    const guestId = `guest-${Date.now()}`;

    // Add to the table
    const tbody = document.querySelector('#guests-table tbody');
    const row = tbody.insertRow();
    row.style.display = '';
    row.setAttribute('data-guest-id', guestId);
    row.innerHTML = `
        <td contenteditable="true">${guestName}</td>
        <td contenteditable="true">0</td>
        <td>
            <select class="form-select guest-category" onchange="updateGuestCounts()">
                <option>Familia Novia</option>
                <option>Familia Novio</option>
                <option>Amigos Novia</option>
                <option>Amigos Novio</option>
                <option>Trabajo Novia</option>
                <option>Trabajo Novio</option>
                <option>Otros</option>
            </select>
        </td>
        <td>
            <select class="form-select dietary-restrictions">
                <option value="none" selected>Sin restricciones</option>
                <option value="vegetarian">Vegetariano</option>
                <option value="vegan">Vegano</option>
                <option value="gluten">Sin gluten</option>
                <option value="lactose">Sin lactosa</option>
                <option value="allergies">Alergias</option>
                <option value="other">Otras restricciones</option>
            </select>
        </td>
        <td>
            <select class="form-select invitation-status">
                <option>No</option>
                <option>Sí</option>
            </select>
        </td>
        <td>
            <select class="form-select confirmation-status">
                <option>Pendiente</option>
                <option>Confirmado</option>
                <option>Rechazado</option>
            </select>
        </td>
        <td>
            <select class="form-select table-group">
                <option value="">Sin asignar</option>
                ${getTableOptions()}
            </select>
        </td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteGuest(this)">Eliminar</button>
        </td>
    `;

    // Add to unassigned guests area (Mesas page)
    const guestElement = createGuestItem(guestName, guestId, 0);
    document.getElementById('unassigned-guests').appendChild(guestElement);
    setupDragAndDrop(guestElement);

    // Add change listeners
    row.querySelector('.confirmation-status').addEventListener('change', updateGuestCounts);
    row.querySelector('.guest-category').addEventListener('change', updateGuestCounts);

    // Watch for changes in the plus-ones field
    const plusOnesCell = row.cells[1];
    plusOnesCell.addEventListener('input', () => {
        const plusOnes = parseInt(plusOnesCell.textContent) || 0;
        const guestItem = document.querySelector(`.guest-item[data-guest-id="${guestId}"]`);
        if (guestItem) {
            guestItem.setAttribute('data-plus-ones', plusOnes);
            // Update the plus-ones display
            const plusOnesDisplay = guestItem.querySelector('.text-muted');
            if (plusOnes > 0) {
                if (plusOnesDisplay) {
                    plusOnesDisplay.textContent = `+${plusOnes}`;
                } else {
                    guestItem.querySelector('.guest-info').insertAdjacentHTML(
                        'beforeend',
                        `<small class="text-muted">+${plusOnes}</small>`
                    );
                }
            } else if (plusOnesDisplay) {
                plusOnesDisplay.remove();
            }
            updateTableStats();
        }
    });

    updateGuestCounts();
}

function deleteGuest(button) {
    if (!confirm('¿Estás seguro de que quieres eliminar este invitado?')) {
        return;
    }

    const row = button.closest('tr');
    const guestId = row.getAttribute('data-guest-id');

    // Remove guest from unassigned area if present
    const unassignedGuest = document.querySelector(`#unassigned-guests .guest-item[data-guest-id="${guestId}"]`);
    if (unassignedGuest) {
        unassignedGuest.remove();
    }

    // Remove guest from any table they might be in
    const tableGuest = document.querySelector(`.table-guests .guest-item[data-guest-id="${guestId}"]`);
    if (tableGuest) {
        tableGuest.remove();
    }

    // Remove from table
    row.remove();

    // Remove from localStorage
    const guests = JSON.parse(localStorage.getItem('wedding-guests') || '[]');
    const updatedGuests = guests.filter(g => g.id !== guestId);
    localStorage.setItem('wedding-guests', JSON.stringify(updatedGuests));

    // Update counts
    updateGuestCounts();
    updateTableStats();
}

function updateGuestCounts() {
    console.log('Updating guest counts...'); // Debug log
    const rows = document.querySelectorAll('#guests-table tbody tr');
    const total = rows.length;
    const confirmed = Array.from(rows).filter(row =>
        row.querySelector('select.confirmation-status').value === 'Confirmado'
    ).length;

    document.getElementById('guest-count').textContent = total;
    document.getElementById('confirmed-count').textContent = confirmed;
    document.getElementById('pending-count').textContent = total - confirmed;

    // Update category counts
    const categories = {
        'Familia Novia': 0,
        'Familia Novio': 0,
        'Amigos Novia': 0,
        'Amigos Novio': 0,
        'Trabajo Novia': 0,
        'Trabajo Novio': 0,
        'Otros': 0
    };

    console.log('Counting categories...'); // Debug log
    rows.forEach(row => {
        const category = row.querySelector('.guest-category').value;
        console.log('Found category:', category); // Debug log
        categories[category]++;
    });

    document.getElementById('bride-family-count').textContent = categories['Familia Novia'];
    document.getElementById('groom-family-count').textContent = categories['Familia Novio'];
    document.getElementById('bride-friends-count').textContent = categories['Amigos Novia'];
    document.getElementById('groom-friends-count').textContent = categories['Amigos Novio'];
    document.getElementById('bride-work-count').textContent = categories['Trabajo Novia'];
    document.getElementById('groom-work-count').textContent = categories['Trabajo Novio'];
    document.getElementById('other-count').textContent = categories['Otros'];

    // Update summary section
    document.getElementById('summary-total-guests').textContent = total;
    document.getElementById('summary-confirmed-guests').textContent = confirmed;
}

function filterGuests(status) {
    const rows = document.querySelectorAll('#guests-table tbody tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const confirmation = row.querySelector('select.confirmation-status').value;
            row.style.display = (status === confirmation) ? '' : 'none';
        }
    });
}

function filterGuestsByName() {
    const searchValue = document.getElementById('guest-search').value.toLowerCase();
    const rows = document.querySelectorAll('#guests-table tbody tr');

    rows.forEach(row => {
        const guestName = row.cells[0].textContent.toLowerCase();
        row.style.display = guestName.includes(searchValue) ? '' : 'none';
    });
}

// -------------------- TABLES (MESAS) FUNCTIONS -------------------- //

function addTable() {
    const tableCount = document.querySelectorAll('.table-card').length + 1;
    const tableGrid = document.getElementById('tables-grid');

    const tableCard = document.createElement('div');
    tableCard.className = 'table-card';
    tableCard.setAttribute('data-table-id', `table-${tableCount}`);
    tableCard.innerHTML = `
        <div class="card" style="width: 300px;">
            <div class="card-header">
                <h5 class="mb-0" contenteditable="true">Mesa ${tableCount}</h5>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-3">
                    <select class="form-select form-select-sm me-2" style="width: 48%;">
                        <option value="">Categoría</option>
                        <option value="familia">Familia</option>
                        <option value="amigos">Amigos</option>
                        <option value="trabajo">Trabajo</option>
                        <option value="otros">Otros</option>
                    </select>
                    <select class="form-select form-select-sm" style="width: 48%;">
                        <option value="round">Redonda</option>
                        <option value="rectangular">Rectangular</option>
                    </select>
                </div>
                <div class="table-capacity mb-3">
                    Capacidad: <span contenteditable="true" onblur="updateTableStats()">8</span> personas
                </div>
                <div class="table-guests" data-table-id="table-${tableCount}">
                    <!-- Assigned guests will appear here -->
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-danger btn-sm" onclick="deleteTable(this)">Eliminar Mesa</button>
            </div>
        </div>
    `;

    tableGrid.appendChild(tableCard);
    setupDropZones();
    setupTableCapacityListeners();
    updateTableStats();
}

function deleteTable(button) {
    const tableCard = button.closest('.table-card');
    const unassignedContainer = document.getElementById('unassigned-guests');

    // Move all guests back to unassigned
    const guests = tableCard.querySelectorAll('.guest-item');
    guests.forEach(guest => {
        unassignedContainer.appendChild(guest);
    });

    tableCard.remove();
    updateTableStats();
}

function setupDragAndDrop(element) {
    // If the element is not an actual draggable guest item, skip
    if (!element || !element.classList || !element.classList.contains('guest-item')) return;

    element.draggable = true;

    element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-guest-id'));
        e.target.classList.add('dragging');
    });

    element.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });

    // Double-click to unassign
    element.addEventListener('dblclick', function() {
        if (this.closest('.table-guests')) {
            unassignGuestFromTable(this);
        }
    });
}

function unassignGuestFromTable(guestElement) {
    const unassignedArea = document.getElementById('unassigned-guests');
    unassignedArea.appendChild(guestElement);
    updateTableStats();
}

function setupDropZones() {
    // Setup table drop zones
    document.querySelectorAll('.table-guests').forEach(dropZone => {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragleave', handleDragLeave);
    });

    // Setup unassigned guests drop zone
    const unassignedZone = document.getElementById('unassigned-guests');
    if (unassignedZone) {
        unassignedZone.addEventListener('dragover', handleDragOver);
        unassignedZone.addEventListener('drop', handleDrop);
        unassignedZone.addEventListener('dragleave', handleDragLeave);
    }

    // Also make sure every guest item is draggable
    document.querySelectorAll('.guest-item').forEach(guestItem => {
        setupDragAndDrop(guestItem);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('can-drop');
    e.dataTransfer.dropEffect = 'move';
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('can-drop');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('can-drop');

    const guestId = e.dataTransfer.getData('text/plain');
    const guestElement = document.querySelector(`[data-guest-id="${guestId}"]`);
    if (!guestElement) return;

    const tableCard = dropZone.closest('.table-card');
    if (!tableCard) {
        // Dropping in unassigned area
        dropZone.appendChild(guestElement);
        updateTableStats();
        return;
    }

    // Check table capacity
    const capacity = parseInt(tableCard.querySelector('.table-capacity span').textContent) || 0;
    const currentGuests = Array.from(dropZone.querySelectorAll('.guest-item')).reduce((total, guest) => {
        const plusOnes = parseInt(guest.getAttribute('data-plus-ones')) || 0;
        return total + 1 + plusOnes;
    }, 0);

    const newGuestPlusOnes = parseInt(guestElement.getAttribute('data-plus-ones')) || 0;
    if (currentGuests + 1 + newGuestPlusOnes <= capacity) {
        if (guestElement.parentNode) {
            guestElement.parentNode.removeChild(guestElement);
        }
        dropZone.appendChild(guestElement);
        updateTableStats();
    } else {
        alert('No hay suficiente espacio en esta mesa');
    }
}

function setupTableCapacityListeners() {
    document.querySelectorAll('.table-capacity span[contenteditable]').forEach(span => {
        span.addEventListener('input', updateTableStats);
        span.addEventListener('blur', updateTableStats);
    });
}

function getTableOptions() {
    const tables = document.querySelectorAll('.table-card h5');
    return Array.from(tables)
        .map(table => `<option value="${table.textContent}">${table.textContent}</option>`)
        .join('');
}

function updateTableStats() {
    const tables = document.querySelectorAll('.table-card');
    let totalTables = tables.length;
    let totalSeats = 0;
    let occupiedSeats = 0;

    tables.forEach(table => {
        // Get table capacity
        const capacitySpan = table.querySelector('.table-capacity span');
        const capacity = parseInt(capacitySpan.textContent) || 0;
        totalSeats += capacity;

        // Calculate occupied seats
        const guests = table.querySelectorAll('.guest-item');
        const tableOccupied = Array.from(guests).reduce((total, guest) => {
            const plusOnes = parseInt(guest.getAttribute('data-plus-ones')) || 0;
            return total + 1 + plusOnes;
        }, 0);
        occupiedSeats += tableOccupied;
    });

    // Update main stats
    document.getElementById('tables-count').textContent = totalTables;
    document.getElementById('total-seats').textContent = totalSeats;
    document.getElementById('available-seats').textContent = totalSeats - occupiedSeats;

    // Update Resumen Mesas (if you have these elements on the page)
    const asientosTotales = document.querySelector('.card .d-flex:nth-child(2) span:last-child');
    const asientosLibres = document.querySelector('.card .d-flex:last-child span:last-child');
    if (asientosTotales) asientosTotales.textContent = totalSeats;
    if (asientosLibres) asientosLibres.textContent = totalSeats - occupiedSeats;
}

// -------------------- BASIC DETAILS & SUMMARY -------------------- //

function saveBasicDetails() {
    const weddingDate = document.getElementById('wedding-date').value;
    const totalGuests = document.getElementById('total-guests').value;

    if (!weddingDate) {
        alert('Por favor, seleccione una fecha de boda');
        return;
    }

    if (!totalGuests || totalGuests <= 0) {
        alert('Por favor, ingrese un número válido de invitados');
        return;
    }

    // Save to localStorage
    localStorage.setItem('weddingDate', weddingDate);
    localStorage.setItem('totalGuests', totalGuests);

    alert('Detalles guardados correctamente');
    updateSummary();
}

function updateSummary() {
    const confirmedGuests = Array.from(document.querySelectorAll('#guests-table tbody tr'))
        .filter(row => row.querySelector('.confirmation-status').value === 'Confirmado')
        .length;

    const totalTables = document.querySelectorAll('#tables-table tbody tr').length; // If you have a #tables-table

    document.getElementById('summary-total-guests').textContent =
        localStorage.getItem('totalGuests') || '0';
    document.getElementById('summary-confirmed-guests').textContent = confirmedGuests;
    document.getElementById('summary-tables').textContent = totalTables;
}

// -------------------- IMPORT/EXPORT GUESTS -------------------- //

function importGuests() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const csvData = event.target.result;
            const guests = parseCSV(csvData);

            guests.forEach(guest => {
                // Add each guest from the CSV
                const tbody = document.querySelector('#guests-table tbody');
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td contenteditable="true">${guest.nombre || ''}</td>
                    <td contenteditable="true">${guest.adicionales || '0'}</td>
                    <td>
                        <select class="form-select guest-category" onchange="updateGuestCounts()">
                            <option ${guest.categoria === 'Familia Novia' ? 'selected' : ''}>Familia Novia</option>
                            <option ${guest.categoria === 'Familia Novio' ? 'selected' : ''}>Familia Novio</option>
                            <option ${guest.categoria === 'Amigos Novia' ? 'selected' : ''}>Amigos Novia</option>
                            <option ${guest.categoria === 'Amigos Novio' ? 'selected' : ''}>Amigos Novio</option>
                            <option ${guest.categoria === 'Trabajo Novia' ? 'selected' : ''}>Trabajo Novia</option>
                            <option ${guest.categoria === 'Trabajo Novio' ? 'selected' : ''}>Trabajo Novio</option>
                            <option ${guest.categoria === 'Otros' ? 'selected' : ''}>Otros</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select dietary-restrictions">
                            <option value="none" ${!guest.restricciones ? 'selected' : ''}>Sin restricciones</option>
                            <option value="vegetarian" ${guest.restricciones === 'vegetarian' ? 'selected' : ''}>Vegetariano</option>
                            <option value="vegan" ${guest.restricciones === 'vegan' ? 'selected' : ''}>Vegano</option>
                            <option value="gluten" ${guest.restricciones === 'gluten' ? 'selected' : ''}>Sin gluten</option>
                            <option value="lactose" ${guest.restricciones === 'lactose' ? 'selected' : ''}>Sin lactosa</option>
                            <option value="allergies" ${guest.restricciones === 'allergies' ? 'selected' : ''}>Alergias</option>
                            <option value="other" ${guest.restricciones === 'other' ? 'selected' : ''}>Otras restricciones</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select invitation-status">
                            <option ${guest.invitacion === 'No' ? 'selected' : ''}>No</option>
                            <option ${guest.invitacion === 'Sí' ? 'selected' : ''}>Sí</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select confirmation-status">
                            <option ${guest.confirmacion === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option ${guest.confirmacion === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                            <option ${guest.confirmacion === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select table-group">
                            <option value="">Sin asignar</option>
                        </select>
                    </td>
                    <td contenteditable="true">${guest.regalo || ''}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteGuest(this)">Eliminar</button>
                    </td>
                `;

                // Create draggable item in Unassigned
                const guestElement = document.createElement('div');
                guestElement.className = 'guest-item';
                guestElement.setAttribute('data-guest-id', `guest-${tbody.rows.length}`);
                guestElement.innerHTML = `
                    <div class="guest-info" contenteditable="true">${guest.nombre}</div>
                    <small class="text-muted">Arrastra a una mesa</small>
                `;
                setupDragAndDrop(guestElement);
                document.getElementById('unassigned-guests').appendChild(guestElement);

                // Add change listeners for counts
                row.querySelector('.confirmation-status').addEventListener('change', updateGuestCounts);
                row.querySelector('.guest-category').addEventListener('change', updateGuestCounts);
            });

            updateGuestCounts();
        };

        reader.readAsText(file);
    };

    input.click();
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());

    for(let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const obj = {};
        const currentline = lines[i].split(',').map(cell => cell.trim());

        headers.forEach((header, index) => {
            obj[header] = currentline[index];
        });

        result.push(obj);
    }

    return result;
}

// -------------------- EXPORT TO EXCEL & PDF -------------------- //

function exportToExcel() {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Export Guests
    const guestsData = [];
    document.querySelectorAll('#guests-table tbody tr').forEach(row => {
        // The "Regalo" cell is row.cells[8], since we have 10 <td> total
        // but confirm exact index for your table structure
        guestsData.push({
            'Nombre': row.cells[0].textContent,
            'Personas Adicionales': row.cells[1].textContent,
            'Categoría': row.querySelector('.guest-category').value,
            'Restricciones Alimentarias':
                row.querySelector('.dietary-restrictions')
                   .options[row.querySelector('.dietary-restrictions').selectedIndex]
                   .text,
            'Invitación': row.querySelector('.invitation-status').value,
            'Confirmación': row.querySelector('.confirmation-status').value,
            'Mesa Asignada': row.querySelector('.table-group').value,
            'Regalo': row.cells[7].textContent // 7 is the 'Regalo' column in your structure
        });
    });
    const wsGuests = XLSX.utils.json_to_sheet(guestsData);
    XLSX.utils.book_append_sheet(wb, wsGuests, 'Invitados');

    // Export Tables
    const tablesData = [];
    document.querySelectorAll('.table-card').forEach(table => {
        const tableName = table.querySelector('h5').textContent;
        const capacity = table.querySelector('.table-capacity span').textContent;
        const guests = Array.from(table.querySelectorAll('.guest-item div'))
            .map(guest => guest.textContent)
            .join(', ');

        tablesData.push({
            'Mesa': tableName,
            'Capacidad': capacity,
            'Invitados Asignados': guests
        });
    });
    const wsTables = XLSX.utils.json_to_sheet(tablesData);
    XLSX.utils.book_append_sheet(wb, wsTables, 'Mesas');

    // Export Budget
    const budgetData = [];
    ['civil', 'religious', 'banquet'].forEach(section => {
        document.querySelectorAll(`#${section}-table tbody tr:not(.table-secondary)`).forEach(row => {
            if (row.cells[0].textContent) {
                const selects = row.querySelectorAll('select');
                const statusSelect = selects.length > 0 ? selects[0] : null;
                const prioritySelect = selects.length > 1 ? selects[1] : null;

                budgetData.push({
                    'Sección':
                        section === 'civil'
                            ? 'Ceremonia Civil'
                            : section === 'religious'
                                ? 'Ceremonia Religiosa'
                                : 'Convite',
                    'Elemento': row.cells[0].textContent,
                    'Gasto Estimado': row.cells[1].textContent,
                    'Gasto Real': row.cells[2].textContent,
                    'Estado': statusSelect ? statusSelect.value : '',
                    'Prioridad': prioritySelect ? prioritySelect.value : ''
                });
            }
        });
    });
    const wsBudget = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, wsBudget, 'Presupuesto');

    // Save the file
    XLSX.writeFile(wb, 'Planificacion_Boda.xlsx');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Planificación de Boda', 105, yPos, { align: 'center' });
    yPos += 20;

    // Basic Details
    doc.setFontSize(16);
    doc.text('Detalles Básicos', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Fecha de Boda: ${document.getElementById('wedding-date').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Invitados: ${document.getElementById('total-guests').value}`, 20, yPos);
    yPos += 20;

    // Guest Summary
    doc.setFontSize(16);
    doc.text('Resumen de Invitados', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Total: ${document.getElementById('guest-count').textContent}`, 20, yPos);
    yPos += 7;
    doc.text(`Confirmados: ${document.getElementById('confirmed-count').textContent}`, 20, yPos);
    yPos += 7;
    doc.text(`Pendientes: ${document.getElementById('pending-count').textContent}`, 20, yPos);
    yPos += 20;

    // Budget Summary
    doc.setFontSize(16);
    doc.text('Resumen de Presupuesto', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Presupuesto Inicial: ${document.getElementById('initial-budget').value}€`, 20, yPos);
    yPos += 7;
    doc.text(`Total Estimado: ${document.getElementById('total-estimated').textContent}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Real: ${document.getElementById('total-real').textContent}`, 20, yPos);
    yPos += 7;
    doc.text(`Restante: ${document.getElementById('remaining-budget').textContent}`, 20, yPos);
    yPos += 20;

    // Guest List
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Lista de Invitados', 20, 20);

    const guestHeaders = [['Nombre', 'Adicionales', 'Categoría', 'Confirmación', 'Mesa']];
    const guestData = Array.from(document.querySelectorAll('#guests-table tbody tr')).map(row => [
        row.cells[0].textContent,
        row.cells[1].textContent,
        row.querySelector('.guest-category').value,
        row.querySelector('.confirmation-status').value,
        row.querySelector('.table-group').value
    ]);

    doc.autoTable({
        startY: 30,
        head: guestHeaders,
        body: guestData
    });

    // Save the PDF
    doc.save('Planificacion_Boda.pdf');
}

// -------------------- TASKS (EXAMPLE PLACEHOLDERS) -------------------- //

function showTaskModal() {
    alert('Mostrando modal para crear tarea (funcionalidad de ejemplo).');
    // Implement your actual modal logic here
}

function saveTask() {
    alert('Guardando tarea... (funcionalidad de ejemplo).');
    // Implement your actual task saving logic here
}

function filterTasks() {
    alert('Filtrando tareas... (funcionalidad de ejemplo).');
    // Implement your actual task filtering logic here
}

// -------------------- CHECKLIST & COUNTDOWN (EXAMPLES) -------------------- //

function updateChecklistProgress() {
    alert('Actualizando progreso de checklist... (funcionalidad de ejemplo).');
    // Implement your actual checklist logic here
}

function updateWeddingCountdown() {
    // Example: read #wedding-date and compute days
    const dateInput = document.getElementById('wedding-date');
    if (!dateInput) return;

    const dateValue = dateInput.value;
    if (!dateValue) {
        return;
    }

    const today = new Date();
    const weddingDate = new Date(dateValue);
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.textContent = diffDays > 0 ? diffDays : 0;
    }
}

// -------------------- HELPER HTML CREATORS -------------------- //

// Create the row HTML for a saved guest (used in DOMContentLoaded if guests are loaded from localStorage)
function createGuestRowHTML(guest) {
    // Adjust to match your columns:
    return `
        <td contenteditable="true">${guest.name || ''}</td>
        <td contenteditable="true">${guest.plusOnes || '0'}</td>
        <td>
            <select class="form-select guest-category" onchange="updateGuestCounts()">
                <option ${guest.category === 'Familia Novia' ? 'selected' : ''}>Familia Novia</option>
                <option ${guest.category === 'Familia Novio' ? 'selected' : ''}>Familia Novio</option>
                <option ${guest.category === 'Amigos Novia' ? 'selected' : ''}>Amigos Novia</option>
                <option ${guest.category === 'Amigos Novio' ? 'selected' : ''}>Amigos Novio</option>
                <option ${guest.category === 'Trabajo Novia' ? 'selected' : ''}>Trabajo Novia</option>
                <option ${guest.category === 'Trabajo Novio' ? 'selected' : ''}>Trabajo Novio</option>
                <option ${guest.category === 'Otros' ? 'selected' : ''}>Otros</option>
            </select>
        </td>
        <td>
            <select class="form-select dietary-restrictions">
                <option value="none" ${guest.diet === 'none' ? 'selected' : ''}>Sin restricciones</option>
                <option value="vegetarian" ${guest.diet === 'vegetarian' ? 'selected' : ''}>Vegetariano</option>
                <option value="vegan" ${guest.diet === 'vegan' ? 'selected' : ''}>Vegano</option>
                <option value="gluten" ${guest.diet === 'gluten' ? 'selected' : ''}>Sin gluten</option>
                <option value="lactose" ${guest.diet === 'lactose' ? 'selected' : ''}>Sin lactosa</option>
                <option value="allergies" ${guest.diet === 'allergies' ? 'selected' : ''}>Alergias</option>
                <option value="other" ${guest.diet === 'other' ? 'selected' : ''}>Otras restricciones</option>
            </select>
        </td>
        <td>
            <select class="form-select invitation-status">
                <option ${guest.invitation === 'No' ? 'selected' : ''}>No</option>
                <option ${guest.invitation === 'Sí' ? 'selected' : ''}>Sí</option>
            </select>
        </td>
        <td>
            <select class="form-select confirmation-status">
                <option ${guest.confirmation === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                <option ${guest.confirmation === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                <option ${guest.confirmation === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
            </select>
        </td>
        <td>
            <select class="form-select table-group">
                <option value="">Sin asignar</option>
                ${getTableOptions()}
            </select>
        </td>
        <td contenteditable="true">${guest.gift || ''}</td>
        <td contenteditable="true">${guest.notes || ''}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteGuest(this)">Eliminar</button>
        </td>
    `;
}

// Create a draggable guest item for the "unassigned" or table area
function createGuestItem(name, id, plusOnes) {
    const guestElement = document.createElement('div');
    guestElement.className = 'guest-item';
    guestElement.setAttribute('data-guest-id', id);
    guestElement.setAttribute('data-plus-ones', plusOnes || 0);

    guestElement.innerHTML = `
        <div class="guest-info">${name}</div>
        ${plusOnes > 0 ? `<small class="text-muted">+${plusOnes}</small>` : '<small class="text-muted">Arrastra a una mesa</small>'}
    `;

    // Make draggable
    setupDragAndDrop(guestElement);
    return guestElement;
}
