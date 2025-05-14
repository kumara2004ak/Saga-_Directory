document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const dashboard = document.getElementById('dashboard');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
        
        if (window.innerWidth > 576) {
            dashboard.classList.toggle('sidebar-collapsed');
        }
    });
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
    });
    
    // Navigation
    const navItems = document.querySelectorAll('.sidebar-menu li');
    const sections = document.querySelectorAll('.section');
    const viewAllLinks = document.querySelectorAll('.view-all');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section') + '-section';
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Update active nav item
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 576) {
                sidebar.classList.remove('expanded');
            }
        });
    });
    
    // View All links
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Find the nav item with the matching data-section
            const navItem = document.querySelector(`.sidebar-menu li[data-section="${sectionId}"]`);
            
            if (navItem) {
                navItem.click();
            }
        });
    });
    
    // Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
    
    // Date Filter
    const dateBtns = document.querySelectorAll('.date-btn');
    
    dateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            dateBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Advanced Filters Toggle
    const filterToggle = document.getElementById('filter-toggle');
    const advancedFilters = document.getElementById('advanced-filters');
    
    if (filterToggle && advancedFilters) {
        filterToggle.addEventListener('click', function() {
            advancedFilters.classList.toggle('show');
        });
    }
    
    const licenseFilterToggle = document.getElementById('license-filter-toggle');
    const licenseAdvancedFilters = document.getElementById('license-advanced-filters');
    
    if (licenseFilterToggle && licenseAdvancedFilters) {
        licenseFilterToggle.addEventListener('click', function() {
            licenseAdvancedFilters.classList.toggle('show');
        });
    }
    
    // Range Filters
    const usersRange = document.getElementById('users-range');
    const usersValue = document.getElementById('users-value');
    
    if (usersRange && usersValue) {
        usersRange.addEventListener('input', function() {
            usersValue.textContent = this.value + '+';
        });
    }
    
    const utilizationRange = document.getElementById('utilization-range');
    const utilizationValue = document.getElementById('utilization-value');
    
    if (utilizationRange && utilizationValue) {
        utilizationRange.addEventListener('input', function() {
            utilizationValue.textContent = this.value + '%+';
        });
    }
    
    // Reset Filters
    const resetFilters = document.getElementById('reset-filters');
    
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            document.getElementById('app-search').value = '';
            document.getElementById('category-filter').value = '';
            document.getElementById('risk-filter').value = '';
            document.getElementById('sso-filter').value = '';
            document.getElementById('vendor-filter').value = '';
            document.getElementById('status-filter').value = '';
            document.getElementById('users-range').value = 0;
            document.getElementById('users-value').textContent = '0+';
        });
    }
    
    const resetLicenseFilters = document.getElementById('reset-license-filters');
    
    if (resetLicenseFilters) {
        resetLicenseFilters.addEventListener('click', function() {
            document.getElementById('license-search').value = '';
            document.getElementById('app-license-filter').value = '';
            document.getElementById('license-status-filter').value = '';
            document.getElementById('renewal-filter').value = '';
            document.getElementById('utilization-range').value = 0;
            document.getElementById('utilization-value').textContent = '0%+';
        });
    }
    
    // Table Sorting
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const table = this.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const column = this.getAttribute('data-sort');
            const index = Array.from(this.parentNode.children).indexOf(this);
            
            // Toggle sort direction
            const isAscending = this.classList.contains('sort-asc');
            
            // Remove sort classes from all headers
            sortableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Add sort class to current header
            this.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
            
            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.children[index].textContent.trim();
                const bValue = b.children[index].textContent.trim();
                
                // Check if values are numbers
                const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
                const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAscending ? bNum - aNum : aNum - bNum;
                }
                
                // Sort as strings
                return isAscending ? 
                    bValue.localeCompare(aValue) : 
                    aValue.localeCompare(bValue);
            });
            
            // Reorder rows
            rows.forEach(row => tbody.appendChild(row));
        });
    });
    
    // Pagination
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (page === 'prev' || page === 'next') {
                // Handle prev/next logic
                const activePage = document.querySelector('.pagination-btn.active');
                const activePageNum = parseInt(activePage.getAttribute('data-page'));
                
                if (page === 'prev' && activePageNum > 1) {
                    document.querySelector(`.pagination-btn[data-page="${activePageNum - 1}"]`).click();
                } else if (page === 'next') {
                    const nextPage = document.querySelector(`.pagination-btn[data-page="${activePageNum + 1}"]`);
                    if (nextPage) {
                        nextPage.click();
                    }
                }
            } else {
                // Update active page
                paginationBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Here you would normally update the table content
                // For demo purposes, we'll just show a toast notification
                showToast(`Navigated to page ${page}`);
            }
        });
    });
    
    // Modal functionality
    const modalTriggers = document.querySelectorAll('#add-application-btn, #add-license-btn, .btn-edit');
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, #cancel-app, #cancel-license');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            let modalId;
            
            if (this.id === 'add-application-btn' || this.classList.contains('btn-edit') && this.closest('#applications-table')) {
                modalId = 'application-modal';
                document.getElementById('app-modal-title').textContent = this.id === 'add-application-btn' ? 'Add Application' : 'Edit Application';
            } else if (this.id === 'add-license-btn' || this.classList.contains('btn-edit') && this.closest('#licenses-table')) {
                modalId = 'license-modal';
                document.getElementById('license-modal-title').textContent = this.id === 'add-license-btn' ? 'Add License' : 'Edit License';
            }
            
            if (modalId) {
                document.getElementById(modalId).classList.add('show');
            }
        });
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
    
    // Delete confirmation
    const deleteBtns = document.querySelectorAll('.btn-delete');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const cancelConfirm = document.getElementById('cancel-confirm');
    const confirmAction = document.getElementById('confirm-action');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const appName = this.closest('tr').querySelector('.app-info span').textContent;
            confirmMessage.textContent = `Are you sure you want to delete "${appName}"? This action cannot be undone.`;
            confirmModal.classList.add('show');
            
            // Store reference to the row
            confirmAction.setAttribute('data-target', this.closest('tr').rowIndex);
        });
    });
    
    cancelConfirm.addEventListener('click', function() {
        confirmModal.classList.remove('show');
    });
    
    confirmAction.addEventListener('click', function() {
        confirmModal.classList.remove('show');
        
        // Here you would normally delete the item from your database
        // For demo purposes, we'll just remove the row from the table
        const rowIndex = this.getAttribute('data-target');
        if (rowIndex) {
            const table = document.querySelector('.data-table');
            table.deleteRow(rowIndex);
            
            showToast('Item deleted successfully');
        }
    });
    
    // Form submission
    const saveAppBtn = document.getElementById('save-app');
    const applicationForm = document.getElementById('application-form');
    
    if (saveAppBtn && applicationForm) {
        saveAppBtn.addEventListener('click', function() {
            if (applicationForm.checkValidity()) {
                // Here you would normally send the data to your backend
                // For demo purposes, we'll just close the modal and show a toast
                document.getElementById('application-modal').classList.remove('show');
                showToast('Application saved successfully');
            } else {
                applicationForm.reportValidity();
            }
        });
    }
    
    const saveLicenseBtn = document.getElementById('save-license');
    const licenseForm = document.getElementById('license-form');
    
    if (saveLicenseBtn && licenseForm) {
        saveLicenseBtn.addEventListener('click', function() {
            if (licenseForm.checkValidity()) {
                // Here you would normally send the data to your backend
                // For demo purposes, we'll just close the modal and show a toast
                document.getElementById('license-modal').classList.remove('show');
                showToast('License saved successfully');
            } else {
                licenseForm.reportValidity();
            }
        });
    }
    
    // Toast notification
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    document.querySelector('.toast-close').addEventListener('click', function() {
        document.getElementById('toast').classList.remove('show');
    });
    
    // Charts
    if (typeof Chart !== 'undefined') {
        // License Utilization Chart
        const licenseUtilizationCtx = document.getElementById('licenseUtilizationChart');
        
        if (licenseUtilizationCtx) {
            new Chart(licenseUtilizationCtx, {
                type: 'bar',
                data: {
                    labels: ['Slack', 'Microsoft 365', 'Salesforce', 'Zoom', 'Adobe CC', 'Asana', 'Dropbox', 'Jira'],
                    datasets: [{
                        label: 'Utilization',
                        data: [98, 97, 87, 99, 84, 95, 97, 97],
                        backgroundColor: '#4361ee',
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                display: true,
                                color: '#f5f5f5'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `Utilization: ${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }
            });
        }
        
        // Category Chart
        const categoryCtx = document.getElementById('categoryChart');
        
        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Productivity', 'Communication', 'Development', 'Marketing', 'Finance', 'Sales', 'HR', 'Storage', 'Design'],
                    datasets: [{
                        data: [25, 20, 15, 10, 8, 7, 5, 5, 5],
                        backgroundColor: [
                            '#4361ee',
                            '#3a0ca3',
                            '#7209b7',
                            '#f72585',
                            '#4cc9f0',
                            '#f8961e',
                            '#90be6d',
                            '#43aa8b',
                            '#577590'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 12,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed}%`;
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }
    
    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth <= 992) {
            dashboard.classList.add('sidebar-collapsed');
        } else {
            dashboard.classList.remove('sidebar-collapsed');
        }
        
        if (window.innerWidth <= 576) {
            sidebar.classList.remove('expanded');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
});