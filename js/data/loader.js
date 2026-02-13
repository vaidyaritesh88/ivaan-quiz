const cache = {};

/**
 * Load a JSON file with in-memory caching.
 */
export async function loadJSON(path) {
  if (cache[path]) return cache[path];

  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  const data = await response.json();
  cache[path] = data;
  return data;
}

/**
 * Load topics registry.
 */
export async function loadTopics() {
  return loadJSON('data/topics.json');
}

/**
 * Load questions for a specific topic, filtered by age group.
 * Merges in any custom questions from localStorage.
 */
export async function loadQuestions(dataFile, ageGroup, topicId) {
  const data = await loadJSON(`data/${dataFile}`);
  let questions = data.questions.filter(q => q.ageGroup.includes(ageGroup));

  // Merge custom questions if any
  if (topicId) {
    try {
      const raw = localStorage.getItem('ivaan_custom_questions');
      if (raw) {
        const custom = JSON.parse(raw);
        if (custom[topicId]) {
          const customFiltered = custom[topicId].filter(q => q.ageGroup.includes(ageGroup));
          questions = [...questions, ...customFiltered];
        }
      }
    } catch {
      // ignore
    }
  }

  return questions;
}
