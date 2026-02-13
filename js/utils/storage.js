const STORAGE_KEY = 'ivaan_quiz_data';

function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { quizHistory: [], bestScores: {} };
    return JSON.parse(raw);
  } catch {
    return { quizHistory: [], bestScores: {} };
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function saveQuizResult({ topic, ageGroup, questionCount, score, streak }) {
  const data = getData();
  const percentage = Math.round((score / questionCount) * 100);

  // Add to history (keep last 50)
  data.quizHistory.unshift({
    date: new Date().toISOString(),
    topic,
    ageGroup,
    questionCount,
    score,
    percentage,
    streak
  });
  data.quizHistory = data.quizHistory.slice(0, 50);

  // Update best score
  const key = `${topic}_${ageGroup}`;
  const prev = data.bestScores[key];
  if (!prev || percentage > prev.percentage) {
    data.bestScores[key] = {
      score,
      total: questionCount,
      percentage,
      date: new Date().toISOString().split('T')[0]
    };
  }

  saveData(data);
}

export function getBestScores() {
  return getData().bestScores;
}

export function getQuizHistory() {
  return getData().quizHistory;
}

// === Custom Questions ===
const CUSTOM_KEY = 'ivaan_custom_questions';

export function getCustomQuestions() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function addCustomQuestion(topicId, question) {
  const all = getCustomQuestions();
  if (!all[topicId]) all[topicId] = [];
  all[topicId].push(question);
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
  } catch {
    // silently fail
  }
}

export function clearCustomQuestions() {
  localStorage.removeItem(CUSTOM_KEY);
}
