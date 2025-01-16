document.addEventListener('DOMContentLoaded', function() {
    // Initialize all collapse elements
    const collapseElements = document.querySelectorAll('.collapse');
    collapseElements.forEach(collapse => {
        new bootstrap.Collapse(collapse, {
            toggle: false
        });
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            // Create/remove overlay for mobile
            if (window.innerWidth <= 992) {
                let overlay = document.querySelector('.sidebar-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    document.body.appendChild(overlay);
                }
                overlay.classList.toggle('show');
                
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
            
            // Toggle the submenu using Bootstrap's Collapse
            bootstrap.Collapse.getOrCreateInstance(submenu).toggle();
            
            // Update icon rotation
            const icon = this.querySelector('.submenu-icon');
            if (icon) {
                if (submenu.classList.contains('show')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Initialize active submenu
    const activeLink = document.querySelector('.submenu .nav-link.active');
    if (activeLink) {
        const submenu = activeLink.closest('.collapse');
        const toggle = document.querySelector(`[href="#${submenu.id}"]`);
        const icon = toggle?.querySelector('.submenu-icon');
        
        if (submenu) {
            bootstrap.Collapse.getOrCreateInstance(submenu).show();
        }
        
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
    }
});