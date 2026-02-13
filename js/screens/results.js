import { saveQuizResult } from '../utils/storage.js';

let resultData = {};
let showScreenFn = null;

export function init({ showScreen }, data = {}) {
  showScreenFn = showScreen;
  resultData = data;

  const { topic, ageGroup, questionCount, score, maxStreak, answers } = data;
  const percentage = Math.round((score / questionCount) * 100);
  const stars = Math.max(1, Math.ceil(percentage / 20));

  // Save to localStorage
  saveQuizResult({
    topic: topic.id,
    ageGroup,
    questionCount,
    score,
    streak: maxStreak
  });

  // Emoji
  const emojiEl = document.getElementById('results-emoji');
  if (percentage >= 90) emojiEl.textContent = '\uD83C\uDFC6';
  else if (percentage >= 70) emojiEl.textContent = '\uD83C\uDF1F';
  else if (percentage >= 50) emojiEl.textContent = '\uD83D\uDC4D';
  else emojiEl.textContent = '\uD83D\uDCAA';

  // Title
  document.getElementById('results-title').textContent = 'Quiz Complete!';

  // Score
  document.getElementById('results-score').textContent = `${score} / ${questionCount}`;

  // Stars
  const starsEl = document.getElementById('results-stars');
  starsEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const span = document.createElement('span');
    span.className = 'star';
    span.textContent = i < stars ? '\u2B50' : '\u2606';
    starsEl.appendChild(span);
  }

  // Message
  const msgEl = document.getElementById('results-message');
  if (percentage >= 90) msgEl.textContent = 'Amazing! You\'re a Quiz Champion!';
  else if (percentage >= 70) msgEl.textContent = 'Great job! You\'re really smart!';
  else if (percentage >= 50) msgEl.textContent = 'Good effort! Keep learning!';
  else msgEl.textContent = 'Nice try! Practice makes perfect!';

  // Streak
  const streakEl = document.getElementById('results-streak');
  if (maxStreak >= 2) {
    streakEl.textContent = `\uD83D\uDD25 Best streak: ${maxStreak} in a row!`;
    streakEl.style.display = 'block';
  } else {
    streakEl.style.display = 'none';
  }

  // Hide review panel
  document.getElementById('review-panel').classList.add('hidden');

  // Show confetti for high scores
  if (percentage >= 80) {
    triggerConfetti();
  }

  // Button handlers
  document.getElementById('btn-review').onclick = () => showReview(answers);
  document.getElementById('btn-back-review').onclick = () => {
    document.getElementById('review-panel').classList.add('hidden');
  };

  document.getElementById('btn-play-again').onclick = () => {
    showScreen('quiz', {
      topic: resultData.topic,
      ageGroup: resultData.ageGroup,
      questionCount: resultData.questionCount
    });
  };

  document.getElementById('btn-new-topic').onclick = () => showScreen('topic-select');
  document.getElementById('btn-home').onclick = () => showScreen('home');

  document.getElementById('btn-share').onclick = () => shareScore(topic, score, questionCount, percentage);
}

function showReview(answers) {
  const list = document.getElementById('review-list');
  list.innerHTML = answers.map((a, i) => `
    <div class="review-item">
      <div class="review-item-header">
        <span>Q${i + 1}</span>
        <span class="badge ${a.correct ? 'correct' : 'wrong'}">
          ${a.correct ? '\u2705 Correct' : '\u274C Wrong'}
        </span>
      </div>
      <div class="review-question">${a.question}</div>
      <div class="review-answer">
        ${!a.correct ? `<div><span class="label">Your answer:</span> ${a.options[a.selectedIndex]}</div>` : ''}
        <div><span class="label">Correct answer:</span> ${a.options[a.correctIndex]}</div>
      </div>
      <div class="review-explanation">${a.explanation}</div>
    </div>
  `).join('');

  document.getElementById('review-panel').classList.remove('hidden');
  document.getElementById('review-panel').scrollTop = 0;
}

function shareScore(topic, score, total, percentage) {
  const text = `I scored ${score}/${total} (${percentage}%) on the ${topic.name} quiz in Ivaan's Quiz Challenge! Can you beat my score?`;

  if (navigator.share) {
    navigator.share({
      title: 'Ivaan\'s Quiz Challenge',
      text: text,
      url: window.location.href
    }).catch(() => {});
  } else {
    // Fallback: WhatsApp share
    const encoded = encodeURIComponent(text + '\n' + window.location.href);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }
}

function triggerConfetti() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
  const container = document.body;

  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 1}s`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    const size = 6 + Math.random() * 8;
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);

    // Clean up after animation
    setTimeout(() => piece.remove(), 4000);
  }
}
