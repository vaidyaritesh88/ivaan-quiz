import { loadQuestions } from '../data/loader.js';
import { generateMathQuestions } from '../data/math-generator.js';
import { shuffle, pickRandom } from '../utils/shuffle.js';

let questions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let answers = []; // { question, selectedIndex, correct }
let quizConfig = {};
let showScreenFn = null;
let answered = false;

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export async function init({ showScreen }, data = {}) {
  showScreenFn = showScreen;
  quizConfig = data;

  // Reset state
  currentIndex = 0;
  score = 0;
  streak = 0;
  maxStreak = 0;
  answers = [];
  answered = false;

  // Load or generate questions
  const { topic, ageGroup, questionCount } = data;

  if (topic.type === 'generated') {
    questions = generateMathQuestions(ageGroup, questionCount);
  } else {
    const allQuestions = await loadQuestions(topic.dataFile, ageGroup, topic.id);
    questions = pickRandom(allQuestions, Math.min(questionCount, allQuestions.length));
  }

  // Update config with actual count (in case fewer questions available)
  quizConfig.questionCount = questions.length;

  // Shuffle options for static questions (math already shuffled)
  if (topic.type === 'static') {
    questions = questions.map(q => {
      const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correctIndex }));
      const shuffled = shuffle(indexed);
      return {
        ...q,
        options: shuffled.map(s => s.opt),
        correctIndex: shuffled.findIndex(s => s.isCorrect)
      };
    });
  }

  // Set topic badge
  const badge = document.getElementById('quiz-topic-badge');
  badge.textContent = `${topic.emoji} ${topic.name}`;
  badge.style.background = topic.color;

  // Hide streak
  document.getElementById('streak-banner').classList.add('hidden');

  // Render first question
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = questions[currentIndex];
  const total = questions.length;

  // Update progress
  const progress = ((currentIndex) / total) * 100;
  document.getElementById('quiz-progress').style.width = `${progress}%`;
  document.getElementById('quiz-counter').textContent = `Question ${currentIndex + 1} of ${total}`;
  document.getElementById('quiz-score-display').textContent = `\u2B50 ${score}`;

  // Question text
  document.getElementById('question-text').textContent = q.question;

  // Options
  const container = document.getElementById('options-container');
  container.innerHTML = q.options.map((opt, i) => `
    <button class="option-btn" data-index="${i}">
      <span class="option-label">${OPTION_LABELS[i]}</span>
      <span class="option-text">${opt}</span>
    </button>
  `).join('');

  // Click handler for options
  container.onclick = (e) => {
    const btn = e.target.closest('.option-btn');
    if (!btn || answered) return;
    handleAnswer(parseInt(btn.dataset.index, 10));
  };

  // Hide explanation and next button
  document.getElementById('explanation-card').classList.add('hidden');
  document.getElementById('btn-next-question').classList.add('hidden');

  // Scroll to top of quiz body
  document.querySelector('.quiz-body').scrollTop = 0;
}

function handleAnswer(selectedIndex) {
  answered = true;
  const q = questions[currentIndex];
  const isCorrect = selectedIndex === q.correctIndex;

  // Update score and streak
  if (isCorrect) {
    score++;
    streak++;
    if (streak > maxStreak) maxStreak = streak;
  } else {
    streak = 0;
  }

  // Store answer for review
  answers.push({
    question: q.question,
    options: q.options,
    selectedIndex,
    correctIndex: q.correctIndex,
    correct: isCorrect,
    explanation: q.explanation,
    funFact: q.funFact
  });

  // Highlight options
  const buttons = document.querySelectorAll('#options-container .option-btn');
  buttons.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.correctIndex) {
      btn.classList.add('correct');
    }
    if (i === selectedIndex && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  // Update score display
  document.getElementById('quiz-score-display').textContent = `\u2B50 ${score}`;

  // Show streak
  const streakBanner = document.getElementById('streak-banner');
  if (streak >= 2) {
    document.getElementById('streak-count').textContent = streak;
    streakBanner.classList.remove('hidden');
  } else {
    streakBanner.classList.add('hidden');
  }

  // Show explanation
  const expCard = document.getElementById('explanation-card');
  const expResult = document.getElementById('explanation-result');
  const expText = document.getElementById('explanation-text');
  const funFact = document.getElementById('fun-fact');

  if (isCorrect) {
    expResult.textContent = '\u2705 Correct! Well done!';
    expResult.className = 'explanation-result correct';
  } else {
    expResult.textContent = `\u274C Not quite. The answer is: ${q.options[q.correctIndex]}`;
    expResult.className = 'explanation-result wrong';
  }

  expText.textContent = q.explanation;
  funFact.textContent = q.funFact || '';
  funFact.style.display = q.funFact ? 'block' : 'none';

  expCard.classList.remove('hidden');
  expCard.classList.add('slide-up');

  // Show next button (or finish button)
  const nextBtn = document.getElementById('btn-next-question');
  if (currentIndex < questions.length - 1) {
    nextBtn.textContent = 'Next Question \u2192';
  } else {
    nextBtn.textContent = 'See Results \u2192';
  }
  nextBtn.classList.remove('hidden');
  nextBtn.onclick = () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      // Update progress to 100%
      document.getElementById('quiz-progress').style.width = '100%';
      // Go to results
      showScreenFn('results', {
        topic: quizConfig.topic,
        ageGroup: quizConfig.ageGroup,
        questionCount: questions.length,
        score,
        maxStreak,
        answers
      });
    }
  };

  // Scroll explanation into view
  setTimeout(() => {
    expCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}
