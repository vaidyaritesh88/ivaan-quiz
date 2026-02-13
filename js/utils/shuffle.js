/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick `count` random items from an array (without repeats).
 */
export function pickRandom(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
