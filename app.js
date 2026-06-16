/* ============================================================
   WhoGoesYou.gl — Core Application
   Navigation, Matrix Canvas, Utilities
   ============================================================ */

// ==================== NAVIGATION ====================
let currentSection = 'home';

function navigateTo(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Show target section
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.add('active');
  }

  // Update nav links
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  // Close mobile menu
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  currentSection = sectionId;

  // Initialize tool on first visit
  if (sectionId === 'network' && !networkScanInitialized) {
    // Network scanner waits for manual start
  }
}

function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});


// ==================== MATRIX CANVAS BACKGROUND ====================
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'WHOGOESYOU01アイウエオカキクケコ<>{}[]|/\\';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);

  // Randomize initial drop positions
  for (let i = 0; i < drops.length; i++) {
    drops[i] = Math.random() * canvas.height / fontSize;
  }

  let lastTime = 0;
  const interval = 60; // 60ms interval (approx 16 FPS) for super calm movement

  function draw(timestamp) {
    requestAnimationFrame(draw);

    if (!timestamp) timestamp = 0;
    const elapsed = timestamp - lastTime;
    if (elapsed < interval) return;
    lastTime = timestamp;

    ctx.fillStyle = 'rgba(9, 10, 15, 0.05)'; // Matches --bg-deep with slower fade out
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Vary brightness with subtle green matrix theme
      const brightness = Math.random();
      if (brightness > 0.96) {
        ctx.fillStyle = 'rgba(16, 185, 129, 1.0)';  // Solid bright flash
      } else if (brightness > 0.8) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.65)'; // Semi-solid normal drop
      } else {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';  // Faint drop
      }

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.985) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  requestAnimationFrame(draw);
}


// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, iconName = 'shield', duration = 3000) {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<i data-lucide="${iconName}" class="icon-inline" style="margin-right: var(--space-sm); vertical-align: middle;"></i><span>${message}</span>`;
  toast.classList.add('show');
  
  if (window.lucide) {
    lucide.createIcons();
  }

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}


// ==================== UTILITY FUNCTIONS ====================
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function animateCounter(element, target, duration = 1500) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}


// ==================== TYPEWRITER EFFECT ====================
async function typewriterEffect(element, text, speed = 30) {
  element.textContent = '';
  element.classList.add('typewriter');

  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await delay(speed);
  }

  element.classList.remove('typewriter');
}


// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initMatrixCanvas(); // Re-enabled with throttled frame rate and subtle colors
  
  if (window.lucide) {
    lucide.createIcons();
  }

  // Animate hero stats on load
  setTimeout(() => {
    showToast('Welcome to WhoGoesYou.gl', 'shield-check');
  }, 1000);
});

// Track network scan initialization
let networkScanInitialized = false;
