document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Add buttons event listeners
    document.getElementById('add-civil-item').addEventListener('click', () => addItem('civil'));
    document.getElementById('add-religious-item').addEventListener('click', () => addItem('religious'));
    document.getElementById('add-banquet-item').addEventListener('click', () => addItem('banquet'));
    document.getElementById('add-guest').addEventListener('click', addGuest);
    document.getElementById('add-table').addEventListener('click', addTable);

    // Budget calculator
    document.getElementById('initial-budget').addEventListener('input', updateBudget);

    // Show initial section
    showSection('civil');
});

function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

function addItem(type) {
    const tbody = document.querySelector(`#${type}-table tbody`);
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Nuevo elemento</td>
        <td contenteditable="true">0 €</td>
        <td contenteditable="true">0 €</td>
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
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); updateBudget();">
                Eliminar
            </button>
        </td>
    `;
    row.addEventListener('input', updateBudget);
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
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove();">
                Eliminar
            </button>
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
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); updateTableGroups();">
                Eliminar
            </button>
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

function updateBudget() {
    const initialBudget = parseFloat(document.getElementById('initial-budget').value) || 0;
    
    // Calculate costs for each section
    const sections = ['civil', 'religious', 'banquet'];
    let totalEstimated = 0;
    let totalReal = 0;

    sections.forEach(section => {
        let sectionEstimated = 0;
        let sectionReal = 0;

        document.querySelectorAll(`#${section}-table tbody tr`).forEach(row => {
            const estimated = parseFloat(row.cells[1].textContent) || 0;
            const real = parseFloat(row.cells[2].textContent) || 0;
            sectionEstimated += estimated;
            sectionReal += real;
        });

        document.getElementById(`${section}-cost`).textContent = `${sectionEstimated.toFixed(2)} €`;
        totalEstimated += sectionEstimated;
        totalReal += sectionReal;
    });

    // Update totals
    document.getElementById('total-estimated').textContent = `${totalEstimated.toFixed(2)} €`;
    document.getElementById('total-real').textContent = `${totalReal.toFixed(2)} €`;
    document.getElementById('remaining-budget').textContent = `${(initialBudget - totalReal).toFixed(2)} €`;
}
