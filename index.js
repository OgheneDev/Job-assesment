// Attendees data
const attendeesData = {
    'Cloud Innovation Summit': [
        { name: 'Alice Johnson', role: 'Product Manager', image: './images/image.png' },
        { name: 'Bob Wilson', role: 'Software Engineer', image: '/api/placeholder/32/32' },
        { name: 'Carol Martinez', role: 'Data Scientist', image: '/api/placeholder/32/32' }
    ],
};

const ctx = document.getElementById('eventChart').getContext('2d');

const isMobile = () => window.innerWidth <= 767;

const eventData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Event Registrations per month',
        data: [600, 1000, 800, 400, 1000, 600, 900, 300, 820, 700, 950, 600],
        backgroundColor: '#8576FF',
        borderColor: '#8576FF',
        borderWidth: 1
    }]
};

const eventChart = new Chart(ctx, {
    type: 'bar',
    data: eventData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Always hide legend to save space
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y} registrations`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 200, // Show more y-axis values
                    maxTicksLimit: 8, // Increase number of y-axis ticks
                    callback: function(value) {
                        // Show actual numbers instead of K format
                        return value;
                    },
                    font: {
                        size: 10 // Smaller font size for y-axis
                    }
                },
                grid: {
                    display: true,
                    drawBorder: true,
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: false, // Don't auto-skip labels
                    maxTicksLimit: 12, // Show all months
                    font: {
                        size: 10 // Smaller font size for x-axis
                    }
                }
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 20,
                top: 20,
                bottom: 20
            }
        }
    }
});

// Update chart size on orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        eventChart.resize();
    }, 100);
});

// Add this CSS for the chart container

// Enhanced event data
const eventsData = [
    { name: 'Cloud Innovation Summit', date: '2024-10-15', speaker: 'Jane Doe', status: 'Completed' },
    { name: 'Blockchain Revolution Conference', date: '2024-11-05', speaker: 'Dr. Peter Smith', status: 'In Progress' },
    { name: 'AI in Healthcare Symposium', date: '2024-12-01', speaker: 'Dr. Aisha Malik', status: 'Completed' },
    { name: 'Future of Fintech Forum', date: '2024-10-25', speaker: 'John Lee', status: 'Completed' },
    { name: 'Data Analytics in Business', date: '2024-11-12', speaker: 'Rachel Moore', status: 'Completed' },
    { name: 'Sustainable Energy Expo', date: '2024-09-28', speaker: 'Prof. Alan Green', status: 'Completed' },
    { name: 'Web3 Interfaces Workshop', date: '2024-10-10', speaker: 'Kevin Adams', status: 'In Progress' },
    { name: 'Cybersecurity for Startups', date: '2024-11-19', speaker: 'Emily Zhang', status: 'Completed' },
    { name: 'Smart Cities Forum', date: '2024-10-18', speaker: 'Dr. Maria Hernandez', status: 'In Progress' },
    { name: 'Tech Safari Mixer', date: '2024-09-30', speaker: 'Guest Panel', status: 'In Progress' }
];

// Initialize filter states
let currentFilters = {
    search: '',
    date: '0',
    status: '0',
    name: '0',
    sort: '0'
};

// Populate filter dropdowns
function initializeFilters() {
    // Populate date dropdown
    const dateSelect = document.getElementById('date');
    const dates = [...new Set(eventsData.map(event => {
        const date = new Date(event.date);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }))];
    
    dateSelect.innerHTML = '<option value="0">Date</option>' + 
        dates.map(date => `<option value="${date}">${date}</option>`).join('');

    // Populate status dropdown
    const statusSelect = document.getElementById('status');
    const statuses = [...new Set(eventsData.map(event => event.status))];
    statusSelect.innerHTML = '<option value="0">Status</option>' + 
        statuses.map(status => `<option value="${status}">${status}</option>`).join('');

    // Populate name dropdown (event names)
    const nameSelect = document.getElementById('name');
    const names = [...new Set(eventsData.map(event => event.name))];
    nameSelect.innerHTML = '<option value="0">Name</option>' + 
        names.map(name => `<option value="${name}">${name}</option>`).join('');
}

// Filter events based on current filters
function filterEvents() {
    let filteredEvents = [...eventsData];

    // Apply search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
            event.name.toLowerCase().includes(searchTerm) ||
            event.speaker.toLowerCase().includes(searchTerm)
        );
    }

    // Apply date filter
    if (currentFilters.date !== '0') {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            const eventDateString = eventDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            return eventDateString === currentFilters.date;
        });
    }

    // Apply status filter
    if (currentFilters.status !== '0') {
        filteredEvents = filteredEvents.filter(event => 
            event.status === currentFilters.status
        );
    }

    // Apply name filter
    if (currentFilters.name !== '0') {
        filteredEvents = filteredEvents.filter(event => 
            event.name === currentFilters.name
        );
    }

    // Apply sorting
    if (currentFilters.sort === 'Most Recent') {
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filteredEvents;
}

// Update table with filtered events
function updateTable() {
    const tableBody = document.querySelector('.events-table tbody');
    const filteredEvents = filterEvents();
    
    // Update results count
    document.querySelector('.text p').textContent = `Displaying ${filteredEvents.length} results`;

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Add filtered events to table
    filteredEvents.forEach(event => {
        const row = document.createElement('tr');
        const statusClass = event.status === 'Completed' ? 'completed' : 'in-progress';
        
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.speaker}</td>
            <td><span class="status ${statusClass}"><span class="dot"></span>${event.status}</span></td>
        `;
        row.addEventListener('click', () => showEventModal(event));
        tableBody.appendChild(row);
    });
}

// Sidebar collapse functionality
document.getElementById('collapseSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.side-bar');
    sidebar.classList.toggle('collapsed');
});

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;
const prevBtn = document.querySelector('.carousel-nav.prev');
const nextBtn = document.querySelector('.carousel-nav.next');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
});

// Auto-play carousel
setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}, 5000);

// Modal functionality
const modal = document.getElementById('eventModal');
const closeBtn = document.querySelector('.close');
const deleteButton = document.querySelector('.delete-button');
const completeButton = document.querySelector('.complete-button');

function showEventModal(event) {
    const modalEventName = document.querySelector('.event-name');
    const modalEventDate = document.querySelector('.event-date');
    const modalEventDescription = document.querySelector('.event-description');
    const modalSpeakerName = document.querySelector('.speaker-name');

    modalEventName.textContent = event.name;
    modalEventDate.textContent = event.date;
    modalEventDescription.textContent = 'Event Description';
    modalSpeakerName.textContent = event.speaker;

    modal.style.display = 'block';
}

// Close modal handlers
function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);

// Delete button handler
deleteButton.addEventListener('click', () => {
    // Add delete functionality here
    closeModal();
});

// Complete button handler
completeButton.addEventListener('click', () => {
    // Add complete functionality here
    closeModal();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Set up event listeners for filters
function initializeEventListeners() {
    // Search input listener
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        updateTable();
    });

    // Date filter listener
    document.getElementById('date').addEventListener('change', (e) => {
        currentFilters.date = e.target.value;
        updateTable();
    });

    // Status filter listener
    document.getElementById('status').addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        updateTable();
    });

    // Name filter listener
    document.getElementById('name').addEventListener('change', (e) => {
        currentFilters.name = e.target.value;
        updateTable();
    });

    // Sort listener
    document.getElementById('sort').addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        updateTable();
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeEventListeners();
    updateTable();
});

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-theme');
        darkModeToggle.checked = true;
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});

// Add this to your existing JavaScript file

function createMobileEventCards() {
    const eventsData = [
        { name: 'Cloud Innovation Summit', status: 'Completed' },
        { name: 'Blockchain Revolution Conference', status: 'Completed' },
        { name: 'AI in Healthcare Symposium', status: 'In Progress' },
        // Add more events as needed
    ];

    const mobileEvents = document.querySelector('.mobile-events');
    
    // Only proceed if we're in mobile view and the container exists
    if (window.innerWidth <= 767 && mobileEvents) {
        mobileEvents.innerHTML = ''; // Clear existing cards
        
        eventsData.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            
            const statusClass = event.status === 'Completed' ? 'completed' : 'in-progress';
            
            card.innerHTML = `
                <div class="event-card-header">
                    <span class="event-card-title">${event.name}</span>
                    ${event.status ? `
                        <div class="status ${statusClass}">
                            <span class="dot"></span>
                            ${event.status}
                        </div>
                    ` : ''}
                </div>
                ${event.date ? `<div class="event-date">${event.date}</div>` : ''}
            `;
            
            mobileEvents.appendChild(card);
        });
    }
}

// Call on load and resize
window.addEventListener('load', createMobileEventCards);
window.addEventListener('resize', createMobileEventCards);



