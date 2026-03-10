/* ============================================
   ArtNecô — Scroll Animations
   IntersectionObserver-based reveals, counters,
   parallax, and background transitions
   ============================================ */

class ScrollAnimations {
    constructor() {
        this.observers = [];
        this.countersAnimated = new Set();

        this.initRevealObserver();
        this.initCounterObserver();
        this.initParallax();
        this.initNavScroll();
        this.initProblemFadeEffect();
    }

    /* ── Reveal Observer ── */
    initRevealObserver() {
        const revealElements = document.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Don't unobserve — allows re-triggering if we want
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    /* ── Counter Animation ── */
    initCounterObserver() {
        const counters = document.querySelectorAll('.counter-animate');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated.has(entry.target)) {
                    this.countersAnimated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(update);
    }

    /* ── Parallax ── */
    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.3;
                const rect = el.getBoundingClientRect();
                const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
                el.style.transform = `translateY(${offset * -0.1}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── Navigation scroll effect ── */
    initNavScroll() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        let lastScrollY = 0;
        let ticking = false;

        const updateNav = () => {
            const scrollY = window.scrollY;

            // Add scrolled class
            if (scrollY > 80) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Check if on dark section
            const darkSections = document.querySelectorAll('.section--dark');
            let onDark = false;

            darkSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                // Check if nav overlaps with dark section
                if (rect.top <= 60 && rect.bottom >= 60) {
                    onDark = true;
                }
            });

            if (onDark) {
                nav.classList.add('on-dark');
            } else {
                nav.classList.remove('on-dark');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateNav();
    }

    /* ── Problem Section: Fade previous statements ── */
    initProblemFadeEffect() {
        const statements = document.querySelectorAll('.problem__statement');
        if (statements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When a statement becomes visible, fade the previous ones
                    const index = Array.from(statements).indexOf(entry.target);
                    statements.forEach((s, i) => {
                        if (i < index - 1) {
                            s.classList.add('faded');
                        } else {
                            s.classList.remove('faded');
                        }
                    });
                }
            });
        }, {
            threshold: 0.8,
            rootMargin: '0px 0px -20% 0px'
        });

        statements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    /* ── Cleanup ── */
    destroy() {
        this.observers.forEach(obs => obs.disconnect());
    }
}

// Export for main.js
window.ScrollAnimations = ScrollAnimations;
