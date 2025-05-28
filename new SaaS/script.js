// Global variables
let currentPage = 'dashboard';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadPageData();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Sidebar toggle
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    if (openSidebar) {
        openSidebar.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
        });
    }

    // User menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');

    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            userMenu.classList.add('hidden');
        });
    }

    // Filter menu toggle
    const filterBtn = document.getElementById('filterBtn');
    const filterMenu = document.getElementById('filterMenu');

    if (filterBtn && filterMenu) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            filterMenu.classList.add('hidden');
        });
    }

    // Category filter toggle
    const categoryBtn = document.getElementById('categoryBtn');
    const categoryMenu = document.getElementById('categoryMenu');

    if (categoryBtn && categoryMenu) {
        categoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            categoryMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            categoryMenu.classList.add('hidden');
        });
    }

    // Department filter toggle
    const departmentBtn = document.getElementById('departmentBtn');
    const departmentMenu = document.getElementById('departmentMenu');

    if (departmentBtn && departmentMenu) {
        departmentBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            departmentMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            departmentMenu.classList.add('hidden');
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
    document.body.style.overflow = 'auto';
}

// Export functions
function exportReport() {
    // Simulate export functionality
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `sam-report-${currentDate}.csv`;
    
    // Create sample CSV data
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Application,Category,Users,Monthly Cost,Status,Risk Level\n";
    csvContent += "Microsoft Office 365,Productivity,450,$12500,Active,Low\n";
    csvContent += "Salesforce,CRM,120,$8900,Active,Low\n";
    csvContent += "Slack,Communication,380,$3200,Active,Medium\n";
    csvContent += "Adobe Creative Suite,Design,45,$5600,Expiring,Low\n";
    csvContent += "Unknown App,Unknown,15,$0,Shadow IT,High\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    showNotification('Report exported successfully!', 'success');
}

function exportFinancialReport() {
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `financial-report-${currentDate}.csv`;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Application,Renewal Date,Cost,Status\n";
    csvContent += "Microsoft Office 365,2024-03-15,$125000,Upcoming\n";
    csvContent += "Salesforce,2024-04-22,$89000,Upcoming\n";
    csvContent += "Adobe Creative Suite,2024-02-10,$56000,Overdue\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Financial report exported successfully!', 'success');
}

// Filter functions
function filterByCategory(category) {
    const categoryBtn = document.getElementById('categoryBtn');
    if (categoryBtn) {
        categoryBtn.innerHTML = `Category: ${category} <i class="fas fa-chevron-down ml-2"></i>`;
    }
    
    const tableRows = document.querySelectorAll('#applicationsTable tbody tr');
    tableRows.forEach(row => {
        const categoryCell = row.cells[1];
        if (category === 'All' || categoryCell.textContent === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    closeAllDropdowns();
    showNotification(`Filtered by category: ${category}`, 'info');
}

function filterByDepartment(department) {
    const departmentBtn = document.getElementById('departmentBtn');
    if (departmentBtn) {
        departmentBtn.innerHTML = `Department: ${department} <i class="fas fa-chevron-down ml-2"></i>`;
    }
    
    closeAllDropdowns();
    showNotification(`Filtered by department: ${department}`, 'info');
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('[id$="Menu"]');
    dropdowns.forEach(dropdown => {
        dropdown.classList.add('hidden');
    });
}

// Application management functions
function addApplication() {
    const form = document.getElementById('addApplicationForm');
    if (!form) return;

    const formData = new FormData(form);
    const applicationData = {
        name: formData.get('name'),
        category: formData.get('category'),
        vendor: formData.get('vendor'),
        cost: formData.get('cost'),
        users: formData.get('users'),
        renewalDate: formData.get('renewalDate')
    };

    // Simulate adding to database
    console.log('Adding application:', applicationData);
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Application added successfully!', 'success');
    
    // Redirect to inventory page
    setTimeout(() => {
        window.location.href = 'inventory.html';
    }, 1500);
}

// Calendar functions
function switchCalendarView(view) {
    const viewButtons = document.querySelectorAll('.calendar-view-btn');
    viewButtons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });

    const activeButton = document.querySelector(`[onclick="switchCalendarView('${view}')"]`);
    if (activeButton) {
        activeButton.classList.remove('bg-white', 'text-gray-700');
        activeButton.classList.add('bg-blue-600', 'text-white');
    }

    // Update calendar content based on view
    updateCalendarContent(view);
    showNotification(`Switched to ${view} view`, 'info');
}

function updateCalendarContent(view) {
    const calendarContent = document.getElementById('calendarContent');
    if (!calendarContent) return;

    let content = '';
    
    switch(view) {
        case 'month':
            content = generateMonthView();
            break;
        case 'week':
            content = generateWeekView();
            break;
        case 'list':
            content = generateListView();
            break;
    }
    
    calendarContent.innerHTML = content;
}

function generateMonthView() {
    return `
        <div class="grid grid-cols-7 gap-1 mb-4">
            <div class="p-2 text-center font-semibold text-gray-600">Sun</div>
            <div class="p-2 text-center font-semibold text-gray-600">Mon</div>
            <div class="p-2 text-center font-semibold text-gray-600">Tue</div>
            <div class="p-2 text-center font-semibold text-gray-600">Wed</div>
            <div class="p-2 text-center font-semibold text-gray-600">Thu</div>
            <div class="p-2 text-center font-semibold text-gray-600">Fri</div>
            <div class="p-2 text-center font-semibold text-gray-600">Sat</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
            ${generateCalendarDays()}
        </div>
    `;
}

function generateCalendarDays() {
    let days = '';
    for (let i = 1; i <= 31; i++) {
        const hasRenewal = [10, 15, 22].includes(i);
        days += `
            <div class="min-h-24 p-2 border border-gray-200 ${hasRenewal ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50">
                <div class="font-medium text-sm">${i}</div>
                ${hasRenewal ? '<div class="text-xs text-red-600 mt-1">Renewal Due</div>' : ''}
            </div>
        `;
    }
    return days;
}

function generateWeekView() {
    return `
        <div class="space-y-4">
            <div class="grid grid-cols-8 gap-4">
                <div class="font-semibold text-gray-600">Time</div>
                <div class="font-semibold text-gray-600">Mon</div>
                <div class="font-semibold text-gray-600">Tue</div>
                <div class="font-semibold text-gray-600">Wed</div>
                <div class="font-semibold text-gray-600">Thu</div>
                <div class="font-semibold text-gray-600">Fri</div>
                <div class="font-semibold text-gray-600">Sat</div>
                <div class="font-semibold text-gray-600">Sun</div>
            </div>
            <div class="grid grid-cols-8 gap-4">
                <div class="text-sm text-gray-600">9:00 AM</div>
                <div class="p-2 bg-blue-100 rounded text-xs">Office 365 Review</div>
                <div></div>
                <div class="p-2 bg-red-100 rounded text-xs">Adobe Renewal</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    `;
}

function generateListView() {
    return `
        <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium">Microsoft Office 365 Renewal</h4>
                        <p class="text-sm text-gray-600">March 15, 2024</p>
                    </div>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Upcoming</span>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg border">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium">Salesforce Renewal</h4>
                        <p class="text-sm text-gray-600">April 22, 2024</p>
                    </div>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Scheduled</span>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg border">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium">Adobe Creative Suite</h4>
                        <p class="text-sm text-gray-600">February 10, 2024</p>
                    </div>
                    <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Overdue</span>
                </div>
            </div>
        </div>
    `;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-transform duration-300 translate-x-full`;
    
    const bgColor = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500',
        'info': 'bg-blue-500'
    }[type] || 'bg-blue-500';
    
    notification.classList.add(bgColor);
    notification.innerHTML = `
        <div class="flex items-center text-white">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Load page specific data
function loadPageData() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    
    switch(page) {
        case 'index':
            loadDashboardData();
            break;
        case 'inventory':
            loadInventoryData();
            break;
        case 'financial':
            loadFinancialData();
            break;
        case 'security':
            loadSecurityData();
            break;
        case 'insights':
            loadInsightsData();
            break;
        case 'calendar':
            loadCalendarData();
            break;
    }
}

function loadDashboardData() {
    // Dashboard specific initialization
    console.log('Dashboard loaded');
}

function loadInventoryData() {
    // Inventory specific initialization
    console.log('Inventory loaded');
}

function loadFinancialData() {
    // Financial specific initialization
    console.log('Financial loaded');
}

function loadSecurityData() {
    // Security specific initialization
    console.log('Security loaded');
}

function loadInsightsData() {
    // Insights specific initialization
    console.log('Insights loaded');
}

function loadCalendarData() {
    // Calendar specific initialization
    if (document.getElementById('calendarContent')) {
        updateCalendarContent('month');
    }
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length < 2) {
        showNotification('Please enter at least 2 characters to search', 'warning');
        return;
    }
    
    // Simulate search
    showNotification(`Searching for: ${searchTerm}`, 'info');
    
    // Here you would implement actual search logic
    console.log('Searching for:', searchTerm);
}

// Add search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function calculatePercentage(value, total) {
    return Math.round((value / total) * 100);
}

// Initialize tooltips and other UI enhancements
function initializeUI() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.cursor-pointer');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('transform', 'scale-105');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('transform', 'scale-105');
        });
    });
}

// Call UI initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUI);



function toggleActionMenu(button) {
            const menu = button.nextElementSibling;
            const allMenus = document.querySelectorAll('.absolute.right-0.mt-2');
            
            // Close all other menus
            allMenus.forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });
            
            // Toggle current menu
            menu.classList.toggle('hidden');
        }

        function switchTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Remove active class from all tab buttons
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.remove('hidden');
            
            // Add active class to selected tab button
            event.target.classList.remove('bg-gray-200', 'text-gray-700');
            event.target.classList.add('bg-blue-600', 'text-white');
        }

        // Close action menus when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.relative')) {
                const allMenus = document.querySelectorAll('.absolute.right-0.mt-2');
                allMenus.forEach(menu => menu.classList.add('hidden'));
            }
        });



        function showPage(pageId) {
      const pages = document.querySelectorAll('.page');
      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(pageId).classList.add('active');
    }