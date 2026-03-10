/* ============================================
   ArtNecô — Particle System (Hero Canvas)
   Floating colorful dots inspired by the logo
   ============================================ */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.animationId = null;
    this.isVisible = true;

    // Colors from the logo dots
    this.colors = [
      { r: 200, g: 80, b: 107, a: 0.4 },   // Rose
      { r: 125, g: 180, b: 212, a: 0.35 },  // Blue
      { r: 58, g: 139, b: 92, a: 0.3 },     // Green
      { r: 232, g: 148, b: 74, a: 0.3 },    // Orange
      { r: 166, g: 61, b: 78, a: 0.25 },    // Crimson
      { r: 217, g: 107, b: 138, a: 0.3 },   // Pink
    ];

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  createParticles() {
    const count = Math.min(Math.floor((this.width * this.height) / 15000), 60);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const size = Math.random() * 6 + 2;
    
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: size,
      baseSize: size,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: color,
      opacity: Math.random() * 0.5 + 0.1,
      baseOpacity: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.01 + 0.005,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    this.canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    
    observer.observe(this.canvas.parentElement);
  }

  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
    this.ctx.fill();

    // Subtle glow
    if (p.size > 3) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.1})`;
      this.ctx.fill();
    }
  }

  drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.06;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          
          // Curved connections like the logo
          const midX = (this.particles[i].x + this.particles[j].x) / 2 + (Math.random() - 0.5) * 20;
          const midY = (this.particles[i].y + this.particles[j].y) / 2 + (Math.random() - 0.5) * 20;
          this.ctx.quadraticCurveTo(midX, midY, this.particles[j].x, this.particles[j].y);
          
          this.ctx.strokeStyle = `rgba(26, 26, 30, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  update() {
    for (const p of this.particles) {
      // Phase-based float
      p.phase += p.phaseSpeed;
      p.x += p.vx + Math.sin(p.phase) * 0.2;
      p.y += p.vy + Math.cos(p.phase * 0.7) * 0.15;

      // Size oscillation
      p.size = p.baseSize + Math.sin(p.phase * 1.5) * 0.5;
      p.opacity = p.baseOpacity + Math.sin(p.phase) * 0.1;

      // Mouse interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const interactionRadius = 150;

      if (dist < interactionRadius) {
        const force = (1 - dist / interactionRadius) * 0.8;
        p.x -= dx * force * 0.02;
        p.y -= dy * force * 0.02;
        p.opacity = Math.min(p.baseOpacity + force * 0.4, 0.8);
        p.size = p.baseSize + force * 3;
      }

      // Wrap around edges
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      if (p.y > this.height + 20) p.y = -20;
    }
  }

  animate() {
    if (this.isVisible) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.update();
      this.drawConnections();
      for (const p of this.particles) {
        this.drawParticle(p);
      }
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Export for main.js
window.ParticleSystem = ParticleSystem;
