import { loadTopics } from '../data/loader.js';
import { getCustomQuestions, addCustomQuestion, clearCustomQuestions } from '../utils/storage.js';

let topics = [];

export async function init({ showScreen }) {
  // Load topics for dropdown
  if (topics.length === 0) {
    const data = await loadTopics();
    topics = data.topics.filter(t => t.type === 'static'); // Only static topics can have custom questions
  }

  // Populate topic dropdown
  const topicSelect = document.getElementById('settings-topic');
  topicSelect.innerHTML = topics.map(t =>
    `<option value="${t.id}">${t.emoji} ${t.name}</option>`
  ).join('');

  // Back button
  document.getElementById('btn-back-settings').onclick = () => showScreen('home');

  // Add question button
  document.getElementById('btn-add-question').onclick = () => handleAddQuestion();

  // Clear custom questions
  document.getElementById('btn-clear-custom').onclick = () => {
    if (confirm('Are you sure you want to delete all custom questions?')) {
      clearCustomQuestions();
      renderSummary();
      showMessage('All custom questions cleared.', 'success');
    }
  };

  // Clear scores
  document.getElementById('btn-clear-scores').onclick = () => {
    if (confirm('Are you sure you want to clear all high scores?')) {
      localStorage.removeItem('ivaan_quiz_data');
      showMessage('All scores cleared.', 'success');
    }
  };

  // Render summary
  renderSummary();

  // Hide any previous message
  document.getElementById('settings-message').classList.add('hidden');
}

function handleAddQuestion() {
  const topicId = document.getElementById('settings-topic').value;
  const ageGroup = document.getElementById('settings-age').value;
  const question = document.getElementById('settings-question').value.trim();
  const optA = document.getElementById('settings-opt-a').value.trim();
  const optB = document.getElementById('settings-opt-b').value.trim();
  const optC = document.getElementById('settings-opt-c').value.trim();
  const optD = document.getElementById('settings-opt-d').value.trim();
  const explanation = document.getElementById('settings-explanation').value.trim();
  const funFact = document.getElementById('settings-funfact').value.trim();

  // Validate
  if (!question || !optA || !optB || !optC || !optD || !explanation) {
    showMessage('Please fill in all required fields (Fun Fact is optional).', 'error');
    return;
  }

  const newQuestion = {
    id: `custom-${Date.now()}`,
    ageGroup: [ageGroup],
    question,
    options: [optA, optB, optC, optD],
    correctIndex: 0, // Option A is always the correct answer
    explanation,
    funFact: funFact || ''
  };

  addCustomQuestion(topicId, newQuestion);

  // Clear form
  document.getElementById('settings-question').value = '';
  document.getElementById('settings-opt-a').value = '';
  document.getElementById('settings-opt-b').value = '';
  document.getElementById('settings-opt-c').value = '';
  document.getElementById('settings-opt-d').value = '';
  document.getElementById('settings-explanation').value = '';
  document.getElementById('settings-funfact').value = '';

  showMessage('Question added successfully!', 'success');
  renderSummary();
}

function renderSummary() {
  const container = document.getElementById('custom-questions-summary');
  const customQuestions = getCustomQuestions();
  const entries = Object.entries(customQuestions);

  if (entries.length === 0 || entries.every(([, qs]) => qs.length === 0)) {
    container.innerHTML = '<div class="empty-state" style="padding: 16px;">No custom questions yet.</div>';
    return;
  }

  container.innerHTML = entries
    .filter(([, qs]) => qs.length > 0)
    .map(([topicId, qs]) => {
      const topic = topics.find(t => t.id === topicId);
      const name = topic ? `${topic.emoji} ${topic.name}` : topicId;
      return `<div class="custom-q-summary">
        <span>${name}</span>
        <span class="custom-q-count">${qs.length} question${qs.length !== 1 ? 's' : ''}</span>
      </div>`;
    })
    .join('');
}

function showMessage(text, type) {
  const el = document.getElementById('settings-message');
  el.textContent = text;
  el.className = `settings-message ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}
