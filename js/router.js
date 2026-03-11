/* ============================================
   ArtNecô v2 — SPA Router
   Handles hash-based routing between pages
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const links = document.querySelectorAll('[data-link]');

    function handleRoute() {
        let hash = window.location.hash || '#/';
        const pageId = hash === '#/' ? 'home' : hash.substring(2);

        // Update active class on pages
        pages.forEach(page => {
            if (page.getAttribute('data-page') === pageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        // Update active class on nav links
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });

        // Handle nav dark-page class for pages with dark hero sections
        const nav = document.getElementById('nav');
        if (nav) {
            if (pageId === 'contato') {
                nav.classList.add('dark-page');
            } else {
                nav.classList.remove('dark-page');
            }
        }

        // Scroll to top on page change
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    // Initialize route on load
    handleRoute();

    // Listen to hash changes
    window.addEventListener('hashchange', handleRoute);
});
