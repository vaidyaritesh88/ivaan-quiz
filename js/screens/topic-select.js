import { loadTopics } from '../data/loader.js';

let topics = [];
let selectedTopic = null;

export async function init({ showScreen }) {
  const grid = document.getElementById('topic-grid');
  const nextBtn = document.getElementById('btn-topic-next');

  // Load topics if not already loaded
  if (topics.length === 0) {
    const data = await loadTopics();
    topics = data.topics;
    renderTopics(grid);
  }

  // Reset selection
  selectedTopic = null;
  nextBtn.disabled = true;
  grid.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));

  // Back button
  document.getElementById('btn-back-topics').onclick = () => showScreen('home');

  // Next button
  nextBtn.onclick = () => {
    if (selectedTopic) {
      showScreen('quiz-config', { topic: selectedTopic });
    }
  };
}

function renderTopics(grid) {
  grid.innerHTML = topics.map(t => `
    <div class="topic-card" data-topic-id="${t.id}" style="--topic-color: ${t.color}">
      <span class="topic-card-emoji">${t.emoji}</span>
      <div class="topic-card-name">${t.name}</div>
      <div class="topic-card-tagline">${t.tagline}</div>
    </div>
  `).join('');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.topic-card');
    if (!card) return;

    // Deselect all
    grid.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));

    // Select this one
    card.classList.add('selected');
    const topicId = card.dataset.topicId;
    selectedTopic = topics.find(t => t.id === topicId);

    // Enable next button
    document.getElementById('btn-topic-next').disabled = false;
  });
}

export function getSelectedTopic() {
  return selectedTopic;
}
