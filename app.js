/* ============================================================
   WhoGoesYou — Core Application
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
  const hamburger = document.getElementById('hamburger');
  const pill = document.getElementById('navPill');
  hamburger.classList.toggle('active');
  // On mobile: toggle visibility of the pill
  if (pill) pill.classList.toggle('mobile-open');
}

// ==================== PILL NAVBAR: EXPAND / COLLAPSE ====================
let navIsExpanded = false;

function initPillNav() {
  const pill      = document.getElementById('navPill');
  const track     = document.getElementById('navTrack');
  const primary   = document.getElementById('navPrimary');
  const secondary = document.getElementById('navSecondary');
  if (!pill || !track || !primary || !secondary) return;

  // After lucide renders icons, measure both panels
  requestAnimationFrame(() => {
    const primaryW   = primary.scrollWidth;
    const secondaryW = secondary.scrollWidth;

    // Set pill to primary width initially
    pill.style.width = primaryW + 'px';

    // Store widths for later use
    pill.dataset.primaryW   = primaryW;
    pill.dataset.secondaryW = secondaryW;
  });
}

function expandNavPanel() {
  const pill      = document.getElementById('navPill');
  const track     = document.getElementById('navTrack');
  const secondary = document.getElementById('navSecondary');
  if (!pill || !track || navIsExpanded) return;

  const primaryW   = parseFloat(pill.dataset.primaryW)   || pill.offsetWidth;
  const secondaryW = parseFloat(pill.dataset.secondaryW) || 400;

  navIsExpanded = true;

  // Expand pill to secondary width
  pill.style.width = secondaryW + 'px';

  // Slide track left by primaryW
  track.style.transform = `translateX(-${primaryW}px)`;

  secondary.setAttribute('aria-hidden', 'false');
}

function collapseNavPanel() {
  const pill      = document.getElementById('navPill');
  const track     = document.getElementById('navTrack');
  const secondary = document.getElementById('navSecondary');
  if (!pill || !track || !navIsExpanded) return;

  const primaryW = parseFloat(pill.dataset.primaryW) || pill.offsetWidth;

  navIsExpanded = false;

  // Shrink pill back to primary width
  pill.style.width = primaryW + 'px';

  // Slide track back to origin
  track.style.transform = 'translateX(0)';

  secondary.setAttribute('aria-hidden', 'true');
}

// Nav scroll effect — pill moves closer to top
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});




// ==================== MATRIX CANVAS BACKGROUND ====================
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let cols, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const fontSize = 14;
    cols = Math.floor(canvas.width / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * (canvas.height / fontSize));
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'WHOGOESYOU01アイウエオカキクケコサシスセソ<>{}[]|/\\01001110';
  const fontSize = 14;
  let lastTime = 0;
  const TICK = 45; // ms between frames (~22 FPS) — snappy but not frantic

  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - lastTime < TICK) return;
    lastTime = ts;

    // Translucent black overlay — controls how long the trail persists
    ctx.fillStyle = 'rgba(3, 3, 3, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Bright white head, then solid green body, then dim tail
      const rand = Math.random();
      if (rand > 0.95) {
        // Glowing white head character
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10b981';
        ctx.fillStyle = '#eefff8';
      } else if (rand > 0.6) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#10b981';
        ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
      } else if (rand > 0.25) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.55)';
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      }

      ctx.fillText(char, x, y);
      ctx.shadowBlur = 0;

      // Reset drop after it passes the bottom
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5; // half-step speed — smooth and cinematic
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


// ==================== DASHBOARD & TELEMETRY LOGIC ====================
let completedAssessments = JSON.parse(localStorage.getItem('completed_assessments')) || {};
let installedTools = JSON.parse(localStorage.getItem('installed_tools')) || {};

// Tool configurations matching index.html IDs and packages
const totalTools = 20;

function isToolInstalled(toolId) {
  const preInstalled = [
    'portscan', 'hash', 'whois', 'dns', 'encoder', 'subdomain',
    'phishing', 'password', 'quiz', 'osint', 'network', 'breach'
  ];
  return preInstalled.includes(toolId) || !!installedTools[toolId];
}
window.isToolInstalled = isToolInstalled;

function launchTool(toolId) {
  if (!isToolInstalled(toolId)) {
    showToast(`Package 'wg-tool-${toolId}' is not installed. Type 'apt install ${toolId}' in terminal to install.`, 'shield-alert');
    return;
  }
  navigateTo(toolId);
}
window.launchTool = launchTool;

function completeAssessment(toolId) {
  completedAssessments[toolId] = true;
  localStorage.setItem('completed_assessments', JSON.stringify(completedAssessments));
  updateAssessmentProgress();
}
window.completeAssessment = completeAssessment;

function updateAssessmentProgress() {
  const completedList = Object.keys(completedAssessments).filter(id => completedAssessments[id]);
  const completedCount = completedList.length;
  
  // Update UI Elements
  const countEl = document.getElementById('telemetry-assessment-count');
  const fillEl = document.getElementById('telemetry-assessment-progress-fill');
  const percentEl = document.getElementById('telemetry-assessment-percentage');
  const badgeEl = document.getElementById('telemetry-assessment-badge');
  const statusTextEl = document.getElementById('telemetry-assessment-status-text');
  
  if (countEl) countEl.innerHTML = `${completedCount}<span style="font-size: 1rem; color: var(--text-secondary);">/${totalTools} Tools</span>`;
  
  const percentage = Math.round((completedCount / totalTools) * 100);
  if (fillEl) fillEl.style.width = `${percentage}%`;
  if (percentEl) percentEl.textContent = `${percentage}% Done`;
  
  if (completedCount === 0) {
    if (badgeEl) { badgeEl.textContent = 'PENDING AUDIT'; badgeEl.className = 'telemetry-card__badge telemetry-badge--danger'; }
    if (statusTextEl) statusTextEl.textContent = 'NEEDS AUDIT';
  } else if (completedCount < totalTools) {
    if (badgeEl) { badgeEl.textContent = 'IN PROGRESS'; badgeEl.className = 'telemetry-card__badge telemetry-badge--warning'; }
    if (statusTextEl) statusTextEl.textContent = 'PARTIALLY AUDITED';
  } else {
    if (badgeEl) { badgeEl.textContent = 'FULLY SECURED'; badgeEl.className = 'telemetry-card__badge telemetry-badge--success'; }
    if (statusTextEl) statusTextEl.textContent = 'SECURED';
  }
}

// 1. Browser profile detection
function initBrowserTelemetry() {
  const osEl = document.getElementById('telemetry-browser-os');
  const engineEl = document.getElementById('telemetry-browser-engine');
  const resEl = document.getElementById('telemetry-browser-res');
  const statusEl = document.getElementById('telemetry-browser-status');
  
  // OS detection
  let os = 'Unknown OS';
  if (navigator.userAgent.indexOf('Win') !== -1) os = 'Windows';
  if (navigator.userAgent.indexOf('Mac') !== -1) os = 'macOS';
  if (navigator.userAgent.indexOf('Linux') !== -1) os = 'Linux';
  if (navigator.userAgent.indexOf('Android') !== -1) os = 'Android';
  if (navigator.userAgent.indexOf('like Mac') !== -1) os = 'iOS';
  
  // Browser engine
  let engine = 'Unknown Engine';
  if (navigator.userAgent.indexOf('Chrome') !== -1) engine = 'Blink (Chrome)';
  else if (navigator.userAgent.indexOf('Safari') !== -1) engine = 'WebKit (Safari)';
  else if (navigator.userAgent.indexOf('Firefox') !== -1) engine = 'Gecko (Firefox)';
  else if (navigator.userAgent.indexOf('Edge') !== -1) engine = 'Blink (Edge)';
  
  if (osEl) osEl.textContent = os;
  if (engineEl) engineEl.textContent = engine;
  if (resEl) resEl.textContent = `${window.screen.width}x${window.screen.height}`;
  
  // Status check
  if (statusEl) {
    statusEl.textContent = 'EXPOSED';
    statusEl.className = 'telemetry-card__badge telemetry-badge--warning';
  }
}

// 2. Threat level matrix slider
function initThreatSlider() {
  const slider = document.getElementById('threat-level-slider');
  const levelEl = document.getElementById('telemetry-threat-level');
  const badgeEl = document.getElementById('telemetry-threat-badge');
  const iconEl = document.getElementById('telemetry-threat-icon');
  const adviceEl = document.getElementById('threat-level-advice');
  const cardEl = document.getElementById('telemetry-threat-slider');
  
  if (!slider) return;
  
  function updateThreatDisplay(val) {
    if (levelEl) levelEl.innerHTML = `${val}<span style="font-size: 1rem; color: var(--text-secondary);">/100</span>`;
    
    // Clear dynamic glows
    cardEl.style.boxShadow = '';
    
    if (val <= 30) {
      if (badgeEl) { badgeEl.textContent = 'LOW EXPOSURE'; badgeEl.className = 'telemetry-card__badge telemetry-badge--success'; }
      if (iconEl) { iconEl.setAttribute('data-lucide', 'shield'); iconEl.className = 'telemetry-card__icon-svg text-green'; }
      if (adviceEl) adviceEl.textContent = 'All local client ports shielded. Maintain regular posture scans.';
      cardEl.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.1)';
    } else if (val <= 70) {
      if (badgeEl) { badgeEl.textContent = 'MEDIUM EXPOSURE'; badgeEl.className = 'telemetry-card__badge telemetry-badge--warning'; }
      if (iconEl) { iconEl.setAttribute('data-lucide', 'shield-alert'); iconEl.className = 'telemetry-card__icon-svg text-amber'; }
      if (adviceEl) adviceEl.textContent = 'Exposure markers detected. Audit browser fingerprint configuration.';
      cardEl.style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.1)';
    } else {
      if (badgeEl) { badgeEl.textContent = 'CRITICAL EXPOSURE'; badgeEl.className = 'telemetry-card__badge telemetry-badge--danger'; }
      if (iconEl) { iconEl.setAttribute('data-lucide', 'shield-x'); iconEl.className = 'telemetry-card__icon-svg text-red'; }
      if (adviceEl) adviceEl.textContent = 'Host metrics exposed. Perform local credential hardening audits immediately.';
      cardEl.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.15)';
    }
    
    if (window.lucide) lucide.createIcons();
  }
  
  slider.addEventListener('input', (e) => {
    updateThreatDisplay(e.target.value);
  });
  
  // Set initial value
  updateThreatDisplay(slider.value);
}

// 3. Posture hardening checklist
function initRecommendationsChecklist() {
  const checkboxes = document.querySelectorAll('.rec-checkbox');
  const countEl = document.getElementById('hardening-progress-ratio');
  const fillEl = document.getElementById('hardening-progress-bar-fill');
  const statusLabel = document.getElementById('hardening-status-label');
  const descEl = document.getElementById('hardening-progress-desc');
  
  if (checkboxes.length === 0) return;
  
  // Load saved checklist states
  const savedChecks = JSON.parse(localStorage.getItem('recommendation_checks')) || {};
  checkboxes.forEach(cb => {
    if (savedChecks[cb.id]) {
      cb.checked = true;
    }
    
    cb.addEventListener('change', () => {
      savedChecks[cb.id] = cb.checked;
      localStorage.setItem('recommendation_checks', JSON.stringify(savedChecks));
      updateChecklistProgress();
    });
  });
  
  function updateChecklistProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.rec-checkbox:checked').length;
    
    if (countEl) countEl.textContent = `${checked}/${total} Checked`;
    
    const percentage = Math.round((checked / total) * 100);
    if (fillEl) fillEl.style.width = `${percentage}%`;
    
    if (checked === 0) {
      if (statusLabel) { statusLabel.textContent = 'UNARMORED'; statusLabel.className = 'text-red text-mono'; }
      if (descEl) descEl.textContent = 'Implement recommendations below to secure your system endpoints and digital posture.';
    } else if (checked <= 3) {
      if (statusLabel) { statusLabel.textContent = 'VULNERABLE'; statusLabel.className = 'text-red text-mono'; }
      if (descEl) descEl.textContent = 'Initial credentials checked. Plug remaining network leaks to build armor.';
    } else if (checked <= 6) {
      if (statusLabel) { statusLabel.textContent = 'PARTIALLY ARMORED'; statusLabel.className = 'text-amber text-mono'; }
      if (descEl) descEl.textContent = 'Good start! More than half of your critical defenses are in place.';
    } else if (checked < total) {
      if (statusLabel) { statusLabel.textContent = 'ROBUST DEFENSE'; statusLabel.className = 'text-cyan text-mono'; }
      if (descEl) descEl.textContent = 'Your digital armor is solid. Just a few remaining gaps to plug.';
    } else {
      if (statusLabel) { statusLabel.textContent = 'FULLY FORTIFIED'; statusLabel.className = 'text-green text-mono'; }
      if (descEl) descEl.textContent = 'All benchmarks met! Your client-side digital posture is outstanding.';
    }
  }
  
  updateChecklistProgress();
}

// 4. Linux Terminal Shell Simulator
function initTerminalShell() {
  const input = document.getElementById('terminal-input');
  const buffer = document.getElementById('terminal-buffer');
  const scrollContainer = document.getElementById('terminal-scroll');
  
  if (!input) return;
  
  // Keep input focused when clicking terminal window
  const windowEl = document.getElementById('home-terminal');
  if (windowEl) {
    windowEl.addEventListener('click', () => {
      input.focus();
    });
  }
  
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const commandLine = input.value.trim();
      input.value = '';
      
      if (!commandLine) return;
      
      // Print prompt echo
      const echoLine = document.createElement('div');
      echoLine.className = 'terminal-line';
      echoLine.innerHTML = `<span class="terminal-prompt">user@secnode:~$</span> ${commandLine}`;
      buffer.appendChild(echoLine);
      
      // Parse command parts
      const parts = commandLine.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);
      
      await executeTerminalCommand(command, args);
      
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  });
}

async function executeTerminalCommand(cmd, args) {
  // Command list
  const validTools = [
    'phishing', 'password', 'quiz', 'osint', 'network', 'breach',
    'portscan', 'hash', 'whois', 'dns', 'encoder', 'subdomain',
    'headers', 'xss', 'ransomware', 'exif', 'arp', 'ssl', 'sqli', 'wifi'
  ];
  
  const aptPackages = {
    'headers': 'wg-tool-headers',
    'xss': 'wg-tool-xss',
    'ransomware': 'wg-tool-ransomware',
    'exif': 'wg-tool-exif',
    'arp': 'wg-tool-arp',
    'ssl': 'wg-tool-ssl',
    'sqli': 'wg-tool-sqli',
    'wifi': 'wg-tool-wifi'
  };

  switch (cmd) {
    case 'help':
      await writeToTerminal([
        `Available Commands:`,
        `  help                  Display command list`,
        `  clear                 Clear terminal window`,
        `  neofetch              Output system specifications & status`,
        `  ping &lt;host&gt;           Send ICMP echo packets to test network connectivity`,
        `  tools                 List all 20 tools and their installation status`,
        `  apt install &lt;pkg&gt;     Install new tools from remote repository`,
        `  launch &lt;tool&gt;         Navigate UI to visual tool panel`,
        `  [tool-command]        Run a tool in console mode (e.g. 'wifi', 'portscan')`
      ]);
      break;
      
    case 'clear':
      const buffer = document.getElementById('terminal-buffer');
      if (buffer) buffer.innerHTML = '';
      break;
      
    case 'neofetch':
      await writeToTerminal([
        `   <span class="text-green">.---.</span>          <span class="text-green">user@secnode</span>`,
        `  <span class="text-green">/     \\</span>         ------------------`,
        `  <span class="text-green">| () () |</span>       OS: SecurityNode OS v1.0`,
        `   <span class="text-green">\\  ^  /</span>        Host: Web-Container Client Node`,
        `    <span class="text-green">|||||</span>         Uptime: 4 hours, 32 mins`,
        `                  Shell: secsh v1.0.0`,
        `                  Resolution: ${window.screen.width}x${window.screen.height}`,
        `                  Browser: ${navigator.userAgent.substring(0, 30)}...`,
        `                  Memory: 4096MB simulated`,
        `                  Assessments: ${Object.keys(completedAssessments).filter(id => completedAssessments[id]).length}/20 run`
      ], 50);
      break;
      
    case 'ping':
      const host = args[0] || 'whogoesyou.io';
      await writeToTerminal([
        `PING ${host} (197.210.64.9) 56(84) bytes of data.`,
        `64 bytes from 197.210.64.9: icmp_seq=1 ttl=54 time=28.4 ms`,
        `64 bytes from 197.210.64.9: icmp_seq=2 ttl=54 time=29.1 ms`,
        `64 bytes from 197.210.64.9: icmp_seq=3 ttl=54 time=27.8 ms`,
        `--- ${host} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss, time 2004ms`,
        `rtt min/avg/max/mdev = 27.8/28.4/29.1/0.5 ms`
      ], 150);
      break;
      
    case 'tools':
      const toolLines = ['System packages index:'];
      validTools.forEach(t => {
        const isInst = isToolInstalled(t) ? '<span class="text-green">Installed</span>' : `<span class="text-red">Not Installed (apt install ${t})</span>`;
        const runCount = completedAssessments[t] ? '[<span class="text-green">Audited</span>]' : '[Pending]';
        toolLines.push(`  ${t.padEnd(14)} : ${isInst} ${runCount}`);
      });
      await writeToTerminal(toolLines, 30);
      break;
      
    case 'apt':
    case 'apt-get':
      const subcmd = args[0];
      const pkg = args[1];
      if (subcmd === 'install') {
        if (!pkg) {
          await writeToTerminal(['[ERROR] Specify package to install. Example: apt install wifi']);
        } else if (!aptPackages[pkg]) {
          if (validTools.includes(pkg)) {
            await writeToTerminal([`Package 'wg-tool-${pkg}' is already pre-installed.`]);
          } else {
            await writeToTerminal([`[ERROR] Package 'wg-tool-${pkg}' not found in SecurityNode repositories.`]);
          }
        } else if (installedTools[pkg]) {
          await writeToTerminal([`Package 'wg-tool-${pkg}' is already installed and active.`]);
        } else {
          // Perform full package installation simulation!
          await writeToTerminal([
            `Reading package lists... Done`,
            `Building dependency tree... Done`,
            `The following NEW packages will be installed:`,
            `  wg-tool-${pkg}`,
            `Need to get 142 kB of archives.`,
            `After this operation, 384 kB of additional disk space will be used.`,
            `Get:1 http://archive.securitynode.io secure/main wg-tool-${pkg} [142 kB]`,
            `Unpacking wg-tool-${pkg} ...`,
            `Setting up wg-tool-${pkg} ...`,
            `Processing triggers for security-node-service ...`,
            `[SUCCESS] Package wg-tool-${pkg} installed successfully. Tool is now active!`
          ], 150);
          
          // Unlocking the card in dashboard!
          installedTools[pkg] = true;
          localStorage.setItem('installed_tools', JSON.stringify(installedTools));
          
          const cardEl = document.getElementById(`card-${pkg}`);
          if (cardEl) {
            cardEl.classList.add('unlocking');
            setTimeout(() => {
              cardEl.classList.remove('locked', 'unlocking');
              const overlay = cardEl.querySelector('.tool-card__lock');
              if (overlay) overlay.remove();
            }, 600);
          }
          
          showToast(`Tool '${pkg}' unlocked on dashboard!`, 'shield-check');
        }
      } else {
        await writeToTerminal(['Usage: apt install <package>']);
      }
      break;
      
    case 'launch':
      const target = args[0];
      if (!target) {
        await writeToTerminal(['[ERROR] Usage: launch <tool-id>. Example: launch portscan']);
      } else if (!validTools.includes(target)) {
        await writeToTerminal([`[ERROR] Unknown tool: '${target}'. Type 'tools' for list.`]);
      } else {
        if (!isToolInstalled(target)) {
          await writeToTerminal([`[ERROR] Tool '${target}' is locked. Install it first: apt install ${target}`]);
        } else {
          await writeToTerminal([`[+] Launching visual UI panel for '${target}'...`]);
          setTimeout(() => navigateTo(target), 500);
        }
      }
      break;
      
    default:
      // Check if command is one of the valid tools (running it in terminal)
      if (validTools.includes(cmd)) {
        if (!isToolInstalled(cmd)) {
          await writeToTerminal([`Command '${cmd}' not found, but can be installed with: apt install ${cmd}`]);
        } else {
          // Dynamic terminal run execution based on tools
          if (cmd === 'portscan') await runTerminalPortScan(args);
          else if (cmd === 'hash') await runTerminalHash(args);
          else if (cmd === 'whois') await runTerminalWhois(args);
          else if (cmd === 'dns') await runTerminalDns(args);
          else if (cmd === 'encoder') await runTerminalEncoder(args);
          else if (cmd === 'subdomain') await runTerminalSubdomain(args);
          else if (cmd === 'headers') await runTerminalHeaders(args);
          else if (cmd === 'xss') await runTerminalXss(args);
          else if (cmd === 'ransomware') await runTerminalRansomware(args);
          else if (cmd === 'exif') await runTerminalExif(args);
          else if (cmd === 'arp') await runTerminalArp(args);
          else if (cmd === 'ssl') await runTerminalSsl(args);
          else if (cmd === 'sqli') await runTerminalSqli(args);
          else if (cmd === 'wifi') await runTerminalWifi(args);
          else if (cmd === 'phishing') {
            await writeToTerminal([
              `[+] Running Phishing Awareness Console Module...`,
              `[!] Scenario 1: Invoice email from 'billing-support@gmai1.com'.`,
              `[!] Red flag found: gmai1.com character substitution (look-alike domain).`,
              `[!] Audit complete. Review all scenarios in visual UI: launch phishing`
            ]);
            completeAssessment('phishing');
          } else if (cmd === 'password') {
            const pw = args[0] || 'password123';
            await writeToTerminal([
              `[+] Analyzing password: "${pw}"`,
              `Entropy Score: ${pw.length * 4} bits`,
              `Audit rating: WEAK password structure. Vulnerable to dictionary crunch.`,
              `Try analyzing complex values in the visual UI: launch password`
            ]);
            completeAssessment('password');
          } else if (cmd === 'quiz') {
            await writeToTerminal([
              `[+] Running Social Engineering Quiz overview...`,
              `[!] 15 scenarios loaded. Badges granted: Cyber Guardian / Novice.`,
              `[!] Take the full interactive quiz in the UI: launch quiz`
            ]);
            completeAssessment('quiz');
          } else if (cmd === 'osint') {
            const targetHandle = args[0] || 'target_user';
            await writeToTerminal([
              `[+] Querying public footprints for: ${targetHandle}`,
              `[EXPOSED] Social profiles resolved on: Twitter/X, GitHub, LinkedIn`,
              `[EXPOSED] Linked repositories found: 14 public node repositories`,
              `[+] OSINT audit finished. View recommendations in UI: launch osint`
            ]);
            completeAssessment('osint');
          } else if (cmd === 'network') {
            await writeToTerminal([
              `[+] Accessing Client Navigator specs...`,
              `User-Agent: ${navigator.userAgent}`,
              `Resolution: ${window.screen.width}x${window.screen.height}`,
              `Cookies status: Active`,
              `[!] WebRTC IP leaks audit recommended. Open GUI: launch network`
            ]);
            completeAssessment('network');
          } else if (cmd === 'breach') {
            const email = args[0] || 'admin@example.com';
            await writeToTerminal([
              `[+] Querying data breach tables for email: ${email}`,
              `[BREACHED] Match found: 'Adobe Leak' (2013) - Exposed: passwords, hints`,
              `[BREACHED] Match found: 'Canva Leak' (2019) - Exposed: emails, user hashes`,
              `[!] System compromised. Change password immediately.`
            ]);
            completeAssessment('breach');
          }
        }
      } else {
        await writeToTerminal([
          `Command '${cmd}' not found. Type 'help' for available list.`,
          aptPackages[cmd] || validTools.includes(cmd) ? `You can install it with: apt install ${cmd}` : ''
        ].filter(line => line !== ''));
      }
  }
}

// Unlock pre-installed tools visual templates
function initUnlockedCards() {
  const validTools = [
    'phishing', 'password', 'quiz', 'osint', 'network', 'breach',
    'portscan', 'hash', 'whois', 'dns', 'encoder', 'subdomain',
    'headers', 'xss', 'ransomware', 'exif', 'arp', 'ssl', 'sqli', 'wifi'
  ];
  
  validTools.forEach(t => {
    const cardEl = document.getElementById(`card-${t}`);
    if (cardEl) {
      if (isToolInstalled(t)) {
        cardEl.classList.remove('locked');
        const overlay = cardEl.querySelector('.tool-card__lock');
        if (overlay) overlay.remove();
      }
    }
  });
}

// DOM Init Integration
document.addEventListener('DOMContentLoaded', () => {
  initMatrixCanvas(); // Re-enabled with throttled frame rate and subtle colors
  
  if (window.lucide) {
    lucide.createIcons();
    // Measure pill panels after icons render
    initPillNav();
  }

  // Animate stats on load
  setTimeout(() => {
    showToast('Welcome to WhoGoesYou Node', 'shield-check');
  }, 1000);
  
  // Custom dashboard integrations
  initUnlockedCards();
  initBrowserTelemetry();
  initThreatSlider();
  initRecommendationsChecklist();
  initTerminalShell();
  updateAssessmentProgress();
});

// Track network scan initialization
let networkScanInitialized = false;
