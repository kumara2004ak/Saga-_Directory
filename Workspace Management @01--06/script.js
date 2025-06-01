// Workspace Management Dashboard Script
// Handles all interactive functionality including responsive design, navigation, notifications, and modals

class WorkspaceManager {
  constructor() {
    this.currentSection = 'email';
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.notifications = [
      {
        id: 1,
        title: 'Email quota updated',
        message: 'Email storage quota has been increased to 15GB',
        time: '2 minutes ago',
        type: 'success',
        read: false
      },
      {
        id: 2,
        title: 'New user added',
        message: 'John Doe has been added to the workspace',
        time: '1 hour ago',
        type: 'info',
        read: false
      },
      {
        id: 3,
        title: 'Drive sync completed',
        message: 'All files have been synchronized successfully',
        time: '3 hours ago',
        type: 'success',
        read: true
      },
      {
        id: 4,
        title: 'Security alert',
        message: 'Unusual login activity detected from new location',
        time: '1 day ago',
        type: 'warning',
        read: false
      }
    ];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeDarkMode();
    this.renderNotifications();
    this.loadSectionContent();
    this.setupSliders();
    this.handleResponsiveDesign();
  }

  setupEventListeners() {
    // Sidebar toggle
    const openSidebar = document.getElementById('open-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebar = document.getElementById('sidebar');

    openSidebar?.addEventListener('click', () => this.toggleSidebar(true));
    closeSidebar?.addEventListener('click', () => this.toggleSidebar(false));
    sidebarBackdrop?.addEventListener('click', () => this.toggleSidebar(false));

    // Workspace submenu toggle
    const workspaceToggle = document.getElementById('workspace-toggle');
    const workspaceSubmenu = document.getElementById('workspace-submenu');
    const workspaceChevron = document.getElementById('workspace-chevron');

    workspaceToggle?.addEventListener('click', () => {
      const isExpanded = workspaceSubmenu.style.display !== 'none';
      workspaceSubmenu.style.display = isExpanded ? 'none' : 'block';
      workspaceChevron.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    // Navigation items
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        if (section) {
          this.navigateToSection(section);
        }
      });
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('toggle-dark-mode');
    darkModeToggle?.addEventListener('click', () => this.toggleDarkMode());

    // Notifications
    const notificationsButton = document.getElementById('notifications-button');
    const notificationsPanel = document.getElementById('notifications-panel');
    const closeNotifications = document.getElementById('close-notifications');

    notificationsButton?.addEventListener('click', () => this.toggleNotifications());
    closeNotifications?.addEventListener('click', () => this.closeNotifications());

    // Notification actions
    const markAllRead = document.getElementById('mark-all-read');
    const clearAll = document.getElementById('clear-all');

    markAllRead?.addEventListener('click', () => this.markAllNotificationsRead());
    clearAll?.addEventListener('click', () => this.clearAllNotifications());

    // Modal functionality
    const infoButtons = document.querySelectorAll('[data-info]');
    const modal = document.getElementById('info-modal');
    const closeModal = document.getElementById('close-modal');
    const modalOk = document.getElementById('modal-ok');

    infoButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const infoType = e.currentTarget.dataset.info;
        this.showInfoModal(infoType);
      });
    });

    closeModal?.addEventListener('click', () => this.closeModal());
    modalOk?.addEventListener('click', () => this.closeModal());

    // Close modal on backdrop click
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Toast close
    const closeToast = document.getElementById('close-toast');
    closeToast?.addEventListener('click', () => this.hideToast());

    // Save buttons
    const saveEmailSettings = document.getElementById('save-email-settings');
    saveEmailSettings?.addEventListener('click', () => this.saveSettings('email'));

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
      const notificationsPanel = document.getElementById('notifications-panel');
      const notificationsButton = document.getElementById('notifications-button');
      
      if (!notificationsPanel.contains(e.target) && !notificationsButton.contains(e.target)) {
        this.closeNotifications();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeNotifications();
        if (window.innerWidth < 1024) {
          this.toggleSidebar(false);
        }
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => this.handleResponsiveDesign());
  }

  toggleSidebar(show) {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (show) {
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    }
  }

  navigateToSection(section) {
    // Update active sidebar item
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('bg-blue-50', 'text-blue-600', 'dark:bg-blue-900/30', 'dark:text-blue-400');
      item.classList.add('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900', 'dark:text-gray-400', 'dark:hover:bg-gray-700', 'dark:hover:text-gray-300');
    });

    const activeItem = document.querySelector(`[data-section="${section}"]`);
    if (activeItem) {
      activeItem.classList.remove('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900', 'dark:text-gray-400', 'dark:hover:bg-gray-700', 'dark:hover:text-gray-300');
      activeItem.classList.add('bg-blue-50', 'text-blue-600', 'dark:bg-blue-900/30', 'dark:text-blue-400');
    }

    // Hide all content sections
    document.querySelectorAll('[id$="-content"]').forEach(content => {
      content.classList.add('hidden');
    });

    // Show selected section
    const sectionContent = document.getElementById(`${section}-content`);
    if (sectionContent) {
      sectionContent.classList.remove('hidden');
    }

    // Update page title and subtitle
    this.updatePageTitle(section);
    this.currentSection = section;

    // Load section-specific content
    this.loadSectionContent(section);

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      this.toggleSidebar(false);
    }
  }

  updatePageTitle(section) {
    const titles = {
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of your workspace metrics and activities'
      },
      domain: {
        title: 'Domain Management',
        subtitle: 'Manage domains and DNS settings for your organization'
      },
      email: {
        title: 'Email Admin Settings',
        subtitle: 'Manage email settings for your organization'
      },
      drive: {
        title: 'Drive Admin Settings',
        subtitle: 'Configure storage and sharing policies'
      },
      chat: {
        title: 'Chat Meet Admin Settings',
        subtitle: 'Manage communication and meeting settings'
      },
      calendar: {
        title: 'Calendar Admin Settings',
        subtitle: 'Configure calendar and scheduling options'
      }
    };

    const titleElement = document.getElementById('section-title');
    const subtitleElement = document.getElementById('section-subtitle');

    if (titles[section]) {
      titleElement.textContent = titles[section].title;
      subtitleElement.textContent = titles[section].subtitle;
    }
  }

  loadSectionContent(section = this.currentSection) {
    const contentContainer = document.getElementById(`${section}-content`);
    
    if (!contentContainer || !contentContainer.classList.contains('hidden')) {
      return; // Content already loaded or visible
    }

    // Generate content based on section
    switch (section) {
      case 'dashboard':
        this.loadDashboardContent(contentContainer);
        break;
      case 'domain':
        this.loadDomainContent(contentContainer);
        break;
      case 'drive':
        this.loadDriveContent(contentContainer);
        break;
      case 'chat':
        this.loadChatContent(contentContainer);
        break;
      case 'calendar':
        this.loadCalendarContent(contentContainer);
        break;
    }
  }

  loadDashboardContent(container) {
    container.innerHTML = `
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="m22 21-3-3m0 0a6 6 0 1 0-6-6 6 6 0 0 0 6 6z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">1,247</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m8 17 4 4 4-4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Storage Used</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">2.4 TB</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Emails Today</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">3,247</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Meetings Today</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">24</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 21-3-3m0 0a6 6 0 1 0-6-6 6 6 0 0 0 6 6z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sarah Johnson joined the workspace</p>
              </div>
              <div class="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                2m ago
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Settings updated</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Email quota increased to 15GB</p>
              </div>
              <div class="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                1h ago
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">System Status</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white">Email Service</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white">Drive Storage</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white">Chat Service</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Maintenance
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white">Calendar Sync</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  loadDomainContent(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Domain Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Domain</label>
              <input type="text" value="acmecorp.com" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DNS Records</label>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-md dark:border-gray-600">
                  <div>
                    <span class="font-medium text-gray-900 dark:text-white">MX Record</span>
                    <p class="text-sm text-gray-500 dark:text-gray-400">mail.acmecorp.com</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-md dark:border-gray-600">
                  <div>
                    <span class="font-medium text-gray-900 dark:text-white">CNAME Record</span>
                    <p class="text-sm text-gray-500 dark:text-gray-400">www.acmecorp.com</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2">Cancel</button>
          <button onclick="workspaceManager.saveSettings('domain')" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2">Save Changes</button>
        </div>
      </div>
    `;
  }

  loadDriveContent(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Storage Quota per User (GB)</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Sets the maximum amount of drive storage allocated per user
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span id="drive-quota-value" class="text-sm font-medium text-gray-700 dark:text-gray-300">100 GB</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">Max: 1000 GB</span>
            </div>
            <div class="relative w-full h-2">
              <div class="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div id="drive-quota-slider" class="absolute inset-y-0 left-0 w-1/10 rounded-full bg-blue-600"></div>
              <input type="range" min="10" max="1000" value="100" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="drive-quota-range">
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                External Sharing
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Allow users to share files with external users
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="external-sharing-toggle" class="peer sr-only" checked>
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Version History
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Keep version history for files (30 days)
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="version-history-toggle" class="peer sr-only" checked>
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2">Cancel</button>
          <button onclick="workspaceManager.saveSettings('drive')" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2">Save Changes</button>
        </div>
      </div>
    `;

    // Setup drive quota slider
    this.setupDriveQuotaSlider();
  }

  loadChatContent(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                External Chat
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Allow users to chat with external users
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="external-chat-toggle" class="peer sr-only">
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Meeting Recording
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Allow users to record meetings
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="meeting-recording-toggle" class="peer sr-only" checked>
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Chat History
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Retain chat history for compliance (90 days)
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="chat-history-toggle" class="peer sr-only" checked>
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2">Cancel</button>
          <button onclick="workspaceManager.saveSettings('chat')" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2">Save Changes</button>
        </div>
      </div>
    `;
  }

  loadCalendarContent(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                External Calendar Sharing
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Allow users to share calendars with external users
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="external-calendar-toggle" class="peer sr-only" checked>
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Auto-Accept Invitations
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Automatically accept meeting invitations from internal users
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="auto-accept-toggle" class="peer sr-only">
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          <div class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-0.5">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Working Hours Enforcement
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Restrict meeting scheduling outside working hours (9 AM - 6 PM)
              </p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" id="working-hours-toggle" class="peer sr-only" checked>
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2">Cancel</button>
          <button onclick="workspaceManager.saveSettings('calendar')" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2">Save Changes</button>
        </div>
      </div>
    `;
  }

  setupSliders() {
    // Email quota slider
    const emailQuotaSlider = document.getElementById('email-quota-slider');
    const quotaValue = document.getElementById('quota-value');
    const quotaSliderBar = document.getElementById('quota-slider');

    if (emailQuotaSlider) {
      emailQuotaSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        quotaValue.textContent = `${value} GB`;
        quotaSliderBar.style.width = `${(value / 50) * 100}%`;
      });
    }
  }

  setupDriveQuotaSlider() {
    // Drive quota slider
    const driveQuotaSlider = document.getElementById('drive-quota-range');
    const driveQuotaValue = document.getElementById('drive-quota-value');
    const driveQuotaSliderBar = document.getElementById('drive-quota-slider');

    if (driveQuotaSlider) {
      driveQuotaSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        driveQuotaValue.textContent = `${value} GB`;
        driveQuotaSliderBar.style.width = `${(value / 1000) * 100}%`;
      });
    }
  }

  initializeDarkMode() {
    const html = document.documentElement;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');

    if (this.isDarkMode) {
      html.classList.add('dark');
      moonIcon?.classList.add('hidden');
      sunIcon?.classList.remove('hidden');
    } else {
      html.classList.remove('dark');
      moonIcon?.classList.remove('hidden');
      sunIcon?.classList.add('hidden');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.initializeDarkMode();
  }

  toggleNotifications() {
    const panel = document.getElementById('notifications-panel');
    const isVisible = !panel.classList.contains('pointer-events-none');

    if (isVisible) {
      this.closeNotifications();
    } else {
      panel.classList.remove('pointer-events-none', 'opacity-0', 'translate-y-2');
      panel.classList.add('opacity-100', 'translate-y-0');
    }
  }

  closeNotifications() {
    const panel = document.getElementById('notifications-panel');
    panel.classList.add('pointer-events-none', 'opacity-0', 'translate-y-2');
    panel.classList.remove('opacity-100', 'translate-y-0');
  }

  renderNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;

    container.innerHTML = this.notifications.map(notification => `
      <div class="flex items-start space-x-3 rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.read ? 'opacity-60' : ''}">
        <div class="flex-shrink-0">
          <div class="h-8 w-8 rounded-full ${this.getNotificationColor(notification.type)} flex items-center justify-center">
            ${this.getNotificationIcon(notification.type)}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white">${notification.title}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">${notification.message}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${notification.time}</p>
        </div>
        <div class="flex-shrink-0">
          <button onclick="workspaceManager.removeNotification(${notification.id})" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  getNotificationColor(type) {
    const colors = {
      success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
      warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
      error: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
    };
    return colors[type] || colors.info;
  }

  getNotificationIcon(type) {
    const icons = {
      success: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
      warning: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>',
      error: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>'
    };
    return icons[type] || icons.info;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.renderNotifications();
    this.showToast('All notifications marked as read', 'success');
  }

  clearAllNotifications() {
    this.notifications = [];
    this.renderNotifications();
    this.showToast('All notifications cleared', 'success');
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
    this.renderNotifications();
  }

  showInfoModal(infoType) {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');

    const infoData = {
      'email-quota': {
        title: 'Email Quota Information',
        description: 'The email quota setting determines the maximum amount of storage space allocated to each user for their email account. This includes all emails, attachments, and folders. When a user reaches their quota limit, they will not be able to receive new emails until they free up space or the quota is increased.'
      },
      'delete-emails': {
        title: 'Delete Emails for Exited Employees',
        description: 'When enabled, this setting will automatically delete the email accounts and all stored emails of employees who have been marked as exited in the system. This action is irreversible and helps maintain data security and compliance with company policies.'
      },
      'archive-emails': {
        title: 'Archive Emails for Exited Employees',
        description: 'This setting creates a backup of all emails from exited employees before their accounts are deactivated. The archived emails are stored securely and can be accessed by administrators for compliance, legal, or business continuity purposes.'
      }
    };

    const info = infoData[infoType];
    if (info) {
      title.textContent = info.title;
      description.textContent = info.description;
      modal.classList.remove('hidden');
    }
  }

  closeModal() {
    const modal = document.getElementById('info-modal');
    modal.classList.add('hidden');
  }

  saveSettings(section) {
    // Simulate saving settings
    this.showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`, 'success');
    
    // Add a new notification about the settings update
    const newNotification = {
      id: Date.now(),
      title: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated`,
      message: `Your ${section} configuration has been saved successfully`,
      time: 'Just now',
      type: 'success',
      read: false
    };
    
    this.notifications.unshift(newNotification);
    this.renderNotifications();
  }

  showToast(message, type = 'success', title = 'Success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDescription = document.getElementById('toast-description');

    toastTitle.textContent = title;
    toastDescription.textContent = message;

    // Show toast
    toast.classList.remove('notification-exit');
    toast.classList.add('notification-enter');

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('notification-enter');
    toast.classList.add('notification-exit');
  }

  handleResponsiveDesign() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (window.innerWidth >= 1024) {
      // Desktop: Show sidebar, hide backdrop
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.add('hidden');
    } else {
      // Mobile: Hide sidebar unless explicitly opened
      if (!backdrop.classList.contains('hidden')) {
        // Sidebar is open on mobile, keep it open
        return;
      }
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    }
  }
}

// Initialize the workspace manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.workspaceManager = new WorkspaceManager();
});

// Handle page visibility change to update notifications
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && window.workspaceManager) {
    // Simulate receiving new notifications when page becomes visible
    const randomNotifications = [
      {
        title: 'System backup completed',
        message: 'Daily backup has been completed successfully',
        type: 'success'
      },
      {
        title: 'New security update',
        message: 'Security patches have been applied to the system',
        type: 'info'
      },
      {
        title: 'Storage warning',
        message: 'Storage usage is approaching 80% capacity',
        type: 'warning'
      }
    ];

    // Randomly add a notification (10% chance)
    if (Math.random() < 0.1) {
      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      const newNotification = {
        id: Date.now(),
        title: randomNotification.title,
        message: randomNotification.message,
        time: 'Just now',
        type: randomNotification.type,
        read: false
      };
      
      window.workspaceManager.notifications.unshift(newNotification);
      window.workspaceManager.renderNotifications();
    }
  }
});




        // Domain data
        let domains = [
            {
                id: 1,
                name: "acmecorp.com",
                status: "Verified",
                primary: true,
                mailHosting: true,
                added: "Jan 15, 2022",
                verificationCode: "saga-verification=abc123def456",
                sslStatus: "Active",
                emailConfigured: true
            },
            {
                id: 2,
                name: "acme-tech.com",
                status: "Verified",
                primary: false,
                mailHosting: false,
                added: "Mar 22, 2022",
                verificationCode: "saga-verification=def789ghi012",
                sslStatus: "Active",
                emailConfigured: false
            },
            {
                id: 3,
                name: "bytebuilds.com",
                status: "Not Verified",
                primary: false,
                mailHosting: false,
                added: "3 days ago",
                verificationCode: "saga-verification=ghi345jkl678",
                sslStatus: "Pending",
                emailConfigured: false
            },
            {
                id: 4,
                name: "web.whatsapp.com",
                status: "Pending",
                primary: false,
                mailHosting: false,
                added: "1 day ago",
                verificationCode: "saga-verification=jkl901mno234",
                sslStatus: "Pending",
                emailConfigured: false
            }
        ];

        let currentVerifyingDomain = null;

        // DOM Elements
        const addDomainBtn = document.getElementById('add-domain-btn');
        const addDomainModal = document.getElementById('add-domain-modal');
        const domainVerificationModal = document.getElementById('domain-verification-modal');
        const addDomainForm = document.getElementById('add-domain-form');
        const closeButtons = document.querySelectorAll('.modal-close');

        // Domain Functions
        function renderDomains() {
            const tableBody = document.querySelector('#domains-table tbody');
            if (!tableBody) return;

            tableBody.innerHTML = '';

            domains.forEach(domain => {
                const row = document.createElement('tr');
                row.className = 'border-b hover:bg-gray-50';

                // Status badge
                let statusBadge = '';
                switch (domain.status) {
                    case 'Verified':
                        statusBadge = `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i class="fas fa-check-circle mr-1"></i>
                                Verified
                            </span>
                        `;
                        break;
                    case 'Pending':
                        statusBadge = `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i class="fas fa-clock mr-1"></i>
                                Pending
                            </span>
                        `;
                        break;
                    case 'Not Verified':
                        statusBadge = `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <i class="fas fa-exclamation-circle mr-1"></i>
                                Not Verified
                            </span>
                        `;
                        break;
                }

                row.innerHTML = `
                    <td class="py-4 px-4">
                        <div class="flex items-center space-x-2">
                            <span class="font-medium">${domain.name}</span>
                            <button class="ml-1 text-gray-400 hover:text-green-600" title="Open in new tab" onclick="window.open('https://${domain.name}', '_blank')">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                        </div>
                    </td>
                    <td class="py-4 px-4 text-gray-600">${domain.added}</td>
                    <td class="py-4 px-4">${statusBadge}</td>
                    <td class="py-4 px-4">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" ${domain.mailHosting ? 'checked' : ''} onchange="toggleMailHosting(${domain.id})" ${domain.status !== 'Verified' ? 'disabled' : ''}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 ${domain.status !== 'Verified' ? 'opacity-50' : ''}"></div>
                        </label>
                    </td>
                    <td class="py-4 px-4">
                        ${domain.primary
                            ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <i class="fas fa-star mr-1"></i>Primary
                               </span>`
                            : `<button class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 ${domain.status !== 'Verified' ? 'opacity-50 cursor-not-allowed' : ''}" 
                                      onclick="setPrimaryDomain(${domain.id})" 
                                      ${domain.status !== 'Verified' ? 'disabled' : ''}>
                                    Set as Primary
                               </button>`
                        }
                    </td>
                    <td class="py-4 px-4 text-right">
                        <div class="flex items-center justify-end space-x-2">
                            ${domain.status !== 'Verified'
                                ? `<button class="inline-flex items-center px-3 py-1 text-xs border border-green-300 text-green-700 rounded-md hover:bg-green-50" onclick="openDomainVerification(${domain.id})">
                                        <i class="fas fa-shield-alt mr-1"></i>
                                        Verify
                                    </button>`
                                : `<button class="inline-flex items-center px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50" onclick="openDomainVerification(${domain.id})">
                                        <i class="fas fa-shield-alt mr-1"></i>
                                        Details
                                    </button>`
                            }
                            <button class="p-1 text-gray-600 hover:text-green-600" title="Settings" onclick="editDomain(${domain.id})">
                                <i class="fas fa-cog"></i>
                            </button>
                            <button class="p-1 text-red-500 hover:text-red-700" title="Delete" onclick="deleteDomain(${domain.id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            updateDomainStats();
        }

        function updateDomainStats() {
            const totalDomains = domains.length;
            const verifiedDomains = domains.filter(d => d.status === 'Verified').length;
            const pendingDomains = domains.filter(d => d.status === 'Pending' || d.status === 'Not Verified').length;
            const mailHostingDomains = domains.filter(d => d.mailHosting).length;

            document.getElementById('total-domains').textContent = totalDomains;
            document.getElementById('verified-domains').textContent = verifiedDomains;
            document.getElementById('pending-domains').textContent = pendingDomains;
            document.getElementById('mail-hosting-domains').textContent = mailHostingDomains;
        }

        function toggleMailHosting(domainId) {
            const domain = domains.find(d => d.id === domainId);
            if (domain && domain.status === 'Verified') {
                domain.mailHosting = !domain.mailHosting;
                renderDomains();
                showNotification(`Mail hosting ${domain.mailHosting ? 'enabled' : 'disabled'} for ${domain.name}`, 'success');
            }
        }

        function setPrimaryDomain(domainId) {
            const domain = domains.find(d => d.id === domainId);
            if (domain && domain.status === 'Verified') {
                domains.forEach(d => d.primary = false);
                domain.primary = true;
                renderDomains();
                showNotification(`${domain.name} set as primary domain`, 'success');
            }
        }

        function openDomainVerification(domainId) {
            const domain = domains.find(d => d.id === domainId);
            if (domain) {
                currentVerifyingDomain = domain;
                document.getElementById('verification-domain-name').textContent = domain.name;
                document.getElementById('ownership-verification-code').textContent = domain.verificationCode;
                openModal('domainVerification');
            }
        }

        function verifyDomain() {
            if (currentVerifyingDomain) {
                currentVerifyingDomain.status = 'Verified';
                currentVerifyingDomain.sslStatus = 'Active';
                renderDomains();
                closeAllModals();
                showNotification(`${currentVerifyingDomain.name} has been verified successfully!`, 'success');
                currentVerifyingDomain = null;
            }
        }

        function checkDomainVerification() {
            showNotification('Checking domain verification...', 'info');
            setTimeout(() => {
                document.getElementById('ownership-status').innerHTML = `
                    <span class="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                        Verified
                    </span>
                `;
                showNotification('Domain verification successful!', 'success');
            }, 2000);
        }

        function checkEmailConfiguration() {
            showNotification('Checking email configuration...', 'info');
            setTimeout(() => {
                document.getElementById('email-status').innerHTML = `
                    <span class="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                        Configured
                    </span>
                `;
                showNotification('Email configuration verified!', 'success');
            }, 1500);
        }

        function copyVerificationCode() {
            const code = document.getElementById('ownership-verification-code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                showNotification('Copied to clipboard!', 'success');
            });
        }

        function deleteDomain(domainId) {
            const domain = domains.find(d => d.id === domainId);
            if (domain && confirm(`Are you sure you want to delete ${domain.name}?`)) {
                domains = domains.filter(d => d.id !== domainId);
                renderDomains();
                showNotification(`${domain.name} has been deleted`, 'success');
            }
        }

        function editDomain(domainId) {
            const domain = domains.find(d => d.id === domainId);
            if (domain) {
                showNotification('Domain settings coming soon!', 'info');
            }
        }

        // Modal Functions
        function openModal(type) {
            if (type === 'domain') {
                addDomainModal.classList.remove('opacity-0', 'pointer-events-none');
            } else if (type === 'domainVerification') {
                domainVerificationModal.classList.remove('opacity-0', 'pointer-events-none');
            }
            document.body.classList.add('modal-active');
        }

        function closeAllModals() {
            addDomainModal.classList.add('opacity-0', 'pointer-events-none');
            domainVerificationModal.classList.add('opacity-0', 'pointer-events-none');
            document.body.classList.remove('modal-active');
        }

        // Verification tab switching
        function switchVerificationTab(tabName) {
            document.querySelectorAll('.verification-tab-btn').forEach(btn => {
                btn.classList.remove('border-green-500', 'text-green-600', 'active');
                btn.classList.add('border-transparent', 'text-gray-500');
            });

            document.querySelectorAll('.verification-tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
            const activeContent = document.getElementById(`${tabName}-tab`);

            if (activeButton && activeContent) {
                activeButton.classList.add('border-green-500', 'text-green-600', 'active');
                activeButton.classList.remove('border-transparent', 'text-gray-500');
                activeContent.classList.remove('hidden');
            }
        }

        // Domain form submission
        function handleDomainSubmit(e) {
            e.preventDefault();

            const name = document.getElementById('domain-name').value.trim();
            const primary = document.getElementById('domain-primary').checked;
            const email = document.getElementById('domain-email').checked;

            if (!name) {
                showNotification('Please enter a domain name', 'error');
                return;
            }

            if (domains.some(d => d.name.toLowerCase() === name.toLowerCase())) {
                showNotification('This domain already exists', 'error');
                return;
            }

            if (primary) {
                domains.forEach(domain => {
                    domain.primary = false;
                });
            }

            const newDomain = {
                id: domains.length + 1,
                name: name.toLowerCase(),
                status: "Not Verified",
                primary: primary,
                mailHosting: email,
                added: "Just now",
                verificationCode: `saga-verification=${Math.random().toString(36).substring(2, 15)}`,
                sslStatus: "Pending",
                emailConfigured: false
            };

            domains.push(newDomain);
            renderDomains();
            closeAllModals();
            addDomainForm.reset();
            showNotification(`Domain ${name} added successfully! Please verify it to activate all features.`, 'success');
        }

        // Notification system
        function showNotification(message, type = 'info') {
            let color = 'bg-blue-500';
            if (type === 'success') color = 'bg-green-500';
            if (type === 'error') color = 'bg-red-500';
            if (type === 'info') color = 'bg-blue-500';

            const notification = document.createElement('div');
            notification.className = `fixed top-6 right-6 z-50 px-4 py-2 rounded shadow text-white ${color}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Event Listeners
        addDomainBtn.addEventListener('click', () => openModal('domain'));
        addDomainForm.addEventListener('submit', handleDomainSubmit);
        closeButtons.forEach(btn => btn.addEventListener('click', closeAllModals));

        // Verification tab switching
        document.querySelectorAll('.verification-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchVerificationTab(btn.getAttribute('data-tab'));
            });
        });

        // Close modal on escape key
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeAllModals();
        });

        // Initialize
        renderDomains();