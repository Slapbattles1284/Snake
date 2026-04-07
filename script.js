(() => {
  const canvas = document.getElementById('game');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  const levelEl = document.getElementById('level');
  const levelCapEl = document.getElementById('levelCap');
  const roundEl = document.getElementById('round');
  const roundCapEl = document.getElementById('roundCap');
  const scoreEl = document.getElementById('score');
  const bestScoreEl = document.getElementById('bestScore');
  const coinsEl = document.getElementById('coins');
  const healthEl = document.getElementById('health');
  const xpEl = document.getElementById('xp');
  const comboEl = document.getElementById('combo');
  const mapSizeEl = document.getElementById('mapSize');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const homeBtn = document.getElementById('homeBtn');
  const backBtn = document.getElementById('backBtn');
  const playNormalBtn = document.getElementById('playNormalBtn');
  const playEndlessBtn = document.getElementById('playEndlessBtn');
  const changeNameBtn = document.getElementById('changeNameBtn');
  const dailyRewardBtn = document.getElementById('dailyRewardBtn');
  const leaderboardBtn = document.getElementById('leaderboardBtn');
  const guideBtn = document.getElementById('guideBtn');
  const spinBtn = document.getElementById('spinBtn');
  const eventsBtn = document.getElementById('eventsBtn');
  const missionsBtn = document.getElementById('missionsBtn');
  const shopBtn = document.getElementById('shopBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const playerNameLabel = document.getElementById('playerNameLabel');
  const coinBankLabel = document.getElementById('coinBankLabel');
  const abilityOverlay = document.getElementById('abilityOverlay');
  const abilityChoicesEl = document.getElementById('abilityChoices');
  const infoOverlay = document.getElementById('infoOverlay');
  const infoTitleEl = document.getElementById('infoTitle');
  const infoSubtitleEl = document.getElementById('infoSubtitle');
  const infoContentEl = document.getElementById('infoContent');
  const infoCloseBtn = document.getElementById('infoCloseBtn');
  const shopOverlay = document.getElementById('shopOverlay');
  const shopItemsEl = document.getElementById('shopItems');
  const shopCloseBtn = document.getElementById('shopCloseBtn');
  const shopCoinLabel = document.getElementById('shopCoinLabel');
  const touchButtons = Array.from(document.querySelectorAll('.touch-btn'));
  const cardWrap = document.querySelector('.card-wrap');
  const homePage = document.getElementById('homePage');
  const gamePage = document.getElementById('gamePage');
  const cheatPage = document.getElementById('cheatPage');
  const gameModeLabel = document.getElementById('gameModeLabel');
  const realmXpWrap = document.getElementById('realmXpWrap');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const gameOverTitleEl = document.getElementById('gameOverTitle');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const gameOverHomeBtn = document.getElementById('gameOverHomeBtn');

  const baseGridSize = 7;
  const maxGridSize = 28;
  const baseTickMs = 196;
  const minMapTickMs = 92;
  const minAbsoluteTickMs = 54;
  const maxRounds = 30;
  const maxLevels = 15;
  const angelMaxRounds = 50;
  const angelMaxLevels = 30;
  const portalSequence = 'fghj'.repeat(5).split('');
  const snakeSkins = [
    { key: 'classic', name: 'Classic', emoji: '🐍', price: 0, desc: 'The default green runner.', body: '#2bc866', head: '#5ef38c', accent: '#9af0b8', label: '#ffffff', bgA: '#193324', bgB: '#0b1711' },
    { key: 'frost', name: 'Frost Byte', emoji: '🧊', price: 12, desc: 'Cold blue squares with an icy glow.', body: '#52c7ff', head: '#d6f6ff', accent: '#91dfff', label: '#effbff', bgA: '#18374d', bgB: '#0a1826' },
    { key: 'lava', name: 'Lava Rush', emoji: '🔥', price: 18, desc: 'Bright ember colors for hot streaks.', body: '#ff6a3d', head: '#ffd166', accent: '#ff9b54', label: '#fff0c4', bgA: '#4a1e14', bgB: '#1b0b07' },
    { key: 'royal', name: 'Royal Circuit', emoji: '👑', price: 26, desc: 'Gold highlights and deep arcade blue.', body: '#6b7cff', head: '#ffd95e', accent: '#b5beff', label: '#fff4b8', bgA: '#1d2754', bgB: '#0d1228' },
    { key: 'shadow', name: 'Shadow Venom', emoji: '🌑', price: 32, desc: 'A stealth skin with neon green edges.', body: '#1e2938', head: '#8effa7', accent: '#4ade80', label: '#d7ffe1', bgA: '#111827', bgB: '#030712' },
    { key: 'bubble', name: 'Bubble Bloom', emoji: '🫧', price: 22, desc: 'Soft aqua scales with a bright candy shine.', body: '#5eead4', head: '#cffafe', accent: '#99f6e4', label: '#effffe', bgA: '#10343a', bgB: '#081b21' },
    { key: 'sunset', name: 'Sunset Coil', emoji: '🌇', price: 24, desc: 'Warm neon orange and pink like an arcade sunset.', body: '#ff7a59', head: '#ffd0a8', accent: '#ff9ac1', label: '#fff1de', bgA: '#4d1f2b', bgB: '#1a1021' },
    { key: 'toxic', name: 'Toxic Byte', emoji: '☣️', price: 29, desc: 'Radioactive green edges with a dark tech body.', body: '#1a2f24', head: '#b7ff3c', accent: '#67e8a5', label: '#f3ffd9', bgA: '#112416', bgB: '#07110a' },
    { key: 'candy', name: 'Candy Coil', emoji: '🍬', price: 21, desc: 'Bright striped colors for a playful run.', body: '#ff5ea8', head: '#ffe27a', accent: '#8bd3ff', label: '#fff7d2', bgA: '#4a1730', bgB: '#1f1333' },
    { key: 'storm', name: 'Storm Fang', emoji: '⛈️', price: 35, desc: 'Electric blue highlights with a thunder-dark frame.', body: '#2b3350', head: '#9bd7ff', accent: '#ffe56d', label: '#eef7ff', bgA: '#12192c', bgB: '#070b14' }
  ];

  let snake = [];
  let prevSnake = [];
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let directionQueue = [];
  let food = null;
  let bonusApples = [];
  let obstacles = [];
  let score = 0;
  let round = 1;
  let level = 1;
  let gameOver = false;
  let invincible = false;
  let autoAim = false;
  let speedLevel = 0;
  let keyBuffer = [];
  let pendingSpeedTimer = null;
  let lastProcessedSpeedBuffer = '';
  let tickMs = baseTickMs;
  let accumulator = 0;
  let lastFrameTime = 0;
  let nextTongueAt = 0;
  let tongueVisibleUntil = 0;
  let activePortals = [];
  let boardCache = null;
  let boardCacheKey = '';
  let angelRealm = false;
  let playerHealth = 10;
  let maxHealth = 10;
  let xp = 0;
  let xpLevel = 1;
  let abilities = { vigor: 0, reflex: 0, luck: 0, shield: 0, bounty: 0 };
  let angels = [];
  let generalAngels = [];
  let projectiles = [];
  let grenades = [];
  let healOrb = null;
  let altar = null;
  let boss = null;
  let particles = [];
  let trackingLasers = [];
  let skyBeams = [];
  let jackpotMode = false;
  let realmMessage = '';
  let realmMessageUntil = 0;
  let currentScreen = 'home';
  let endlessMode = false;
  let playerName = 'Player';
  let jackpotHud = { mode: 'XP', nextRollAt: 0 };
  const leaderboardStorageKey = 'snakeEndlessLeaderboard';
  const coinStorageKey = 'snakeCoins';
  const dailyRewardStorageKey = 'snakeDailyRewardAt';
  const spinReadyAtStorageKey = 'snakeSpinReadyAt';
  const challengeStateStorageKey = 'snakeChallengeState';
  const missionStreakStorageKey = 'snakeMissionStreak';
  const coinEconomyVersionKey = 'snakeCoinEconomyVersion';
  const coinEconomyVersion = '2';
  const bestScoreStorageKey = 'snakeBestScore';
  const ownedSkinsStorageKey = 'snakeOwnedSkins';
  const equippedSkinStorageKey = 'snakeEquippedSkin';
  let cheatsUsedThisRun = false;
  let leaderboardAbuseMode = false;
  let leaderboardSavedThisLife = false;
  let endlessLeaderboard = [];
  let lastLeaderboardResult = null;
  let paused = false;
  let coins = 0;
  let comboCount = 0;
  let comboTimer = 0;
  let pendingBlessingChoices = 0;
  let currentBlessingOptions = [];
  let blessingSelectionOpen = false;
  let bestScore = 0;
  let ownedSkins = ['classic'];
  let equippedSkin = 'classic';
  let shopOpen = false;
  let infoPanel = '';
  let spinReadyAt = 0;
  let lastSpinResult = '';
  let challengeState = null;
  let missionStreak = { count: 0, best: 0, lastCompletedDate: '' };
  let countdownStartedAt = 0;
  let countdownLeadSeconds = 0;
  let lastCountdownActive = false;
  const countdownGoDurationMs = 850;

  try {
    const savedName = localStorage.getItem('snakePlayerName');
    if (savedName) playerName = savedName;
    coins = Number.parseInt(localStorage.getItem(coinStorageKey) || '0', 10) || 0;
    bestScore = Number.parseInt(localStorage.getItem(bestScoreStorageKey) || '0', 10) || 0;
    const savedOwnedSkins = JSON.parse(localStorage.getItem(ownedSkinsStorageKey) || '["classic"]');
    if (Array.isArray(savedOwnedSkins) && savedOwnedSkins.length) ownedSkins = [...new Set(savedOwnedSkins)];
    const savedEquippedSkin = localStorage.getItem(equippedSkinStorageKey);
    if (savedEquippedSkin) equippedSkin = savedEquippedSkin;
    spinReadyAt = Number.parseInt(localStorage.getItem(spinReadyAtStorageKey) || '0', 10) || 0;
    const rawChallengeState = localStorage.getItem(challengeStateStorageKey);
    if (rawChallengeState) challengeState = JSON.parse(rawChallengeState);
    const rawMissionStreak = localStorage.getItem(missionStreakStorageKey);
    if (rawMissionStreak) missionStreak = JSON.parse(rawMissionStreak);
    const savedEconomyVersion = localStorage.getItem(coinEconomyVersionKey);
    if (savedEconomyVersion !== coinEconomyVersion) {
      coins = 0;
      localStorage.setItem(coinStorageKey, '0');
      localStorage.setItem(coinEconomyVersionKey, coinEconomyVersion);
    }
  } catch {
    // ignore storage errors
  }

  normalizeMissionStreak();
  endlessLeaderboard = loadEndlessLeaderboard();
  ensureChallengeState();

  function currentGridSize() {
    return Math.min(maxGridSize, baseGridSize + (level - 1));
  }

  function currentCellSize() {
    return canvas.width / currentGridSize();
  }

  function boardGrowthCapLevel() {
    return maxGridSize - baseGridSize + 1;
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function loadEndlessLeaderboard() {
    try {
      const raw = localStorage.getItem(leaderboardStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveEndlessLeaderboard() {
    try {
      localStorage.setItem(leaderboardStorageKey, JSON.stringify(endlessLeaderboard));
    } catch {
      // ignore storage errors
    }
  }

  function saveCoins() {
    try {
      localStorage.setItem(coinStorageKey, String(coins));
    } catch {
      // ignore storage errors
    }
  }

  function addCoins(amount) {
    if (!amount) return;
    coins = Math.max(0, coins + amount);
    saveCoins();
  }

  function saveBestScore() {
    try {
      localStorage.setItem(bestScoreStorageKey, String(bestScore));
    } catch {
      // ignore storage errors
    }
  }

  function saveOwnedSkins() {
    try {
      localStorage.setItem(ownedSkinsStorageKey, JSON.stringify([...new Set(ownedSkins)]));
    } catch {
      // ignore storage errors
    }
  }

  function saveEquippedSkin() {
    try {
      localStorage.setItem(equippedSkinStorageKey, equippedSkin);
    } catch {
      // ignore storage errors
    }
  }

  function saveSpinReadyAt() {
    try {
      localStorage.setItem(spinReadyAtStorageKey, String(spinReadyAt));
    } catch {
      // ignore storage errors
    }
  }

  function saveChallengeState() {
    try {
      localStorage.setItem(challengeStateStorageKey, JSON.stringify(challengeState));
    } catch {
      // ignore storage errors
    }
  }

  function syncBestScore() {
    if (score <= bestScore) return;
    bestScore = score;
    saveBestScore();
  }

  function normalizeSkinState() {
    if (!ownedSkins.includes('classic')) ownedSkins.unshift('classic');
    if (!ownedSkins.includes(equippedSkin)) equippedSkin = 'classic';
  }

  function getLocalDateKey() {
    return new Date().toLocaleDateString('en-CA');
  }

  function hashString(value) {
    let hash = 0;
    for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return hash;
  }

  function normalizeMissionStreak() {
    if (!missionStreak || typeof missionStreak !== 'object') {
      missionStreak = { count: 0, best: 0, lastCompletedDate: '' };
      return;
    }
    missionStreak.count = Math.max(0, Number.parseInt(missionStreak.count || '0', 10) || 0);
    missionStreak.best = Math.max(missionStreak.count, Number.parseInt(missionStreak.best || '0', 10) || 0);
    missionStreak.lastCompletedDate = typeof missionStreak.lastCompletedDate === 'string' ? missionStreak.lastCompletedDate : '';
  }

  function saveMissionStreak() {
    try {
      localStorage.setItem(missionStreakStorageKey, JSON.stringify(missionStreak));
    } catch {
      // ignore storage errors
    }
  }

  function getPreviousDateKey(dateKey = getLocalDateKey()) {
    const date = new Date(`${dateKey}T12:00:00`);
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('en-CA');
  }

  function formatTimeRemaining(ms) {
    if (ms <= 0) return 'ready';
    const totalSeconds = Math.ceil(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  function timeUntilNextLocalResetLabel() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    return formatTimeRemaining(next - now);
  }

  function missionStreakBonusFor(streakCount) {
    return 2 + Math.min(6, Math.max(1, streakCount));
  }

  function nextMissionStreakCount(dateKey = getLocalDateKey()) {
    normalizeMissionStreak();
    return missionStreak.lastCompletedDate === getPreviousDateKey(dateKey) ? missionStreak.count + 1 : 1;
  }

  function maybeCompleteMissionStreak(dateKey = getLocalDateKey()) {
    normalizeMissionStreak();
    if (!challengeState || challengeState.date !== dateKey) return null;
    const missions = challengeState.missions || [];
    if (!missions.length || !missions.every(mission => mission.claimed)) return null;
    if (missionStreak.lastCompletedDate === dateKey) return null;

    const streakCount = nextMissionStreakCount(dateKey);
    const bonus = missionStreakBonusFor(streakCount);
    missionStreak.count = streakCount;
    missionStreak.best = Math.max(missionStreak.best, streakCount);
    missionStreak.lastCompletedDate = dateKey;
    saveMissionStreak();
    addCoins(bonus);
    return { streakCount, bonus };
  }

  function countdownTotalMs() {
    return countdownLeadSeconds > 0 ? (countdownLeadSeconds * 1000) + countdownGoDurationMs : 0;
  }

  function clearCountdown() {
    countdownStartedAt = 0;
    countdownLeadSeconds = 0;
    lastCountdownActive = false;
  }

  function startCountdown(seconds = 3) {
    countdownLeadSeconds = seconds;
    countdownStartedAt = performance.now();
    accumulator = 0;
    lastCountdownActive = true;
  }

  function isCountdownActive(now = performance.now()) {
    const total = countdownTotalMs();
    return countdownStartedAt > 0 && total > 0 && now < countdownStartedAt + total;
  }

  function getCountdownState(now = performance.now()) {
    if (!isCountdownActive(now)) return null;

    const elapsed = now - countdownStartedAt;
    const numericWindow = countdownLeadSeconds * 1000;
    if (elapsed < numericWindow) {
      const step = Math.floor(elapsed / 1000);
      return {
        text: String(Math.max(1, countdownLeadSeconds - step)),
        phase: (elapsed % 1000) / 1000,
        go: false
      };
    }

    return {
      text: 'GO!',
      phase: Math.min(1, (elapsed - numericWindow) / countdownGoDurationMs),
      go: true
    };
  }

  function challengeTemplates() {
    return [
      { type: 'apples', title: 'Apple Rush', desc: 'Eat {target} apples', target: [5, 7, 9], reward: [4, 6, 8] },
      { type: 'rounds', title: 'Round Runner', desc: 'Clear {target} rounds', target: [2, 3, 4], reward: [4, 6, 8] },
      { type: 'bonus', title: 'Bonus Hunt', desc: 'Eat {target} bonus apples', target: [1, 2, 3], reward: [5, 7, 9] },
      { type: 'endless', title: 'Endless Push', desc: 'Clear {target} endless rounds', target: [1, 2, 3], reward: [5, 8, 10] }
    ];
  }

  function makeChallenge(template, indexSeed = 0, targetBias = 0) {
    const targetIndex = Math.min(template.target.length - 1, (indexSeed + targetBias) % template.target.length);
    return {
      type: template.type,
      title: template.title,
      desc: template.desc.replace('{target}', template.target[targetIndex]),
      target: template.target[targetIndex],
      reward: template.reward[targetIndex],
      progress: 0,
      claimed: false
    };
  }

  function ensureChallengeState() {
    const dateKey = getLocalDateKey();
    if (challengeState?.date === dateKey) return;

    const templates = challengeTemplates();
    const seed = hashString(dateKey);
    const eventTemplate = templates[seed % templates.length];
    const missions = [];
    const usedTypes = new Set([eventTemplate.type]);
    let cursor = 0;
    while (missions.length < 3) {
      const template = templates[(seed + cursor + 1) % templates.length];
      if (!usedTypes.has(template.type)) {
        usedTypes.add(template.type);
        missions.push(makeChallenge(template, seed + cursor, missions.length));
      }
      cursor += 1;
      if (cursor > 10) break;
    }

    challengeState = {
      date: dateKey,
      event: makeChallenge(eventTemplate, seed, 1),
      missions
    };
    saveChallengeState();
  }

  function updateChallengeProgress(type, amount = 1) {
    ensureChallengeState();
    if (!challengeState) return;
    const allChallenges = [challengeState.event, ...challengeState.missions];
    allChallenges.forEach(challenge => {
      if (challenge.type !== type || challenge.claimed) return;
      challenge.progress = Math.min(challenge.target, challenge.progress + amount);
    });
    saveChallengeState();
  }

  function claimChallenge(kind, index = 0) {
    ensureChallengeState();
    if (!challengeState) return;
    const challenge = kind === 'event' ? challengeState.event : challengeState.missions[index];
    if (!challenge || challenge.claimed || challenge.progress < challenge.target) return;
    challenge.claimed = true;
    addCoins(challenge.reward);
    saveChallengeState();
    const streakResult = kind === 'mission' ? maybeCompleteMissionStreak(challengeState.date) : null;
    if (streakResult) {
      showRealmMessage(`+${challenge.reward} coins • Streak x${streakResult.streakCount} +${streakResult.bonus}`, 2200);
    } else {
      showRealmMessage(`+${challenge.reward} coins`, 1400);
    }
    updateHud();
  }

  function spinCooldownLabel() {
    const remaining = spinReadyAt - Date.now();
    return remaining <= 0 ? 'ready' : formatTimeRemaining(remaining);
  }

  function runLuckySpin() {
    if (Date.now() < spinReadyAt) {
      showRealmMessage(`Spin in ${spinCooldownLabel()}`, 1400);
      updateView();
      return;
    }

    const roll = Math.random();
    let rewardText = '';
    if (roll < 0.45) {
      addCoins(3);
      rewardText = '+3 coins';
    } else if (roll < 0.73) {
      addCoins(5);
      rewardText = '+5 coins';
    } else if (roll < 0.91) {
      addCoins(8);
      rewardText = '+8 coins';
    } else {
      const locked = snakeSkins.filter(skin => !isSkinOwned(skin.key) && skin.key !== 'classic');
      if (locked.length) {
        const unlocked = locked[Math.floor(Math.random() * locked.length)];
        ownedSkins.push(unlocked.key);
        equippedSkin = unlocked.key;
        saveOwnedSkins();
        saveEquippedSkin();
        rewardText = `${unlocked.name} skin`;
      } else {
        addCoins(10);
        rewardText = '+10 coins';
      }
    }

    spinReadyAt = Date.now() + (4 * 60 * 60 * 1000);
    saveSpinReadyAt();
    lastSpinResult = rewardText;
    showRealmMessage(`Lucky Spin: ${rewardText}`, 1800);
    updateHud();
  }

  function isSkinOwned(key) {
    return ownedSkins.includes(key);
  }

  function getActiveSkin() {
    normalizeSkinState();
    return snakeSkins.find(skin => skin.key === equippedSkin) || snakeSkins[0];
  }

  function renderShop() {
    normalizeSkinState();
    if (shopCoinLabel) shopCoinLabel.textContent = String(coins);
    if (!shopItemsEl) return;

    shopItemsEl.innerHTML = snakeSkins.map(skin => {
      const owned = isSkinOwned(skin.key);
      const active = equippedSkin === skin.key;
      const canAfford = coins >= skin.price;
      const priceMarkup = skin.price ? `<span class="skin-price"><img src="coin.svg" class="coin-icon" alt="Coin" /> ${skin.price}</span>` : '<span class="skin-price">Free</span>';
      const buttonLabel = active ? 'Equipped' : (owned ? 'Equip' : (canAfford ? 'Buy skin' : `Need ${skin.price - coins}`));
      const buttonClass = active ? 'skin-action owned' : (owned ? 'skin-action equip' : 'skin-action');

      return `
        <article class="skin-card${active ? ' active' : ''}">
          <div class="skin-preview" style="--skin-bg-a:${skin.bgA};--skin-bg-b:${skin.bgB};--skin-body:${skin.body};--skin-head:${skin.head};--skin-accent:${skin.accent};"></div>
          <div class="skin-meta">
            <div>
              <p class="skin-name">${skin.emoji} ${skin.name}</p>
            </div>
            ${priceMarkup}
          </div>
          <p class="skin-desc">${skin.desc}</p>
          <button class="${buttonClass}" type="button" data-skin="${skin.key}">${buttonLabel}</button>
        </article>
      `;
    }).join('');
  }

  function toggleShop(force) {
    if (currentScreen !== 'home') return;
    infoPanel = '';
    shopOpen = typeof force === 'boolean' ? force : !shopOpen;
    renderShop();
    updateView();
  }

  function openInfoPanel(kind) {
    if (currentScreen !== 'home') return;
    shopOpen = false;
    infoPanel = kind;
    updateView();
  }

  function closeInfoPanel() {
    infoPanel = '';
    updateView();
  }

  function renderInfoPanel() {
    ensureChallengeState();
    if (!infoTitleEl || !infoSubtitleEl || !infoContentEl) return;

    if (infoPanel === 'leaderboard') {
      infoTitleEl.textContent = 'endless leaderboard';
      infoSubtitleEl.textContent = 'Top scores from your best endless runs.';
      const board = endlessLeaderboard.slice(0, 5);
      infoContentEl.innerHTML = board.length
        ? board.map((entry, index) => `<div class="info-card"><strong>#${index + 1} ${entry.name}</strong>Score ${entry.score} • Level ${entry.level} • Round ${entry.round}</div>`).join('')
        : '<div class="info-card"><strong>No scores yet</strong>Finish an endless run to start filling the board.</div>';
      return;
    }

    if (infoPanel === 'guide') {
      infoTitleEl.textContent = 'quick guide';
      infoSubtitleEl.textContent = 'A few mobile-game style tips before you jump in.';
      infoContentEl.innerHTML = [
        '<div class="info-card"><strong>Controls</strong>Use arrow keys, WASD, or the touch pad on mobile.</div>',
        '<div class="info-card"><strong>Lucky Spin</strong>Spin every 4 hours for coins or a surprise skin.</div>',
        '<div class="info-card"><strong>Progress</strong>Events and missions track automatically while you play.</div>'
      ].join('');
      return;
    }

    if (infoPanel === 'spin') {
      infoTitleEl.textContent = 'lucky spin';
      infoSubtitleEl.textContent = 'A real cooldown-based spin for coins and rare skins.';
      const ready = Date.now() >= spinReadyAt;
      infoContentEl.innerHTML = `
        <div class="info-card">
          <strong>Wheel status</strong>
          <span class="info-tag">${ready ? 'Ready now' : `Next spin in ${spinCooldownLabel()}`}</span>
          <button class="info-action" type="button" data-action="spin" ${ready ? '' : 'disabled'}>${ready ? 'Spin now' : 'Cooling down'}</button>
          ${lastSpinResult ? `<div class="info-progress"><span style="width:100%"></span></div><div style="margin-top:10px">Last result: ${lastSpinResult}</div>` : ''}
        </div>
      `;
      return;
    }

    if (infoPanel === 'events') {
      const event = challengeState?.event;
      if (!event) return;
      const percent = Math.min(100, Math.round((event.progress / event.target) * 100));
      const canClaim = event.progress >= event.target && !event.claimed;
      infoTitleEl.textContent = 'daily event';
      infoSubtitleEl.textContent = `One featured challenge that refreshes each day. Reset in ${timeUntilNextLocalResetLabel()}.`;
      infoContentEl.innerHTML = `
        <div class="info-card">
          <strong>${event.title}</strong>
          <div>${event.desc}</div>
          <div class="info-progress"><span style="width:${percent}%"></span></div>
          <div style="margin-top:10px">${event.progress}/${event.target} complete • Reward ${event.reward} coins</div>
          <button class="info-action ${event.claimed ? 'alt' : ''}" type="button" data-action="claim-event" ${canClaim ? '' : 'disabled'}>${event.claimed ? 'Claimed' : (canClaim ? 'Claim reward' : 'Keep going')}</button>
        </div>
      `;
      return;
    }

    if (infoPanel === 'missions') {
      const missions = challengeState?.missions || [];
      const streakLockedToday = missionStreak.lastCompletedDate === (challengeState?.date || getLocalDateKey());
      const streakPreview = streakLockedToday ? Math.max(1, missionStreak.count) : nextMissionStreakCount(challengeState?.date || getLocalDateKey());
      const streakBonus = missionStreakBonusFor(streakPreview);
      infoTitleEl.textContent = 'missions';
      infoSubtitleEl.textContent = `Three working daily tasks that track progress automatically. Reset in ${timeUntilNextLocalResetLabel()}.`;
      infoContentEl.innerHTML = `
        <div class="info-card">
          <strong>Mission streak</strong>
          <div>${streakLockedToday ? `Today's streak is locked in at x${missionStreak.count}.` : `Claim all 3 missions today for +${streakBonus} bonus coins.`}</div>
          <div style="margin-top:10px">Current streak ${missionStreak.count} • Best ${missionStreak.best}</div>
        </div>
        <div class="info-grid">${missions.map((mission, index) => {
          const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));
          const canClaim = mission.progress >= mission.target && !mission.claimed;
          return `
            <div class="info-card">
              <strong>${mission.title}</strong>
              <div>${mission.desc}</div>
              <div class="info-progress"><span style="width:${percent}%"></span></div>
              <div style="margin-top:10px">${mission.progress}/${mission.target} complete • Reward ${mission.reward} coins</div>
              <button class="info-action ${mission.claimed ? 'alt' : ''}" type="button" data-action="claim-mission" data-index="${index}" ${canClaim ? '' : 'disabled'}>${mission.claimed ? 'Claimed' : (canClaim ? 'Claim reward' : 'In progress')}</button>
            </div>
          `;
        }).join('')}</div>
      `;
      return;
    }

    infoTitleEl.textContent = 'panel';
    infoSubtitleEl.textContent = 'Extra game info.';
    infoContentEl.innerHTML = '';
  }

  function handleShopAction(key) {
    const skin = snakeSkins.find(item => item.key === key);
    if (!skin) return;

    if (!isSkinOwned(key)) {
      if (coins < skin.price) {
        showRealmMessage(`Need ${skin.price - coins} more coins`, 1400);
        updateView();
        return;
      }
      coins -= skin.price;
      saveCoins();
      ownedSkins.push(key);
      saveOwnedSkins();
      equippedSkin = key;
      saveEquippedSkin();
      showRealmMessage(`${skin.name} unlocked`, 1600);
    } else if (equippedSkin !== key) {
      equippedSkin = key;
      saveEquippedSkin();
      showRealmMessage(`${skin.name} equipped`, 1200);
    }

    renderShop();
    updateHud();
  }

  function toggleFullscreen() {
    const target = currentScreen === 'game' ? gamePage : cardWrap;
    if (!document.fullscreenElement) {
      target?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function getDailyRewardState() {
    try {
      const lastClaim = Number.parseInt(localStorage.getItem(dailyRewardStorageKey) || '0', 10) || 0;
      const cooldownMs = 24 * 60 * 60 * 1000;
      const remaining = lastClaim + cooldownMs - Date.now();
      if (remaining <= 0) return { ready: true, label: 'ready', shortLabel: 'Ready', remaining: 0 };
      const label = formatTimeRemaining(remaining);
      return { ready: false, label, shortLabel: label, remaining };
    } catch {
      return { ready: true, label: 'ready', shortLabel: 'Ready', remaining: 0 };
    }
  }

  function claimDailyReward() {
    const rewardState = getDailyRewardState();
    if (!rewardState.ready) {
      showRealmMessage(`Daily reward in ${rewardState.label}`, 1400);
      updateView();
      return;
    }

    addCoins(8);
    try {
      localStorage.setItem(dailyRewardStorageKey, String(Date.now()));
    } catch {
      // ignore storage errors
    }
    showRealmMessage('+8 daily coins', 1800);
    updateHud();
    updateView();
  }

  function togglePause(force) {
    if ((blessingSelectionOpen || isCountdownActive()) && force !== false) return;
    paused = typeof force === 'boolean' ? force : !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    updateHud();
  }

  function markCheatUsed() {
    cheatsUsedThisRun = true;
  }

  function recordEndlessLeaderboardResult() {
    if (!endlessMode || leaderboardSavedThisLife) return;

    leaderboardSavedThisLife = true;
    const qualifies = !cheatsUsedThisRun || leaderboardAbuseMode;
    const result = {
      qualifies,
      cheated: cheatsUsedThisRun,
      override: leaderboardAbuseMode,
      rank: null,
      board: endlessLeaderboard.slice(0, 5)
    };

    if (qualifies) {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: (playerName || 'Player').slice(0, 18),
        score,
        level,
        round,
        cheated: cheatsUsedThisRun,
        override: leaderboardAbuseMode,
        createdAt: new Date().toISOString()
      };

      endlessLeaderboard = [...endlessLeaderboard, entry]
        .sort((a, b) => (b.score - a.score) || (b.level - a.level) || (b.round - a.round))
        .slice(0, 10);

      saveEndlessLeaderboard();
      const rank = endlessLeaderboard.findIndex(item => item.id === entry.id) + 1;
      result.rank = rank > 0 ? rank : null;
      result.board = endlessLeaderboard.slice(0, 5);
    }

    lastLeaderboardResult = result;
  }

  function triggerGameOver(message = 'Game Over') {
    if (gameOver) return;
    gameOver = true;
    paused = false;
    blessingSelectionOpen = false;
    clearCountdown();
    if (message) showRealmMessage(message, 1800);
    recordEndlessLeaderboardResult();
    updateHud();
  }

  function buildBlessingChoices(count = 3) {
    const pool = [
      { key: 'vigor', icon: '🛡️', title: 'Heavenly Vigor', desc: '+2 max HP and a heal burst', tag: 'HP' },
      { key: 'reflex', icon: '⚡', title: 'Seraph Reflex', desc: 'Move faster every tick', tag: 'SPD' },
      { key: 'luck', icon: '🍀', title: 'Lucky Halo', desc: 'Better heals and bonus XP gain', tag: 'LUCK' },
      { key: 'shield', icon: '✨', title: 'Guardian Shield', desc: 'Reduce incoming damage by 1', tag: 'DEF' },
      { key: 'bounty', icon: '💰', title: 'Golden Bounty', desc: 'Slightly better coin drops from apples', tag: 'COIN' },
      { key: 'smite', icon: '☄️', title: 'Smite Pulse', desc: 'Blast nearby threats right now', tag: 'AOE' }
    ];
    return pool.sort(() => Math.random() - 0.5).slice(0, count);
  }

  function renderBlessingChoices() {
    if (!abilityChoicesEl) return;
    abilityChoicesEl.innerHTML = '';

    currentBlessingOptions.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ability-card';
      button.innerHTML = `
        <span class="ability-icon">${option.icon}</span>
        <span class="ability-title">${index + 1}. ${option.title}</span>
        <span class="ability-desc">${option.desc}</span>
        <span class="ability-tag">${option.tag}</span>
      `;
      button.addEventListener('click', () => chooseBlessing(option.key));
      abilityChoicesEl.appendChild(button);
    });
  }

  function openBlessingSelection() {
    if (!angelRealm || pendingBlessingChoices <= 0 || blessingSelectionOpen) return;
    currentBlessingOptions = buildBlessingChoices(3);
    blessingSelectionOpen = true;
    paused = true;
    accumulator = 0;
    renderBlessingChoices();
    updateHud();
  }

  function applyBlessing(key) {
    switch (key) {
      case 'vigor':
        abilities.vigor += 1;
        playerHealth = Math.min(maxHealth + 2, playerHealth + 2);
        break;
      case 'reflex':
        abilities.reflex += 1;
        break;
      case 'luck':
        abilities.luck += 1;
        addCoins(2);
        xp += 3;
        break;
      case 'shield':
        abilities.shield += 1;
        playerHealth = Math.min(maxHealth, playerHealth + 1);
        break;
      case 'bounty':
        abilities.bounty += 1;
        addCoins(3);
        score += 5;
        break;
      case 'smite':
        obstacles.splice(0, Math.min(3, obstacles.length));
        angels.splice(0, Math.min(2, angels.length));
        generalAngels.splice(0, Math.min(1, generalAngels.length));
        if (snake[0]) emitParticles(snake[0].x, snake[0].y, 20, ['rgba(255,255,255,0.98)', 'rgba(255,226,105,0.95)']);
        score += 12;
        break;
      default:
        break;
    }

    recalcStats();
    tickMs = getSpeedForState();
  }

  function chooseBlessing(key) {
    const picked = currentBlessingOptions.find(option => option.key === key);
    if (!picked) return;

    applyBlessing(key);
    pendingBlessingChoices = Math.max(0, pendingBlessingChoices - 1);
    currentBlessingOptions = [];
    blessingSelectionOpen = false;
    paused = false;
    accumulator = 0;
    showRealmMessage(`${picked.title} chosen`, 1600);
    updateHud();

    if (pendingBlessingChoices > 0) openBlessingSelection();
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function roundedRectPath(x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y + h - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  function endsWithSequence(sequence) {
    if (keyBuffer.length < sequence.length) return false;
    return sequence.every((char, index) => keyBuffer[keyBuffer.length - sequence.length + index] === char);
  }

  function queueTurn(turn) {
    const reference = directionQueue.length ? directionQueue[directionQueue.length - 1] : nextDirection;
    if (reference.x === turn.x && reference.y === turn.y) return;
    if (snake.length > 1 && reference.x === -turn.x && reference.y === -turn.y) return;
    directionQueue.push(turn);
    if (directionQueue.length > 3) directionQueue.shift();
  }

  function setDockLabel(button, fullLabel, visibleLabel = fullLabel) {
    if (!button) return;
    button.dataset.label = fullLabel;
    button.title = fullLabel;
    button.setAttribute('aria-label', fullLabel);
    const textEl = button.querySelector('.dock-text');
    if (textEl) textEl.textContent = visibleLabel;
  }

  function setDockBadge(button, value = '') {
    if (!button) return;
    if (value === '' || value === null || value === undefined) {
      button.removeAttribute('data-badge');
      return;
    }
    button.dataset.badge = String(value);
  }

  function updateView() {
    const inCheatRoom = window.location.hash === '#cheats';
    const onHome = currentScreen === 'home';
    if (!onHome) {
      shopOpen = false;
      infoPanel = '';
    }

    if (playerNameLabel) playerNameLabel.textContent = playerName;
    if (coinBankLabel) coinBankLabel.textContent = String(coins);
    if (shopCoinLabel) shopCoinLabel.textContent = String(coins);
    if (gameModeLabel) {
      gameModeLabel.textContent = angelRealm ? 'Angel Realm' : (endlessMode ? 'Endless Run' : 'Normal Run');
    }
    if (gameOverTitleEl) {
      gameOverTitleEl.textContent = endlessMode ? 'Endless Run Over' : 'Game Over';
    }
    setDockLabel(leaderboardBtn, 'Leaderboard', 'Ranks');
    setDockBadge(leaderboardBtn);
    setDockLabel(guideBtn, 'Guide', 'Guide');
    setDockBadge(guideBtn);
    const spinReady = Date.now() >= spinReadyAt;
    setDockLabel(spinBtn, spinReady ? 'Lucky Spin' : `Spin ${spinCooldownLabel()}`, 'Spin');
    if (spinBtn) spinBtn.classList.toggle('reward-ready', spinReady);
    setDockBadge(spinBtn, spinReady ? '!' : '');
    setDockLabel(changeNameBtn, 'Change name', 'Name');
    setDockBadge(changeNameBtn);
    const eventReady = challengeState?.event && challengeState.event.progress >= challengeState.event.target && !challengeState.event.claimed;
    const missionReadyCount = (challengeState?.missions || []).filter(mission => mission.progress >= mission.target && !mission.claimed).length;
    const missionBadge = missionReadyCount ? missionReadyCount : (missionStreak.count > 0 ? `S${missionStreak.count}` : '');
    const missionLabel = missionReadyCount
      ? `Missions ${missionReadyCount} ready • Streak ${missionStreak.count}`
      : (missionStreak.count > 0 ? `Missions • Streak ${missionStreak.count}` : 'Missions');
    setDockLabel(eventsBtn, eventReady ? 'Event Ready' : 'Events', 'Events');
    if (eventsBtn) eventsBtn.classList.toggle('reward-ready', !!eventReady);
    setDockBadge(eventsBtn, eventReady ? '!' : '');
    setDockLabel(missionsBtn, missionLabel, 'Tasks');
    if (missionsBtn) missionsBtn.classList.toggle('reward-ready', missionReadyCount > 0);
    setDockBadge(missionsBtn, missionBadge);
    setDockLabel(shopBtn, 'Shop', 'Shop');
    setDockBadge(shopBtn);
    if (dailyRewardBtn) {
      const rewardState = getDailyRewardState();
      dailyRewardBtn.disabled = false;
      dailyRewardBtn.classList.toggle('reward-ready', rewardState.ready);
      setDockLabel(dailyRewardBtn, rewardState.ready ? 'Daily reward ready' : `Daily reward in ${rewardState.label}`, rewardState.ready ? 'Ready' : rewardState.shortLabel);
      setDockBadge(dailyRewardBtn, rewardState.ready ? '!' : '');
    }
    if (fullscreenBtn) {
      const label = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
      setDockLabel(fullscreenBtn, label, 'Full');
      setDockBadge(fullscreenBtn);
    }
    if (pauseBtn) {
      pauseBtn.textContent = paused && !blessingSelectionOpen ? 'Resume' : 'Pause';
      pauseBtn.disabled = blessingSelectionOpen || gameOver || isCountdownActive();
    }
    if (realmXpWrap) {
      const showRealmXp = currentScreen === 'game' && !inCheatRoom && angelRealm && !gameOver;
      realmXpWrap.classList.toggle('hidden', !showRealmXp);
    }

    renderShop();
    renderInfoPanel();

    if (infoOverlay) infoOverlay.classList.toggle('hidden', !infoPanel || !onHome);
    if (shopOverlay) shopOverlay.classList.toggle('hidden', !shopOpen || !onHome);
    if (abilityOverlay) abilityOverlay.classList.toggle('hidden', !blessingSelectionOpen || currentScreen !== 'game' || inCheatRoom);
    if (gameOverOverlay) gameOverOverlay.classList.toggle('hidden', currentScreen !== 'game' || inCheatRoom || !gameOver);
    if (homePage) homePage.classList.toggle('hidden', !onHome);
    gamePage.classList.toggle('hidden', currentScreen !== 'game' || inCheatRoom);
    cheatPage.classList.toggle('hidden', currentScreen !== 'game' || !inCheatRoom);
  }

  function currentMaxRounds() {
    return angelRealm ? angelMaxRounds : maxRounds;
  }

  function currentMaxLevels() {
    if (endlessMode && !angelRealm) return Number.POSITIVE_INFINITY;
    return angelRealm ? angelMaxLevels : maxLevels;
  }

  function startMode(mode = 'normal') {
    endlessMode = mode === 'endless';
    currentScreen = 'game';
    shopOpen = false;
    window.location.hash = '';
    resetGame();
    showRealmMessage(endlessMode ? 'Endless mode' : 'Normal mode', 1200);
    updateView();
  }

  function returnHome() {
    currentScreen = 'home';
    shopOpen = false;
    window.location.hash = '';
    clearCountdown();
    togglePause(false);
    updateView();
  }

  function changePlayerName() {
    const entered = window.prompt('Enter your name', playerName);
    if (entered === null) return;

    const cleaned = entered.trim().slice(0, 18) || 'Player';
    playerName = cleaned;
    try {
      localStorage.setItem('snakePlayerName', playerName);
    } catch {
      // ignore storage errors
    }
    updateView();
  }

  function showRealmMessage(message, duration = 1600) {
    realmMessage = message;
    realmMessageUntil = performance.now() + duration;
  }

  function recalcStats() {
    maxHealth = (jackpotMode ? 14 : 10) + abilities.vigor * 2;
    if (playerHealth > maxHealth) playerHealth = maxHealth;
  }

  function gainXp(amount) {
    if (amount <= 0 || !angelRealm) return;
    const earnedBase = jackpotMode && jackpotHud.mode === '%XP' ? Math.ceil(amount * 1.5) : amount;
    const earned = earnedBase + abilities.luck;
    xp += earned;

    let leveledUp = false;
    while (xp >= xpLevel * 25) {
      xp -= xpLevel * 25;
      xpLevel += 1;
      pendingBlessingChoices += 1;
      leveledUp = true;
    }

    if (leveledUp) {
      playerHealth = Math.min(maxHealth, playerHealth + 1 + abilities.luck);
      tickMs = getSpeedForState();
      showRealmMessage('Level up! Choose a blessing', 2200);
      openBlessingSelection();
    }
  }

  function emitParticles(cellX, cellY, count = 8, colors = ['rgba(255,240,140,0.95)', 'rgba(255,255,255,0.95)']) {
    const size = currentCellSize();
    const cx = (cellX + 0.5) * size;
    const cy = (cellY + 0.5) * size;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * (1.6 + Math.random() * 2),
        vy: (Math.random() - 0.5) * (1.6 + Math.random() * 2),
        life: 12 + Math.random() * 18,
        radius: 1.5 + Math.random() * 2.5,
        color: colors[i % colors.length]
      });
    }
  }

  function applyDamage(amount, hitX, hitY) {
    if (invincible || amount <= 0) return;
    const reducedAmount = Math.max(1, amount - abilities.shield);
    playerHealth = Math.max(0, playerHealth - reducedAmount);
    emitParticles(hitX, hitY, 10, ['rgba(255,255,255,0.95)', 'rgba(255,225,120,0.9)']);
    if (playerHealth <= 0) {
      triggerGameOver('Fallen in the Angel Realm');
    }
    updateHud();
  }

  function enterAngelRealm() {
    markCheatUsed();
    currentScreen = 'game';
    angelRealm = true;
    xp = 0;
    xpLevel = 1;
    abilities = { vigor: 0, reflex: 0, luck: 0, shield: 0, bounty: 0 };
    recalcStats();
    playerHealth = maxHealth;
    showRealmMessage('Angel Realm awakened', 2200);
    resetGame(true);
    updateView();
  }

  function getSpeedForState() {
    const sizeGrowth = currentGridSize() - baseGridSize;
    const mapSpeedBoost = sizeGrowth * 4;
    const roundSpeedBoost = (round - 1) * 2;
    const levelSpeedBoost = (level - 1) * 2;
    const naturalTick = Math.max(minMapTickMs, baseTickMs - mapSpeedBoost - roundSpeedBoost - levelSpeedBoost - abilities.reflex * 6 - (angelRealm ? 8 : 0));
    return Math.max(minAbsoluteTickMs, Math.floor(naturalTick * Math.pow(0.84, speedLevel)));
  }

  function obstacleTargetForState() {
    const grid = currentGridSize();
    const limit = Math.max(2, Math.floor((grid * grid) / 5));
    return Math.min(limit, level + Math.floor((round - 1) / 2));
  }

  function cellKey(x, y) {
    return `${x},${y}`;
  }

  function canReachCell(start, target, obstacleList = obstacles, allowWrap = false) {
    if (!start || !target) return false;

    const grid = currentGridSize();
    const blocked = new Set(obstacleList.map(ob => cellKey(ob.x, ob.y)));
    snake.slice(0, -1).forEach(seg => blocked.add(cellKey(seg.x, seg.y)));
    blocked.delete(cellKey(start.x, start.y));
    blocked.delete(cellKey(target.x, target.y));

    const visited = new Set([cellKey(start.x, start.y)]);
    const queue = [{ x: start.x, y: start.y }];
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    while (queue.length) {
      const current = queue.shift();
      if (current.x === target.x && current.y === target.y) return true;

      for (const dir of directions) {
        let nx = current.x + dir.x;
        let ny = current.y + dir.y;

        if (allowWrap) {
          if (nx < 0) nx = grid - 1;
          if (nx >= grid) nx = 0;
          if (ny < 0) ny = grid - 1;
          if (ny >= grid) ny = 0;
        } else if (nx < 0 || nx >= grid || ny < 0 || ny >= grid) {
          continue;
        }

        const key = cellKey(nx, ny);
        if (visited.has(key) || blocked.has(key)) continue;
        visited.add(key);
        queue.push({ x: nx, y: ny });
      }
    }

    return false;
  }

  function countOpenNeighbors(x, y, obstacleList = obstacles, allowWrap = false) {
    const grid = currentGridSize();
    const blocked = new Set(obstacleList.map(ob => cellKey(ob.x, ob.y)));
    snake.slice(0, -1).forEach(seg => blocked.add(cellKey(seg.x, seg.y)));

    return [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ].reduce((count, dir) => {
      let nx = x + dir.x;
      let ny = y + dir.y;

      if (allowWrap) {
        if (nx < 0) nx = grid - 1;
        if (nx >= grid) nx = 0;
        if (ny < 0) ny = grid - 1;
        if (ny >= grid) ny = 0;
      } else if (nx < 0 || nx >= grid || ny < 0 || ny >= grid) {
        return count;
      }

      return blocked.has(cellKey(nx, ny)) ? count : count + 1;
    }, 0);
  }

  function randomEmptyCell(preferReachable = false) {
    const grid = currentGridSize();
    const options = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const occupiedBySnake = snake.some(seg => seg.x === x && seg.y === y);
        const occupiedByObstacle = obstacles.some(ob => ob.x === x && ob.y === y);
        const occupiedByFood = food && food.x === x && food.y === y;
        const occupiedByBonus = bonusApples.some(ap => ap.x === x && ap.y === y);
        const occupiedByAngel = angels.some(enemy => enemy.x === x && enemy.y === y) || generalAngels.some(enemy => enemy.x === x && enemy.y === y);
        const occupiedByHeal = healOrb && healOrb.x === x && healOrb.y === y;
        const occupiedByAltar = altar && altar.x === x && altar.y === y;
        if (!occupiedBySnake && !occupiedByObstacle && !occupiedByFood && !occupiedByBonus && !occupiedByAngel && !occupiedByHeal && !occupiedByAltar) {
          options.push({ x, y });
        }
      }
    }

    const filtered = preferReachable && snake.length
      ? options.filter(cell => countOpenNeighbors(cell.x, cell.y) >= 1 && canReachCell(snake[0], cell, obstacles, false))
      : options;

    const pool = filtered.length ? filtered : options;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function spawnFoodIfMissing() {
    if (!boss?.active && !food) food = randomEmptyCell(true);
  }

  function ensureObstaclesForRound() {
    const grid = currentGridSize();
    const target = obstacleTargetForState();
    const nextObstacles = [];
    let attempts = 0;

    while (nextObstacles.length < target && attempts < grid * grid * 6) {
      const pos = randomEmptyCell();
      if (!pos || nextObstacles.some(ob => ob.x === pos.x && ob.y === pos.y)) {
        attempts += 1;
        continue;
      }

      const candidateObstacles = [...nextObstacles, pos];
      const headSafe = !snake[0] || countOpenNeighbors(snake[0].x, snake[0].y, candidateObstacles, false) >= 1;
      const foodSafe = !food || (
        countOpenNeighbors(food.x, food.y, candidateObstacles, false) >= 1 &&
        canReachCell(snake[0], food, candidateObstacles, false)
      );

      if (headSafe && foodSafe) {
        nextObstacles.push(pos);
      }

      attempts += 1;
    }

    obstacles = nextObstacles;
  }

  function spawnAngelEntities() {
    if (!angelRealm || boss?.active) return;

    const angelTarget = level >= 10 ? Math.min(1 + Math.floor((level - 10) / 4), 4) : 0;
    while (angels.length < angelTarget) {
      const pos = randomEmptyCell();
      if (!pos) break;
      angels.push({ ...pos, lastShotAt: 0, moveCooldown: randomBetween(2, 5) });
    }

    const generalTarget = round >= 20 ? Math.min(1 + Math.floor((round - 20) / 10), 3) : 0;
    while (generalAngels.length < generalTarget) {
      const pos = randomEmptyCell();
      if (!pos) break;
      generalAngels.push({ ...pos, lastShotAt: 0, lastGrenadeAt: 0, moveCooldown: randomBetween(2, 4) });
    }

    if (!healOrb && Math.random() < 0.1) {
      healOrb = randomEmptyCell();
    }
  }

  function startBossFight() {
    if (boss?.active) return;
    angels = [];
    generalAngels = [];
    projectiles = [];
    grenades = [];
    trackingLasers = [];
    skyBeams = [];
    healOrb = null;
    food = null;
    boss = {
      name: 'Arch Angle',
      hp: 150,
      maxHp: 150,
      x: Math.max(2, Math.floor(currentGridSize() / 2)),
      y: 1,
      dir: 1,
      floatSeed: Math.random() * Math.PI * 2,
      lastVolleyAt: 0,
      lastGrenadeAt: 0,
      lastAltarAt: 0,
      lastLaserAt: 0,
      lastBeamAt: 0,
      active: true
    };
    altar = randomEmptyCell();
    showRealmMessage('Arch Angle descends', 2400);
  }

  function setupLevel(resetSnakePosition = true) {
    obstacles = [];
    bonusApples = [];
    food = null;
    if (resetSnakePosition) {
      const center = Math.floor(currentGridSize() / 2);
      snake = [{ x: center, y: center }, { x: center - 1, y: center }];
      prevSnake = snake.map(seg => ({ ...seg }));
      direction = { x: 1, y: 0 };
      nextDirection = { x: 1, y: 0 };
    }
    if (!boss?.active) {
      spawnFoodIfMissing();
      ensureObstaclesForRound();
      spawnAngelEntities();
    } else {
      ensureObstaclesForRound();
    }
  }

  function scheduleTongue(now = performance.now()) {
    nextTongueAt = now + randomBetween(5000, 12000);
    tongueVisibleUntil = 0;
  }

  function resetGame(preserveCheatState = false, useCountdown = currentScreen === 'game') {
    score = 0;
    round = 1;
    level = 1;
    gameOver = false;
    paused = false;
    invincible = false;
    autoAim = false;
    speedLevel = 0;
    keyBuffer = [];
    directionQueue = [];
    activePortals = [];
    angels = [];
    generalAngels = [];
    projectiles = [];
    grenades = [];
    healOrb = null;
    altar = null;
    boss = null;
    particles = [];
    trackingLasers = [];
    skyBeams = [];
    comboCount = 0;
    comboTimer = 0;
    pendingBlessingChoices = 0;
    currentBlessingOptions = [];
    blessingSelectionOpen = false;
    leaderboardSavedThisLife = false;
    lastLeaderboardResult = null;
    if (!preserveCheatState) {
      leaderboardAbuseMode = false;
      cheatsUsedThisRun = !!jackpotMode;
    }
    recalcStats();
    playerHealth = maxHealth;
    setupLevel(true);
    tickMs = getSpeedForState();
    accumulator = 0;
    scheduleTongue();
    if (useCountdown) startCountdown();
    else clearCountdown();
    updateHud();
  }

  function reviveGame() {
    if (!gameOver) return;
    gameOver = false;
    leaderboardSavedThisLife = false;
    lastLeaderboardResult = null;
    const center = Math.floor(currentGridSize() / 2);
    snake = [{ x: center, y: center }, { x: Math.max(0, center - 1), y: center }];
    prevSnake = snake.map(seg => ({ ...seg }));
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    directionQueue = [];
    projectiles = [];
    grenades = [];
    trackingLasers = [];
    skyBeams = [];
    playerHealth = Math.max(1, Math.ceil(maxHealth * 0.6));
    scheduleTongue();
    startCountdown();
    updateHud();
  }

  function fillWorldWithApples() {
    bonusApples = [];
    const grid = currentGridSize();
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const occupiedBySnake = snake.some(seg => seg.x === x && seg.y === y);
        const occupiedByObstacle = obstacles.some(ob => ob.x === x && ob.y === y);
        const isMainFood = food && food.x === x && food.y === y;
        if (!occupiedBySnake && !occupiedByObstacle && !isMainFood) {
          bonusApples.push({ x, y });
        }
      }
    }
    draw(performance.now());
  }

  function updateHud() {
    const tags = [];
    if (angelRealm) tags.push('angel realm');
    if (boss?.active) tags.push('boss');
    if (jackpotMode) tags.push('jackpot');
    if (leaderboardAbuseMode) tags.push('lb override');
    if (blessingSelectionOpen) tags.push('choose blessing');
    else if (isCountdownActive()) tags.push('starting');
    else if (paused) tags.push('paused');
    if (invincible) tags.push('invincible');
    if (autoAim) tags.push('aimbot');
    if (speedLevel > 0) tags.push(`fast x${speedLevel}`);
    if (speedLevel < 0) tags.push(`slow x${Math.abs(speedLevel)}`);
    if (!tags.length) tags.push('playing');
    if (gameOver) {
      tags.length = 0;
      tags.push('game over');
    }

    syncBestScore();
    if (levelEl) levelEl.textContent = String(level);
    if (roundEl) roundEl.textContent = String(round);
    if (scoreEl) scoreEl.textContent = String(score);
    if (bestScoreEl) bestScoreEl.textContent = String(bestScore);
    if (coinsEl) coinsEl.textContent = String(coins);
    if (comboEl) comboEl.textContent = comboCount > 1 ? `x${comboCount}` : 'x1';
    if (mapSizeEl) {
      const size = currentGridSize();
      mapSizeEl.textContent = `${size}x${size}`;
    }
    if (levelCapEl) levelCapEl.textContent = Number.isFinite(currentMaxLevels()) ? String(currentMaxLevels()) : '∞';
    if (roundCapEl) roundCapEl.textContent = String(currentMaxRounds());
    if (healthEl) healthEl.textContent = `${playerHealth}/${maxHealth}`;
    if (xpEl) xpEl.textContent = angelRealm ? `${xp} • Lv ${xpLevel}` : '';
    if (statusEl) statusEl.textContent = tags.join(' + ');
    updateView();
  }

  function scheduleSpeedCommandParse() {
    if (pendingSpeedTimer) clearTimeout(pendingSpeedTimer);

    pendingSpeedTimer = setTimeout(() => {
      const bufferString = keyBuffer.join('');
      if (bufferString === lastProcessedSpeedBuffer) return;

      if (/zoom\s*normal$/.test(bufferString) || /unzoom\s*normal$/.test(bufferString)) {
        markCheatUsed();
        speedLevel = 0;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
        return;
      }

      const zoomMatch = bufferString.match(/zoom\s*(\d+)?$/);
      const unzoomMatch = bufferString.match(/unzoom\s*(\d+)?$/);

      if (zoomMatch) {
        markCheatUsed();
        const typedValue = zoomMatch[1] ? Number.parseInt(zoomMatch[1], 10) : 1;
        const amount = Math.max(1, typedValue || 1);
        speedLevel += amount;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
      } else if (unzoomMatch) {
        markCheatUsed();
        const typedValue = unzoomMatch[1] ? Number.parseInt(unzoomMatch[1], 10) : 1;
        const amount = Math.max(1, typedValue || 1);
        speedLevel -= amount;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
      }
    }, 1000);
  }

  function advanceProgress() {
    const maxRoundCount = currentMaxRounds();
    const maxLevelCount = currentMaxLevels();

    if (round < maxRoundCount) {
      round += 1;
      updateChallengeProgress('rounds', 1);
      if (endlessMode) updateChallengeProgress('endless', 1);
      obstacles = [];
      spawnFoodIfMissing();
      ensureObstaclesForRound();
      spawnAngelEntities();
    } else if (level < maxLevelCount) {
      level += 1;
      if (level === boardGrowthCapLevel() + 1) {
        showRealmMessage('Board size cap reached', 1800);
      }
      round = 1;
      activePortals = [];
      angels = [];
      generalAngels = [];
      projectiles = [];
      grenades = [];
      healOrb = null;
      setupLevel(true);
    } else if (angelRealm) {
      startBossFight();
    } else {
      food = randomEmptyCell(true);
    }
    gainXp(angelRealm ? 6 : 0);
    tickMs = getSpeedForState();
    updateHud();
  }

  function createPortalPair(entry, exit) {
    const now = performance.now();
    activePortals.push(
      { ...entry, start: now, duration: 1200 },
      { ...exit, start: now, duration: 1200 }
    );
  }

  function wrapPositionForPortal(x, y) {
    const grid = currentGridSize();
    let wrappedX = x;
    let wrappedY = y;

    if (wrappedX < 0) wrappedX = grid - 1;
    if (wrappedX >= grid) wrappedX = 0;
    if (wrappedY < 0) wrappedY = grid - 1;
    if (wrappedY >= grid) wrappedY = 0;

    return { x: wrappedX, y: wrappedY };
  }

  function portalDistanceScore(fromX, fromY, toX, toY) {
    const grid = currentGridSize();
    const dx = Math.abs(fromX - toX);
    const dy = Math.abs(fromY - toY);

    if (invincible) {
      return Math.min(dx, grid - dx) + Math.min(dy, grid - dy);
    }

    return dx + dy;
  }

  function dangerScoreAtCell(x, y) {
    if (invincible) return 0;

    let score = 0;
    const centerX = x + 0.5;
    const centerY = y + 0.5;

    projectiles.forEach(projectile => {
      const dist = Math.hypot(projectile.x - centerX, projectile.y - centerY);
      if (dist < 0.75) score += projectile.persist ? 140 : 90;
    });

    trackingLasers.forEach(laser => {
      const dist = Math.hypot(laser.x - centerX, laser.y - centerY);
      if (dist < 0.85) score += 180;
    });

    skyBeams.forEach(beam => {
      if (beam.x === x) score += beam.warning > 0 ? 40 : 220;
    });

    grenades.forEach(grenade => {
      const inBlast = Math.abs(grenade.x - x) <= grenade.radius && Math.abs(grenade.y - y) <= grenade.radius;
      const nearBlast = Math.abs(grenade.x - x) <= grenade.radius + 1 && Math.abs(grenade.y - y) <= grenade.radius + 1;

      if (grenade.exploding > 0 && inBlast) score += 220;
      else if (grenade.timer <= 2 && nearBlast) score += 140;
      else if (grenade.timer <= 5 && nearBlast) score += 45;
    });

    return score;
  }

  function chooseAutoDirection() {
    if (!autoAim || (!food && !altar) || !snake.length) return;

    const targetFood = altar || food;
    const head = snake[0];
    const options = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    const grid = currentGridSize();
    const evaluated = options.map(dir => {
      if (direction.x === -dir.x && direction.y === -dir.y && snake.length > 1) return null;

      const rawX = head.x + dir.x;
      const rawY = head.y + dir.y;

      if ((rawX < 0 || rawX >= grid || rawY < 0 || rawY >= grid) && !invincible) return null;

      const wrapped = wrapPositionForPortal(rawX, rawY);
      const hitsObstacle = obstacles.some(ob => ob.x === wrapped.x && ob.y === wrapped.y);
      if (!invincible && hitsObstacle) return null;

      const body = snake.slice(0, -1);
      const hitsBody = body.some(seg => seg.x === wrapped.x && seg.y === wrapped.y);
      if (!invincible && hitsBody) return null;

      const routeDistance = invincible
        ? portalDistanceScore(wrapped.x, wrapped.y, targetFood.x, targetFood.y)
        : (canReachCell({ x: wrapped.x, y: wrapped.y }, targetFood, obstacles, false)
          ? portalDistanceScore(wrapped.x, wrapped.y, targetFood.x, targetFood.y)
          : Number.POSITIVE_INFINITY);

      return {
        dir,
        x: wrapped.x,
        y: wrapped.y,
        hazard: dangerScoreAtCell(wrapped.x, wrapped.y),
        distance: routeDistance,
        exits: countOpenNeighbors(wrapped.x, wrapped.y, obstacles, invincible)
      };
    }).filter(Boolean);

    if (!evaluated.length) return;

    const safeMoves = invincible ? evaluated : evaluated.filter(option => option.hazard === 0 && Number.isFinite(option.distance));
    const candidates = safeMoves.length ? safeMoves : evaluated;

    candidates.sort((a, b) => {
      if (!invincible && a.hazard !== b.hazard) return a.hazard - b.hazard;
      if (a.distance !== b.distance) return a.distance - b.distance;
      if (a.exits !== b.exits) return b.exits - a.exits;

      const aStraight = a.dir.x === direction.x && a.dir.y === direction.y ? 0 : 1;
      const bStraight = b.dir.x === direction.x && b.dir.y === direction.y ? 0 : 1;
      return aStraight - bStraight;
    });

    nextDirection = candidates[0].dir;
  }

  function fireProjectile(fromX, fromY, targetX, targetY, speed = 0.35, damage = 1, color = 'rgba(255,248,180,0.95)', persist = false) {
    const dx = targetX + 0.5 - (fromX + 0.5);
    const dy = targetY + 0.5 - (fromY + 0.5);
    const length = Math.hypot(dx, dy) || 1;
    projectiles.push({
      x: fromX + 0.5,
      y: fromY + 0.5,
      vx: (dx / length) * speed,
      vy: (dy / length) * speed,
      damage,
      life: persist ? 9999 : 42,
      cooldown: 0,
      persist,
      color
    });
    if (projectiles.length > 160) projectiles.shift();
  }

  function spawnTrackingLaser(originX, originY) {
    trackingLasers.push({
      x: originX + 0.5,
      y: originY + 0.5,
      vx: 0,
      vy: 0,
      life: 180,
      cooldown: 0
    });
    if (trackingLasers.length > 16) trackingLasers.shift();
  }

  function spawnSkyBeam(columnX, damage = 1) {
    skyBeams.push({
      x: Math.max(0, Math.min(currentGridSize() - 1, Math.round(columnX))),
      warning: 20,
      active: 10,
      damage,
      hitDone: false
    });
    if (skyBeams.length > 18) skyBeams.shift();
  }

  function moveEnemyWander(enemy, pace = 4) {
    if (enemy.moveCooldown == null) enemy.moveCooldown = pace;
    if (enemy.moveCooldown > 0) {
      enemy.moveCooldown -= 1;
      return;
    }

    enemy.moveCooldown = pace + randomBetween(0, 2);
    const options = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ].sort(() => Math.random() - 0.5);

    for (const option of options) {
      const nx = enemy.x + option.x;
      const ny = enemy.y + option.y;
      const blocked = obstacles.some(ob => ob.x === nx && ob.y === ny) ||
        angels.some(other => other !== enemy && other.x === nx && other.y === ny) ||
        generalAngels.some(other => other !== enemy && other.x === nx && other.y === ny);
      if (!blocked && nx >= 0 && ny >= 0 && nx < currentGridSize() && ny < currentGridSize()) {
        enemy.x = nx;
        enemy.y = ny;
        break;
      }
    }
  }

  function updateAngelRealmThreats() {
    const now = performance.now();
    const vulnerable = snake.slice(0, Math.min(4, snake.length));

    if (angelRealm && !gameOver) {
      const targetX = Math.max(0, Math.min(currentGridSize() - 1, snake[0].x + direction.x * 2));
      const targetY = Math.max(0, Math.min(currentGridSize() - 1, snake[0].y + direction.y * 2));

      angels.forEach(enemy => {
        moveEnemyWander(enemy, 6);
        if (now - enemy.lastShotAt >= 5000) {
          fireProjectile(enemy.x, enemy.y, targetX, targetY, 0.34, 1, 'rgba(255,242,166,0.95)');
          enemy.lastShotAt = now;
        }
      });

      generalAngels.forEach(enemy => {
        moveEnemyWander(enemy, 5);
        if (now - enemy.lastShotAt >= 2000) {
          fireProjectile(enemy.x, enemy.y, targetX, targetY, 0.42, 1, 'rgba(255,255,255,0.95)');
          enemy.lastShotAt = now;
        }
        if (now - enemy.lastGrenadeAt >= 5000) {
          grenades.push({ x: targetX, y: targetY, timer: Math.max(12, Math.round(5000 / Math.max(40, tickMs))), damage: 2, radius: 1, exploding: 0 });
          enemy.lastGrenadeAt = now;
        }
      });

      if (boss?.active) {
        boss.x += boss.dir * 0.12;
        if (boss.x <= 2 || boss.x >= currentGridSize() - 3) boss.dir *= -1;

        if (now - boss.lastVolleyAt >= 1400) {
          const volleyCount = randomBetween(4, 9);
          for (let i = 0; i < volleyCount; i++) {
            fireProjectile(boss.x + (i % 3) - 1, boss.y + 1, targetX + randomBetween(-3, 3), targetY + randomBetween(-2, 2), 0.32, 1, 'rgba(255,236,120,0.95)', true);
          }
          boss.lastVolleyAt = now;
        }

        if (now - boss.lastLaserAt >= 2600) {
          spawnTrackingLaser(boss.x, boss.y + 1);
          if (Math.random() < 0.5) spawnTrackingLaser(boss.x + randomBetween(-1, 1), boss.y + 1);
          boss.lastLaserAt = now;
        }

        if (now - boss.lastBeamAt >= 2200) {
          const beamCount = randomBetween(1, 3);
          for (let i = 0; i < beamCount; i++) {
            spawnSkyBeam(targetX + randomBetween(-2, 2), 1);
          }
          boss.lastBeamAt = now;
        }

        if (now - boss.lastGrenadeAt >= 2800) {
          const grenadeCount = randomBetween(1, 5);
          for (let i = 0; i < grenadeCount; i++) {
            grenades.push({ x: Math.max(1, Math.min(currentGridSize() - 2, targetX + randomBetween(-2, 2))), y: Math.max(1, Math.min(currentGridSize() - 2, targetY + randomBetween(-2, 2))), timer: Math.max(10, Math.round(5000 / Math.max(40, tickMs))), damage: 2, radius: 1, exploding: 0 });
          }
          boss.lastGrenadeAt = now;
        }

        if (!altar && now - boss.lastAltarAt >= 2200) {
          altar = randomEmptyCell();
          boss.lastAltarAt = now;
        }
      }
    }

    projectiles = projectiles.filter(projectile => {
      const grid = currentGridSize();
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      if (projectile.cooldown > 0) projectile.cooldown -= 1;
      if (!projectile.persist) projectile.life -= 1;

      if (projectile.persist) {
        if (projectile.x < 0) projectile.x += grid;
        if (projectile.y < 0) projectile.y += grid;
        if (projectile.x >= grid) projectile.x -= grid;
        if (projectile.y >= grid) projectile.y -= grid;
      }

      const hit = projectile.cooldown <= 0 && vulnerable.find(seg => seg.x === Math.floor(projectile.x) && seg.y === Math.floor(projectile.y));
      if (hit) {
        applyDamage(projectile.damage, hit.x, hit.y);
        projectile.cooldown = 8;
        if (!projectile.persist) return false;
      }
      return projectile.persist || (projectile.life > 0 && projectile.x >= -1 && projectile.y >= -1 && projectile.x <= grid + 1 && projectile.y <= grid + 1);
    });

    trackingLasers = trackingLasers.filter(laser => {
      const grid = currentGridSize();
      const dx = snake[0].x + 0.5 - laser.x;
      const dy = snake[0].y + 0.5 - laser.y;
      const len = Math.hypot(dx, dy) || 1;
      laser.vx = laser.vx * 0.9 + (dx / len) * 0.04;
      laser.vy = laser.vy * 0.9 + (dy / len) * 0.04;
      laser.x += laser.vx;
      laser.y += laser.vy;
      laser.life -= 1;
      if (laser.cooldown > 0) laser.cooldown -= 1;

      if (laser.x < 0) laser.x += grid;
      if (laser.y < 0) laser.y += grid;
      if (laser.x >= grid) laser.x -= grid;
      if (laser.y >= grid) laser.y -= grid;

      const hit = laser.cooldown <= 0 && vulnerable.find(seg => Math.abs(seg.x + 0.5 - laser.x) < 0.45 && Math.abs(seg.y + 0.5 - laser.y) < 0.45);
      if (hit) {
        applyDamage(1, hit.x, hit.y);
        laser.cooldown = 10;
      }
      return laser.life > 0;
    });

    skyBeams = skyBeams.filter(beam => {
      if (beam.warning > 0) {
        beam.warning -= 1;
        return true;
      }

      if (!beam.hitDone) {
        const hit = vulnerable.some(seg => seg.x === beam.x || Math.abs(seg.x - beam.x) <= 0);
        if (hit) applyDamage(beam.damage, beam.x, snake[0].y);
        emitParticles(beam.x, Math.floor(currentGridSize() / 2), 18, ['rgba(255,255,255,0.98)', 'rgba(255,232,130,0.95)']);
        beam.hitDone = true;
      }

      beam.active -= 1;
      return beam.active > 0;
    });

    grenades = grenades.filter(grenade => {
      if (grenade.exploding > 0) {
        grenade.exploding -= 1;
        return grenade.exploding > 0;
      }
      grenade.timer -= 1;
      if (grenade.timer <= 0) {
        const hit = vulnerable.some(seg => Math.abs(seg.x - grenade.x) <= grenade.radius && Math.abs(seg.y - grenade.y) <= grenade.radius);
        emitParticles(grenade.x, grenade.y, 14, ['rgba(255,255,255,0.95)', 'rgba(255,226,105,0.95)']);
        if (hit) applyDamage(grenade.damage, grenade.x, grenade.y);
        grenade.exploding = 5;
      }
      return true;
    });
  }

  function step() {
    if (gameOver) return;

    prevSnake = snake.map(seg => ({ ...seg }));
    if (!autoAim && directionQueue.length) {
      nextDirection = directionQueue.shift();
    }
    chooseAutoDirection();
    direction = nextDirection;
    const head = snake[0];
    const grid = currentGridSize();
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (newHead.x < 0 || newHead.x >= grid || newHead.y < 0 || newHead.y >= grid) {
      if (invincible) {
        const from = { x: head.x, y: head.y };
        if (newHead.x < 0) {
          newHead.x = grid - 1;
          createPortalPair({ x: -0.18, y: from.y }, { x: grid - 0.82, y: from.y });
        } else if (newHead.x >= grid) {
          newHead.x = 0;
          createPortalPair({ x: grid - 0.82, y: from.y }, { x: -0.18, y: from.y });
        } else if (newHead.y < 0) {
          newHead.y = grid - 1;
          createPortalPair({ x: from.x, y: -0.18 }, { x: from.x, y: grid - 0.82 });
        } else if (newHead.y >= grid) {
          newHead.y = 0;
          createPortalPair({ x: from.x, y: grid - 0.82 }, { x: from.x, y: -0.18 });
        }
      } else {
        triggerGameOver(endlessMode ? 'Endless run over' : 'Wall crash');
        return;
      }
    }

    const ateMainFood = !!food && newHead.x === food.x && newHead.y === food.y;
    const bonusIndex = bonusApples.findIndex(ap => ap.x === newHead.x && ap.y === newHead.y);
    const ateBonusApple = bonusIndex !== -1;
    const obstacleIndex = obstacles.findIndex(ob => ob.x === newHead.x && ob.y === newHead.y);
    const angelIndex = angels.findIndex(enemy => enemy.x === newHead.x && enemy.y === newHead.y);
    const generalIndex = generalAngels.findIndex(enemy => enemy.x === newHead.x && enemy.y === newHead.y);
    const grabbedHeal = healOrb && healOrb.x === newHead.x && healOrb.y === newHead.y;
    const hitAltar = altar && altar.x === newHead.x && altar.y === newHead.y;
    if (obstacleIndex !== -1) {
      obstacles.splice(obstacleIndex, 1);
      if (invincible) {
        score += 3;
      } else {
        applyDamage(3, newHead.x, newHead.y);
        if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } catch (e) {
      console.error('Draw error:', e);
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function frame(now) {
    if (!lastFrameTime) lastFrameTime = now;
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    const countdownActive = isCountdownActive(now);

    if (countdownActive !== lastCountdownActive) {
      lastCountdownActive = countdownActive;
      updateHud();
    }

    if (!gameOver && !paused && !countdownActive && comboTimer > 0) {
      comboTimer -= delta;
      if (comboTimer <= 0 && comboCount !== 0) {
        comboCount = 0;
        updateHud();
      }
    }

    if (!gameOver && !paused && !countdownActive && window.location.hash !== '#cheats') {
      accumulator += delta;
      while (accumulator >= tickMs) {
        step();
        accumulator -= tickMs;
      }
    }

    draw(now);
    requestAnimationFrame(frame);
  }

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const movementKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
    if (movementKeys.includes(key)) event.preventDefault();

    if (blessingSelectionOpen) {
      if (['1', '2', '3'].includes(key)) {
        const picked = currentBlessingOptions[Number(key) - 1];
        if (picked) chooseBlessing(picked.key);
      }
      return;
    }

    keyBuffer.push(key);
    if (keyBuffer.length > 40) keyBuffer.shift();

    if (endsWithSequence(portalSequence)) {
      window.location.hash = '#cheats';
      updateView();
    }
    if (endsWithSequence(['g', 'o', 'd'])) {
      markCheatUsed();
      invincible = true;
      updateHud();
    }
    if (endsWithSequence(['a', 'n', 'g', 'e', 'l'])) {
      enterAngelRealm();
    }
    if (endsWithSequence(['j', 'a', 'c', 'k', 'p', 'o', 't'])) {
      markCheatUsed();
      jackpotMode = true;
      abilities.luck += 1;
      recalcStats();
      playerHealth = maxHealth;
      showRealmMessage('Jackpot skin unlocked', 1800);
      updateHud();
    }

    if (endsWithSequence('leaderboardabuse'.split(''))) {
      markCheatUsed();
      leaderboardAbuseMode = true;
      showRealmMessage('Leaderboard override armed', 1800);
      updateHud();
    }
    if (endsWithSequence(['h', 'e', 'a', 'l'])) {
      markCheatUsed();
      playerHealth = maxHealth;
      showRealmMessage('Full heal', 1200);
      updateHud();
    }
    if (endsWithSequence(['c', 'l', 'e', 'a', 'r'])) {
      markCheatUsed();
      obstacles = [];
      grenades = [];
      projectiles = [];
      trackingLasers = [];
      skyBeams = [];
      showRealmMessage('Arena cleared', 1200);
      updateHud();
    }
    if (endsWithSequence(['s', 'm', 'i', 't', 'e'])) {
      markCheatUsed();
      const removed = angels.length + generalAngels.length;
      angels = [];
      generalAngels = [];
      score += removed * 12;
      gainXp(removed * 8);
      addCoins(Math.ceil(removed / 2));
      emitParticles(snake[0].x, snake[0].y, 18, ['rgba(255,255,255,0.98)', 'rgba(255,236,120,0.95)']);
      showRealmMessage('Smite!', 1200);
      updateHud();
    }
    if (endsWithSequence(['h', 'a', 'l', 'o'])) {
      markCheatUsed();
      abilities.vigor += 1;
      abilities.reflex += 1;
      recalcStats();
      playerHealth = maxHealth;
      tickMs = getSpeedForState();
      showRealmMessage('Halo blessing', 1400);
      updateHud();
    }
    if (endsWithSequence(['b', 'l', 'e', 's', 's'])) {
      markCheatUsed();
      healOrb = randomEmptyCell();
      gainXp(15);
      showRealmMessage('Blessing dropped', 1400);
      updateHud();
    }
    if (endsWithSequence(['n', 'e', 'x', 't'])) {
      markCheatUsed();
      advanceProgress();
      showRealmMessage('Round skipped', 1200);
    }

    scheduleSpeedCommandParse();

    if (endsWithSequence(['f', 'o', 'o', 'd'])) {
      markCheatUsed();
      fillWorldWithApples();
    }
    if (endsWithSequence(['a', 'i', 'm']) || endsWithSequence(['a', 'i', 'm', 'b', 'o', 't'])) {
      markCheatUsed();
      autoAim = !autoAim;
      updateHud();
    }

    if ((key === 'p' || key === ' ') && currentScreen === 'game' && window.location.hash !== '#cheats' && !gameOver) {
      event.preventDefault();
      togglePause();
      return;
    }

    if (key === 'r' && gameOver) {
      reviveGame();
      return;
    }

    if (key === 'arrowup' || key === 'w') queueTurn({ x: 0, y: -1 });
    if (key === 'arrowdown' || key === 's') queueTurn({ x: 0, y: 1 });
    if (key === 'arrowleft' || key === 'a') queueTurn({ x: -1, y: 0 });
    if (key === 'arrowright' || key === 'd') queueTurn({ x: 1, y: 0 });
  });

  window.addEventListener('hashchange', updateView);
  document.addEventListener('fullscreenchange', updateView);
  backBtn.addEventListener('click', () => {
    window.location.hash = '';
    updateView();
  });
  restartBtn.addEventListener('click', () => resetGame());
  if (pauseBtn) pauseBtn.addEventListener('click', () => togglePause());
  if (homeBtn) homeBtn.addEventListener('click', returnHome);
  if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => resetGame());
  if (gameOverHomeBtn) gameOverHomeBtn.addEventListener('click', returnHome);
  if (playNormalBtn) playNormalBtn.addEventListener('click', () => startMode('normal'));
  if (playEndlessBtn) playEndlessBtn.addEventListener('click', () => startMode('endless'));
  if (changeNameBtn) changeNameBtn.addEventListener('click', changePlayerName);
  if (dailyRewardBtn) dailyRewardBtn.addEventListener('click', claimDailyReward);
  if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => openInfoPanel('leaderboard'));
  if (guideBtn) guideBtn.addEventListener('click', () => openInfoPanel('guide'));
  if (spinBtn) spinBtn.addEventListener('click', () => openInfoPanel('spin'));
  if (eventsBtn) eventsBtn.addEventListener('click', () => openInfoPanel('events'));
  if (missionsBtn) missionsBtn.addEventListener('click', () => openInfoPanel('missions'));
  if (shopBtn) shopBtn.addEventListener('click', () => toggleShop(true));
  if (shopCloseBtn) shopCloseBtn.addEventListener('click', () => toggleShop(false));
  if (infoCloseBtn) infoCloseBtn.addEventListener('click', closeInfoPanel);
  if (infoOverlay) infoOverlay.addEventListener('click', (event) => {
    if (event.target === infoOverlay) closeInfoPanel();
  });
  if (infoContentEl) infoContentEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'spin') runLuckySpin();
    if (button.dataset.action === 'claim-event') claimChallenge('event');
    if (button.dataset.action === 'claim-mission') claimChallenge('mission', Number(button.dataset.index || 0));
    updateView();
  });
  if (shopOverlay) shopOverlay.addEventListener('click', (event) => {
    if (event.target === shopOverlay) toggleShop(false);
  });
  if (shopItemsEl) shopItemsEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-skin]');
    if (!button) return;
    handleShopAction(button.dataset.skin);
  });
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  touchButtons.forEach(button => {
    button.addEventListener('pointerdown', (event) => {
      if (currentScreen !== 'game' || gameOver || blessingSelectionOpen || window.location.hash === '#cheats') return;
      event.preventDefault();
      const dir = button.dataset.dir;
      if (dir === 'up') queueTurn({ x: 0, y: -1 });
      if (dir === 'down') queueTurn({ x: 0, y: 1 });
      if (dir === 'left') queueTurn({ x: -1, y: 0 });
      if (dir === 'right') queueTurn({ x: 1, y: 0 });
    });
  });

  normalizeSkinState();
  updateView();
  resetGame();
  window.setInterval(() => {
    if (currentScreen === 'home') updateView();
  }, 1000);
  requestAnimationFrame(frame);
})();
