/* ============================================================
   Phishing Awareness Simulator
   10 realistic phishing scenarios with red-flag detection
   ============================================================ */

const phishingScenarios = [
  {
    id: 1,
    type: 'email',
    from: 'security@paypa1-verify.com',
    fromDisplay: 'PayPal Security Team',
    subject: 'URGENT: Your account has been limited!',
    body: `Dear Valued Customer,

We have noticed <span class="red-flag" data-flag="Vague urgency — legitimate services rarely use panic language">unusual activity</span> on your PayPal account. Your account has been temporarily limited.

To restore your account access, please <span class="red-flag" data-flag="Suspicious link — hover to check the real URL before clicking">click here to verify your identity</span> within <span class="red-flag" data-flag="Artificial time pressure is a classic phishing tactic">24 hours</span> or your account will be permanently suspended.

<span class="red-flag" data-flag="Generic greeting — PayPal would use your actual name">Dear Valued Customer</span> — we take your security seriously.

Best regards,
<span class="red-flag" data-flag="Check sender email: paypa1-verify.com uses '1' instead of 'l'">PayPal Security Team</span>`,
    redFlagCount: 5,
    difficulty: 'Easy'
  },
  {
    id: 2,
    type: 'email',
    from: 'it-support@company-internal.net',
    fromDisplay: 'IT Department',
    subject: 'Mandatory Password Reset Required',
    body: `Hi Team,

Due to a <span class="red-flag" data-flag="Vague security incident without specific details">recent security incident</span>, all employees are required to reset their passwords immediately.

Please use the link below to update your credentials:
<span class="red-flag" data-flag="External domain for internal IT — company would use internal portal">https://company-password-reset.external-site.com/update</span>

Your current username and password will be required to <span class="red-flag" data-flag="Legitimate reset flows never ask for your current password via a link">verify your identity</span>.

This must be completed by <span class="red-flag" data-flag="Artificial deadline creates urgency">end of business today</span>.

Thanks,
IT Support`,
    redFlagCount: 4,
    difficulty: 'Easy'
  },
  {
    id: 3,
    type: 'sms',
    from: '+1-555-0199',
    fromDisplay: 'Unknown Number',
    subject: 'SMS Message',
    body: `<span class="red-flag" data-flag="Banks never send SMS asking you to click links">Your bank account</span> has been locked due to suspicious activity. 

Verify now: <span class="red-flag" data-flag="Shortened URL hides the real destination — never click these">https://bit.ly/3xR9kMz</span>

Reply STOP to <span class="red-flag" data-flag="Replying confirms your number is active — a common tactic">unsubscribe</span>`,
    redFlagCount: 3,
    difficulty: 'Easy'
  },
  {
    id: 4,
    type: 'email',
    from: 'ceo@company-corp.com',
    fromDisplay: 'Michael Chen (CEO)',
    subject: 'Urgent - Wire Transfer Needed',
    body: `Hi,

I need you to process an urgent wire transfer of <span class="red-flag" data-flag="Large unexpected payment request from senior exec is classic CEO fraud">$45,000</span> to the account below. This is for a <span class="red-flag" data-flag="Confidential framing prevents you from verifying with colleagues">confidential acquisition</span> — please don't discuss with anyone else.

Account: 8847291035
Routing: 091000019

Please process this <span class="red-flag" data-flag="Extreme urgency bypasses normal verification procedures">before 3 PM today</span>. I'm in meetings all day so <span class="red-flag" data-flag="Requesting you not to call prevents voice verification">don't call, just email me when done</span>.

Thanks,
Michael`,
    redFlagCount: 4,
    difficulty: 'Medium'
  },
  {
    id: 5,
    type: 'email',
    from: 'noreply@linkedn.com',
    fromDisplay: 'LinkedIn',
    subject: 'You have 3 new connection requests',
    body: `<div style="text-align: center;">
<strong style="font-size: 1.1rem;">LinkedIn</strong>

You have <strong>3 pending connection requests</strong> from people in your network.

<span class="red-flag" data-flag="Misspelled domain: 'linkedn.com' instead of 'linkedin.com'">View Connections →</span>

New connections:
• Sarah Johnson — <span class="red-flag" data-flag="Too-good-to-be-true connection from high-profile person">VP at Google</span>
• David Park — Recruiter at Meta
• <span class="red-flag" data-flag="Vague profile with no company — likely fake">Jane Smith — Professional</span>

Don't miss out on growing your network!</div>`,
    redFlagCount: 3,
    difficulty: 'Medium'
  },
  {
    id: 6,
    type: 'email',
    from: 'delivery@amaz0n-tracking.com',
    fromDisplay: 'Amazon Delivery',
    subject: 'Your package could not be delivered',
    body: `Hello,

We attempted to deliver your package but were unable to reach you. 

Tracking Number: <span class="red-flag" data-flag="Random tracking number you didn't expect">AMZ-7823-9912-XK</span>

To reschedule delivery, please confirm your <span class="red-flag" data-flag="Legitimate delivery services never ask for payment details via email">payment details and shipping address</span> at the link below:

<span class="red-flag" data-flag="Domain uses zero instead of 'o' — amaz0n vs amazon">https://amaz0n-tracking.com/reschedule</span>

A <span class="red-flag" data-flag="Unexpected fees for delivery are a classic phishing lure">$2.99 redelivery fee</span> will be charged.

Amazon Logistics Team`,
    redFlagCount: 4,
    difficulty: 'Medium'
  },
  {
    id: 7,
    type: 'social',
    from: '@crypto_wealth_official',
    fromDisplay: 'CryptoWealth Official ✓',
    subject: 'Instagram DM',
    body: `Hey! 👋 

I noticed you're interested in <span class="red-flag" data-flag="Unsolicited investment advice from strangers is always suspicious">crypto investing</span>. I've been making <span class="red-flag" data-flag="Guaranteed returns don't exist — this is a major red flag">$5,000/week guaranteed</span> with my strategy.

I'm offering <span class="red-flag" data-flag="Limited spots create artificial scarcity">10 free spots</span> for my mentorship program.

Just send me <span class="red-flag" data-flag="Never send money to strangers promising returns">0.1 ETH as a commitment fee</span> and I'll give you access to my exclusive trading group 🚀

DM me now before <span class="red-flag" data-flag="Urgency combined with opportunity is a classic scam pattern">spots run out!</span>`,
    redFlagCount: 5,
    difficulty: 'Easy'
  },
  {
    id: 8,
    type: 'email',
    from: 'admin@microsoftonline-auth.com',
    fromDisplay: 'Microsoft 365 Admin',
    subject: 'Action Required: Email quota exceeded',
    body: `<div style="text-align: center;">
<strong>Microsoft 365</strong>
</div>

Your mailbox has reached <span class="red-flag" data-flag="Fake quota warnings are a common phishing lure">97% capacity (4.85 GB / 5 GB)</span>.

Incoming messages are being held. To prevent mail loss, increase your quota:

<span class="red-flag" data-flag="Microsoft uses microsoft.com, not microsoftonline-auth.com">[Increase Storage →]</span>

You will need to <span class="red-flag" data-flag="Microsoft never asks you to re-enter credentials via email">re-enter your Microsoft credentials</span> for verification.

This is an automated message from <span class="red-flag" data-flag="Fake domain — Microsoft would use microsoft.com or office.com">microsoftonline-auth.com</span>

Do not reply to this email.`,
    redFlagCount: 4,
    difficulty: 'Medium'
  },
  {
    id: 9,
    type: 'email',
    from: 'tax-refund@irs-gov-refunds.com',
    fromDisplay: 'Internal Revenue Service',
    subject: 'Tax Refund Notification - $3,847.00',
    body: `Dear Taxpayer,

After the last annual calculation of your fiscal activity, we have determined that you are eligible to receive a <span class="red-flag" data-flag="IRS never contacts taxpayers about refunds via email">tax refund of $3,847.00</span>.

To claim your refund, please submit the required form within <span class="red-flag" data-flag="Creating time pressure — real tax processes don't have 48-hour deadlines">48 hours</span>:

<span class="red-flag" data-flag="IRS domain is irs.gov, not irs-gov-refunds.com">https://irs-gov-refunds.com/claim-refund</span>

You will need to provide:
• <span class="red-flag" data-flag="The IRS would never ask for SSN via email">Social Security Number</span>
• Bank account details
• Date of Birth

Sincerely,
<span class="red-flag" data-flag="Vague signature — no specific agent name or ID">Internal Revenue Service</span>`,
    redFlagCount: 5,
    difficulty: 'Hard'
  },
  {
    id: 10,
    type: 'email',
    from: 'hr@actual-company.com',
    fromDisplay: 'HR Department',
    subject: 'Updated Employee Handbook - Please Review',
    body: `Hi Team,

We've updated our employee handbook with new policies effective next quarter.

Please review the changes at your convenience:
<span style="color: var(--primary);">https://intranet.actual-company.com/handbook-2026</span>

Key updates include:
• Remote work policy adjustments
• Updated PTO accrual rates  
• New benefits enrollment window

No action is required — just read through when you have a moment.

Best,
Sarah Martinez
HR Director
Ext. 4521`,
    isLegitimate: true,
    redFlagCount: 0,
    difficulty: 'Hard'
  }
];

let currentPhishingIndex = 0;
let phishingScore = 0;
let phishingFlagsFound = 0;
let phishingTotalFlags = 0;

function initPhishingSimulator() {
  currentPhishingIndex = 0;
  phishingScore = 0;
  phishingFlagsFound = 0;
  phishingTotalFlags = 0;

  // Build progress bar
  const progressEl = document.getElementById('phishing-progress');
  progressEl.innerHTML = phishingScenarios.map((_, i) =>
    `<div class="quiz-progress__dot" id="phishing-dot-${i}"></div>`
  ).join('');

  renderPhishingScenario();
}

function renderPhishingScenario() {
  const container = document.getElementById('phishing-container');
  const scenario = phishingScenarios[currentPhishingIndex];

  if (!scenario) {
    showPhishingResults();
    return;
  }

  // Update progress
  const currentDot = document.getElementById(`phishing-dot-${currentPhishingIndex}`);
  if (currentDot) currentDot.classList.add('current');

  const typeIcons = { email: 'mail', sms: 'message-square', social: 'share-2' };
  const typeLabels = { email: 'Email', sms: 'SMS', social: 'Social Media DM' };

  container.innerHTML = `
    <div class="glass-card mb-lg">
      <div class="flex justify-between items-center mb-md">
        <span class="tag tag--cyan"><i data-lucide="${typeIcons[scenario.type]}" class="btn-icon"></i> ${typeLabels[scenario.type]}</span>
        <span class="tag tag--amber">${scenario.difficulty}</span>
      </div>

      <div class="email-preview">
        <div class="email-preview__header">
          <div class="email-preview__from">
            <span>From:</span> ${scenario.fromDisplay} &lt;${scenario.from}&gt;
          </div>
          <div class="email-preview__subject">
            <span>Subject:</span> ${scenario.subject}
          </div>
        </div>
        <div class="email-preview__body" id="phishing-body-${scenario.id}">
          ${scenario.body}
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <div>
        <span class="text-mono text-muted" style="font-size: 0.75rem;">
          ${scenario.isLegitimate ? 'Hint: Not all emails are phishing!' : `Find ${scenario.redFlagCount} red flags — click suspicious elements`}
        </span>
        <div class="text-mono mt-sm" style="font-size: 0.8rem;">
          Flags found: <span class="text-green" id="flags-found-${scenario.id}">0</span> / ${scenario.redFlagCount}
        </div>
      </div>
      <div class="flex gap-md">
        ${scenario.isLegitimate ? `
          <button class="btn btn--primary btn--sm" onclick="markLegitimate(${scenario.id})"><i data-lucide="check" class="btn-icon"></i> Legitimate</button>
          <button class="btn btn--danger btn--sm" onclick="markPhishing(${scenario.id})"><i data-lucide="x" class="btn-icon"></i> Phishing</button>
        ` : `
          <button class="btn btn--outline btn--sm" onclick="revealAllFlags(${scenario.id})"><i data-lucide="eye" class="btn-icon"></i> Reveal All</button>
          <button class="btn btn--primary btn--sm" id="next-phishing" onclick="nextPhishingScenario()"><i data-lucide="arrow-right" class="btn-icon"></i> Next</button>
        `}
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }

  // Attach click handlers to red flags
  if (!scenario.isLegitimate) {
    const flags = container.querySelectorAll('.red-flag');
    let foundCount = 0;

    flags.forEach(flag => {
      const tooltip = document.createElement('span');
      tooltip.className = 'red-flag__tooltip';
      tooltip.textContent = flag.dataset.flag;
      flag.appendChild(tooltip);

      flag.addEventListener('click', () => {
        if (!flag.classList.contains('revealed')) {
          flag.classList.add('revealed');
          foundCount++;
          phishingFlagsFound++;
          document.getElementById(`flags-found-${scenario.id}`).textContent = foundCount;

          if (foundCount === scenario.redFlagCount) {
            phishingScore++;
            showToast(`All flags found! Score: ${phishingScore}/${currentPhishingIndex + 1}`, 'check-circle');
          }
        }
      });
    });
  }
}

function markLegitimate(scenarioId) {
  const scenario = phishingScenarios.find(s => s.id === scenarioId);
  if (scenario && scenario.isLegitimate) {
    phishingScore++;
    showToast('Correct! This was a legitimate email.', 'check-circle');
  } else {
    showToast('Incorrect — this was actually a phishing attempt!', 'alert-triangle');
  }
  nextPhishingScenario();
}

function markPhishing(scenarioId) {
  const scenario = phishingScenarios.find(s => s.id === scenarioId);
  if (scenario && !scenario.isLegitimate) {
    phishingScore++;
    showToast('Correct! This was a phishing attempt.', 'check-circle');
  } else {
    showToast('Incorrect — this was actually a legitimate email.', 'alert-triangle');
  }
  nextPhishingScenario();
}

function revealAllFlags(scenarioId) {
  document.querySelectorAll(`#phishing-body-${scenarioId} .red-flag`).forEach(flag => {
    flag.classList.add('revealed');
  });
}

function nextPhishingScenario() {
  const prevDot = document.getElementById(`phishing-dot-${currentPhishingIndex}`);
  if (prevDot) {
    prevDot.classList.remove('current');
    prevDot.classList.add('completed');
  }

  currentPhishingIndex++;
  renderPhishingScenario();
}

function showPhishingResults() {
  const container = document.getElementById('phishing-container');
  container.classList.add('hidden');

  const results = document.getElementById('phishing-results');
  results.classList.remove('hidden');

  const percentage = Math.round((phishingScore / phishingScenarios.length) * 100);
  let grade, gradeClass;

  if (percentage >= 90) { grade = 'Excellent'; gradeClass = 'excellent'; }
  else if (percentage >= 70) { grade = 'Good'; gradeClass = 'good'; }
  else if (percentage >= 50) { grade = 'Fair'; gradeClass = 'fair'; }
  else { grade = 'Needs Work'; gradeClass = 'poor'; }

  results.innerHTML = `
    <div class="glass-card">
      <div class="score-display">
        <div class="score-circle score-circle--${gradeClass}">
          <span class="score-circle__value">${percentage}%</span>
          <span class="score-circle__label">Score</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--text-bright); margin-bottom: var(--space-sm);">
          ${grade}
        </h3>
        <p class="text-muted" style="margin-bottom: var(--space-lg);">
          You correctly identified ${phishingScore} out of ${phishingScenarios.length} scenarios
        </p>
        <div class="flex gap-md justify-center">
          <button class="btn btn--primary" onclick="resetPhishing()"><i data-lucide="refresh-cw" class="btn-icon"></i> Try Again</button>
          <button class="btn btn--outline" onclick="navigateTo('tools')"><i data-lucide="arrow-left" class="btn-icon"></i> Back to Tools</button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function resetPhishing() {
  document.getElementById('phishing-container').classList.remove('hidden');
  document.getElementById('phishing-results').classList.add('hidden');
  initPhishingSimulator();
}

// Auto-init when section is shown
document.addEventListener('DOMContentLoaded', () => {
  initPhishingSimulator();
});
