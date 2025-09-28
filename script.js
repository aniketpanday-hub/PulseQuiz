// PulseQuiz - vanilla JavaScript (ES6+) logic
const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  timeLeft: 90, // Timer set to 90 seconds
  timerId: null,
  advancing: false,
  paletteIndex: 0,
};

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

const quizScreen = document.getElementById('quiz-screen');
const questionText = document.getElementById('question-text');
const optionsWrap = document.getElementById('options');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const quitBtn = document.getElementById('quit-btn');

const resultScreen = document.getElementById('result-screen');
const finalScore = document.getElementById('final-score');
const detailScore = document.getElementById('detail-score');
const playAgainBtn = document.getElementById('play-again-btn');
const returnStartBtn = document.getElementById('return-start-btn');

const quizCard = document.querySelector('.quiz-card');

state.questions = [
  { question: "Which planet is known for its prominent ring system?", options: ["Mars", "Saturn", "Jupiter", "Venus"], answer: "Saturn" },
  { question: "Who wrote the play 'Romeo and Juliet'?", options: ["William Shakespeare", "Charles Dickens", "Leo Tolstoy", "Jane Austen"], answer: "William Shakespeare" },
  { question: "What is the capital city of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: "Tokyo" },
  { question: "Which gas do plants absorb for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
  { question: "In computing, what does 'CPU' stand for?", options: ["Central Processing Unit", "Control Program Utility", "Central Program Unit", "Computer Processing Unit"], answer: "Central Processing Unit" },
  { question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Oganesson"], answer: "Oxygen" },
  { question: "Who proposed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"], answer: "Albert Einstein" },
  { question: "Which country is known as the land of the rising sun?", options: ["India", "Japan", "Australia", "Egypt"], answer: "Japan" },
  { question: "What currency is used in the United Kingdom?", options: ["Euro", "Pound Sterling", "Dollar", "Franc"], answer: "Pound Sterling" },
  { question: "Which organ filters blood and produces urine?", options: ["Lung", "Liver", "Kidney", "Pancreas"], answer: "Kidney" }
];

const palettes = [
  { name: 'Aurora', grad: 'linear-gradient(135deg,#22c1c3,#fdbb2d)' },
  { name: 'IndigoMint', grad: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { name: 'Sunset', grad: 'linear-gradient(135deg,#ff9966,#ff5e62)' },
  { name: 'Ocean', grad: 'linear-gradient(135deg,#00b4db,#0083b0)' },
  { name: 'Spring', grad: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
];

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function applyTheme(index) {
  const p = palettes[index % palettes.length];
  progressBar.style.background = p.grad;
  quizCard.style.backgroundImage = `linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92)), ${p.grad}`;
}

function renderQuestion() {
  const qObj = state.questions[state.currentIndex];
  questionText.classList.remove('question-enter');
  void questionText.offsetWidth; 
  questionText.classList.add('question-enter');

  questionText.textContent = qObj.question;
  optionsWrap.innerHTML = '';

  const shuffledOptions = shuffle(qObj.options);
  shuffledOptions.forEach((opt) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';
    const btn = document.createElement('button');
    btn.className = 'option-btn shadow-sm';
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-option', opt);
    btn.textContent = opt; 
    btn.addEventListener('click', () => handleAnswer(btn, opt));
    col.appendChild(btn);
    optionsWrap.appendChild(col);
  });

  progressText.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
  const pct = (state.currentIndex / state.questions.length) * 100;
  progressBar.style.width = `${pct}%`;
}

function handleAnswer(buttonEl, selected) {
  if (state.advancing) return;
  state.advancing = true;

  const current = state.questions[state.currentIndex];
  const allButtons = optionsWrap.querySelectorAll('.option-btn');

  const isCorrect = selected === current.answer;
  if (isCorrect) {
    buttonEl.classList.add('correct');
    state.score += 1;
    flashScore();
  } else {
    buttonEl.classList.add('incorrect');
    allButtons.forEach(btn => {
      if (btn.dataset.option === current.answer) btn.classList.add('correct');
    });
  }

  allButtons.forEach(btn => btn.disabled = true);

  setTimeout(() => {
    state.advancing = false;
    state.currentIndex += 1;
    const pctComplete = (state.currentIndex / state.questions.length) * 100;
    progressBar.style.width = `${pctComplete}%`;

    if (state.currentIndex >= state.questions.length) {
      endQuiz();
    } else {
      renderQuestion();
    }
  }, 1500);
}

function flashScore() {
  scoreEl.textContent = state.score;
  scoreEl.classList.add('pulse');
  setTimeout(() => scoreEl.classList.remove('pulse'), 200);
}

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function startTimer() {
  stopTimer();
  timerEl.textContent = formatTime(state.timeLeft);
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    timerEl.textContent = formatTime(state.timeLeft);
    if (state.timeLeft <= 0) {
      stopTimer();
      endQuiz(true);
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startQuiz() {
  state.currentIndex = 0;
  state.score = 0;
  state.timeLeft = 90; // Reset timer to 90 seconds
  scoreEl.textContent = '0';

  state.questions = shuffle(state.questions);
  state.paletteIndex = (state.paletteIndex + 1) % palettes.length;
  applyTheme(state.paletteIndex);

  startScreen.classList.add('d-none');
  resultScreen.classList.add('d-none');
  quizScreen.classList.remove('d-none');

  renderQuestion();
  progressBar.style.width = '0%';
  startTimer();
}

function endQuiz(timeUp = false) {
  stopTimer();
  quizScreen.classList.add('d-none');

  finalScore.textContent = `Score: ${state.score} / ${state.questions.length}`;
  detailScore.textContent = `You answered ${state.score} correct out of ${state.questions.length}.`;

  const existingNote = resultScreen.querySelector('.time-note');
  if (existingNote) existingNote.remove();

  if (timeUp) {
    const note = document.createElement('p');
    note.className = 'small text-danger mt-2 time-note';
    note.textContent = 'Time is up — try again to beat the clock!';
    resultScreen.prepend(note);
  }

  resultScreen.classList.remove('d-none');
}

function quitToStart() {
  stopTimer();
  quizScreen.classList.add('d-none');
  resultScreen.classList.add('d-none');
  startScreen.classList.remove('d-none');
}

startBtn.addEventListener('click', startQuiz);
playAgainBtn.addEventListener('click', startQuiz);
returnStartBtn.addEventListener('click', () => {
  stopTimer();
  resultScreen.classList.add('d-none');
  startScreen.classList.remove('d-none');
});
quitBtn.addEventListener('click', quitToStart);

document.addEventListener('keydown', (e) => {
  if (quizScreen.classList.contains('d-none') || state.advancing) return;
  const key = e.key;
  if (["1", "2", "3", "4"].includes(key)) {
    const idx = parseInt(key, 10) - 1;
    const btns = Array.from(optionsWrap.querySelectorAll('.option-btn'));
    if (btns[idx]) btns[idx].click();
  }
});

function initBackgroundAnimation() {
  const container = document.getElementById('background-animation');
  if (!container) return;

  const chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const colors = ['#667eea', '#764ba2', '#ff9966', '#00b4db', '#43e97b', '#f87171', '#fbbf24', '#34d399'];
  const charCount = 40;

  for (let i = 0; i < charCount; i++) {
      const charEl = document.createElement('span');
      charEl.classList.add('floating-char');

      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSize = Math.random() * (48 - 16) + 16;
      const randomLeft = Math.random() * 100;
      const randomDuration = Math.random() * (30 - 15) + 15;
      const randomDelay = Math.random() * 15;

      charEl.textContent = randomChar;
      charEl.style.color = randomColor;
      charEl.style.fontSize = `${randomSize}px`;
      charEl.style.left = `${randomLeft}vw`;
      charEl.style.animationDuration = `${randomDuration}s`;
      charEl.style.animationDelay = `-${randomDelay}s`;

      container.appendChild(charEl);
  }
}

(function init() {
  initBackgroundAnimation();
  applyTheme(Math.floor(Math.random() * palettes.length));
  timerEl.textContent = formatTime(state.timeLeft);
})();
