:root {
    --primary-color: #9D7553;  /* Elegant brown */
    --secondary-color: #D4B996; /* Light gold */
    --accent-color: #634832;    /* Dark brown */
    --success-color: #7C9070;   /* Sage green */
    --warning-color: #CB997E;   /* Rose gold */
    --danger-color: #6B4423;    /* Deep brown */
    --light-bg: #FAF3E0;        /* Cream */
    --dark-text: #1E212D;       /* Almost black */
    --border-radius: 12px;
    --transition-speed: 0.3s;
}

/* Global Styles */
body {
    font-family: 'Montserrat', sans-serif;
    background-color: var(--light-bg);
    color: var(--dark-text);
    line-height: 1.6;
    min-height: 100vh;
}

/* Navigation Bar */
.navbar {
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    padding: 1rem;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.navbar-brand {
    color: white;
    font-size: 1.5rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
}

.navbar-brand:hover {
    color: rgba(255,255,255,0.9);
    transform: translateY(-1px);
}

.navbar .nav-link {
    color: rgba(255,255,255,0.9);
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    border-radius: var(--border-radius);
    transition: all 0.3s ease;
}

.navbar .nav-link:hover {
    background-color: rgba(255,255,255,0.1);
    transform: translateY(-1px);
}

.navbar .nav-link.active {
    background-color: rgba(255,255,255,0.2);
    color: white;
}

/* Main Content Layout */
.main-content {
    padding: 2rem;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Budget Calculator */
.budget-calculator {
    position: sticky;
    top: 100px; /* Adjust based on navbar height + desired spacing */
    max-height: calc(100vh - 120px);
    overflow-y: auto;
}

/* Basic Details Banner */
.basic-details-banner {
    background-color: white;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Section Headers */
h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-weight: 600;
}

/* Make sure sections are visible */
.section-content {
    display: none;
}

.section-content.active {
    display: block;
}

/* Cards */
.card {
    border: none;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: transform var(--transition-speed) ease;
    margin-bottom: 1.5rem;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.card .card-body {
    padding: 1.5rem;
}

/* Icons */
.card .bi {
    color: var(--primary-color);
    transition: transform var(--transition-speed) ease;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* Buttons */
.btn {
    border-radius: 8px;
    padding: 8px 16px;
    transition: all var(--transition-speed) ease;
}

.btn-primary {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    border: none;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Tables */
.table {
    background: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-top: 1rem;
}

.table thead th {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 1rem;
}

/* Adjust content for fixed navbar */
.container-fluid.mt-4 {
    margin-top: 80px; /* Adjust based on navbar height */
}

/* Dynamic content width */
#main-content-area {
    transition: all 0.3s ease;
}

/* Hide calculator for specific sections */
body[data-active-section="guests"] #budget-calculator-container,
body[data-active-section="tables"] #budget-calculator-container {
    display: none;
}

body[data-active-section="guests"] #main-content-area,
body[data-active-section="tables"] #main-content-area {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
}

/* Drag and Drop Styling */
.guest-item.dragging {
    opacity: 0.5;
    cursor: move;
}

.table-guests.drag-over {
    background-color: rgba(157, 117, 83, 0.1);
    border: 2px dashed var(--primary-color);
}

.guest-item {
    cursor: grab;
    transition: all 0.3s ease;
}

.guest-item:active {
    cursor: grabbing;
}
