import './style.css';
import { saveScore, getTop } from './scores.js';

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 12000;
const RANKING_SIZE = 10;

const app = document.getElementById('app');
const messageEl = document.querySelector('[data-role="message"]');
const startButton = document.querySelector('[data-role="start-button"]');
const resultEl = document.querySelector('[data-role="result"]');
const resultTimeEl = document.querySelector('[data-role="result-time"]');
const nicknameForm = document.querySelector('[data-role="nickname-form"]');
const nicknameInput = document.querySelector('[data-role="nickname-input"]');
const saveButton = document.querySelector('[data-role="save-button"]');
const saveStatusEl = document.querySelector('[data-role="save-status"]');
const retryButton = document.querySelector('[data-role="retry-button"]');
const rankingListEl = document.querySelector('[data-role="ranking-list"]');

let state = 'idle';
let timerId = null;
let redStartAt = 0;
let lastMeasuredMs = 0;

function setState(next) {
  state = next;
  app.className = `screen screen--${next}`;
}

function showIdle() {
  setState('idle');
  messageEl.innerHTML =
    '버튼을 누르면 게임이 시작됩니다.<br />화면이 <strong>빨간색</strong>으로 바뀌면 최대한 빨리 클릭하세요!';
  startButton.hidden = false;
  startButton.textContent = '시작하기';
  resultEl.hidden = true;
  saveStatusEl.textContent = '';
  nicknameInput.value = '';
  nicknameForm.reset();
  saveButton.disabled = false;
}

function startGame() {
  clearTimeout(timerId);
  setState('waiting');
  messageEl.textContent = '곧 화면이 빨간색으로 바뀝니다. 기다리세요...';
  startButton.hidden = true;
  resultEl.hidden = true;

  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  timerId = setTimeout(() => {
    setState('ready');
    messageEl.textContent = '지금 클릭하세요!';
    redStartAt = performance.now();
  }, delay);
}

function handleEarlyClick() {
  clearTimeout(timerId);
  setState('fail');
  messageEl.innerHTML = '너무 빨리 눌렀습니다!<br />빨간색으로 바뀔 때까지 기다려주세요.';
  startButton.hidden = false;
  startButton.textContent = '다시 시작';
  resultEl.hidden = true;
}

async function handleReactionClick() {
  lastMeasuredMs = Math.round(performance.now() - redStartAt);
  setState('result');
  messageEl.textContent = '결과';
  startButton.hidden = true;
  resultEl.hidden = false;
  resultTimeEl.textContent = `${lastMeasuredMs} ms`;
  saveStatusEl.textContent = '';
  nicknameInput.value = '';
  saveButton.disabled = false;
  await renderRanking();
}

async function renderRanking() {
  rankingListEl.innerHTML = '';
  let topScores = [];
  try {
    topScores = await getTop(RANKING_SIZE);
  } catch (error) {
    const li = document.createElement('li');
    li.className = 'ranking-empty';
    li.textContent = '랭킹을 불러오지 못했습니다.';
    rankingListEl.appendChild(li);
    return;
  }

  if (topScores.length === 0) {
    const li = document.createElement('li');
    li.className = 'ranking-empty';
    li.textContent = '아직 기록이 없습니다.';
    rankingListEl.appendChild(li);
    return;
  }

  for (const score of topScores) {
    const li = document.createElement('li');
    li.textContent = `${score.nickname} - ${score.ms} ms`;
    rankingListEl.appendChild(li);
  }
}

app.addEventListener('click', (event) => {
  if (state === 'waiting') {
    if (event.target === startButton) return;
    handleEarlyClick();
  } else if (state === 'ready') {
    handleReactionClick();
  }
});

startButton.addEventListener('click', () => {
  startGame();
});

retryButton.addEventListener('click', () => {
  showIdle();
});

nicknameForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  saveButton.disabled = true;
  saveStatusEl.textContent = '저장 중...';
  try {
    await saveScore(lastMeasuredMs, nickname);
    saveStatusEl.textContent = '저장되었습니다!';
    await renderRanking();
  } catch (error) {
    saveStatusEl.textContent = '저장에 실패했습니다. 다시 시도해주세요.';
    saveButton.disabled = false;
  }
});

showIdle();
