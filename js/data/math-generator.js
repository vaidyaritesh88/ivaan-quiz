import { shuffle } from '../utils/shuffle.js';

/**
 * Generate a set of math questions for the given age group.
 */
export function generateMathQuestions(ageGroup, count) {
  const questions = [];
  const used = new Set();

  while (questions.length < count) {
    const q = generateOne(ageGroup);
    const key = q.question;
    if (!used.has(key)) {
      used.add(key);
      questions.push(q);
    }
  }
  return questions;
}

function generateOne(ageGroup) {
  switch (ageGroup) {
    case '5-7': return generateEasy();
    case '8-10': return generateMedium();
    case '11-13': return generateHard();
    default: return generateEasy();
  }
}

// ========================
// Age 5-7: Addition & Subtraction (1-20)
// ========================
function generateEasy() {
  const isAdd = Math.random() < 0.5;
  let a, b, answer, question, explanation;

  if (isAdd) {
    a = randInt(1, 15);
    b = randInt(1, 15);
    answer = a + b;
    question = `What is ${a} + ${b}?`;
    explanation = `${a} + ${b} = ${answer}. When you add ${a} and ${b} together, you get ${answer}.`;
  } else {
    a = randInt(5, 20);
    b = randInt(1, a);
    answer = a - b;
    question = `What is ${a} - ${b}?`;
    explanation = `${a} - ${b} = ${answer}. If you take away ${b} from ${a}, you are left with ${answer}.`;
  }

  const funFacts = [
    'Numbers are everywhere — even in nature! Sunflowers have patterns that follow special numbers.',
    'The word "mathematics" comes from a Greek word meaning "learning".',
    'Ancient people used their fingers to count, just like you do!',
    'A triangle has 3 sides and 3 corners. Can you spot any triangles around you?',
    'Zero was invented in India thousands of years ago!'
  ];

  return buildQuestion(question, answer, explanation, funFacts);
}

// ========================
// Age 8-10: All 4 operations + word problems (1-100)
// ========================
function generateMedium() {
  const type = randInt(0, 4); // 0=add, 1=sub, 2=mul, 3=div, 4=word
  let a, b, answer, question, explanation;

  switch (type) {
    case 0: // Addition
      a = randInt(10, 99);
      b = randInt(10, 99);
      answer = a + b;
      question = `What is ${a} + ${b}?`;
      explanation = `${a} + ${b} = ${answer}.`;
      break;
    case 1: // Subtraction
      a = randInt(30, 99);
      b = randInt(10, a);
      answer = a - b;
      question = `What is ${a} - ${b}?`;
      explanation = `${a} - ${b} = ${answer}.`;
      break;
    case 2: // Multiplication
      a = randInt(2, 12);
      b = randInt(2, 12);
      answer = a * b;
      question = `What is ${a} × ${b}?`;
      explanation = `${a} × ${b} = ${answer}. This means ${a} groups of ${b}.`;
      break;
    case 3: // Division
      b = randInt(2, 10);
      answer = randInt(2, 12);
      a = b * answer;
      question = `What is ${a} ÷ ${b}?`;
      explanation = `${a} ÷ ${b} = ${answer}. If you split ${a} into ${b} equal groups, each group has ${answer}.`;
      break;
    case 4: // Word problem
      return generateWordProblemMedium();
  }

  const funFacts = [
    'If you multiply any number by 9 and add the digits of the result, you always get 9!',
    'The number 1 is neither prime nor composite — it is special!',
    'A googol is 1 followed by 100 zeros. Google was named after it!',
    'There are 86,400 seconds in a single day.',
    'Ancient Egyptians were using multiplication over 4,000 years ago!'
  ];

  return buildQuestion(question, answer, explanation, funFacts);
}

function generateWordProblemMedium() {
  const templates = [
    () => {
      const a = randInt(10, 50);
      const b = randInt(5, 30);
      return {
        question: `Riya has ${a} stickers. She gets ${b} more from her friend. How many stickers does she have now?`,
        answer: a + b,
        explanation: `Riya started with ${a} stickers and got ${b} more. ${a} + ${b} = ${a + b} stickers in total.`
      };
    },
    () => {
      const a = randInt(5, 12);
      const b = randInt(3, 8);
      return {
        question: `A shop has ${a} boxes. Each box has ${b} pencils. How many pencils are there in total?`,
        answer: a * b,
        explanation: `${a} boxes with ${b} pencils each: ${a} × ${b} = ${a * b} pencils.`
      };
    },
    () => {
      const total = randInt(20, 60);
      const given = randInt(5, total - 5);
      return {
        question: `Aarav had ${total} marbles. He gave ${given} to his sister. How many does he have left?`,
        answer: total - given,
        explanation: `${total} marbles minus ${given} given away: ${total} - ${given} = ${total - given} marbles left.`
      };
    },
    () => {
      const total = randInt(12, 48);
      const groups = pickFrom([2, 3, 4, 6]);
      const adjusted = Math.floor(total / groups) * groups;
      return {
        question: `${adjusted} children are divided equally into ${groups} teams. How many children in each team?`,
        answer: adjusted / groups,
        explanation: `${adjusted} ÷ ${groups} = ${adjusted / groups}. Each team has ${adjusted / groups} children.`
      };
    }
  ];

  const { question, answer, explanation } = pickFrom(templates)();
  const funFacts = [
    'Word problems help you use maths in real life, like shopping or cooking!',
    'In India, the game of chess was invented — it uses lots of maths strategy!',
    'Aryabhata, a great Indian mathematician, helped the world understand zero.'
  ];

  return buildQuestion(question, answer, explanation, funFacts);
}

// ========================
// Age 11-13: Fractions, percentages, multi-step
// ========================
function generateHard() {
  const type = randInt(0, 4);
  let answer, question, explanation;

  switch (type) {
    case 0: { // Percentage
      const base = pickFrom([40, 50, 60, 80, 100, 120, 150, 200, 250, 300]);
      const pct = pickFrom([10, 15, 20, 25, 30, 40, 50, 75]);
      answer = (pct / 100) * base;
      question = `What is ${pct}% of ${base}?`;
      explanation = `${pct}% of ${base} = (${pct}/100) × ${base} = ${answer}.`;
      break;
    }
    case 1: { // Multi-step
      const a = randInt(10, 50);
      const b = randInt(10, 50);
      const c = randInt(5, 20);
      answer = a + b - c;
      question = `What is ${a} + ${b} - ${c}?`;
      explanation = `First, ${a} + ${b} = ${a + b}. Then, ${a + b} - ${c} = ${answer}.`;
      break;
    }
    case 2: { // Large multiplication
      const a = randInt(12, 25);
      const b = randInt(10, 20);
      answer = a * b;
      question = `What is ${a} × ${b}?`;
      explanation = `${a} × ${b} = ${answer}.`;
      break;
    }
    case 3: { // Fraction of a number
      const denom = pickFrom([2, 3, 4, 5, 8, 10]);
      const numer = randInt(1, denom - 1);
      const whole = denom * randInt(3, 10);
      answer = (numer / denom) * whole;
      question = `What is ${numer}/${denom} of ${whole}?`;
      explanation = `${numer}/${denom} of ${whole}: First find 1/${denom} of ${whole} = ${whole / denom}. Then multiply by ${numer}: ${whole / denom} × ${numer} = ${answer}.`;
      break;
    }
    case 4: { // Word problem
      const price = randInt(5, 20) * 10;
      const discount = pickFrom([10, 20, 25, 50]);
      const saved = (discount / 100) * price;
      answer = price - saved;
      question = `A book costs Rs. ${price}. There is a ${discount}% discount. What is the price after discount?`;
      explanation = `Discount = ${discount}% of ${price} = Rs. ${saved}. Price after discount = ${price} - ${saved} = Rs. ${answer}.`;
      break;
    }
  }

  const funFacts = [
    'Srinivasa Ramanujan, born in Tamil Nadu, made amazing discoveries in mathematics with almost no formal training!',
    'The number Pi (3.14159...) goes on forever without repeating.',
    'Percentages are used everywhere — in shop discounts, exam scores, and cricket statistics!',
    'The Fibonacci sequence appears in flower petals, pinecones, and seashells.',
    'Indian mathematician Brahmagupta was the first to describe rules for using zero in calculations.'
  ];

  return buildQuestion(question, answer, explanation, funFacts);
}

// ========================
// Helpers
// ========================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuestion(questionText, correctAnswer, explanation, funFacts) {
  // Generate 3 plausible wrong answers
  const distractors = generateDistractors(correctAnswer);
  const allOptions = [correctAnswer, ...distractors];
  const shuffled = shuffle(allOptions);
  const correctIndex = shuffled.indexOf(correctAnswer);

  return {
    id: `math-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ageGroup: ['5-7', '8-10', '11-13'],
    question: questionText,
    options: shuffled.map(String),
    correctIndex,
    explanation,
    funFact: pickFrom(funFacts)
  };
}

function generateDistractors(correct) {
  const distractors = new Set();
  const offsets = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10];

  // Try nearby values first
  const shuffledOffsets = shuffle(offsets);
  for (const offset of shuffledOffsets) {
    if (distractors.size >= 3) break;
    const wrong = correct + offset;
    if (wrong > 0 && wrong !== correct) {
      distractors.add(wrong);
    }
  }

  // Fallback: random nearby
  let attempts = 0;
  while (distractors.size < 3 && attempts < 20) {
    const wrong = correct + randInt(-10, 10);
    if (wrong > 0 && wrong !== correct) {
      distractors.add(wrong);
    }
    attempts++;
  }

  return [...distractors].slice(0, 3);
}
