/* ============================================
   ArtNecô — Main Application
   Initializes all modules and manages global behavior
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Preloader ── */
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 800);
    });

    // Safety: remove preloader after 3s max
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 600);
        }
    }, 3000);

    /* ── Initialize Modules ── */
    const particles = new ParticleSystem('heroCanvas');
    const cursor = new CustomCursor();
    const scrollAnimations = new ScrollAnimations();

    /* ── Smooth Scroll for navigation links ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Allow SPA router to handle these
            if (targetId.startsWith('#/')) return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                const offset = 80; // nav height
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ── Mobile Menu ── */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('[data-close-menu]').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── Accordion ── */
    document.querySelectorAll('.accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.accordion__content');
            const accordion = item.parentElement;

            // Close other items in the same accordion
            accordion.querySelectorAll('.accordion__item').forEach(other => {
                if (other !== item && other.classList.contains('open')) {
                    other.classList.remove('open');
                    other.querySelector('.accordion__content').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('open');
            if (item.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    /* ── Active nav link highlight ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const highlightNav = () => {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ── Word-by-word reveal for hero tagline ── */
    const tagline = document.querySelector('.hero__tagline');
    if (tagline) {
        // Already handled by CSS animations in this case
        // Could add typewriter effect here if desired
    }

    /* ── Year in footer ── */
    const yearSpan = document.querySelector('.footer__text');
    if (yearSpan) {
        const year = new Date().getFullYear();
        yearSpan.textContent = yearSpan.textContent.replace('2025', year);
    }

    /* ── Log ── */
    console.log(
        '%c ArtNecô Studio de Design %c\n Atendemos poucos. Entregamos arte. ',
        'background: #1A1A1E; color: #C8506B; font-size: 16px; font-weight: bold; padding: 12px 20px; font-family: Georgia, serif;',
        'color: #6B6570; font-size: 12px; padding: 4px 20px;'
    );
});
