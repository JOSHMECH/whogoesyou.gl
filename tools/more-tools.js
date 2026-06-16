/* ============================================================
   WhoGoesYou — Additional Security Tools Logic (Tools 7-20)
   Contains both Visual UI logic and Terminal console outputs
   ============================================================ */

// Helper to check if a package is installed
function isToolInstalled(toolId) {
  const installed = JSON.parse(localStorage.getItem('installed_tools')) || {};
  
  // Pre-installed tools
  const preInstalled = [
    'portscan', 'hash', 'whois', 'dns', 'encoder', 'subdomain',
    'phishing', 'password', 'quiz', 'osint', 'network', 'breach'
  ];
  
  return preInstalled.includes(toolId) || !!installed[toolId];
}

// Helper to print simulation text in the terminal window
function writeToTerminal(lines, delayMs = 100) {
  const buffer = document.getElementById('terminal-buffer');
  if (!buffer) return Promise.resolve();

  return new Promise((resolve) => {
    let index = 0;
    
    function printNext() {
      if (index < lines.length) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = lines[index];
        buffer.appendChild(line);
        
        // Auto scroll
        const scrollContainer = document.getElementById('terminal-scroll');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
        
        index++;
        setTimeout(printNext, delayMs);
      } else {
        resolve();
      }
    }
    
    printNext();
  });
}

// ==========================================
// TOOL 07 — PORT SCANNER
// ==========================================
function startPortScan() {
  const ip = document.getElementById('portscan-ip').value || '127.0.0.1';
  const log = document.getElementById('portscan-log');
  const resultsTable = document.getElementById('portscan-results-body');
  const resultsContainer = document.getElementById('portscan-results');
  
  log.innerHTML = `> Initiating port scan against ${ip}...<br>`;
  resultsContainer.classList.add('hidden');
  
  const commonPorts = [
    { port: 21, service: 'FTP', status: 'Closed', vuln: 'Cleartext credentials transmission' },
    { port: 22, service: 'SSH', status: 'Open', vuln: 'Configured for password auth (recommend key auth)' },
    { port: 23, service: 'Telnet', status: 'Open', vuln: 'CRITICAL: Unencrypted management interface' },
    { port: 80, service: 'HTTP', status: 'Open', vuln: 'Active web server. Unencrypted traffic.' },
    { port: 443, service: 'HTTPS', status: 'Open', vuln: 'Secure SSL/TLS web server. Safe.' },
    { port: 3306, service: 'MySQL', status: 'Closed', vuln: 'Database endpoint protected' },
    { port: 3389, service: 'RDP', status: 'Open', vuln: 'Windows Remote Desktop exposed to brute force' },
    { port: 8080, service: 'HTTP-Alt', status: 'Closed', vuln: 'No alternate port web services' }
  ];
  
  let index = 0;
  const interval = setInterval(() => {
    if (index < commonPorts.length) {
      const p = commonPorts[index];
      log.innerHTML += `> Probing port ${p.port} (${p.service})... ${p.status === 'Open' ? '<span class="text-red">OPEN</span>' : '<span class="text-green">CLOSED</span>'}<br>`;
      index++;
    } else {
      clearInterval(interval);
      log.innerHTML += `> Scan completed. Rendering reports.<br>`;
      
      resultsTable.innerHTML = '';
      commonPorts.forEach(p => {
        resultsTable.innerHTML += `
          <tr>
            <td class="text-mono font-bold">${p.port}</td>
            <td class="text-mono">${p.service}</td>
            <td><span class="tag ${p.status === 'Open' ? 'tag--amber' : 'tag--green'}">${p.status}</span></td>
            <td class="text-secondary" style="font-size: 0.8rem;">${p.vuln}</td>
          </tr>
        `;
      });
      resultsContainer.classList.remove('hidden');
      window.completeAssessment('portscan');
    }
  }, 300);
}

function runTerminalPortScan(args) {
  const target = args[0] || '127.0.0.1';
  return writeToTerminal([
    `[+] Scanning ports on host: ${target}`,
    `[+] Service detection enabled. Probing top 1000 ports...`,
    `[!] Port 22/tcp  - OPEN  - OpenSSH 8.2p1 (Ubunu)`,
    `[!] Port 23/tcp  - OPEN  - Telnetd (Insecure cleartext!)`,
    `[!] Port 80/tcp  - OPEN  - Apache httpd 2.4.41`,
    `[!] Port 443/tcp - OPEN  - Apache httpd (SSL Active)`,
    `[!] Port 3389/tcp - OPEN - Microsoft Terminal Services RDP`,
    `[+] Probing completed. 5 ports open.`,
    `[RECOMMENDATION] Close port 23 immediately. Migrate RDP behind VPN.`
  ]);
}

// ==========================================
// TOOL 08 — HASH GENERATOR & CRACKER
// ==========================================
function runHashOperations() {
  const text = document.getElementById('hash-input-text').value;
  const md5Out = document.getElementById('hash-md5');
  const sha256Out = document.getElementById('hash-sha256');
  
  if (!text) {
    md5Out.textContent = '—';
    sha256Out.textContent = '—';
    return;
  }
  
  // Custom simple client-side hash mockups (simulating MD5/SHA256)
  md5Out.textContent = tempHash(text, 32);
  sha256Out.textContent = tempHash(text, 64);
  window.completeAssessment('hash');
}

function tempHash(str, len) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).repeat(4);
  return hex.substring(0, len);
}

const mockHashDict = {
  '5d41402abc4b2a76b9719d911017c592': 'hello',
  '21232f297a57a5a743894a0e4a801fc3': 'admin',
  'e10adc3949ba59abbe56e057f20f883e': '123456',
  'f5134c672b13781297e68bc928f110bc': 'qwerty',
  'secnode2026hashval382910': 'secnode'
};

function crackHash() {
  const hash = document.getElementById('crack-input-hash').value.trim().toLowerCase();
  const output = document.getElementById('crack-result');
  
  output.innerHTML = `<span class="blink">> Performing dictionary attack...</span>`;
  
  setTimeout(() => {
    if (mockHashDict[hash]) {
      output.innerHTML = `<span class="text-green font-bold">[SUCCESS] Hash Cracked! Original value: "${mockHashDict[hash]}" (Matched in common 10k wordlist).</span>`;
    } else if (hash.length !== 32 && hash.length !== 64) {
      output.innerHTML = `<span class="text-red">[ERROR] Invalid hash length. Supported formats: MD5 (32 hex) or SHA-256 (64 hex).</span>`;
    } else {
      output.innerHTML = `<span class="text-amber">[FAILED] Hash not found in the simulated dictionary. Brute force required.</span>`;
    }
    window.completeAssessment('hash');
  }, 1000);
}

function runTerminalHash(args) {
  const action = args[0];
  const value = args[1];
  
  if (action === 'generate') {
    if (!value) return writeToTerminal([`[ERROR] Usage: hash generate <text>`]);
    return writeToTerminal([
      `Text: "${value}"`,
      `MD5:    ${tempHash(value, 32)}`,
      `SHA256: ${tempHash(value, 64)}`
    ]);
  } else if (action === 'crack') {
    if (!value) return writeToTerminal([`[ERROR] Usage: hash crack <hash>`]);
    const match = mockHashDict[value.toLowerCase()];
    return writeToTerminal([
      `[+] Testing dictionary database against hash: ${value}`,
      match ? `[SUCCESS] Match found: "${match}"` : `[FAILED] Hash not found in wordlist.`
    ]);
  } else {
    return writeToTerminal([`Usage: hash [generate|crack] <value>`]);
  }
}

// ==========================================
// TOOL 09 — WHOIS LOOKUP
// ==========================================
function runWhoisScan() {
  const domain = document.getElementById('whois-domain').value || 'google.com';
  const out = document.getElementById('whois-output');
  
  out.classList.remove('hidden');
  out.innerHTML = `[+] Querying WHOIS servers for ${domain}...<br><br>`;
  
  setTimeout(() => {
    out.innerHTML = `
Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 21390482_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.net
Registrar URL: http://www.registrar.net
Updated Date: 2025-10-14T12:00:00Z
Creation Date: 1997-09-15T04:00:00Z
Registry Expiry Date: 2028-09-15T04:00:00Z
Registrar: MarkMonitor Inc.
Registrant Organization: Aries Domain Privacy
Registrant State/Province: London
Registrant Country: UK
Name Server: NS1.AETHER-DNS.NET
Name Server: NS2.AETHER-DNS.NET
DNSSEC: unsigned
    `;
    window.completeAssessment('whois');
  }, 800);
}

function runTerminalWhois(args) {
  const domain = args[0] || 'whogoesyou.io';
  return writeToTerminal([
    `[+] Fetching WHOIS record for: ${domain}`,
    `Domain: ${domain.toUpperCase()}`,
    `Registrar: MarkMonitor Inc.`,
    `Created: 2012-05-18`,
    `Expires: 2027-05-18`,
    `Name Servers: ns1.aether-dns.net, ns2.aether-dns.net`,
    `Registrant: Aries Corporate Privacy (London, UK)`
  ]);
}

// ==========================================
// TOOL 10 — DNS RECORDS ANALYZER
// ==========================================
function runDnsScan() {
  const domain = document.getElementById('dns-domain').value || 'domain.com';
  const tbody = document.getElementById('dns-results-body');
  const results = document.getElementById('dns-results');
  
  tbody.innerHTML = `<tr><td colspan="4" class="text-center">Querying authoritative nameservers...</td></tr>`;
  results.classList.remove('hidden');
  
  setTimeout(() => {
    tbody.innerHTML = `
      <tr>
        <td class="text-mono font-bold">A</td>
        <td class="text-mono">@</td>
        <td class="text-mono">197.210.64.101</td>
        <td><span class="tag tag--green">Normal</span></td>
      </tr>
      <tr>
        <td class="text-mono font-bold">MX</td>
        <td class="text-mono">mail</td>
        <td class="text-mono">10 mx.mail.google.com</td>
        <td><span class="tag tag--green">Normal</span></td>
      </tr>
      <tr>
        <td class="text-mono font-bold">TXT</td>
        <td class="text-mono">@</td>
        <td class="text-mono">v=spf1 include:_spf.google.com ~all</td>
        <td><span class="tag tag--green">SPF Safe</span></td>
      </tr>
      <tr>
        <td class="text-mono font-bold">TXT</td>
        <td class="text-mono">_dmarc</td>
        <td class="text-mono">v=DMARC1; p=none; rua=mailto:dmarc@${domain}</td>
        <td><span class="tag tag--amber">DMARC Monitor Only</span></td>
      </tr>
    `;
    window.completeAssessment('dns');
  }, 1000);
}

function runTerminalDns(args) {
  const domain = args[0] || 'domain.com';
  return writeToTerminal([
    `[+] Querying DNS zones for: ${domain}`,
    `A\t@\t197.210.64.101`,
    `MX\tmail\t10 mx.google.com`,
    `TXT\t@\tv=spf1 include:_spf.google.com ~all (SoftFail)`,
    `TXT\t_dmarc\tv=DMARC1; p=none (Vulnerable to spoofing: change to p=reject)`
  ]);
}

// ==========================================
// TOOL 11 — BASE64/HEX ENCODER
// ==========================================
function runEncoding(op) {
  const input = document.getElementById('encoder-input').value;
  const output = document.getElementById('encoder-output');
  
  if (!input) {
    output.value = '';
    return;
  }
  
  try {
    if (op === 'enc64') {
      output.value = btoa(input);
    } else if (op === 'dec64') {
      output.value = atob(input);
    } else if (op === 'encHex') {
      let hex = '';
      for (let i = 0; i < input.length; i++) {
        hex += input.charCodeAt(i).toString(16).padStart(2, '0');
      }
      output.value = hex;
    } else if (op === 'decHex') {
      let str = '';
      for (let i = 0; i < input.length; i += 2) {
        str += String.fromCharCode(parseInt(input.substr(i, 2), 16));
      }
      output.value = str;
    } else if (op === 'encUrl') {
      output.value = encodeURIComponent(input);
    } else if (op === 'decUrl') {
      output.value = decodeURIComponent(input);
    }
    window.completeAssessment('encoder');
  } catch (e) {
    output.value = `Error performing operation: ${e.message}`;
  }
}

function runTerminalEncoder(args) {
  const op = args[0];
  const val = args[1];
  if (!op || !val) return writeToTerminal([`Usage: encoder [enc64|dec64|encHex|decHex] <text>`]);
  
  try {
    if (op === 'enc64') return writeToTerminal([btoa(val)]);
    if (op === 'dec64') return writeToTerminal([atob(val)]);
    if (op === 'encHex') {
      let hex = '';
      for (let i = 0; i < val.length; i++) hex += val.charCodeAt(i).toString(16).padStart(2, '0');
      return writeToTerminal([hex]);
    }
    if (op === 'decHex') {
      let str = '';
      for (let i = 0; i < val.length; i += 2) str += String.fromCharCode(parseInt(val.substr(i, 2), 16));
      return writeToTerminal([str]);
    }
  } catch(e) {
    return writeToTerminal([`[ERROR] Operations failed: ${e.message}`]);
  }
}

// ==========================================
// TOOL 12 — SUBDOMAIN ENUMERATOR
// ==========================================
function runSubdomainEnum() {
  const domain = document.getElementById('subdomain-domain').value || 'target.com';
  const speed = document.getElementById('subdomain-speed').value;
  const log = document.getElementById('subdomain-log');
  const resultsTable = document.getElementById('subdomain-results-body');
  const resultsContainer = document.getElementById('subdomain-results');
  
  log.innerHTML = `> Starting subdomain enumeration on ${domain} (Speed mode: ${speed})<br>`;
  resultsContainer.classList.add('hidden');
  
  const subs = ['www', 'mail', 'vpn', 'admin', 'dev', 'cpanel', 'api', 'stage', 'test', 'remote'];
  let index = 0;
  
  const intervalTime = speed === 'stealth' ? 500 : 150;
  
  const interval = setInterval(() => {
    if (index < subs.length) {
      const sub = subs[index];
      const found = Math.random() > 0.4;
      log.innerHTML += `> Probing ${sub}.${domain}... ${found ? '<span class="text-green">RESOLVED</span>' : '<span class="text-muted">NXDOMAIN</span>'}<br>`;
      
      if (found) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="text-mono font-bold">${sub}.${domain}</td>
          <td class="text-mono">197.210.64.${Math.floor(Math.random()*254)}</td>
          <td><span class="tag tag--green">Resolved</span></td>
        `;
        resultsTable.appendChild(row);
      }
      index++;
    } else {
      clearInterval(interval);
      log.innerHTML += `> Enumeration finished. Attack surface mapped.<br>`;
      resultsContainer.classList.remove('hidden');
      window.completeAssessment('subdomain');
    }
  }, intervalTime);
}

function runTerminalSubdomain(args) {
  const domain = args[0] || 'google.com';
  return writeToTerminal([
    `[+] Brute forcing subdomains for: ${domain}`,
    `[+] Loaded wordlist containing 5000 records.`,
    `[RESOLVED] www.${domain} -> 142.250.190.46`,
    `[RESOLVED] mail.${domain} -> 142.250.190.5`,
    `[RESOLVED] admin.${domain} -> 142.250.190.102`,
    `[RESOLVED] dev.${domain} -> 142.250.190.15`,
    `[+] Mapping completed. 4 subdomains resolved.`
  ]);
}

// ==========================================
// TOOL 13 — HTTP HEADER CHECKER
// ==========================================
function runHeaderScan() {
  const url = document.getElementById('header-url').value || 'http://example.com';
  const container = document.getElementById('header-results');
  const scoreEl = document.getElementById('header-score');
  const itemsContainer = document.getElementById('header-items');
  
  container.classList.remove('hidden');
  itemsContainer.innerHTML = `<div class="text-center w-full">Requesting page and reading response headers...</div>`;
  
  const mockHeaders = [
    { name: 'X-Frame-Options', value: 'DENY', status: 'safe', desc: 'Prevents clickjacking injection by disabling frame embeds.' },
    { name: 'Strict-Transport-Security', value: 'max-age=31536000', status: 'safe', desc: 'Enforces secure HTTPS traffic tunnels.' },
    { name: 'Content-Security-Policy', value: 'default-src \'self\';', status: 'safe', desc: 'Restricts script sources to prevent XSS.' },
    { name: 'X-Content-Type-Options', value: 'nosniff', status: 'safe', desc: 'Prevents MIME sniffing vulnerabilities.' },
    { name: 'Server', value: 'Apache/2.4.41 (Ubuntu)', status: 'danger', desc: 'Leaks webserver platform version details (OSINT helper).' },
    { name: 'Referrer-Policy', value: 'no-referrer', status: 'safe', desc: 'Protects sensitive URL parameters from leaking.' }
  ];
  
  setTimeout(() => {
    itemsContainer.innerHTML = '';
    mockHeaders.forEach(h => {
      itemsContainer.innerHTML += `
        <div class="result-item">
          <span class="result-item__icon"><i data-lucide="${h.status === 'safe' ? 'shield-check' : 'shield-alert'}" class="icon-sm"></i></span>
          <div class="result-item__content">
            <span class="result-item__title">${h.name}: <code class="text-mono" style="font-size:0.75rem; color:var(--text-secondary);">${h.value}</code></span>
            <span class="result-item__desc">${h.desc}</span>
          </div>
          <span class="result-item__status ${h.status === 'safe' ? 'result-item__status--safe' : 'result-item__status--danger'}">${h.status === 'safe' ? 'Secure' : 'Risk'}</span>
        </div>
      `;
    });
    scoreEl.textContent = '80/100';
    if (window.lucide) lucide.createIcons();
    window.completeAssessment('headers');
  }, 1000);
}

function runTerminalHeaders(args) {
  const url = args[0] || 'http://example.com';
  return writeToTerminal([
    `[+] Analyzing HTTP headers for: ${url}`,
    `[SAFE]   Content-Security-Policy: default-src 'self'`,
    `[SAFE]   X-Frame-Options: SAMEORIGIN`,
    `[RISK]   Server: Nginx/1.18.0 (Leaks system software metrics)`,
    `[RISK]   X-Powered-By: PHP/7.4.3 (Leaks server language parameters)`,
    `[!] Audit complete. Score: 60/100. Hide signature headers.`
  ]);
}

// ==========================================
// TOOL 14 — XSS SANDBOX
// ==========================================
function runXssTest() {
  const input = document.getElementById('xss-input').value;
  const output = document.getElementById('xss-reflection');
  
  if (!input) return;
  
  output.innerHTML = input;
  
  // Safely intercept XSS injection signatures and trigger warning modals
  if (input.includes('<script>') || input.includes('onerror=') || input.includes('onload=')) {
    showToast('Simulated XSS Payload Executed!', 'shield-alert');
    output.style.borderColor = 'var(--destructive)';
  } else {
    output.style.borderColor = 'var(--border)';
  }
  window.completeAssessment('xss');
}

function runTerminalXss(args) {
  const payload = args.join(' ') || '<script>alert(1)</script>';
  return writeToTerminal([
    `[+] Feeding input payload to unescaped rendering template:`,
    `Payload: "${payload}"`,
    `[ALERT] XSS Payload reflected in document context!`,
    `[!] Exploitable vector verified: script execution triggered.`,
    `[DEFENSE] Sanitize input strings using htmlspecialchars() or DOMPurify.`
  ]);
}

// ==========================================
// TOOL 15 — RANSOMWARE SIMULATOR
// ==========================================
const ransomwareFiles = [
  { name: 'client-records.db', size: '2.4 MB', status: 'Decrypted' },
  { name: 'tax-filing.xlsx', size: '480 KB', status: 'Decrypted' },
  { name: 'user-photos.zip', size: '15.2 MB', status: 'Decrypted' },
  { name: 'passwords.txt', size: '4 KB', status: 'Decrypted' },
  { name: 'root-ssh.key', size: '2 KB', status: 'Decrypted' },
  { name: 'system-config.json', size: '12 KB', status: 'Decrypted' }
];

function initRansomwareFiles() {
  const tbody = document.getElementById('ransomware-files');
  if (!tbody) return;
  tbody.innerHTML = '';
  ransomwareFiles.forEach(f => {
    tbody.innerHTML += `
      <tr>
        <td class="text-mono font-bold">${f.name}</td>
        <td class="text-mono">${f.size}</td>
        <td><span class="tag tag--green" id="rf-status-${f.name}">${f.status}</span></td>
      </tr>
    `;
  });
}

function runRansomwareDemo() {
  const btn = document.getElementById('ransomware-btn');
  const decryptBox = document.getElementById('ransomware-decrypt-box');
  btn.disabled = true;
  
  let i = 0;
  const interval = setInterval(() => {
    if (i < ransomwareFiles.length) {
      const f = ransomwareFiles[i];
      const statusEl = document.getElementById(`rf-status-${f.name}`);
      statusEl.textContent = 'ENCRYPTED';
      statusEl.className = 'tag tag--amber';
      i++;
    } else {
      clearInterval(interval);
      showToast('System Compromised! Files Locked.', 'shield-alert');
      decryptBox.classList.remove('hidden');
      window.completeAssessment('ransomware');
    }
  }, 400);
}

function decryptRansomware() {
  const key = document.getElementById('ransomware-key').value.trim();
  const decryptBox = document.getElementById('ransomware-decrypt-box');
  const btn = document.getElementById('ransomware-btn');
  
  if (key === 'SEC-DECRYPT-KEY-2026') {
    ransomwareFiles.forEach(f => {
      const statusEl = document.getElementById(`rf-status-${f.name}`);
      statusEl.textContent = 'Decrypted';
      statusEl.className = 'tag tag--green';
    });
    showToast('Files Successfully Restored!', 'shield-check');
    decryptBox.classList.add('hidden');
    btn.disabled = false;
  } else {
    showToast('Invalid Recovery Key. Try Again.', 'shield-alert');
  }
}

function runTerminalRansomware(args) {
  const action = args[0];
  if (action === 'encrypt') {
    return writeToTerminal([
      `[CRITICAL] Starting encryption payload...`,
      `[LOCKED] client-records.db.locked`,
      `[LOCKED] tax-filing.xlsx.locked`,
      `[LOCKED] passwords.txt.locked`,
      `[!] Encryption finished. Ransom note generated: ransom.txt`,
      `[!] Decrypt keys are available with: decrypt <key>`
    ]);
  } else if (action === 'decrypt') {
    const key = args[1];
    if (key === 'SEC-DECRYPT-KEY-2026') {
      return writeToTerminal([`[SUCCESS] Restoring RSA keys... Files decrypted.`]);
    } else {
      return writeToTerminal([`[ERROR] Invalid recovery key signature.`]);
    }
  } else {
    return writeToTerminal([`Usage: ransomware [encrypt|decrypt <key>]`]);
  }
}

// ==========================================
// TOOL 16 — METADATA (EXIF) EXTRACTOR
// ==========================================
const mockExifPhotos = {
  office: {
    device: 'iPhone 14 Pro',
    date: '2026-05-10 14:32:05',
    gps: '51.5074 N, 0.1278 W',
    location: 'Aether Security London Hub',
    iso: '100',
    exposure: '1/250s'
  },
  beach: {
    device: 'Sony Alpha 7 III',
    date: '2026-04-12 11:15:30',
    gps: '34.0194 N, 118.4912 W',
    location: 'Santa Monica Beach, LA',
    iso: '200',
    exposure: '1/500s'
  },
  apartment: {
    device: 'Samsung Galaxy S23',
    date: '2026-06-01 20:05:12',
    gps: '1.2902 N, 103.8519 E',
    location: 'Singapore Central Marina',
    iso: '640',
    exposure: '1/30s'
  }
};

function selectExifPhoto(type) {
  const data = mockExifPhotos[type];
  const results = document.getElementById('exif-results');
  
  if (!data) return;
  
  results.classList.remove('hidden');
  results.innerHTML = `
    <div class="glass-card mt-lg">
      <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--text-bright); margin-bottom: var(--space-md);">Extracted EXIF Metadata</h3>
      <div class="results-list">
        <div class="result-item">
          <span class="result-item__icon"><i data-lucide="camera" class="icon-sm"></i></span>
          <div class="result-item__content">
            <span class="result-item__title">Device & Camera Specs</span>
            <span class="result-item__desc">Model: ${data.device} | ISO: ${data.iso} | Shutter: ${data.exposure}</span>
          </div>
        </div>
        <div class="result-item">
          <span class="result-item__icon"><i data-lucide="calendar" class="icon-sm"></i></span>
          <div class="result-item__content">
            <span class="result-item__title">Timestamp</span>
            <span class="result-item__desc">Capture Date: ${data.date}</span>
          </div>
        </div>
        <div class="result-item">
          <span class="result-item__icon"><i data-lucide="map-pin" class="icon-sm"></i></span>
          <div class="result-item__content">
            <span class="result-item__title">GPS Coordinates</span>
            <span class="result-item__desc">Coordinates: ${data.gps} | Estimated: ${data.location}</span>
          </div>
        </div>
      </div>
      <div class="mt-lg" style="height: 180px; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; text-align: center; z-index: 1;">
          <i data-lucide="map" class="icon-md text-green mb-sm"></i><br>
          Map Coordinates Loaded: [${data.gps}]
        </div>
        <div style="position: absolute; width: 100%; height: 100%; opacity: 0.15; background-size: cover; background-image: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_black_white.png');"></div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
  window.completeAssessment('exif');
}

function runTerminalExif(args) {
  const photo = args[0] || 'office';
  const data = mockExifPhotos[photo.toLowerCase()];
  if (!data) return writeToTerminal([`[ERROR] Sample photo not found. Choose: office, beach, or apartment.`]);
  
  return writeToTerminal([
    `[+] Analyzing EXIF segments of image: ${photo}.jpg`,
    `Make/Model:  ${data.device}`,
    `Created:     ${data.date}`,
    `Coordinates: ${data.gps}`,
    `ISO Rating:  ${data.iso}`,
    `Exposure:    ${data.exposure}`,
    `Location:    ${data.location}`,
    `[!] Exif metadata exposes exact camera specifications and location info.`
  ]);
}

// ==========================================
// TOOL 17 — ARP SPOOFING DETECTOR
// ==========================================
let arpMonitoring = false;
let arpInterval = null;

function toggleArpMonitor() {
  const btn = document.getElementById('arp-btn');
  const feed = document.getElementById('arp-feed');
  
  if (arpMonitoring) {
    clearInterval(arpInterval);
    btn.textContent = 'Start ARP Monitor';
    btn.className = 'btn btn--primary';
    arpMonitoring = false;
  } else {
    btn.textContent = 'Stop ARP Monitor';
    btn.className = 'btn btn--danger';
    arpMonitoring = true;
    
    feed.innerHTML = `> ARP monitor initialized. Sniffing packets...<br>`;
    
    const packetTypes = [
      'ARP Request: Who has 192.168.1.1? Tell 192.168.1.5',
      'ARP Reply: 192.168.1.1 is at 00:1A:2B:3C:4D:5E',
      'ARP Request: Who has 192.168.1.1? Tell 192.168.1.12',
      'ARP Reply: 192.168.1.1 is at 00:1A:2B:3C:4D:5E',
      'ALERT: ARP spoofing detected! 192.168.1.1 reported at MAC 00:FF:FF:FF:FF:00 (Conflict with 00:1A:2B:3C:4D:5E)',
      'MITIGATION: Blocking malicious MAC and broadcasting network reset packet.'
    ];
    
    let i = 0;
    arpInterval = setInterval(() => {
      if (i < packetTypes.length) {
        const p = packetTypes[i];
        if (p.includes('ALERT')) {
          feed.innerHTML += `<span class="text-red font-bold">> ${p}</span><br>`;
        } else if (p.includes('MITIGATION')) {
          feed.innerHTML += `<span class="text-green">> ${p}</span><br>`;
        } else {
          feed.innerHTML += `> ${p}<br>`;
        }
        feed.scrollTop = feed.scrollHeight;
        i++;
      } else {
        clearInterval(arpInterval);
        btn.textContent = 'Start ARP Monitor';
        btn.className = 'btn btn--primary';
        arpMonitoring = false;
        window.completeAssessment('arp');
      }
    }, 800);
  }
}

function runTerminalArp(args) {
  return writeToTerminal([
    `[+] ARP Poisoning detection daemon active...`,
    `[*] Sniffing link layer mappings...`,
    `[OK] 192.168.1.1 mapping resolved to 00:1A:2B:3C:4D:5E`,
    `[!] ALERT: MAC Address Conflict detected on 192.168.1.1`,
    `[!] Source MAC 00:EE:DD:CC:BB:AA claiming gateway IP.`,
    `[CRITICAL] ARP Cache poisoning vector active (Man-In-The-Middle attack).`,
    `[+] Defensive shielding: Static ARP routing recommended.`
  ]);
}

// ==========================================
// TOOL 18 — SSL/TLS CIPHER AUDIT
// ==========================================
function runSslScan() {
  const domain = document.getElementById('ssl-domain').value || 'example.com';
  const container = document.getElementById('ssl-results');
  
  container.classList.remove('hidden');
  container.innerHTML = `<div class="text-center w-full">Performing TLS Handshake probe against ${domain}...</div>`;
  
  setTimeout(() => {
    container.innerHTML = `
      <div class="glass-card">
        <div class="flex justify-between items-center mb-md">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-bright);">TLS Cipher Report</h3>
          <span class="tag tag--green">Certificate Valid</span>
        </div>
        
        <div class="results-list">
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">Certificate Details</span>
              <span class="result-item__desc">Issued to: *.${domain} | Issued by: Let's Encrypt Authority R3 | Expires: in 84 days</span>
            </div>
          </div>
          
          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="check-circle" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">Supported Protocols</span>
              <span class="result-item__desc">TLS 1.3: <span class="text-green">Supported</span> | TLS 1.2: <span class="text-green">Supported</span> | TLS 1.1/1.0: <span class="text-red">Disabled (Secure)</span></span>
            </div>
          </div>

          <div class="result-item">
            <span class="result-item__icon text-green"><i data-lucide="check-circle" class="icon-sm"></i></span>
            <div class="result-item__content">
              <span class="result-item__title">Forward Secrecy</span>
              <span class="result-item__desc">ECDHE key exchange active: Diffie-Hellman parameters are secure.</span>
            </div>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    window.completeAssessment('ssl');
  }, 1000);
}

function runTerminalSsl(args) {
  const domain = args[0] || 'google.com';
  return writeToTerminal([
    `[+] Analyzing SSL/TLS certificate for: ${domain}`,
    `[+] Issued By: DigiCert SHA2 Secure Server CA`,
    `[+] Signature Algorithm: SHA256withRSA`,
    `[+] Protocols: TLSv1.3 (Secure) | TLSv1.2 (Secure) | TLSv1.1 (Disabled)`,
    `[+] Active Cipher Suite: TLS_AES_256_GCM_SHA384 (256-bit)`,
    `[OK] Configuration meets high encryption compliance standards.`
  ]);
}

// ==========================================
// TOOL 19 — SQL INJECTION SANDBOX
// ==========================================
function runSqliScan() {
  const user = document.getElementById('sqli-user').value;
  const pass = document.getElementById('sqli-pass').value;
  const log = document.getElementById('sqli-log');
  const results = document.getElementById('sqli-results');
  
  log.innerHTML = `> SELECT * FROM users WHERE username='${user}' AND password='${pass}';<br>`;
  
  // Standard SQL injection bypass checks
  const isBypassed = user.includes("' OR 1=1") || user.includes("' or 1=1") || pass.includes("' OR 1=1") || pass.includes("' or 1=1");
  
  setTimeout(() => {
    if (isBypassed) {
      log.innerHTML += `<span class="text-green">> Query returned positive match: Bypass Valid!</span><br>`;
      results.classList.remove('hidden');
      results.innerHTML = `
        <div class="glass-card mt-md" style="border-color: var(--primary);">
          <h3 class="text-green font-bold mb-md" style="font-family: var(--font-heading); font-size: 1rem;">[SQL INJECTION BYPASS SUCCESSFUL]</h3>
          <p class="text-secondary mb-md" style="font-size:0.8rem;">You manipulated the raw query to always resolve to TRUE. The application logged you in without checking credentials. Here is the leaked administrative data:</p>
          <table class="w-full text-mono text-left" style="font-size:0.75rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border);">
                <th style="padding:4px;">ID</th>
                <th style="padding:4px;">Username</th>
                <th style="padding:4px;">Pass Hash (MD5)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:4px;">1</td>
                <td style="padding:4px;">admin</td>
                <td style="padding:4px;">21232f297a57a5a743894a0e4a801fc3</td>
              </tr>
              <tr>
                <td style="padding:4px;">2</td>
                <td style="padding:4px;">ceo_sec</td>
                <td style="padding:4px;">f5134c672b13781297e68bc928f110bc</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      log.innerHTML += `<span class="text-red">> Zero records returned. Authentication failed.</span><br>`;
      results.classList.add('hidden');
    }
    window.completeAssessment('sqli');
  }, 600);
}

function runTerminalSqli(args) {
  const query = args.join(' ') || "' OR 1=1 --";
  return writeToTerminal([
    `[+] Probing target database endpoint with input: ${query}`,
    `[+] Raw query: SELECT * FROM admin WHERE user='${query}'`,
    `[!] SUCCESS: 1 row returned. Bypass established!`,
    `[LEAKED RECORD] Admin Account: admin / Hash: 21232f297a57a5a743894a0e4a801fc3`,
    `[DEFENSE] Use Prepared Statements (Parameterized Queries) to restrict injection.`
  ]);
}

// ==========================================
// TOOL 20 — WIFI HANDSHAKE DECRYPTER
// ==========================================
function runWifiCrack() {
  const log = document.getElementById('wifi-log');
  const btn = document.getElementById('wifi-btn');
  const result = document.getElementById('wifi-result');
  
  btn.disabled = true;
  result.classList.add('hidden');
  log.innerHTML = `> Initiating WPA2 handshake audit...<br>`;
  log.innerHTML += `> Extracted 4-way handshake packets for SSID: "CORP_OFFICE_5G"<br>`;
  log.innerHTML += `> BSSID: 00:14:2D:E1:5B:C2 | Client MAC: F4:F5:D6:C7:B8:A9<br>`;
  
  let i = 0;
  const wordlist = ['password123', 'adminpass', 'homeoffice', 'wifi2025', 'secretkey', 'qwerty', 'corpwifi2026', 'guest123'];
  
  const timer = setInterval(() => {
    if (i < wordlist.length) {
      log.innerHTML += `> testing key: "${wordlist[i]}"... FAILED<br>`;
      log.scrollTop = log.scrollHeight;
      i++;
    } else {
      clearInterval(timer);
      log.innerHTML += `> testing key: "SEC-WIFI-KEY-2026"... <span class="text-green">KEY FOUND!</span><br>`;
      result.classList.remove('hidden');
      btn.disabled = false;
      window.completeAssessment('wifi');
    }
  }, 350);
}

function runTerminalWifi(args) {
  return writeToTerminal([
    `[+] Loading WPA2 Handshake decrypt engine...`,
    `[*] Target BSSID: 00:14:2D:E1:5B:C2 (SSID: CORP_OFFICE_WIFI)`,
    `[*] Cracking speed: 15,400 keys/sec (Dictionary mode)`,
    `[+] Brute forcing index... 10%... 45%... 80%...`,
    `[SUCCESS] Key Found! Password: "corpwifi2026"`,
    `[+] Time elapsed: 4.8s. 4-way handshake decrypted successfully.`
  ]);
}
