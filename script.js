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
    });
    
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
    
    // Handle "Volver al Inicio" button separately
    const homeButton = document.querySelector('a[href="index.html"]');
    if (homeButton) {
    homeButton.addEventListener('click', function(e) {
    // Let this one use its default behavior
    return true;
    });
    }
    
    // Add buttons event listeners
    document.getElementById('add-civil-item').addEventListener('click', () => addNewItem('civil'));
    document.getElementById('add-religious-item').addEventListener('click', () => addNewItem('religious'));
    document.getElementById('add-banquet-item').addEventListener('click', () => addNewItem('banquet'));
    document.getElementById('add-guest').addEventListener('click', addGuest);
    document.getElementById('add-table').addEventListener('click', addTable);
    
    // Initialize budget calculator
    document.getElementById('initial-budget').addEventListener('input', updateBudget);
    document.getElementById('save-details').addEventListener('click', saveBasicDetails);
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
    
    // Initialize the section with its elements
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
    guestItem.querySelector('.guest-info').insertAdjacentHTML('beforeend', 
    `<small class="text-muted">+${plusOnes}</small>`);
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
    // Get the guest name before removing the row
    const guestName = button.closest('tr').cells[0].textContent;
    
    // Remove from guests table
    button.closest('tr').remove();
    
    // Remove from draggable area (Mesas page)
    const guestItems = document.querySelectorAll('.guest-item');
    guestItems.forEach(item => {
    if (item.querySelector('div').textContent === guestName) {
    item.remove();
    }
    });
    
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
    
    document.getElementById('guest-search').addEventListener('input', filterGuestsByName);
    
    function addTable() {
    const tableCount = document.querySelectorAll('.table-card').length + 1;
    const tableGrid = document.getElementById('tables-grid');
    
    const tableCard = document.createElement('div');
    tableCard.className = 'table-card';
    tableCard.setAttribute('data-table-id', `table-${tableCount}`);
    tableCard.innerHTML = `
           <div class="table-header">
               <h5 contenteditable="true">Mesa ${tableCount}</h5>
               <select class="form-select form-select-sm table-category" style="width: auto;">
                   <option value="">Categoría</option>
                   <option value="familia">Familia</option>
                   <option value="amigos">Amigos</option>
                   <option value="trabajo">Trabajo</option>
                   <option value="otros">Otros</option>
               </select>
               <select class="form-select form-select-sm table-shape" style="width: auto;">
                   <option value="round">Redonda</option>
                   <option value="rectangular">Rectangular</option>
               </select>
           </div>
           <div class="table-capacity">
               Capacidad: <span contenteditable="true" onblur="updateTableStats()">8</span> personas
           </div>
           <div class="table-guests" data-table-id="table-${tableCount}"></div>
           <button class="btn btn-danger btn-sm mt-2" onclick="deleteTable(this)">Eliminar Mesa</button>
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
    if (element.classList.contains('guest-item')) {
    element.draggable = true;
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    }
    
    // Make table areas droppable
    if (element.classList.contains('table-card')) {
    const dropZone = element.querySelector('.table-guests');
    if (dropZone) {
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
    }
    }
    }
    
    // Add this function to initialize all drop zones
    function initializeDropZones() {
    // Initialize table drop zones
    document.querySelectorAll('.table-guests').forEach(dropZone => {
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
    });
    
    // Initialize unassigned guests area
    const unassignedArea = document.getElementById('unassigned-guests');
    if (unassignedArea) {
    unassignedArea.addEventListener('dragover', handleDragOver);
    unassignedArea.addEventListener('drop', handleDrop);
    unassignedArea.addEventListener('dragleave', handleDragLeave);
    }
    }
    
    function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-guest-id'));
    e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd(e) {
    e.target.classList.remove('dragging');
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
    const currentGuests = Array.from(dropZone.querySelectorAll('.guest-item'))
    .reduce((total, guest) => {
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
    
    function updateGuestTableAssignment(guestName, tableName) {
    const rows = document.querySelectorAll('#guests-table tbody tr');
    rows.forEach(row => {
    if (row.cells[0].textContent === guestName) {
    const tableSelect = row.querySelector('.table-group');
    if (tableSelect) {
    // Add option if it doesn't exist
    if (!Array.from(tableSelect.options).some(opt => opt.value === tableName)) {
    const option = new Option(tableName, tableName);
    tableSelect.add(option);
    }
    tableSelect.value = tableName;
    }
    }
    });
    }
    
    // Add this helper function to get table options
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
    
    // Update Resumen Mesas
    const asientosTotales = document.querySelector('.card .d-flex:nth-child(2) span:last-child');
    const asientosLibres = document.querySelector('.card .d-flex:last-child span:last-child');
    
    if (asientosTotales) asientosTotales.textContent = totalSeats;
    if (asientosLibres) asientosLibres.textContent = totalSeats - occupiedSeats;
    }
    
    // Add event listener for table capacity changes
    function setupTableCapacityListeners() {
    document.querySelectorAll('.table-capacity span[contenteditable]').forEach(span => {
    span.addEventListener('input', updateTableStats);
    span.addEventListener('blur', updateTableStats);
    });
    }
    
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
    .filter(row => row.querySelector('select').value === 'Confirmado').length;
    
    const totalTables = document.querySelectorAll('#tables-table tbody tr').length;
    
    document.getElementById('summary-total-guests').textContent = 
    localStorage.getItem('totalGuests') || '0';
    document.getElementById('summary-confirmed-guests').textContent = confirmedGuests;
    document.getElementById('summary-tables').textContent = totalTables;
    }
    
    // Add these event listeners in the DOMContentLoaded event
    document.getElementById('save-details').addEventListener('click', saveBasicDetails);
    document.getElementById('export-excel').addEventListener('click', () => {
    alert('Funcionalidad de exportación a Excel en desarrollo');
    });
    document.getElementById('export-pdf').addEventListener('click', () => {
    alert('Funcionalidad de exportación a PDF en desarrollo');
    });
    
    // Enhanced Budget Analysis Functions
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
    const priority = row.querySelector('select').value;
    
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
    
    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
    // ... existing DOMContentLoaded code ...
    
    // Add new event listeners
    document.getElementById('filter-all').addEventListener('click', () => filterGuests('all'));
    document.getElementById('filter-confirmed').addEventListener('click', () => filterGuests('Confirmado'));
    document.getElementById('filter-pending').addEventListener('click', () => filterGuests('Pendiente'));
    
    document.getElementById('import-guests').addEventListener('click', importGuests);
    
    document.getElementById('export-guests').addEventListener('click', () => {
    alert('Funcionalidad de exportación en desarrollo');
    });
    
    // Initialize drag and drop
    setupDragAndDrop(document.getElementById('tables-grid'));
    setupDragAndDrop(document.getElementById('unassigned-guests'));
    
    // Make unassigned guests area droppable
    const unassignedArea = document.getElementById('unassigned-guests');
    unassignedArea.addEventListener('dragover', handleDragOver);
    unassignedArea.addEventListener('drop', handleDrop);
    unassignedArea.addEventListener('dragleave', handleDragLeave);
    });
    
    // Add import functionality
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
    
    // Add to draggable area
    const guestElement = document.createElement('div');
    guestElement.className = 'guest-item';
    guestElement.setAttribute('data-guest-id', `guest-${tbody.rows.length}`);
    guestElement.draggable = true;
    guestElement.innerHTML = `
                       <div contenteditable="true">${guest.nombre}</div>
                       <small class="text-muted">Arrastra a una mesa</small>
                   `;
    
    document.getElementById('unassigned-guests').appendChild(guestElement);
    setupDragAndDrop(guestElement);
    
    // Add change listener
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
    
    // Update the event listener for import button
    document.getElementById('import-guests').addEventListener('click', importGuests);
    
    // Export functions
    function exportToExcel() {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Export Guests
    const guestsData = [];
    document.querySelectorAll('#guests-table tbody tr').forEach(row => {
    guestsData.push({
    'Nombre': row.cells[0].textContent,
    'Personas Adicionales': row.cells[1].textContent,
    'Categoría': row.querySelector('.guest-category').value,
    'Restricciones Alimentarias': row.querySelector('.dietary-restrictions').options[
    row.querySelector('.dietary-restrictions').selectedIndex
    ].text,
    'Invitación': row.querySelector('.invitation-status').value,
    'Confirmación': row.querySelector('.confirmation-status').value,
    'Mesa Asignada': row.querySelector('.table-group').value,
    'Regalo': row.cells[6].textContent
    });
    });
    const wsGuests = XLSX.utils.json_to_sheet(guestsData);
    XLSX.utils.book_append_sheet(wb, wsGuests, "Invitados");
    
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
    XLSX.utils.book_append_sheet(wb, wsTables, "Mesas");
    
    // Export Budget
    const budgetData = [];
    ['civil', 'religious', 'banquet'].forEach(section => {
    document.querySelectorAll(`#${section}-table tbody tr:not(.table-secondary)`).forEach(row => {
    if (row.cells[0].textContent) {
    budgetData.push({
    'Sección': section === 'civil' ? 'Ceremonia Civil' : 
    section === 'religious' ? 'Ceremonia Religiosa' : 'Convite',
    'Elemento': row.cells[0].textContent,
    'Gasto Estimado': row.cells[1].textContent,
    'Gasto Real': row.cells[2].textContent,
    'Estado': row.querySelector('select').value,
    'Prioridad': row.cells[4].querySelector('select').value
    });
    }
    });
    });
    const wsBudget = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, wsBudget, "Presupuesto");
    
    // Save the file
    XLSX.writeFile(wb, "Planificacion_Boda.xlsx");
    }
    
    function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPos = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text("Planificación de Boda", 105, yPos, { align: "center" });
    yPos += 20;
    
    // Basic Details
    doc.setFontSize(16);
    doc.text("Detalles Básicos", 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Fecha de Boda: ${document.getElementById('wedding-date').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Invitados: ${document.getElementById('total-guests').value}`, 20, yPos);
    yPos += 20;
    
    // Guest Summary
    doc.setFontSize(16);
    doc.text("Resumen de Invitados", 20, yPos);
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
    doc.text("Resumen de Presupuesto", 20, yPos);
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
    doc.text("Lista de Invitados", 20, 20);
    
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
    body: guestData,
    });
    
    // Save the PDF
    doc.save("Planificacion_Boda.pdf");
    }
    
    // Update the event listeners
    document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Export buttons
    document.getElementById('export-excel').addEventListener('click', exportToExcel);
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    });
    
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
    }
    
    // Add this to your DOMContentLoaded event listener
    document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    setupDropZones();
    
    // Re-setup drop zones when switching to tables section
    document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
    if (this.getAttribute('data-section') === 'tables') {
    setTimeout(setupDropZones, 100); // Small delay to ensure DOM is ready
    }
    });
    });
    });
    
    // Add sidebar toggle functionality
    document.addEventListener('DOMContentLoaded', function() {
    // Add toggle button to sidebar
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-sm btn-outline-secondary mt-2';
    toggleBtn.innerHTML = '⇄';
    toggleBtn.onclick = toggleSidebar;
    sidebar.querySelector('.d-flex').prepend(toggleBtn);
    });
    
    function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    }
    
    // Update guest item creation for tables
    function createGuestItem(guestName, guestId, plusOnes) {
    const guestElement = document.createElement('div');
    guestElement.className = 'guest-item';
    guestElement.setAttribute('data-guest-id', guestId);
    guestElement.setAttribute('data-plus-ones', plusOnes);
    guestElement.draggable = true;
    guestElement.innerHTML = `
           <span>${guestName}</span>
           ${plusOnes > 0 ? `<small>(+${plusOnes})</small>` : ''}
           <a href="#" onclick="showGuestDetails('${guestId}'); return false;">Datos</a>
       `;
    return guestElement;
    }
    
    function showGuestDetails(guestId) {
    const row = document.querySelector(`tr[data-guest-id="${guestId}"]`);
    if (!row) return;
    
    const modal = new bootstrap.Modal(document.getElementById('guestDetailsModal'));
    const modalBody = document.querySelector('#guestDetailsModal .modal-body');
    
    modalBody.innerHTML = `
           <dl class="row">
               <dt class="col-sm-4">Nombre</dt>
               <dd class="col-sm-8">${row.cells[0].textContent}</dd>
               
               <dt class="col-sm-4">Personas Adicionales</dt>
               <dd class="col-sm-8">${row.cells[1].textContent}</dd>
               
               <dt class="col-sm-4">Categoría</dt>
               <dd class="col-sm-8">${row.querySelector('.guest-category').value}</dd>
               
               <dt class="col-sm-4">Restricciones</dt>
               <dd class="col-sm-8">${row.querySelector('.dietary-restrictions').value}</dd>
               
               <dt class="col-sm-4">Estado</dt>
               <dd class="col-sm-8">${row.querySelector('.confirmation-status').value}</dd>
               
               <dt class="col-sm-4">Mesa</dt>
               <dd class="col-sm-8">${row.querySelector('.table-group').value || 'Sin asignar'}</dd>
           </dl>
       `;
    
    modal.show();
    }
    
    // Planning functionality
    function updateWeddingCountdown() {
    const weddingDate = new Date(document.getElementById('wedding-date').value);
    const today = new Date();
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById('wedding-countdown').textContent = diffDays > 0 ? diffDays : 0;
    }
    
    function createTimelineItem(task) {
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${task.status}`;
    timelineItem.innerHTML = `
           <div class="timeline-card">
               <div class="timeline-date">${new Date(task.deadline).toLocaleDateString()}</div>
               <div class="timeline-title">
                   ${task.title}
                   <span class="task-priority ${task.priority}">${task.priority}</span>
               </div>
               <div class="timeline-description">${task.description}</div>
               <div class="timeline-assignee">
                   Responsable: ${task.assignee || 'Sin asignar'}
               </div>
               <div class="mt-2">
                   <button class="btn btn-sm btn-outline-primary" onclick="editTask('${task.id}')">
                       Editar
                   </button>
                   <button class="btn btn-sm btn-outline-success" onclick="completeTask('${task.id}')">
                       Completar
                   </button>
                   <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task.id}')">
                       Eliminar
                   </button>
               </div>
           </div>
       `;
    return timelineItem;
    }
    
    // Add event listeners
    document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Planning event listeners
    document.getElementById('add-task').addEventListener('click', () => {
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    taskModal.show();
    });
    
    document.getElementById('save-task').addEventListener('click', saveTask);
    
    document.getElementById('task-status-filter').addEventListener('change', filterTasks);
    document.getElementById('task-timeline-filter').addEventListener('change', filterTasks);
    
    // Update countdown when wedding date changes
    document.getElementById('wedding-date').addEventListener('change', updateWeddingCountdown);
    });
    
    // Guest modal handling
    document.getElementById('add-guest-btn').addEventListener('click', showGuestModal);
    
    document.getElementById('save-guest').addEventListener('click', function() {
        const name = document.getElementById('guest-name').value;
        const plusOnes = parseInt(document.getElementById('guest-plus-ones').value) || 0;
        const category = document.getElementById('guest-category').value;
        const dietary = document.getElementById('guest-dietary').value;

        if (!name) {
            alert('Por favor, introduce el nombre del invitado');
            return;
        }

        // Create guest with the form data
        const guestId = `guest-${Date.now()}`;
        
        // Add to guests table
        const tbody = document.querySelector('#guests-table tbody');
        const row = tbody.insertRow();
        row.setAttribute('data-guest-id', guestId);
        row.innerHTML = `
            <td contenteditable="true">${name}</td>
            <td contenteditable="true">${plusOnes}</td>
            <td>
                <select class="form-select guest-category" onchange="updateGuestCounts()">
                    <option ${category === 'Familia Novia' ? 'selected' : ''}>Familia Novia</option>
                    <option ${category === 'Familia Novio' ? 'selected' : ''}>Familia Novio</option>
                    <option ${category === 'Amigos Novia' ? 'selected' : ''}>Amigos Novia</option>
                    <option ${category === 'Amigos Novio' ? 'selected' : ''}>Amigos Novio</option>
                    <option ${category === 'Trabajo Novia' ? 'selected' : ''}>Trabajo Novia</option>
                    <option ${category === 'Trabajo Novio' ? 'selected' : ''}>Trabajo Novio</option>
                    <option ${category === 'Otros' ? 'selected' : ''}>Otros</option>
                </select>
            </td>
            <td>
                <select class="form-select dietary-restrictions">
                    <option value="none" ${dietary === 'none' ? 'selected' : ''}>Sin restricciones</option>
                    <option value="vegetarian" ${dietary === 'vegetarian' ? 'selected' : ''}>Vegetariano</option>
                    <option value="vegan" ${dietary === 'vegan' ? 'selected' : ''}>Vegano</option>
                    <option value="gluten" ${dietary === 'gluten' ? 'selected' : ''}>Sin gluten</option>
                    <option value="lactose" ${dietary === 'lactose' ? 'selected' : ''}>Sin lactosa</option>
                    <option value="allergies" ${dietary === 'allergies' ? 'selected' : ''}>Alergias</option>
                    <option value="other" ${dietary === 'other' ? 'selected' : ''}>Otras restricciones</option>
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

        // Add to unassigned guests area
        const guestElement = createGuestItem(name, guestId, plusOnes);
        document.getElementById('unassigned-guests').appendChild(guestElement);
        setupDragAndDrop(guestElement);

        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('guestModal')).hide();
        document.getElementById('guest-form').reset();
        
        // Update counts
        updateGuestCounts();
    });
});
    
    // Update countdown calculation
    function updateWeddingCountdown() {
    const weddingDateInput = document.getElementById('wedding-date');
    if (!weddingDateInput) return;
    
    const weddingDate = new Date(weddingDateInput.value);
    const today = new Date();
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const countdownElement = document.getElementById('wedding-countdown');
    if (countdownElement) {
    countdownElement.textContent = diffDays > 0 ? diffDays : 0;
    }
    }
    
    // Checklist functionality
    function updateChecklistProgress() {
    const totalTasks = document.querySelectorAll('.form-check-input').length;
    const completedTasks = document.querySelectorAll('.form-check-input:checked').length;
    const progress = (completedTasks / totalTasks) * 100;
    
    document.getElementById('checklist-progress').style.width = `${progress}%`;
    document.getElementById('checklist-progress').textContent = `${Math.round(progress)}%`;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = totalTasks - completedTasks;
    }
    
    // Add event listeners
    document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Setup checklist listeners
    document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', updateChecklistProgress);
    });
    
    // Initial countdown update
    updateWeddingCountdown();
    
    // Update countdown when wedding date changes
    const weddingDateInput = document.getElementById('wedding-date');
    if (weddingDateInput) {
    weddingDateInput.addEventListener('change', updateWeddingCountdown);
    }
    });
    
    // Update the saveDetails function to handle the new planning card
    function saveDetails() {
        const weddingDate = document.getElementById('wedding-date').value;
        const totalGuests = document.getElementById('total-guests').value;
    
        localStorage.setItem('wedding-date', weddingDate);
        localStorage.setItem('total-guests', totalGuests);
    
        // Update the countdown if we're on the landing page
        const countdownElement = document.getElementById('countdown');
        if (countdownElement && weddingDate) {
            const today = new Date();
            const wedding = new Date(weddingDate);
            const diffTime = wedding - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            countdownElement.textContent = diffDays > 0 ? diffDays : 0;
        }
    
        alert('Detalles guardados correctamente');
    }
    
    // Add these functions for the Planning section
    function showTaskModal() {
        const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
        taskModal.show();
    }

    function saveTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const deadline = document.getElementById('task-deadline').value;
        const assignee = document.getElementById('task-assignee').value;
        const priority = document.getElementById('task-priority').value;

        if (!title || !deadline) {
            alert('Por favor, completa los campos requeridos');
            return;
        }

        const taskId = `task-${Date.now()}`;
        const task = {
            id: taskId,
            title,
            description,
            deadline,
            assignee,
            priority,
            status: 'pending'
        };

        // Add task to timeline
        const timelineContainer = document.getElementById('timeline-container');
        const taskElement = createTimelineItem(task);
        timelineContainer.appendChild(taskElement);

        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        document.getElementById('task-form').reset();

        // Save to localStorage
        saveTaskToStorage(task);
        updateTasksProgress();
    }

    function createTimelineItem(task) {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${task.status}`;
        timelineItem.setAttribute('data-task-id', task.id);
        timelineItem.innerHTML = `
            <div class="timeline-card">
                <div class="timeline-date">${new Date(task.deadline).toLocaleDateString()}</div>
                <div class="timeline-title">
                    ${task.title}
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                <div class="timeline-description">${task.description}</div>
                <div class="timeline-assignee">
                    Responsable: ${task.assignee || 'Sin asignar'}
                </div>
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editTask('${task.id}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="completeTask('${task.id}')">
                        Completar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        return timelineItem;
    }

    function completeTask(taskId) {
        const taskElement = document.querySelector(`.timeline-item[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.remove('pending', 'in-progress');
            taskElement.classList.add('completed');
            updateTasksProgress();
            
            // Update in localStorage
            const tasks = JSON.parse(localStorage.getItem('wedding-tasks') || '[]');
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].status = 'completed';
                localStorage.setItem('wedding-tasks', JSON.stringify(tasks));
            }
        }
    }

    function deleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            const taskElement = document.querySelector(`.timeline-item[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.remove();
                updateTasksProgress();
                
                // Remove from localStorage
                const tasks = JSON.parse(localStorage.getItem('wedding-tasks') || '[]');
                const filteredTasks = tasks.filter(t => t.id !== taskId);
                localStorage.setItem('wedding-tasks', JSON.stringify(filteredTasks));
            }
        }
    }

    function saveTaskToStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('wedding-tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('wedding-tasks', JSON.stringify(tasks));
    }

    function updateTasksProgress() {
        const tasks = document.querySelectorAll('.timeline-item');
        const completedTasks = document.querySelectorAll('.timeline-item.completed');
        const progress = (completedTasks.length / tasks.length) * 100 || 0;

        // Update progress in localStorage
        localStorage.setItem('completed-tasks', completedTasks.length);
        localStorage.setItem('total-tasks', tasks.length);

        // Update progress bar if on landing page
        const progressBar = document.getElementById('planning-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
        }
    }

    // Add to your DOMContentLoaded event listener
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...

        // Planning section initialization
        document.getElementById('add-task').addEventListener('click', showTaskModal);
        document.getElementById('save-task').addEventListener('click', saveTask);

        // Load saved tasks
        const savedTasks = JSON.parse(localStorage.getItem('wedding-tasks') || '[]');
        const timelineContainer = document.getElementById('timeline-container');
        if (timelineContainer) {
            savedTasks.forEach(task => {
                const taskElement = createTimelineItem(task);
                timelineContainer.appendChild(taskElement);
            });
            updateTasksProgress();
        }

        // Task filter functionality
        document.getElementById('task-status-filter').addEventListener('change', function() {
            const status = this.value;
            document.querySelectorAll('.timeline-item').forEach(item => {
                if (status === 'all' || item.classList.contains(status)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
