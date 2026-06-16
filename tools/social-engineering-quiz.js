/* ============================================================
   Social Engineering Quiz
   15 interactive scenarios covering phone, online, and physical vectors
   ============================================================ */

const quizQuestions = [
  {
    id: 1,
    scenario: "You receive a phone call from someone claiming to be from your company's IT department. They say there is a critical database update and they need you to confirm your Windows logon password right away to prevent lockout.",
    options: [
      { text: "Give them the password immediately to avoid disruptions.", isCorrect: false },
      { text: "Refuse, hang up, and report the request through verified company IT channels.", isCorrect: true },
      { text: "Give them a fake password to see what they do.", isCorrect: false },
      { text: "Ask them for their supervisor's name and then give them the password.", isCorrect: false }
    ],
    explanation: "Legitimate IT personnel will never ask for your password over the phone. Under any circumstances, report unsolicited calls attempting credential retrieval."
  },
  {
    id: 2,
    scenario: "As you approach the locked main entrance of your office building carrying several boxes, a well-dressed person with a coffee cup follows closely behind you, expecting you to hold the door open for them.",
    options: [
      { text: "Politely hold the door open and let them in.", isCorrect: false },
      { text: "Drop your boxes to block their way.", isCorrect: false },
      { text: "Politely ask them to scan their own access badge, or escort them to the reception desk.", isCorrect: true },
      { text: "Slam the door in their face without saying anything.", isCorrect: false }
    ],
    explanation: "This is a classic 'tailgating' technique. Intruders count on social politeness to bypass physical access controls."
  },
  {
    id: 3,
    scenario: "You receive a LinkedIn connection request from a recruiter who has an attractive profile picture but very few connections, no shared contacts, and a poorly formatted work history.",
    options: [
      { text: "Accept the request to grow your professional network.", isCorrect: false },
      { text: "Decline and report the profile as suspicious, since fake recruiters often collect target info.", isCorrect: true },
      { text: "Message them asking for a job recommendation.", isCorrect: false },
      { text: "Accept, but block them if they message you.", isCorrect: false }
    ],
    explanation: "Malicious actors create fake profiles representing recruiters to gather information on employees or deliver malicious files under the guise of job descriptions."
  },
  {
    id: 4,
    scenario: "A USB flash drive labeled 'HR Salary Adjustments Q3' is left sitting on a table in the office breakroom.",
    options: [
      { text: "Plug it into your workstation to see what the document contains.", isCorrect: false },
      { text: "Plug it into a home computer to avoid risking company networks.", isCorrect: false },
      { text: "Deliver it directly to the security team without plugging it into any system.", isCorrect: true },
      { text: "Leave it on the table so the owner can find it.", isCorrect: false }
    ],
    explanation: "This is 'baiting'. USB drives left in public areas often contain malware designed to execute automatically when connected."
  },
  {
    id: 5,
    scenario: "An email from the 'CEO' asks you to purchase $500 in Google Play gift cards for an upcoming client event, requesting you to email the scratch-off codes to them immediately.",
    options: [
      { text: "Purchase the gift cards immediately using the corporate card to show initiative.", isCorrect: false },
      { text: "Ignore it and delete the email.", isCorrect: false },
      { text: "Contact the CEO via a separate, trusted channel (phone, chat, or in-person) to verify the request.", isCorrect: true },
      { text: "Reply to the email asking for clarification.", isCorrect: false }
    ],
    explanation: "Gift card scams are extremely common in CEO impersonation attacks. Always verify out-of-band before executing unusual financial requests."
  },
  {
    id: 6,
    scenario: "While browsing the web, a browser popup claims your computer is infected with 14 viruses and offers a toll-free number to call for certified Microsoft technicians to clean it.",
    options: [
      { text: "Call the number and follow their instructions to remove the infections.", isCorrect: false },
      { text: "Close the browser tab/process and run a local antivirus scan.", isCorrect: true },
      { text: "Download the suggested cleanup tool shown on the screen.", isCorrect: false },
      { text: "Leave the window open so it can block the viruses.", isCorrect: false }
    ],
    explanation: "Web browser popups claiming infections are fake alerts ('tech support scams') designed to gain remote access to your device or steal payment details."
  },
  {
    id: 7,
    scenario: "A colleague sends a message on Slack saying, 'Check out this hilarious meme!' with a link to a file hosted on a public sharing site you don't recognize.",
    options: [
      { text: "Click the link immediately to see the meme.", isCorrect: false },
      { text: "Confirm with your colleague via a call or in person that they actually sent the link before clicking it.", isCorrect: true },
      { text: "Click the link, but only if you are using an incognito window.", isCorrect: false },
      { text: "Forward the link to other team members to share the laugh.", isCorrect: false }
    ],
    explanation: "Compromised accounts are frequently used to distribute malware or phishing links to trust circles within team workspaces."
  },
  {
    id: 8,
    scenario: "A caller claims to be from the delivery courier service and says they need to confirm your home address and credit card number to deliver a package you don't remember ordering.",
    options: [
      { text: "Provide the info so you don't miss out on a potential gift.", isCorrect: false },
      { text: "Refuse to give sensitive information and look up the package status directly on the courier's official portal.", isCorrect: true },
      { text: "Give them a fake address and credit card number.", isCorrect: false },
      { text: "Ask them to drop it off anyway and verify on delivery.", isCorrect: false }
    ],
    explanation: "Courier scams use the curiosity of unexpected deliveries to steal sensitive financial and identity information over the phone."
  },
  {
    id: 9,
    scenario: "You receive a notification that you have won a free iPad from a hackathon raffle you did not enter. The link asks for your social media login details to claim the prize.",
    options: [
      { text: "Enter your login details to claim the prize.", isCorrect: false },
      { text: "Decline, knowing that raffles you didn't enter are scams, and close the page.", isCorrect: true },
      { text: "Enter fake login details to test the page.", isCorrect: false },
      { text: "Share the link with friends so they can try to win too.", isCorrect: false }
    ],
    explanation: "Baiting techniques often promise high-value electronic prizes to collect credentials or distribute malicious payloads."
  },
  {
    id: 10,
    scenario: "A delivery driver arrives at the office reception carrying flowers. They claim their clipboard battery is dead and ask to plug their USB device into the reception computer to print a receipt signature page.",
    options: [
      { text: "Let them plug it in to help them out and sign for the flowers.", isCorrect: false },
      { text: "Refuse access to the computer, and offer to sign a paper receipt instead.", isCorrect: true },
      { text: "Plug it in, but watch the screen closely for any strange popups.", isCorrect: false },
      { text: "Print the file for them by downloading it from their email.", isCorrect: false }
    ],
    explanation: "Plugging unknown USB devices into corporate endpoints is highly risky. This is a common physical penetration testing technique using malicious USB keystroke injectors."
  },
  {
    id: 11,
    scenario: "You get a text message claiming your mobile service plan will be shut off unless you pay an outstanding balance of $3.50 immediately via an attached web link.",
    options: [
      { text: "Click the link and pay the small fee to keep service active.", isCorrect: false },
      { text: "Ignore the text, and log into your provider's verified customer portal directly to check billing status.", isCorrect: true },
      { text: "Reply to the text asking for an itemized invoice.", isCorrect: false },
      { text: "Forward the link to your IT department to pay.", isCorrect: false }
    ],
    explanation: "Smishing (SMS Phishing) alerts use small financial penalties to trick victims into providing full credit card details on fake billing portals."
  },
  {
    id: 12,
    scenario: "You receive an email from the company HR department offering an invitation to a private 'Employee Feedback Session' with a link to a Microsoft Forms document asking for your employee ID and network login details.",
    options: [
      { text: "Fill out the form and submit your feedback.", isCorrect: false },
      { text: "Verify the authenticity of the feedback request directly with HR before providing any credentials.", isCorrect: true },
      { text: "Submit the form using anonymous feedback instead.", isCorrect: false },
      { text: "Forward it to your department team to ensure everyone responds.", isCorrect: false }
    ],
    explanation: "Internal spear-phishing campaigns mimic HR forms to capture employee domain credentials inside corporate environments."
  },
  {
    id: 13,
    scenario: "An email claiming to be from security alerts at Google states that a login attempt was blocked on your account from a foreign country, asking you to click 'Secure My Account' to change your password.",
    options: [
      { text: "Click the link immediately to prevent unauthorized access.", isCorrect: false },
      { text: "Navigate manually to Google's official security console to check recent login events.", isCorrect: true },
      { text: "Ignore the email entirely, assuming your password is safe.", isCorrect: false },
      { text: "Forward it to your colleagues to alert them of the hack.", isCorrect: false }
    ],
    explanation: "Security alert impersonation is a highly effective bait tactic designed to panic targets into giving up logins on mock login panels."
  },
  {
    id: 14,
    scenario: "An acquaintance from a previous job messages you on WhatsApp: 'Hey, I lost my access keys and need to verify the host IP for the staging database. Can you share the IP prefix?'",
    options: [
      { text: "Provide the IP prefix since you know them from your last company.", isCorrect: false },
      { text: "Politely refuse, explaining that corporate network configurations cannot be shared over personal chat.", isCorrect: true },
      { text: "Give them a fake IP address to be safe.", isCorrect: false },
      { text: "Ask them for their current manager's contact details first.", isCorrect: false }
    ],
    explanation: "Social engineers use established rapport to collect small pieces of technical information (reconnaissance) that can later be combined for attacks."
  },
  {
    id: 15,
    scenario: "A caller claiming to be from the electric company warns that your home power will be disconnected in 45 minutes unless you settle an overdue bill using a prepaid card or crypto transfer immediately.",
    options: [
      { text: "Pay immediately to keep your power on.", isCorrect: false },
      { text: "Hang up, find your utility bill, and call the customer service number listed on the official bill.", isCorrect: true },
      { text: "Call the police immediately.", isCorrect: false },
      { text: "Ask them to call back after the 45-minute window expires.", isCorrect: false }
    ],
    explanation: "Utility disconnect scams rely on extreme immediate urgency and request untraceable payment mechanisms like gift cards or cryptocurrency."
  }
];

let currentQuizIndex = 0;
let quizScore = 0;

function initSocialQuiz() {
  currentQuizIndex = 0;
  quizScore = 0;

  const progressEl = document.getElementById('quiz-progress');
  if (progressEl) {
    progressEl.innerHTML = quizQuestions.map((_, i) =>
      `<div class="quiz-progress__dot" id="quiz-dot-${i}"></div>`
    ).join('');
  }

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const scenario = quizQuestions[currentQuizIndex];

  if (!scenario) {
    showQuizResults();
    return;
  }

  // Update progress dots
  const currentDot = document.getElementById(`quiz-dot-${currentQuizIndex}`);
  if (currentDot) currentDot.classList.add('current');

  container.innerHTML = `
    <div class="mb-lg">
      <div class="flex justify-between items-center mb-md">
        <span class="tag tag--magenta"><i data-lucide="brain" class="btn-icon"></i> Scenario ${currentQuizIndex + 1} / ${quizQuestions.length}</span>
      </div>
      <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: var(--space-xl); color: var(--text-bright);">
        ${scenario.scenario}
      </p>
      
      <div class="quiz-options">
        ${scenario.options.map((option, idx) => `
          <button class="quiz-option" onclick="handleQuizAnswer(${idx})">
            ${option.text}
          </button>
        `).join('')}
      </div>

      <div id="quiz-feedback" class="hidden mt-xl" style="padding: var(--space-lg); background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-lg); border: 1px solid var(--border);">
        <div class="flex items-center gap-md mb-md">
          <span id="feedback-icon"></span>
          <h4 id="feedback-title" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700;"></h4>
        </div>
        <p id="feedback-text" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-lg);"></p>
        <button class="btn btn--primary btn--sm" onclick="nextQuizQuestion()"><i data-lucide="arrow-right" class="btn-icon"></i> Next Question</button>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function handleQuizAnswer(optionIdx) {
  const scenario = quizQuestions[currentQuizIndex];
  const selectedOption = scenario.options[optionIdx];
  const optionsButtons = document.querySelectorAll('.quiz-option');

  // Disable buttons
  optionsButtons.forEach((btn, idx) => {
    btn.classList.add('disabled');
    if (scenario.options[idx].isCorrect) {
      btn.classList.add('correct');
    } else if (idx === optionIdx) {
      btn.classList.add('incorrect');
    }
  });

  const feedbackDiv = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');

  feedbackDiv.classList.remove('hidden');

  if (selectedOption.isCorrect) {
    quizScore++;
    feedbackIcon.innerHTML = '<i data-lucide="check-circle" class="icon-md text-green"></i>';
    feedbackTitle.textContent = "Correct Response";
    feedbackTitle.style.color = "var(--success)";
  } else {
    feedbackIcon.innerHTML = '<i data-lucide="alert-triangle" class="icon-md text-red"></i>';
    feedbackTitle.textContent = "Incorrect Response";
    feedbackTitle.style.color = "var(--destructive)";
  }
  
  feedbackText.textContent = scenario.explanation;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function nextQuizQuestion() {
  const prevDot = document.getElementById(`quiz-dot-${currentQuizIndex}`);
  if (prevDot) {
    prevDot.classList.remove('current');
    prevDot.classList.add('completed');
  }

  currentQuizIndex++;
  renderQuizQuestion();
}

function showQuizResults() {
  const container = document.getElementById('quiz-container');
  if (container) container.classList.add('hidden');

  const results = document.getElementById('quiz-results');
  if (!results) return;
  results.classList.remove('hidden');

  const percentage = Math.round((quizScore / quizQuestions.length) * 100);
  let badge, gradeClass, description;

  if (percentage >= 90) {
    badge = 'Cyber Guardian';
    gradeClass = 'excellent';
    description = 'Exceptional security awareness! You can easily identify common social engineering scams.';
  } else if (percentage >= 70) {
    badge = 'Aware Professional';
    gradeClass = 'good';
    description = 'Good job! You understand physical security and caller trickery, but remain vigilant.';
  } else if (percentage >= 50) {
    badge = 'Junior Shield';
    gradeClass = 'fair';
    description = 'Moderate awareness. Watch out for urgent calls and look closely at baiting attempts.';
  } else {
    badge = 'Novice Target';
    gradeClass = 'poor';
    description = 'High risk. Take time to read indicators, inspect tailgating hazards, and verify sender addresses.';
  }

  results.innerHTML = `
    <div class="glass-card">
      <div class="score-display">
        <div class="score-circle score-circle--${gradeClass}">
          <span class="score-circle__value">${quizScore}/${quizQuestions.length}</span>
          <span class="score-circle__label">Score</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--text-bright); margin-bottom: var(--space-xs);">
          ${badge}
        </h3>
        <p class="text-muted" style="margin-bottom: var(--space-lg); font-size: 0.9rem;">
          ${description}
        </p>
        <div class="flex gap-md justify-center">
          <button class="btn btn--primary" onclick="resetQuiz()"><i data-lucide="refresh-cw" class="btn-icon"></i> Try Again</button>
          <button class="btn btn--outline" onclick="navigateTo('tools')"><i data-lucide="arrow-left" class="btn-icon"></i> Back to Tools</button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function resetQuiz() {
  const container = document.getElementById('quiz-container');
  if (container) container.classList.remove('hidden');
  
  const results = document.getElementById('quiz-results');
  if (results) results.classList.add('hidden');
  
  initSocialQuiz();
}

// Auto-init when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  initSocialQuiz();
});
