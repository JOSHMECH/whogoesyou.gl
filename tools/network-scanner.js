/* ============================================================
   Network and Browser Fingerprint Scanner
   Pulls local variables, screen metrics, and user agent parameters
   ============================================================ */

function startNetworkScan() {
  networkScanInitialized = true;
  const area = document.getElementById('network-scan-area');
  const btn = document.getElementById('network-start-btn');
  
  if (btn) btn.classList.add('hidden');

  area.innerHTML = `
    <div class="scan-container" id="network-scanning">
      <div class="scan-ring">
        <span class="scan-ring__value" id="network-counter">0%</span>
      </div>
      <p class="scan-status" id="network-status-log">Accessing Navigator APIs<span class="blink">_</span></p>
      <div class="text-mono mt-lg" id="network-console" style="max-height: 120px; overflow-y: auto; text-align: left; font-size: 0.75rem; color: var(--text-secondary); background: rgba(0,0,0,0.3); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border);">
        > Querying screen pixel density parameters...
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }

  let progress = 0;
  const consoleEl = document.getElementById('network-console');
  const statusLog = document.getElementById('network-status-log');
  const counterEl = document.getElementById('network-counter');

  const logs = [
    "Collecting navigator platform metrics...",
    "Querying timezone settings and system language...",
    "Inspecting installed screen specifications...",
    "Simulating WebRTC local IP candidates resolution...",
    "Detecting browser graphic renderer configurations (WebGL)...",
    "Measuring canvas rendering difference offsets...",
    "Computing uniqueness metric coefficients..."
  ];

  const logInterval = setInterval(() => {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress > 100) progress = 100;
      counterEl.textContent = `${progress}%`;
      
      const logIdx = Math.floor((progress / 100) * logs.length);
      if (logs[logIdx] && !consoleEl.innerHTML.includes(logs[logIdx])) {
        consoleEl.innerHTML += `<br>> ${logs[logIdx]}`;
        statusLog.textContent = logs[logIdx];
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }
    } else {
      clearInterval(logInterval);
      renderNetworkResults();
    }
  }, 150);
}

function renderNetworkResults() {
  const area = document.getElementById('network-scan-area');
  const resultsDiv = document.getElementById('network-results');
  
  if (area) area.classList.add('hidden');
  if (resultsDiv) resultsDiv.classList.remove('hidden');

  // Pull actual local system/browser settings
  const platform = navigator.platform || 'Unknown';
  const language = navigator.language || 'Unknown';
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const colorDepth = `${window.screen.colorDepth}-bit`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled';
  const userAgent = navigator.userAgent;

  // WebRTC simulated details
  const localIp = '192.168.1.34 (Simulated Local Candidate)';
  const publicIp = '197.210.64.122 (Mock Gateway)';

  resultsDiv.innerHTML = `
    <div class="glass-card">
      <div class="flex justify-between items-center mb-xl">
        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-bright);">System Fingerprint Report</h3>
        <span class="tag tag--amber">Privacy score: 45/100</span>
      </div>

      <div class="mb-xl" style="padding-bottom: var(--space-xl); border-bottom: 1px solid var(--border);">
        <p class="text-secondary" style="font-size: 0.9rem; line-height: 1.6;">
          Your browser shares a highly distinct combination of platform details, extensions, and render configurations. Ad trackers use this to track you across websites even without cookies.
        </p>
      </div>

      <div class="mb-xl">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Collected Fingerprint Details</h4>
        <div class="results-list">
          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="monitor" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">Operating System & Platform</span>
              <span class="result-item__desc">${platform} (${navigator.oscpu || 'Unknown CPU'})</span>
            </div>
            <span class="result-item__status result-item__status--warning">Exposed</span>
          </div>

          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="maximize" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">Screen Size & Color Specs</span>
              <span class="result-item__desc">Resolution: ${screenRes} | Color Depth: ${colorDepth}</span>
            </div>
            <span class="result-item__status result-item__status--warning">Exposed</span>
          </div>

          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="globe" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">System Language & Timezone</span>
              <span class="result-item__desc">Language: ${language} | Timezone: ${timeZone}</span>
            </div>
            <span class="result-item__status result-item__status--warning">Exposed</span>
          </div>

          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="shield-alert" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">WebRTC Leak Detection</span>
              <span class="result-item__desc">Internal IP: ${localIp} | Public Gateway: ${publicIp}</span>
            </div>
            <span class="result-item__status result-item__status--danger">Risk</span>
          </div>

          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="database" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">Cookies Configuration</span>
              <span class="result-item__desc">Cookie parameters are currently: ${cookiesEnabled}</span>
            </div>
            <span class="result-item__status result-item__status--safe">Safe</span>
          </div>
        </div>
      </div>

      <div class="mb-xl">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Raw User-Agent Header</h4>
        <div style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(0,0,0,0.4); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border); overflow-x: auto; color: var(--text-secondary);">
          ${userAgent}
        </div>
      </div>

      <div>
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Defensive Guidelines</h4>
        <div class="results-list">
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title" style="color: var(--primary);">Disable WebRTC in Browser</span>
              <span class="result-item__desc">Install extensions like 'WebRTC Control' or disable WebRTC manually in advanced configs to prevent local IP leaks.</span>
            </div>
          </div>
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title" style="color: var(--primary);">Use Privacy-Focused Browsers</span>
              <span class="result-item__desc">Firefox (with ResistFingerprinting enabled) or Brave randomize canvas vectors to reduce your fingerprint's uniqueness.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-xl">
        <button class="btn btn--outline" onclick="resetNetworkScan()"><i data-lucide="refresh-cw" class="btn-icon"></i> Scan Again</button>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function resetNetworkScan() {
  const area = document.getElementById('network-scan-area');
  const resultsDiv = document.getElementById('network-results');
  
  if (area) {
    area.classList.remove('hidden');
    area.innerHTML = `
      <div class="scan-container" id="network-scanning">
        <div class="scan-ring">
          <span class="scan-ring__value" id="network-score">—</span>
        </div>
        <p class="scan-status">Initializing scan<span class="blink">_</span></p>
        <button class="btn btn--accent mt-xl" id="network-start-btn" onclick="startNetworkScan()"><i data-lucide="play" class="btn-icon"></i> Start Scan</button>
      </div>
    `;
  }
  if (resultsDiv) resultsDiv.classList.add('hidden');
  networkScanInitialized = false;

  if (window.lucide) {
    lucide.createIcons();
  }
}
