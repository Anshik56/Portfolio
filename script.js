/**
 * ANSHIKA MATHUR — DEVELOPER PORTFOLIO JAVASCRIPT
 * Features:
 *  - Ambient Canvas Particle/Constellation System
 *  - ScrollSpy & Navbar Progress Indicator
 *  - Mobile Drawer Navigation
 *  - Technical Skills Filtering System
 *  - Interactive Minimax Tic-Tac-Toe Game Engine
 *  - Interactive Simon Says Memory Game with Web Audio API & LocalStorage
 *  - Modal System (Resume, Projects, Games)
 *  - Form Validation & Copy-to-Clipboard Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initScrollProgress();
  initHeaderScrollSpy();
  initMobileDrawer();
  initSkillsFilter();
  initBackToTop();
  initContactForm();
  initResumeModals();
  initSimonSaysEngine();
  initTicTacToeEngine();
  initBackgroundMusic();
});

/* ==========================================================================
   1. AMBIENT CANVAS PARTICLES
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 24 : 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = Math.random() > 0.4 ? '168, 85, 247' : '56, 189, 248';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowBlur = 0;

    // Connect close particles with faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. SCROLL PROGRESS & SCROLLSPY
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

function initHeaderScrollSpy() {
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-links .drawer-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    // Header styling on scroll
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Detection
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSectionId) {
        link.classList.add('active');
      }
    });

    drawerLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   4. TECHNICAL SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterTabs.length || !skillCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterVal = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & INTERACTIVITY
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const successToast = document.getElementById('form-success-toast');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error states
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    nameInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    messageInput.classList.remove('is-invalid');

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please enter your message.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message should be at least 10 characters.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    }

    if (isValid) {
      const subject = subjectInput.value.trim() || 'Portfolio Inquiry';
      const body = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`;
      const mailtoUrl = `mailto:anshikamathur726@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Show toast
      if (successToast) {
        successToast.classList.remove('hidden');
      }

      // Open mail client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);

      form.reset();
    }
  });
}

/* Clipboard Helper */
window.copyToClipboard = function(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const label = btnElement.querySelector('.copy-label');
    if (label) {
      const original = label.textContent;
      label.textContent = 'Copied!';
      btnElement.style.borderColor = 'var(--neon-emerald)';
      btnElement.style.color = 'var(--neon-emerald)';
      setTimeout(() => {
        label.textContent = original;
        btnElement.style.borderColor = '';
        btnElement.style.color = '';
      }, 2000);
    }
  }).catch(() => {
    alert('Contact: ' + text);
  });
};

/* ==========================================================================
   7. MODALS (RESUME, AIRBNB, GAMES)
   ========================================================================== */
function initResumeModals() {
  const resumeBtnNav = document.getElementById('resume-btn-nav');
  const resumeHeroBtn = document.getElementById('resume-hero-btn');

  if (resumeBtnNav) resumeBtnNav.addEventListener('click', openResumeModal);
  if (resumeHeroBtn) resumeHeroBtn.addEventListener('click', openResumeModal);

  // Close modals on clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.add('hidden');
      });
      document.body.style.overflow = '';
    }
  });
}

window.openResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};
window.closeResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.openAirbnbModal = function() {
  const modal = document.getElementById('airbnb-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};
window.closeAirbnbModal = function() {
  const modal = document.getElementById('airbnb-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.openTicTacToeModal = function() {
  const modal = document.getElementById('tictactoe-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetTTTGame();
  }
};
window.closeTicTacToeModal = function() {
  const modal = document.getElementById('tictactoe-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.openSimonModal = function() {
  const modal = document.getElementById('simon-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};
window.closeSimonModal = function() {
  const modal = document.getElementById('simon-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   8. MINIMAX AI TIC-TAC-TOE ENGINE (From CodSoft Internship Project)
   ========================================================================== */
let tttBoard = Array(9).fill(null);
const HUMAN = 'X';
const AI = 'O';
let isHumanTurn = true;
let tttScores = { human: 0, ai: 0, draws: 0 };

function initTicTacToeEngine() {
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = parseInt(cell.getAttribute('data-index'), 10);
      handleHumanTTTMove(idx);
    });
  });
}

function handleHumanTTTMove(idx) {
  if (!isHumanTurn || tttBoard[idx] !== null) return;

  makeTTTMove(idx, HUMAN);

  if (checkWinner(tttBoard, HUMAN)) {
    endTTTMatch('🎉 You won! Impressive strategy!');
    tttScores.human++;
    updateTTTScoreboard();
    return;
  }

  if (isBoardFull(tttBoard)) {
    endTTTMatch("🤝 It's a Draw! Optimal outcome reached.");
    tttScores.draws++;
    updateTTTScoreboard();
    return;
  }

  // AI Turn
  isHumanTurn = false;
  const statusEl = document.getElementById('ttt-status');
  if (statusEl) statusEl.textContent = 'Minimax AI is calculating optimal state...';

  setTimeout(() => {
    const bestMove = getMinimaxBestMove(tttBoard);
    makeTTTMove(bestMove, AI);

    if (checkWinner(tttBoard, AI)) {
      endTTTMatch('🤖 Minimax AI wins! Unbeatable zero-sum search.');
      tttScores.ai++;
      updateTTTScoreboard();
      return;
    }

    if (isBoardFull(tttBoard)) {
      endTTTMatch("🤝 It's a Draw! Both players played optimally.");
      tttScores.draws++;
      updateTTTScoreboard();
      return;
    }

    isHumanTurn = true;
    if (statusEl) statusEl.textContent = 'Your turn! Select your move.';
  }, 400);
}

function makeTTTMove(idx, player) {
  tttBoard[idx] = player;
  const cell = document.querySelector(`.ttt-cell[data-index="${idx}"]`);
  if (cell) {
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.disabled = true;
  }
}

function endTTTMatch(message) {
  isHumanTurn = false;
  const statusEl = document.getElementById('ttt-status');
  if (statusEl) statusEl.textContent = message;
}

function updateTTTScoreboard() {
  const hScore = document.getElementById('human-score');
  const aScore = document.getElementById('ai-score');
  const dScore = document.getElementById('draws-score');
  if (hScore) hScore.textContent = tttScores.human;
  if (aScore) aScore.textContent = tttScores.ai;
  if (dScore) dScore.textContent = tttScores.draws;
}

window.resetTTTGame = function() {
  tttBoard = Array(9).fill(null);
  isHumanTurn = true;
  document.querySelectorAll('.ttt-cell').forEach(cell => {
    cell.textContent = '';
    cell.className = 'ttt-cell';
    cell.disabled = false;
  });
  const statusEl = document.getElementById('ttt-status');
  if (statusEl) statusEl.textContent = 'Your turn! Click any cell to place X.';
};

/* Minimax Algorithm Implementation */
function getMinimaxBestMove(board) {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = AI;
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, AI)) return 10 - depth;
  if (checkWinner(board, HUMAN)) return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = AI;
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = HUMAN;
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(board, player) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  return winCombos.some(combo => 
    board[combo[0]] === player && 
    board[combo[1]] === player && 
    board[combo[2]] === player
  );
}

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

/* ==========================================================================
   9. SIMON SAYS MEMORY GAME (Web Audio API & Persistent LocalStorage)
   ========================================================================== */
let simonSequence = [];
let simonPlayerIndex = 0;
let simonLevel = 0;
let simonHighScore = 0;
let isSimonActive = false;
let audioCtx = null;

const SIMON_TONES = {
  green: 261.63,  // C4
  red: 329.63,    // E4
  yellow: 392.00, // G4
  blue: 523.25    // C5
};

function initSimonSaysEngine() {
  // Load persistent high score from LocalStorage
  const savedHigh = localStorage.getItem('anshika_simon_high');
  if (savedHigh) {
    simonHighScore = parseInt(savedHigh, 10);
    const hsEl = document.getElementById('simon-highscore');
    if (hsEl) hsEl.textContent = simonHighScore;
  }

  const quadrants = document.querySelectorAll('.simon-quadrant');
  quadrants.forEach(quadrant => {
    quadrant.addEventListener('click', () => {
      if (!isSimonActive) return;
      const color = quadrant.getAttribute('data-color');
      handleSimonUserClick(color);
    });
  });
}

function playTone(freq, duration = 250) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration / 1000);
  } catch (e) {
    // Audio synthesis fallback
  }
}

function flashPad(color) {
  const pad = document.querySelector(`.simon-quadrant.simon-${color}`);
  if (!pad) return;
  pad.classList.add('active');
  playTone(SIMON_TONES[color] || 300);
  setTimeout(() => {
    pad.classList.remove('active');
  }, 280);
}

window.startSimonGame = function() {
  simonSequence = [];
  simonLevel = 0;
  nextSimonRound();
};

function nextSimonRound() {
  simonLevel++;
  simonPlayerIndex = 0;
  isSimonActive = false;

  const levelEl = document.getElementById('simon-level');
  const statusEl = document.getElementById('simon-status-text');
  if (levelEl) levelEl.textContent = simonLevel;
  if (statusEl) statusEl.textContent = `Level ${simonLevel}: Watch the sequence...`;

  const colors = ['green', 'red', 'yellow', 'blue'];
  const nextColor = colors[Math.floor(Math.random() * 4)];
  simonSequence.push(nextColor);

  // Play sequence playback
  let i = 0;
  const interval = setInterval(() => {
    if (i < simonSequence.length) {
      flashPad(simonSequence[i]);
      i++;
    } else {
      clearInterval(interval);
      isSimonActive = true;
      if (statusEl) statusEl.textContent = 'Your turn! Repeat the pattern.';
    }
  }, 550);
}

function handleSimonUserClick(color) {
  flashPad(color);

  if (color === simonSequence[simonPlayerIndex]) {
    simonPlayerIndex++;
    if (simonPlayerIndex === simonSequence.length) {
      isSimonActive = false;
      const statusEl = document.getElementById('simon-status-text');
      if (statusEl) statusEl.textContent = 'Correct sequence! Leveling up...';

      // Update High Score if achieved
      if (simonLevel > simonHighScore) {
        simonHighScore = simonLevel;
        localStorage.setItem('anshika_simon_high', simonHighScore);
        const hsEl = document.getElementById('simon-highscore');
        if (hsEl) hsEl.textContent = simonHighScore;
      }

      setTimeout(nextSimonRound, 900);
    }
  } else {
    // Game Over
    isSimonActive = false;
    playTone(130, 500); // Low failure buzzer
    const statusEl = document.getElementById('simon-status-text');
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #f43f5e">Game Over at Level ${simonLevel}! Click START to try again.</span>`;
    }
  }
}

/* ==========================================================================
   10. BACKGROUND AMBIENT MUSIC CONTROLLER
   ========================================================================== */
function initBackgroundMusic() {
  const audio = document.getElementById('bg-music-audio');
  const toggleBtn = document.getElementById('music-toggle-btn');
  const muteBtn = document.getElementById('music-mute-btn');
  const detailsToggle = document.getElementById('music-details-toggle');
  const dock = document.getElementById('music-player');
  const statusText = document.getElementById('music-status-text');
  const playIcon = toggleBtn ? toggleBtn.querySelector('.music-play-icon') : null;
  const pauseIcon = toggleBtn ? toggleBtn.querySelector('.music-pause-icon') : null;
  const volumeIcon = muteBtn ? muteBtn.querySelector('.music-volume-icon') : null;
  const muteIcon = muteBtn ? muteBtn.querySelector('.music-mute-icon') : null;

  if (!audio || !toggleBtn || !muteBtn || !dock) return;

  // Set initial volume to a soft, calming background level (25%)
  const INITIAL_VOLUME = 0.25;
  audio.volume = INITIAL_VOLUME;

  function updatePlayState(isPlaying) {
    if (isPlaying) {
      dock.classList.add('is-playing');
      dock.classList.remove('is-paused');
      if (playIcon) playIcon.classList.add('music-hidden');
      if (pauseIcon) pauseIcon.classList.remove('music-hidden');
      toggleBtn.setAttribute('aria-label', 'Pause background music');
      toggleBtn.setAttribute('title', 'Pause background music');
      if (statusText) statusText.textContent = audio.muted ? 'Muted' : 'Playing';
    } else {
      dock.classList.remove('is-playing');
      dock.classList.add('is-paused');
      if (playIcon) playIcon.classList.remove('music-hidden');
      if (pauseIcon) pauseIcon.classList.add('music-hidden');
      toggleBtn.setAttribute('aria-label', 'Play background music');
      toggleBtn.setAttribute('title', 'Play background music');
      if (statusText) statusText.textContent = 'Paused';
    }
  }

  function updateMuteState(isMuted) {
    if (isMuted) {
      dock.classList.add('is-muted');
      if (volumeIcon) volumeIcon.classList.add('music-hidden');
      if (muteIcon) muteIcon.classList.remove('music-hidden');
      muteBtn.setAttribute('aria-label', 'Unmute audio');
      muteBtn.setAttribute('title', 'Unmute audio');
      if (statusText && !audio.paused) statusText.textContent = 'Muted';
    } else {
      dock.classList.remove('is-muted');
      if (volumeIcon) volumeIcon.classList.remove('music-hidden');
      if (muteIcon) muteIcon.classList.add('music-hidden');
      muteBtn.setAttribute('aria-label', 'Mute audio');
      muteBtn.setAttribute('title', 'Mute audio');
      if (statusText && !audio.paused) statusText.textContent = 'Playing';
    }
  }

  function togglePlayPause() {
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updatePlayState(true);
          })
          .catch((err) => {
            console.warn('Audio playback prevented or failed:', err);
          });
      }
    } else {
      audio.pause();
      updatePlayState(false);
    }
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    updateMuteState(audio.muted);
  }

  // Play / Pause event listeners
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });

  if (detailsToggle) {
    detailsToggle.addEventListener('click', () => {
      togglePlayPause();
    });
    detailsToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    });
  }

  // Mute / Unmute event listener
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMute();
  });

  // Native HTML5 audio event listeners to guarantee sync with system events
  audio.addEventListener('play', () => updatePlayState(true));
  audio.addEventListener('pause', () => updatePlayState(false));
  audio.addEventListener('volumechange', () => updateMuteState(audio.muted));
}
