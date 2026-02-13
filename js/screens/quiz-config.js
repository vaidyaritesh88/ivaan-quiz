let currentTopic = null;
let selectedAge = '5-7';
let selectedCount = 10;

export function init({ showScreen }, data = {}) {
  currentTopic = data.topic;

  // Reset to defaults
  selectedAge = '5-7';
  selectedCount = 10;

  const ageOptions = document.getElementById('age-options');
  const countOptions = document.getElementById('count-options');

  // Reset visual selection
  ageOptions.querySelectorAll('.config-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.age === selectedAge);
  });
  countOptions.querySelectorAll('.pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.count === String(selectedCount));
  });

  // Age group selection
  ageOptions.onclick = (e) => {
    const btn = e.target.closest('.config-btn');
    if (!btn) return;
    ageOptions.querySelectorAll('.config-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAge = btn.dataset.age;
  };

  // Question count selection
  countOptions.onclick = (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    countOptions.querySelectorAll('.pill').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedCount = parseInt(btn.dataset.count, 10);
  };

  // Back button
  document.getElementById('btn-back-config').onclick = () => showScreen('topic-select');

  // Start quiz button
  document.getElementById('btn-start-quiz').onclick = () => {
    showScreen('quiz', {
      topic: currentTopic,
      ageGroup: selectedAge,
      questionCount: selectedCount
    });
  };
}
