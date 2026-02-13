import * as home from './screens/home.js';
import * as topicSelect from './screens/topic-select.js';
import * as quizConfig from './screens/quiz-config.js';
import * as quiz from './screens/quiz.js';
import * as results from './screens/results.js';
import * as settings from './screens/settings.js';

const screens = {
  'home': home,
  'topic-select': topicSelect,
  'quiz-config': quizConfig,
  'quiz': quiz,
  'results': results,
  'settings': settings
};

const context = {
  showScreen
};

function showScreen(screenId, data = {}) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
  });

  // Show target screen
  const screenEl = document.getElementById(`screen-${screenId}`);
  if (screenEl) {
    screenEl.classList.add('active');
  }

  // Init the screen module
  const mod = screens[screenId];
  if (mod && mod.init) {
    mod.init(context, data);
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  showScreen('home');

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
