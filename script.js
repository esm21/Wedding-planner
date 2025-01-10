document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Show initial section
    showSection('basic');

    // Basic Details Form
    document.getElementById('basic-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const weddingDate = document.getElementById('wedding-date').value;
        const totalGuests = document.getElementById('total-guests').value;
        saveBasicDetails(weddingDate, totalGuests);
    });

    // Add buttons event listeners
    document.getElementById('add-guest').addEventListener('click', addGuest);
    document.getElementById('add-table').addEventListener('click', addTable);
    document.getElementById('add-civil').addEventListener('click', () => addCeremonyItem('civil'));
    document.getElementById('add-religious').addEventListener('click', () => addCeremonyItem('religious'));
    document.getElementById('add-banquet').addEventListener('click', addBanquetItem);

    // Export buttons
    document.getElementById('export-excel').addEventListener('click', exportToExcel);
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
});

function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

function saveBasicDetails(date, guests) {
    // Save to localStorage for now
    localStorage.setItem('weddingDate', date);
    localStorage.setItem('totalGuests', guests);
    alert('Detalles guardados correctamente');
}

function addGuest() {
    const tbody = document.querySelector('#guests-table tbody');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Nombre</td>
        <td contenteditable="true">0</td>
        <td>
            <select class="form-select">
                <option>Pendiente</option>
                <option>Confirmado</option>
                <option>Cancelado</option>
            </select>
        </td>
        <td contenteditable="true">-</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">Eliminar</button>
        </td>
    `;
}

function addTable() {
    const tbody = document.querySelector('#tables-table tbody');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Mesa Nueva</td>
        <td contenteditable="true">0</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">Eliminar</button>
        </td>
    `;
}

function addCeremonyItem(type) {
    const tbody = document.querySelector(`#${type}-table tbody`);
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Elemento nuevo</td>
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
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">Eliminar</button>
        </td>
    `;
}

function addBanquetItem() {
    const tbody = document.querySelector('#banquet-table tbody');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">Elemento nuevo</td>
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
            <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">Eliminar</button>
        </td>
    `;
}

function exportToExcel() {
    alert('Funcionalidad de exportación a Excel pendiente de implementar');
}

function exportToPDF() {
    alert('Funcionalidad de exportación a PDF pendiente de implementar');
}
