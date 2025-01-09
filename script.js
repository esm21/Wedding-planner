<script>
    const guests = JSON.parse(localStorage.getItem('guests')) || [];
    const ceremonyData = JSON.parse(localStorage.getItem('ceremony')) || { civil: {}, religious: {} };
    const banquetData = JSON.parse(localStorage.getItem('banquet')) || {};

    function navigateTo(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    function validateBasicDetails() {
        const weddingDate = document.getElementById('wedding-date').value;
        const guestCount = document.getElementById('guest-count').value;
        const errorSpan = document.getElementById('basic-error');

        if (!weddingDate || !guestCount || guestCount <= 0) {
            errorSpan.textContent = "Por favor, complete todos los campos correctamente.";
            return;
        }

        localStorage.setItem('weddingDetails', JSON.stringify({ date: weddingDate, guests: guestCount }));
        errorSpan.textContent = "";
        alert("Detalles básicos guardados correctamente.");
    }

    function updateSummaryStats() {
        const confirmedGuests = guests.filter(guest => guest.confirmation === 'Sí').length;
        const totalGuests = guests.length;
        const totalEstimatedCost = Object.values(banquetData).reduce((sum, value) => sum + (value.estimated || 0), 0);
        const totalRealCost = Object.values(banquetData).reduce((sum, value) => sum + (value.real || 0), 0);

        document.getElementById('summary-stats').textContent = `
            Total de invitados confirmados: ${confirmedGuests}/${totalGuests}
            Gasto estimado total: ${totalEstimatedCost} €
            Gasto real total: ${totalRealCost} €
        `;
    }

    function exportToExcel() {
        const combinedData = {
            Invitados: guests,
            Ceremonias: [ceremonyData],
            Convite: [banquetData]
        };

        const workbook = XLSX.utils.book_new();
        Object.keys(combinedData).forEach(sheetName => {
            const worksheet = XLSX.utils.json_to_sheet(combinedData[sheetName]);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });
        XLSX.writeFile(workbook, 'resumen_planificacion.xlsx');
    }

    function exportToPDF() {
        const pdfContent = `
            Detalles del Resumen:

            Invitados Confirmados: ${guests.filter(guest => guest.confirmation === 'Sí').length}/${guests.length}

            Ceremonias: ${JSON.stringify(ceremonyData)}
            Convite: ${JSON.stringify(banquetData)}
        `;

        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'resumen_planificacion.txt';
        link.click();
    }

    // Initialize Summary Section
    document.addEventListener('DOMContentLoaded', updateSummaryStats);
</script>
