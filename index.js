// Attendees data
const attendeesData = {
    'Cloud Innovation Summit': [
        { name: 'Alice Johnson', role: 'Product Manager', image: './images/image.png' },
        { name: 'Bob Wilson', role: 'Software Engineer', image: '/api/placeholder/32/32' },
        { name: 'Carol Martinez', role: 'Data Scientist', image: '/api/placeholder/32/32' }
    ],
};

// Chart initialization
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
                display: false,
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
                    stepSize: 200,
                    maxTicksLimit: 8,
                    callback: function(value) {
                        return value;
                    },
                    font: {
                        size: 10
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
                    autoSkip: false,
                    maxTicksLimit: 12,
                    font: {
                        size: 10
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

const eventDescriptions = {
    'Cloud Innovation Summit': 'An insightful summit showcasing the latest innovations in cloud computing technologies.',
    'Blockchain Revolution Conference': 'A conference exploring the future of blockchain technology and decentralized applications.',
    'AI in Healthcare Symposium': 'A symposium focused on how artificial intelligence is transforming the healthcare industry.',
    'Future of Fintech Forum': 'A forum that discusses cutting-edge fintech solutions and financial technologies.',
    'Data Analytics in Business': 'An event covering how data analytics is being used to drive business success.',
    'Sustainable Energy Expo': 'An expo showcasing the latest innovations and trends in sustainable energy solutions.',
    'Web3 Interfaces Workshop': 'A hands-on workshop exploring Web3 technologies and decentralized interfaces.',
    'Cybersecurity for Startups': 'A comprehensive session on cybersecurity strategies specifically for startups.',
    'Smart Cities Forum': 'A forum discussing the integration of technology in urban planning and smart city development.',
    'Tech Safari Mixer': 'A networking event for tech enthusiasts to meet, exchange ideas, and collaborate on innovative projects.'
};

// Initialize filter states
let currentFilters = {
    search: '',
    date: '0',
    status: '0',
    name: '0',
    sort: '0'
};

function createMobileEventCards() {
    const mobileEvents = document.querySelector('.mobile-events');
    
    if (window.innerWidth <= 767 && mobileEvents) {
        const filteredEvents = filterEvents();
        mobileEvents.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'mobile-events-table';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th class="mobile-th">Name</th>
                <th class="mobile-th">Status</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        
        filteredEvents.forEach(event => {
            const row = document.createElement('tr');
            const statusClass = event.status === 'Completed' ? 'completed' : 'in-progress';
            
            const mainRow = document.createElement('tr');
            mainRow.className = 'main-row';
            mainRow.innerHTML = `
                <td class="mobile-event-row">
                    <div class="mobile-event-header">
                        <button class="dropdown-toggle">
                            <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 12 12">
                                <path d="M2 4L6 8L10 4" fill="none" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                        <span class="event-name">${event.name}</span>
                    </div>
                </td>
                <td class="status-cell">
                    <span class="status ${statusClass}">
                        <span class="dot"></span>
                        ${event.status}
                    </span>
                </td>
            `;

            const detailsRow = document.createElement('tr');
            detailsRow.className = 'details-row hidden';
            detailsRow.innerHTML = `
                <td colspan="2">
                    <div class="mobile-event-details">
                        <div class="event-speaker">Speaker: ${event.speaker}</div>
                        <div class="event-date">Date: ${event.date}</div>
                    </div>
                </td>
            `;
            
            const dropdownToggle = mainRow.querySelector('.dropdown-toggle');
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownToggle.classList.toggle('active');
                detailsRow.classList.toggle('hidden');
            });
            
            // Populate modal when mainRow is clicked
            mainRow.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown-toggle')) {
                    showEventModal(event);  // Pass event object to the modal
                }
            });
            
            tbody.appendChild(mainRow);
            tbody.appendChild(detailsRow);
        });
        
        table.appendChild(tbody);
        mobileEvents.appendChild(table);
    }
}


// Populate filter dropdowns
function initializeFilters() {
    const dateSelect = document.getElementById('date');
    const dates = [...new Set(eventsData.map(event => {
        const date = new Date(event.date);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }))];
    
    dateSelect.innerHTML = '<option value="0">Date</option>' + 
        dates.map(date => `<option value="${date}">${date}</option>`).join('');

    const statusSelect = document.getElementById('status');
    const statuses = [...new Set(eventsData.map(event => event.status))];
    statusSelect.innerHTML = '<option value="0">Status</option>' + 
        statuses.map(status => `<option value="${status}">${status}</option>`).join('');

    const nameSelect = document.getElementById('name');
    const names = [...new Set(eventsData.map(event => event.name))];
    nameSelect.innerHTML = '<option value="0">Name</option>' + 
        names.map(name => `<option value="${name}">${name}</option>`).join('');
}

// Filter events based on current filters
function filterEvents() {
    let filteredEvents = [...eventsData];

    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
            event.name.toLowerCase().includes(searchTerm) ||
            event.speaker.toLowerCase().includes(searchTerm)
        );
    }

    if (currentFilters.date !== '0') {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            const eventDateString = eventDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            return eventDateString === currentFilters.date;
        });
    }

    if (currentFilters.status !== '0') {
        filteredEvents = filteredEvents.filter(event => 
            event.status === currentFilters.status
        );
    }

    if (currentFilters.name !== '0') {
        filteredEvents = filteredEvents.filter(event => 
            event.name === currentFilters.name
        );
    }

    if (currentFilters.sort === 'Most Recent') {
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filteredEvents;
}

// Update table with filtered events
function updateTable() {
    const tableBody = document.querySelector('.events-table tbody');
    const filteredEvents = filterEvents();
    
    document.querySelector('.text p').textContent = `Displaying ${filteredEvents.length} results`;

    tableBody.innerHTML = '';

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

    createMobileEventCards();
}

// Sidebar functionality
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
    modalEventDescription.textContent = eventDescriptions[event.name]; // Use the event description
    modalSpeakerName.textContent = event.speaker;

    modal.style.display = 'block';
}


function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);

deleteButton.addEventListener('click', () => {
    closeModal();
});

completeButton.addEventListener('click', () => {
    closeModal();
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Set up event listeners for filters
function initializeEventListeners() {
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        updateTable();
    });

    document.getElementById('date').addEventListener('change', (e) => {
        currentFilters.date = e.target.value;
        updateTable();
    });

    document.getElementById('status').addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        updateTable();
    });

    document.getElementById('name').addEventListener('change', (e) => {
        currentFilters.name = e.target.value;
        updateTable();
    });

    document.getElementById('sort').addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        updateTable();
    });
}

// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-theme');
        darkModeToggle.checked = true;
    }

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

const btnMenu = document.querySelector('.btn-menu');
const btnClose = document.querySelector('.btn-close');
const sidebar = document.querySelector('.side-bar');

// When btnMenu is clicked
btnMenu.addEventListener('click', () => {
    btnMenu.classList.remove('close'); // Ensure 'close' is removed from btnMenu
    btnMenu.classList.add('open'); // Add 'open' class to btnMenu

    btnClose.classList.remove('close'); // Ensure 'close' is removed from btnClose
    btnClose.classList.add('open'); // Add 'open' class to btnClose

    sidebar.classList.remove('close'); // Ensure 'close' is removed from sidebar
    sidebar.classList.add('open'); // Add 'open' class to sidebar
});

// When btnClose is clicked
btnClose.addEventListener('click', () => {
    btnClose.classList.remove('open'); // Remove 'open' from btnClose
    btnClose.classList.add('close'); // Add 'close' class to btnClose

    btnMenu.classList.remove('open'); // Remove 'open' from btnMenu
    btnMenu.classList.add('close'); // Add 'close' class to btnMenu

    sidebar.classList.remove('open'); // Remove 'open' from sidebar
    sidebar.classList.add('close'); // Add 'close' class to sidebar
});



// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeEventListeners();
    updateTable();
    createMobileEventCards();
});

// Update mobile view on window resize
window.addEventListener('resize', () => {
    createMobileEventCards();
});



