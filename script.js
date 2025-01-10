// ... (keep all existing code until DOMContentLoaded) ...

document.addEventListener('DOMContentLoaded', function() {
    // Keep existing event listeners...

    // Add predefined elements
    addPredefinedElements();

    // Show initial section
    showSection('civil');
    updateBudget();
});

function addPredefinedElements() {
    // Civil Ceremony predefined elements
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

    // Religious Ceremony predefined elements
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

    // Banquet predefined elements
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

    // Function to add category and its items
    function addCategoryWithItems(tableId, category, items) {
        const tbody = document.querySelector(`#${tableId}-table tbody`);
        
        // Add category row
        const categoryRow = tbody.insertRow();
        categoryRow.classList.add('table-secondary');
        categoryRow.innerHTML = `
            <td colspan="6"><strong>${category}</strong></td>
        `;

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
                    <button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); updateBudget();">
                        Eliminar
                    </button>
                </td>
            `;
            row.addEventListener('input', updateBudget);
        });
    }

    // Add all predefined elements
    civilElements.forEach(category => {
        addCategoryWithItems('civil', category.category, category.items);
    });

    religiousElements.forEach(category => {
        addCategoryWithItems('religious', category.category, category.items);
    });

    banquetElements.forEach(category => {
        addCategoryWithItems('banquet', category.category, category.items);
    });
}

// ... (keep all other existing functions) ...
