import { getBestScores, getQuizHistory } from '../utils/storage.js';

export function init({ showScreen }) {
  document.getElementById('btn-start').onclick = () => showScreen('topic-select');
  document.getElementById('btn-high-scores').onclick = () => showHighScores();
  document.getElementById('btn-settings').onclick = () => showScreen('settings');
  document.getElementById('btn-close-scores').onclick = () => {
    document.getElementById('modal-high-scores').classList.add('hidden');
  };
}

function showHighScores() {
  const modal = document.getElementById('modal-high-scores');
  const list = document.getElementById('high-scores-list');
  const bestScores = getBestScores();
  const entries = Object.entries(bestScores);

  if (entries.length === 0) {
    list.innerHTML = '<div class="empty-state">No scores yet! Play a quiz to get started.</div>';
  } else {
    list.innerHTML = entries
      .sort((a, b) => b[1].percentage - a[1].percentage)
      .map(([key, val]) => {
        const [topic, age] = key.split('_');
        const topicName = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return `
          <div class="score-entry">
            <div>
              <div class="score-entry-topic">${topicName}</div>
              <div class="score-entry-detail">Age ${age} &middot; ${val.date}</div>
            </div>
            <div class="score-entry-value">${val.percentage}%</div>
          </div>
        `;
      })
      .join('');
  }

  modal.classList.remove('hidden');
}
