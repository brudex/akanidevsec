document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            // Create/remove overlay for mobile
            if (window.innerWidth <= 768) {
                let overlay = document.querySelector('.sidebar-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    document.body.appendChild(overlay);
                }
                overlay.classList.toggle('show');
                
                // Close sidebar when clicking overlay
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('show');
                    overlay.classList.remove('show');
                });
            }
        });
    }
    
    // Handle submenu toggles
    const submenuToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const submenuId = this.getAttribute('href');
            const submenu = document.querySelector(submenuId);
            const icon = this.querySelector('.submenu-icon');
            
            if (submenu) {
                submenu.classList.toggle('show');
                if (icon) {
                    icon.style.transform = submenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
                }
            }
        });
    });
});