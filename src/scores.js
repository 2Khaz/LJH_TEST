const STORAGE_KEY = 'reaction-time-scores';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function saveScore(ms, nickname) {
  const scores = readAll();
  scores.push({ ms, nickname, createdAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export async function getTop(n) {
  return readAll()
    .sort((a, b) => a.ms - b.ms)
    .slice(0, n);
}
