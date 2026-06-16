/* ============================================================
   Data Breach Checker
   Simulated check matching target against common leak datasets
   ============================================================ */

const mockBreachDatabase = [
  {
    emailDomain: 'gmail.com',
    breaches: [
      { name: 'Canva Leak (2019)', date: 'May 2019', fields: ['Emails', 'Names', 'Passwords (salted bcrypt)', 'Usernames'] },
      { name: 'Dropbox Compromise (2012)', date: 'August 2012', fields: ['Emails', 'Passwords (salted sha1)'] },
      { name: 'Adobe Leak (2013)', date: 'October 2013', fields: ['Emails', 'Password hints', 'Passwords (encrypted)'] }
    ]
  },
  {
    emailDomain: 'yahoo.com',
    breaches: [
      { name: 'Yahoo Massive Leak (2013)', date: 'August 2013', fields: ['Emails', 'Names', 'Phone Numbers', 'Passwords (salted md5)'] },
      { name: 'LinkedIn Breach (2016)', date: 'May 2016', fields: ['Emails', 'Passwords (unsalted sha1)'] }
    ]
  },
  {
    emailDomain: 'outlook.com',
    breaches: [
      { name: 'Wattpad Exposure (2020)', date: 'June 2020', fields: ['Emails', 'Passwords (bcrypt)', 'Usernames', 'Genders'] }
    ]
  }
];

function checkBreach() {
  const emailInput = document.getElementById('breach-input').value.trim();
  const resultsDiv = document.getElementById('breach-results');

  if (!emailInput || !emailInput.includes('@')) {
    showToast('Please enter a valid email address.', 'alert-triangle');
    return;
  }

  resultsDiv.classList.remove('hidden');
  resultsDiv.innerHTML = `
    <div class="glass-card">
      <div class="scan-container">
        <div class="scan-ring">
          <span class="scan-ring__value" id="breach-counter">0%</span>
        </div>
        <p class="scan-status">Searching compromised data tables<span class="blink">_</span></p>
      </div>
    </div>
  `;

  let progress = 0;
  const counterEl = document.getElementById('breach-counter');

  const logInterval = setInterval(() => {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress > 100) progress = 100;
      counterEl.textContent = `${progress}%`;
    } else {
      clearInterval(logInterval);
      renderBreachResults(emailInput);
    }
  }, 100);
}

function renderBreachResults(email) {
  const resultsDiv = document.getElementById('breach-results');
  const cleanEmail = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  const domain = email.split('@')[1].toLowerCase();
  const matched = mockBreachDatabase.find(entry => entry.emailDomain === domain);
  
  if (matched && matched.breaches.length > 0) {
    resultsDiv.innerHTML = `
      <div class="glass-card">
        <div class="flex justify-between items-center mb-xl" style="color: var(--destructive);">
          <div class="flex items-center gap-md">
            <i data-lucide="shield-alert" class="icon-md"></i>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700;">Account Compromised!</h3>
          </div>
          <span class="tag tag--amber" style="background: var(--destructive-muted); border-color: var(--destructive); color: var(--destructive);">${matched.breaches.length} Breaches</span>
        </div>

        <p class="text-secondary mb-xl" style="font-size: 0.9rem; line-height: 1.6;">
          Your email <strong>${cleanEmail}</strong> has appeared in the following database leaks. Your password security on these platforms might have been compromised.
        </p>

        <div class="mb-xl">
          <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Exposed Records</h4>
          ${matched.breaches.map(breach => `
            <div class="breach-card">
              <div class="breach-card__header">
                <span class="breach-card__name">${breach.name}</span>
                <span class="breach-card__date">${breach.date}</span>
              </div>
              <div class="breach-card__data">
                ${breach.fields.map(field => `<span class="tag tag--cyan">${field}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div>
          <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Mitigation Guidelines</h4>
          <div class="results-list">
            <div class="result-item">
              <span class="result-item__icon text-green"><i data-lucide="key-round" class="icon-sm"></i></span>
              <div class="result-item__content">
                <span class="result-item__title" style="color: var(--primary);">Change Your Password Immediately</span>
                <span class="result-item__desc">Change the password on compromised accounts, and any other site where you reused that password.</span>
              </div>
            </div>
            <div class="result-item">
              <span class="result-item__icon text-green"><i data-lucide="shield-check" class="icon-sm"></i></span>
              <div class="result-item__content">
                <span class="result-item__title" style="color: var(--primary);">Enable Two-Factor Authentication (2FA)</span>
                <span class="result-item__desc">Activate 2FA using authenticator apps to add an extra validation layer even if passwords leak.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-xl">
          <button class="btn btn--outline" onclick="resetBreachChecker()"><i data-lucide="refresh-cw" class="btn-icon"></i> Check Another Email</button>
        </div>
      </div>
    `;
  } else {
    resultsDiv.innerHTML = `
      <div class="glass-card">
        <div class="flex justify-between items-center mb-xl" style="color: var(--success);">
          <div class="flex items-center gap-md">
            <i data-lucide="shield-check" class="icon-md"></i>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700;">No Compromises Detected</h3>
          </div>
          <span class="tag tag--green">Clean</span>
        </div>

        <p class="text-secondary mb-xl" style="font-size: 0.9rem; line-height: 1.6;">
          Your email <strong>${cleanEmail}</strong> was not found in our simulated breach records database.
        </p>

        <div>
          <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Prevention Tips</h4>
          <div class="results-list">
            <div class="result-item">
              <span class="result-item__icon text-green"><i data-lucide="lock" class="icon-sm"></i></span>
              <div class="result-item__content">
                <span class="result-item__title" style="color: var(--primary);">Use Unique Passwords</span>
                <span class="result-item__desc">Generate strong, random credentials for every login using a modern password manager.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-xl">
          <button class="btn btn--outline" onclick="resetBreachChecker()"><i data-lucide="refresh-cw" class="btn-icon"></i> Check Another Email</button>
        </div>
      </div>
    `;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function resetBreachChecker() {
  const resultsDiv = document.getElementById('breach-results');
  const input = document.getElementById('breach-input');
  
  if (resultsDiv) resultsDiv.classList.add('hidden');
  if (input) input.value = '';
}
