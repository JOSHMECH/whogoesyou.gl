/* ============================================================
   Password Strength Analyzer
   Real-time entropy-based analysis with pattern detection
   ============================================================ */

const commonPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'login', 'princess', 'football', 'shadow', 'sunshine', 'trustno1',
  'iloveyou', 'batman', 'access', 'hello', 'charlie', 'donald', '654321',
  'password1', 'qwerty123', 'admin', 'letmein', 'welcome', 'password123',
  '1234567890', 'starwars', 'whatever', 'mustang', 'michael', 'ninja',
  'compaq', 'passw0rd', 'internet', 'samsung', 'killer', 'pepper'
];

const keyboardPatterns = [
  'qwerty', 'asdf', 'zxcv', 'qazwsx', '1qaz', '2wsx', 'qwer', 'asdfgh',
  'zxcvbn', 'poiuy', 'lkjhg', 'mnbvcx', '!@#$', '!@#$%', '1234', '4321',
  'abcd', 'dcba', 'aaaa', 'bbbb', '1111', '0000'
];

const leet = { '@': 'a', '3': 'e', '1': 'i', '0': 'o', '$': 's', '5': 's', '7': 't' };

function analyzeLeetSpeak(password) {
  let decoded = password.toLowerCase();
  for (const [k, v] of Object.entries(leet)) {
    decoded = decoded.replaceAll(k, v);
  }
  return decoded;
}

function calculateEntropy(password) {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;

  if (charsetSize === 0) return 0;
  return Math.floor(password.length * Math.log2(charsetSize));
}

function getTimeToCrack(entropy) {
  // Assuming 10 billion guesses/second (modern GPU)
  const guessesPerSecond = 10e9;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond;

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 86400 * 30) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 86400 * 365) return `${Math.floor(seconds / (86400 * 30))} months`;
  if (seconds < 86400 * 365 * 1000) return `${Math.floor(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1e6) return `${Math.floor(seconds / (86400 * 365 * 1000))}K years`;
  if (seconds < 86400 * 365 * 1e9) return `${Math.floor(seconds / (86400 * 365 * 1e6))}M years`;
  return `${(seconds / (86400 * 365 * 1e9)).toFixed(1)}B years`;
}

function detectPatterns(password) {
  const issues = [];
  const suggestions = [];
  const lower = password.toLowerCase();
  const decoded = analyzeLeetSpeak(password);

  // Check common passwords
  if (commonPasswords.includes(lower) || commonPasswords.includes(decoded)) {
    issues.push({ icon: 'alert-triangle', text: 'This is a commonly used password', severity: 'danger' });
    suggestions.push('Avoid commonly used passwords — attackers try these first');
  }

  // Length check
  if (password.length < 8) {
    issues.push({ icon: 'shield-alert', text: `Only ${password.length} characters long (minimum 12 recommended)`, severity: 'danger' });
    suggestions.push('Use at least 12 characters for strong security');
  } else if (password.length < 12) {
    issues.push({ icon: 'info', text: `${password.length} characters (12+ recommended)`, severity: 'warning' });
    suggestions.push('Consider extending to 16+ characters');
  } else {
    issues.push({ icon: 'check-circle', text: `${password.length} characters — good length`, severity: 'safe' });
  }

  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

  if (varietyCount <= 1) {
    issues.push({ icon: 'type', text: 'Only uses one character type', severity: 'danger' });
    suggestions.push('Mix uppercase, lowercase, numbers, and symbols');
  } else if (varietyCount === 2) {
    issues.push({ icon: 'type', text: 'Uses 2 of 4 character types', severity: 'warning' });
    suggestions.push('Add more character types for stronger security');
  } else if (varietyCount === 3) {
    issues.push({ icon: 'type', text: 'Uses 3 of 4 character types', severity: 'safe' });
  } else {
    issues.push({ icon: 'type', text: 'Excellent character variety — all 4 types used', severity: 'safe' });
  }

  // Repeating characters
  if (/(.)\1{2,}/.test(password)) {
    issues.push({ icon: 'repeat', text: 'Contains repeating characters (e.g., aaa, 111)', severity: 'warning' });
    suggestions.push('Avoid repeating the same character 3+ times');
  }

  // Sequential patterns
  const seqPatterns = ['abc', 'bcd', 'cde', 'def', 'efg', '123', '234', '345', '456', '567', '678', '789'];
  if (seqPatterns.some(p => lower.includes(p))) {
    issues.push({ icon: 'trending-up', text: 'Contains sequential characters (abc, 123...)', severity: 'warning' });
    suggestions.push('Avoid sequential patterns — they\'re easy to guess');
  }

  // Keyboard patterns
  if (keyboardPatterns.some(p => lower.includes(p))) {
    issues.push({ icon: 'keyboard', text: 'Contains keyboard patterns (qwerty, asdf...)', severity: 'warning' });
    suggestions.push('Avoid keyboard walk patterns');
  }

  // Date patterns
  if (/(?:19|20)\d{2}/.test(password) || /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(password)) {
    issues.push({ icon: 'calendar', text: 'Contains what looks like a date', severity: 'warning' });
    suggestions.push('Avoid using dates — they can be guessed from public info');
  }

  // Leet speak
  if (decoded !== lower && commonPasswords.includes(decoded)) {
    issues.push({ icon: 'refresh-cw', text: 'Uses simple leet speak substitution on a common word', severity: 'warning' });
    suggestions.push('Leet speak (p@ssw0rd) is well-known to attackers');
  }

  // Good practices
  if (password.length >= 16 && varietyCount >= 3) {
    suggestions.push('Consider using a passphrase: "correct-horse-battery-staple" is both long and memorable');
  }

  if (suggestions.length === 0) {
    suggestions.push('This is a strong password! Consider using a password manager to remember it.');
  }

  return { issues, suggestions };
}

function getStrengthLevel(entropy, password) {
  const lower = password.toLowerCase();
  const decoded = analyzeLeetSpeak(password);

  // Override for common passwords
  if (commonPasswords.includes(lower) || commonPasswords.includes(decoded)) {
    return { level: 'weak', label: 'Weak — Common Password', color: 'var(--destructive)' };
  }

  if (entropy < 28) return { level: 'weak', label: 'Weak', color: 'var(--destructive)' };
  if (entropy < 36) return { level: 'fair', label: 'Fair', color: 'var(--warning)' };
  if (entropy < 60) return { level: 'good', label: 'Good', color: 'var(--accent)' };
  if (entropy < 80) return { level: 'strong', label: 'Strong', color: 'var(--success)' };
  return { level: 'very-strong', label: 'Very Strong', color: 'var(--primary)' };
}

function analyzePassword(password) {
  if (!password) {
    resetPasswordUI();
    return;
  }

  const entropy = calculateEntropy(password);
  const timeToCrack = getTimeToCrack(entropy);
  const strength = getStrengthLevel(entropy, password);
  const { issues, suggestions } = detectPatterns(password);

  // Update meter
  const meter = document.getElementById('password-meter');
  const meterFill = document.getElementById('password-meter-fill');
  meter.className = `meter meter--${strength.level}`;

  // Update labels
  const strengthLabel = document.getElementById('password-strength-label');
  strengthLabel.textContent = strength.label;
  strengthLabel.style.color = strength.color;

  document.getElementById('password-entropy').textContent = `${entropy} bits`;

  // Render details
  const details = document.getElementById('password-details');
  details.innerHTML = `
    <div class="flex justify-between items-center mb-lg" style="padding: var(--space-md) var(--space-lg); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border);">
      <div>
        <div class="text-mono text-muted" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px;">Time to Crack</div>
        <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: ${strength.color}; text-shadow: 0 0 10px ${strength.color}40; margin-top: 4px;">
          ${timeToCrack}
        </div>
      </div>
      <div style="text-align: right;">
        <div class="text-mono text-muted" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px;">Entropy</div>
        <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-primary); margin-top: 4px;">
          ${entropy} bits
        </div>
      </div>
    </div>

    <div class="mb-lg">
      <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Analysis</h4>
      <div class="results-list">
        ${issues.map(issue => `
          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="${issue.icon}" class="icon-sm"></i></span>
            <span class="result-item__content">
              <span class="result-item__title">${issue.text}</span>
            </span>
            <span class="result-item__status result-item__status--${issue.severity}">${issue.severity}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div>
      <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: var(--space-md);">Suggestions</h4>
      <div class="results-list">
        ${suggestions.map(s => `
          <div class="result-item">
            <span class="result-item__icon"><i data-lucide="lightbulb" class="icon-sm text-amber"></i></span>
            <span class="result-item__content">
              <span class="result-item__desc" style="color: var(--text-primary);">${s}</span>
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function resetPasswordUI() {
  const meter = document.getElementById('password-meter');
  meter.className = 'meter';
  document.getElementById('password-meter-fill').style.width = '0';
  document.getElementById('password-strength-label').textContent = 'Enter a password';
  document.getElementById('password-strength-label').style.color = 'var(--text-muted)';
  document.getElementById('password-entropy').textContent = '0 bits';
  document.getElementById('password-details').innerHTML = '';
}

function togglePasswordVisibility() {
  const input = document.getElementById('password-input');
  const toggle = document.getElementById('password-toggle');
  if (input.type === 'password') {
    input.type = 'text';
    toggle.innerHTML = '<i data-lucide="eye-off" class="icon-sm"></i>';
  } else {
    input.type = 'password';
    toggle.innerHTML = '<i data-lucide="eye" class="icon-sm"></i>';
  }
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('password-input');
  if (input) {
    input.addEventListener('input', (e) => {
      analyzePassword(e.target.value);
    });
  }
});
