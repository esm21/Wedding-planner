document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log
    
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
    
    // Initialize all sections first
    initializePredefinedElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved details
    const savedDate = localStorage.getItem('weddingDate');
    const savedGuests = localStorage.getItem('totalGuests');
    if (savedDate) document.getElementById('wedding-date').value = savedDate;
    if (savedGuests) document.getElementById('total-guests').value = savedGuests;

    updateBudget();
});

function showSection(sectionId) {
    console.log('Showing section:', sectionId); // Debug log
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Reinitialize the section's elements if needed
        if (['civil', 'religious', 'banquet'].includes(sectionId)) {
            initializePredefinedElements();
        }
        // Update budget display
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
            'Alquiler del espacio',
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
}

function addGuest() {
    const tbody = document.querySelector('#guests-table tbody');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Nuevo invitado</td>
        <td contenteditable="true">0</td>
        <td>
            <select class="form-select">
                <option>Familia</option>
                <option>Amigos</option>
                <option>Trabajo</option>
                <option>Otros</option>
            </select>
        </td>
        <td>
            <select class="form-select">
                <option>No</option>
                <option>Sí</option>
            </select>
        </td>
        <td>
            <select class="form-select">
                <option>Pendiente</option>
                <option>Confirmado</option>
                <option>Rechazado</option>
            </select>
        </td>
        <td>
            <select class="form-select table-group">
                <!-- Will be populated dynamically -->
            </select>
        </td>
        <td contenteditable="true"></td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Eliminar</button>
        </td>
    `;
    updateTableGroups();
}

function addTable() {
    const tbody = document.querySelector('#tables-table tbody');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Nueva Mesa</td>
        <td contenteditable="true">8</td>
        <td>0</td>
        <td>8</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Eliminar</button>
        </td>
    `;
    updateTableGroups();
}

function updateTableGroups() {
    const tables = Array.from(document.querySelector('#tables-table tbody').rows)
        .map(row => row.cells[0].textContent);
    
    document.querySelectorAll('.table-group').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `
            <option value="">Sin asignar</option>
            ${tables.map(table => `<option value="${table}">${table}</option>`).join('')}
        `;
        select.value = currentValue;
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

// Move event listeners setup to a separate function
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            history.pushState(null, '', `?section=${section}`);
        });
    });
}
