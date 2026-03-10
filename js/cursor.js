/* ============================================
   ArtNecô — Custom Cursor
   Elegant dot + ring cursor with trail effect
   ============================================ */

class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        if (!this.cursor || !this.isCursorDevice()) {
            if (this.cursor) this.cursor.style.display = 'none';
            document.body.style.cursor = 'auto';
            return;
        }

        this.dot = this.cursor.querySelector('.cursor__dot');
        this.ring = this.cursor.querySelector('.cursor__ring');

        this.pos = { x: -100, y: -100 };
        this.target = { x: -100, y: -100 };
        this.isHovering = false;
        this.isHidden = false;

        this.injectStyles();
        this.bindEvents();
        this.animate();
    }

    isCursorDevice() {
        return window.matchMedia('(hover: hover)').matches;
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
      .cursor {
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        mix-blend-mode: difference;
      }

      .cursor__dot {
        position: absolute;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    background 0.3s;
      }

      .cursor__ring {
        position: absolute;
        width: 36px;
        height: 36px;
        border: 1.5px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    border-color 0.3s,
                    opacity 0.3s;
      }

      .cursor.hovering .cursor__dot {
        width: 12px;
        height: 12px;
        background: #C8506B;
      }

      .cursor.hovering .cursor__ring {
        width: 50px;
        height: 50px;
        border-color: rgba(200, 80, 107, 0.4);
      }

      .cursor.hidden {
        opacity: 0;
      }
    `;
        document.head.appendChild(style);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.target.x = e.clientX;
            this.target.y = e.clientY;
            if (this.isHidden) {
                this.isHidden = false;
                this.cursor.classList.remove('hidden');
            }
        });

        document.addEventListener('mouseleave', () => {
            this.isHidden = true;
            this.cursor.classList.add('hidden');
        });

        // Detect hoverable elements
        const hoverables = 'a, button, [role="button"], .btn, .card, .services__card, .exclusivity__item, .nav__toggle, .cta__btn';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverables)) {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverables)) {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
            }
        });
    }

    animate() {
        // Smooth lerp for the dot (fast follow)
        this.pos.x += (this.target.x - this.pos.x) * 0.15;
        this.pos.y += (this.target.y - this.pos.y) * 0.15;

        // Dot follows more closely
        this.dot.style.left = this.target.x + 'px';
        this.dot.style.top = this.target.y + 'px';

        // Ring follows with delay (smooth)
        this.ring.style.left = this.pos.x + 'px';
        this.ring.style.top = this.pos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// Export for main.js
window.CustomCursor = CustomCursor;
