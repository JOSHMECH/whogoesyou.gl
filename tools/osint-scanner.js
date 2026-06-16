/* ============================================================
   Digital Footprint Scanner (OSINT)
   Simulated intelligence scanner demonstrating public exposure
   ============================================================ */

function startOsintScan() {
  const inputVal = document.getElementById('osint-input').value.trim();
  const resultsDiv = document.getElementById('osint-results');

  if (!inputVal) {
    showToast('Please enter a phone number, username, or email address.', 'alert-triangle');
    return;
  }

  resultsDiv.classList.remove('hidden');
  resultsDiv.innerHTML = `
    <div class="glass-card">
      <div class="scan-container" id="osint-scanning">
        <div class="scan-ring">
          <span class="scan-ring__value" id="osint-counter">0%</span>
        </div>
        <p class="scan-status" id="osint-status-log">Connecting to public registry APIs<span class="blink">_</span></p>
        <div class="text-mono mt-lg" id="osint-console" style="max-height: 120px; overflow-y: auto; text-align: left; font-size: 0.75rem; color: var(--text-secondary); background: rgba(0,0,0,0.3); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border);">
          > Initializing footprints scan target: ${inputVal}...
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }

  let progress = 0;
  const consoleEl = document.getElementById('osint-console');
  const statusLog = document.getElementById('osint-status-log');
  const counterEl = document.getElementById('osint-counter');

  const logs = [
    "Searching public registration records...",
    "Querying social media indices (LinkedIn, Twitter, Github)...",
    "Inspecting metadata headers in image repositories...",
    "Analyzing username configurations across 80+ web platforms...",
    "Scanning public reverse lookup database directories...",
    "Correlating geolocation coordinates from public posts...",
    "Analyzing email alias matching configurations...",
    "Finalizing exposure risk classification metric..."
  ];

  const logInterval = setInterval(() => {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 8) + 4;
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
      renderOsintResults(inputVal);
    }
  }, 180);
}

function renderOsintResults(target) {
  const resultsDiv = document.getElementById('osint-results');
  
  // Clean inputs to avoid script injections
  const cleanTarget = target.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  // Decide dummy data fields based on entry type
  let detectedAssets = [];
  let riskScore = 40;
  let severity = 'warning';
  
  if (target.includes('@')) {
    riskScore = 75;
    severity = 'danger';
    detectedAssets = [
      { category: 'Social Profiles', detail: 'Found associated records on LinkedIn, GitHub, and Twitter matching name prefixes.', icon: 'share-2', status: 'Exposed' },
      { category: 'Breached Databases', detail: 'Target credentials found in 3 historical data dumps (2021, 2023).', icon: 'shield-alert', status: 'Action Required' },
      { category: 'Public Documents', detail: 'Found email matching corporate directory file records in public PDF metadata.', icon: 'file-text', status: 'Exposed' }
    ];
  } else if (/^\+?[0-9\-\s]{7,15}$/.test(target.replace(/\s/g, ''))) {
    riskScore = 60;
    severity = 'warning';
    detectedAssets = [
      { category: 'WhatsApp Footprint', detail: 'Active WhatsApp account detected with public status, profile avatar, and online status enabled.', icon: 'message-square', status: 'Exposed' },
      { category: 'Name Correlation', detail: 'Phone lookup matched registered name indices on public directories.', icon: 'user', status: 'Partially Exposed' },
      { category: 'Location Leaks', detail: 'Telecom prefix associated with region location grids.', icon: 'map-pin', status: 'Safe' }
    ];
  } else {
    riskScore = 30;
    severity = 'safe';
    detectedAssets = [
      { category: 'Username Match', detail: 'Username registered across 5 platforms. No associated emails exposed.', icon: 'user', status: 'Safe' },
      { category: 'Image Indexing', detail: 'No direct facial recognition indexing records found in database search.', icon: 'image', status: 'Safe' }
    ];
  }

  const gradeClass = riskScore >= 75 ? 'poor' : (riskScore >= 50 ? 'fair' : 'good');

  resultsDiv.innerHTML = `
    <div class="glass-card">
      <div class="flex justify-between items-center mb-xl">
        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-bright);">Exposure Risk: ${cleanTarget}</h3>
        <span class="tag tag--${severity === 'danger' ? 'amber' : (severity === 'warning' ? 'cyan' : 'green')}">${severity} level</span>
      </div>

      <div class="flex flex-col md-row gap-xl items-center mb-xl" style="padding-bottom: var(--space-xl); border-bottom: 1px solid var(--border);">
        <div class="score-circle score-circle--${gradeClass}" style="flex-shrink: 0;">
          <span class="score-circle__value">${riskScore}%</span>
          <span class="score-circle__label">Exposure Risk</span>
        </div>
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-bright); margin-bottom: var(--space-sm);">Vulnerability Analysis</h4>
          <p class="text-secondary" style="font-size: 0.9rem; line-height: 1.6;">
            A malicious actor performing target reconnaissance could collect these vectors to coordinate phishing emails, social engineering calls, or credential stuffing attacks against you.
          </p>
        </div>
      </div>

      <div class="mb-xl">
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Scan Vulnerability Log</h4>
        <div class="results-list">
          ${detectedAssets.map(asset => `
            <div class="result-item">
              <span class="result-item__icon"><i data-lucide="${asset.icon}" class="icon-sm"></i></span>
              <div class="result-item__content">
                <span class="result-item__title">${asset.category}</span>
                <span class="result-item__desc">${asset.detail}</span>
              </div>
              <span class="result-item__status result-item__status--${asset.status === 'Action Required' ? 'danger' : (asset.status === 'Exposed' ? 'warning' : 'safe')}">${asset.status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Defensive Guidelines</h4>
        <div class="results-list">
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title" style="color: var(--primary);">Hide WhatsApp / Telegram Profile Info</span>
              <span class="result-item__desc">Configure messaging app security preferences to show profile photos and online status to 'My Contacts Only'.</span>
            </div>
          </div>
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title" style="color: var(--primary);">Clean Up PDF Metadata</span>
              <span class="result-item__desc">Before publishing work documents online, sanitize metadata (author names, software versions) using tools like EXIF purge.</span>
            </div>
          </div>
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title" style="color: var(--primary);">Request Data Removal</span>
              <span class="result-item__desc">Opt-out from public data brokers and lookup directories (e.g. Truecaller, Whitepages) to prevent reverse searches.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
