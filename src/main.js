import './style.css';
import { saveScore, getTop } from './scores.js';

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 12000;
const RETRY_MIN_DELAY_MS = 500;
const RETRY_MAX_DELAY_MS = 4000;
const DECOY_DURATION_MS = 700;
const DECOY_CHANCE = 0.3;
const PARTIAL_CHANCE = 0.3;
const RANKING_SIZE = 10;

const app = document.getElementById('app');
const hitZoneEl = document.querySelector('[data-role="hit-zone"]');
const messageEl = document.querySelector('[data-role="message"]');
const startButton = document.querySelector('[data-role="start-button"]');
const resultEl = document.querySelector('[data-role="result"]');
const resultTimeEl = document.querySelector('[data-role="result-time"]');
const nicknameForm = document.querySelector('[data-role="nickname-form"]');
const nicknameInput = document.querySelector('[data-role="nickname-input"]');
const saveButton = document.querySelector('[data-role="save-button"]');
const saveStatusEl = document.querySelector('[data-role="save-status"]');
const retryButton = document.querySelector('[data-role="retry-button"]');
const rankingEl = document.querySelector('[data-role="ranking"]');
const rankingListEl = document.querySelector('[data-role="ranking-list"]');

let state = 'idle';
let timerId = null;
let signalStartAt = 0;
let lastMeasuredMs = 0;
let rankingRenderToken = 0;

function setState(next) {
  state = next;
  app.className = `screen screen--${next}`;
}

function hideHitZone() {
  hitZoneEl.hidden = true;
}

function showIdle() {
  clearTimeout(timerId);
  hideHitZone();
  setState('idle');
  messageEl.innerHTML =
    '버튼을 누르면 게임이 시작됩니다.<br />' +
    '화면이 <strong>빨간색</strong>으로 바뀌면 최대한 빨리 클릭하세요!';
  startButton.hidden = false;
  startButton.textContent = '시작하기';
  resultEl.hidden = true;
  saveStatusEl.textContent = '';
  nicknameInput.value = '';
  nicknameForm.reset();
  saveButton.disabled = false;
  rankingEl.hidden = false;
  renderRanking();
}

function startGame() {
  clearTimeout(timerId);
  hideHitZone();
  startButton.hidden = true;
  resultEl.hidden = true;
  rankingEl.hidden = true;
  enterWaiting(MIN_DELAY_MS, MAX_DELAY_MS);
}

function enterWaiting(minDelay, maxDelay) {
  setState('waiting');
  messageEl.textContent = '곧 신호가 나타납니다. 기다리세요...';
  const delay = minDelay + Math.random() * (maxDelay - minDelay);
  timerId = setTimeout(triggerSignal, delay);
}

function triggerSignal() {
  const roll = Math.random();
  if (roll < DECOY_CHANCE) {
    showDecoy();
  } else if (roll < DECOY_CHANCE + PARTIAL_CHANCE) {
    showPartialReady();
  } else {
    showReady();
  }
}

function showReady() {
  setState('ready');
  messageEl.textContent = '지금 클릭하세요!';
  signalStartAt = performance.now();
}

function showDecoy() {
  setState('decoy');
  messageEl.textContent = '지금 클릭하세요!';
  timerId = setTimeout(() => {
    if (state === 'decoy') {
      enterWaiting(RETRY_MIN_DELAY_MS, RETRY_MAX_DELAY_MS);
    }
  }, DECOY_DURATION_MS);
}

function showPartialReady() {
  setState('partial-ready');
  messageEl.textContent = '빨간 부분을 찾아 클릭하세요!';
  const left = 10 + Math.random() * 70;
  const top = 15 + Math.random() * 60;
  hitZoneEl.style.left = `${left}%`;
  hitZoneEl.style.top = `${top}%`;
  hitZoneEl.hidden = false;
  signalStartAt = performance.now();
}

function handleEarlyClick() {
  clearTimeout(timerId);
  hideHitZone();
  setState('fail');
  messageEl.innerHTML = '너무 빨리 눌렀습니다!<br />신호가 나타날 때까지 기다려주세요.';
  startButton.hidden = false;
  startButton.textContent = '다시 시작';
  resultEl.hidden = true;
  rankingEl.hidden = false;
  renderRanking();
}

function handleTrapClick() {
  clearTimeout(timerId);
  setState('trapfail');
  messageEl.innerHTML = '낚이셨습니다!<br />빨간색이 아니라 주황색 가짜 신호였어요.';
  startButton.hidden = false;
  startButton.textContent = '다시 시작';
  resultEl.hidden = true;
  rankingEl.hidden = false;
  renderRanking();
}

async function handleReactionClick() {
  clearTimeout(timerId);
  hideHitZone();
  lastMeasuredMs = Math.round(performance.now() - signalStartAt);
  setState('result');
  messageEl.textContent = '결과';
  startButton.hidden = true;
  resultEl.hidden = false;
  resultTimeEl.textContent = `${lastMeasuredMs} ms`;
  saveStatusEl.textContent = '';
  nicknameInput.value = '';
  saveButton.disabled = false;
  rankingEl.hidden = false;
  await renderRanking();
}

async function renderRanking() {
  const token = ++rankingRenderToken;
  let topScores = [];
  let errorMessage = null;
  try {
    topScores = await getTop(RANKING_SIZE);
  } catch (error) {
    errorMessage = '랭킹을 불러오지 못했습니다.';
  }

  if (token !== rankingRenderToken) return;

  rankingListEl.innerHTML = '';

  if (errorMessage) {
    const li = document.createElement('li');
    li.className = 'ranking-empty';
    li.textContent = errorMessage;
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
  } else if (state === 'decoy') {
    handleTrapClick();
  } else if (state === 'partial-ready') {
    if (event.target.closest('[data-role="hit-zone"]')) {
      handleReactionClick();
    }
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
