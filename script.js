document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            document.getElementById(`${section}-section`).style.display = 'block';
        });
    });

    // Add buttons event listeners
    document.getElementById('add-civil-item').addEventListener('click', () => addNewItem('civil'));
    document.getElementById('add-religious-item').addEventListener('click', () => addNewItem('religious'));
    document.getElementById('add-banquet-item').addEventListener('click', () => addNewItem('banquet'));
    document.getElementById('add-guest').addEventListener('click', addGuest);
    document.getElementById('add-table').addEventListener('click', addTable);

    // Initialize predefined elements
    initializePredefinedElements();

    // Initialize budget calculator
    document.getElementById('initial-budget').addEventListener('input', updateBudget);
    
    // Show initial section and calculate initial budget
    showSection('civil');
    updateBudget();
});

function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

function addNewItem(type) {
    const tbody = document.querySelector(`#${type}-table tbody`);
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>Nuevo elemento</td>
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
            <button class="btn btn-danger" onclick="deleteRow(this)">Eliminar</button>
        </td>
    `;
    updateBudget();
}

function deleteRow(button) {
    button.closest('tr').remove();
    updateBudget();
}

function initializePredefinedElements() {
    // Clear existing table contents
    ['civil', 'religious', 'banquet'].forEach(type => {
        const tbody = document.querySelector(`#${type}-table tbody`);
        tbody.innerHTML = '';
    });

    // Add predefined elements for Civil Ceremony
    addCategoryWithItems('civil', 'Lugar de la ceremonia', [
        'Alquiler de espacio',
        'Tarifa del registro civil o juzgado',
        'Gastos de transporte'
    ]);

    addCategoryWithItems('civil', 'Documentación y trámites', [
        'Certificaciones y legalizaciones necesarias',
        'Tarifa de expedición de acta de matrimonio',
        'Tarifa de legalización (si aplica)'
    ]);

    // Add remaining categories...
    // (Continue with all categories from the previous implementation)
}

function addCategoryWithItems(type, category, items) {
    const tbody = document.querySelector(`#${type}-table tbody`);
    
    // Add category header
    const categoryRow = tbody.insertRow();
    categoryRow.classList.add('table-secondary');
    categoryRow.innerHTML = `<td colspan="6"><strong>${category}</strong></td>`;
    
    // Add items
    items.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item}</td>
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
                <button class="btn btn-danger" onclick="deleteRow(this)">Eliminar</button>
            </td>
        `;
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
