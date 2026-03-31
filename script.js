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
  const healthEl = document.getElementById('health');
  const xpEl = document.getElementById('xp');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');
  const backBtn = document.getElementById('backBtn');
  const gamePage = document.getElementById('gamePage');
  const cheatPage = document.getElementById('cheatPage');

  const baseGridSize = 7;
  const maxRounds = 30;
  const maxLevels = 15;
  const angelMaxRounds = 50;
  const angelMaxLevels = 30;
  const portalSequence = 'fghj'.repeat(5).split('');

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
  let tickMs = 160;
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
  let abilities = { vigor: 0, reflex: 0, luck: 0 };
  let angels = [];
  let generalAngels = [];
  let projectiles = [];
  let grenades = [];
  let healOrb = null;
  let altar = null;
  let boss = null;
  let particles = [];
  let jackpotMode = false;
  let realmMessage = '';
  let realmMessageUntil = 0;

  function currentGridSize() {
    return baseGridSize + (level - 1);
  }

  function currentCellSize() {
    return canvas.width / currentGridSize();
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  function updateView() {
    const inCheatRoom = window.location.hash === '#cheats';
    gamePage.classList.toggle('hidden', inCheatRoom);
    cheatPage.classList.toggle('hidden', !inCheatRoom);
  }

  function currentMaxRounds() {
    return angelRealm ? angelMaxRounds : maxRounds;
  }

  function currentMaxLevels() {
    return angelRealm ? angelMaxLevels : maxLevels;
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
    if (amount <= 0) return;
    const earned = jackpotMode && Math.random() < 0.5 ? Math.ceil(amount * 1.5) : amount;
    xp += earned;
    while (xp >= xpLevel * 25) {
      xp -= xpLevel * 25;
      xpLevel += 1;
      if (xpLevel % 3 === 1) abilities.vigor += 1;
      else if (xpLevel % 3 === 2) abilities.reflex += 1;
      else abilities.luck += 1;
      recalcStats();
      playerHealth = Math.min(maxHealth, playerHealth + 2);
      tickMs = getSpeedForState();
      showRealmMessage(`Level up! Power ${xpLevel}`, 1800);
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
    playerHealth = Math.max(0, playerHealth - amount);
    emitParticles(hitX, hitY, 10, ['rgba(255,255,255,0.95)', 'rgba(255,225,120,0.9)']);
    if (playerHealth <= 0) {
      gameOver = true;
      showRealmMessage('Fallen in the Angel Realm', 1800);
    }
    updateHud();
  }

  function enterAngelRealm() {
    angelRealm = true;
    xp = 0;
    xpLevel = 1;
    abilities = { vigor: 0, reflex: 0, luck: 0 };
    recalcStats();
    playerHealth = maxHealth;
    showRealmMessage('Angel Realm awakened', 2200);
    resetGame();
  }

  function getSpeedForState() {
    const base = Math.max(10, 160 - (round - 1) * 2 - (level - 1) * 5 - abilities.reflex * 6 - (angelRealm ? 8 : 0));
    return Math.max(4, Math.floor(base * Math.pow(0.78, speedLevel)));
  }

  function obstacleTargetForState() {
    const grid = currentGridSize();
    const limit = Math.max(2, Math.floor((grid * grid) / 5));
    return Math.min(limit, level + Math.floor((round - 1) / 2));
  }

  function randomEmptyCell() {
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
    return options.length ? options[Math.floor(Math.random() * options.length)] : null;
  }

  function spawnFoodIfMissing() {
    if (!boss?.active && !food) food = randomEmptyCell();
  }

  function ensureObstaclesForRound() {
    const target = obstacleTargetForState();
    while (obstacles.length < target) {
      const pos = randomEmptyCell();
      if (!pos) break;
      obstacles.push(pos);
    }
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
    healOrb = null;
    food = null;
    boss = {
      name: 'Arch Angle',
      hp: 150,
      maxHp: 150,
      x: Math.max(2, Math.floor(currentGridSize() / 2)),
      y: 1,
      dir: 1,
      lastVolleyAt: 0,
      lastGrenadeAt: 0,
      lastAltarAt: 0,
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
    ensureObstaclesForRound();
    if (!boss?.active) {
      spawnFoodIfMissing();
      spawnAngelEntities();
    }
  }

  function scheduleTongue(now = performance.now()) {
    nextTongueAt = now + randomBetween(5000, 12000);
    tongueVisibleUntil = 0;
  }

  function resetGame() {
    score = 0;
    round = 1;
    level = 1;
    gameOver = false;
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
    recalcStats();
    playerHealth = maxHealth;
    setupLevel(true);
    tickMs = getSpeedForState();
    accumulator = 0;
    scheduleTongue();
    updateHud();
  }

  function reviveGame() {
    if (!gameOver) return;
    gameOver = false;
    const center = Math.floor(currentGridSize() / 2);
    snake = [{ x: center, y: center }, { x: Math.max(0, center - 1), y: center }];
    prevSnake = snake.map(seg => ({ ...seg }));
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    directionQueue = [];
    projectiles = [];
    grenades = [];
    playerHealth = Math.max(1, Math.ceil(maxHealth * 0.6));
    scheduleTongue();
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
    if (invincible) tags.push('invincible');
    if (autoAim) tags.push('aimbot');
    if (speedLevel > 0) tags.push(`fast x${speedLevel}`);
    if (speedLevel < 0) tags.push(`slow x${Math.abs(speedLevel)}`);
    if (!tags.length) tags.push('playing');
    if (gameOver) {
      tags.length = 0;
      tags.push('game over');
    }

    levelEl.textContent = String(level);
    roundEl.textContent = String(round);
    scoreEl.textContent = String(score);
    if (levelCapEl) levelCapEl.textContent = String(currentMaxLevels());
    if (roundCapEl) roundCapEl.textContent = String(currentMaxRounds());
    if (healthEl) healthEl.textContent = `${playerHealth}/${maxHealth}`;
    if (xpEl) xpEl.textContent = `${xp} • Lv ${xpLevel}`;
    statusEl.textContent = tags.join(' + ');
  }

  function scheduleSpeedCommandParse() {
    if (pendingSpeedTimer) clearTimeout(pendingSpeedTimer);

    pendingSpeedTimer = setTimeout(() => {
      const bufferString = keyBuffer.join('');
      if (bufferString === lastProcessedSpeedBuffer) return;

      if (/zoom\s*normal$/.test(bufferString) || /unzoom\s*normal$/.test(bufferString)) {
        speedLevel = 0;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
        return;
      }

      const zoomMatch = bufferString.match(/zoom\s*(\d+)?$/);
      const unzoomMatch = bufferString.match(/unzoom\s*(\d+)?$/);

      if (zoomMatch) {
        const typedValue = zoomMatch[1] ? Number.parseInt(zoomMatch[1], 10) : 1;
        const amount = Math.max(1, typedValue || 1);
        speedLevel += amount;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
      } else if (unzoomMatch) {
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
      ensureObstaclesForRound();
      spawnFoodIfMissing();
      spawnAngelEntities();
    } else if (level < maxLevelCount) {
      level += 1;
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
      food = randomEmptyCell();
    }
    gainXp(angelRealm ? 6 : 2);
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
    const valid = options.filter(dir => {
      if (direction.x === -dir.x && direction.y === -dir.y && snake.length > 1) return false;
      const nx = head.x + dir.x;
      const ny = head.y + dir.y;
      if (nx < 0 || nx >= grid || ny < 0 || ny >= grid) return invincible;
      const hitsObstacle = obstacles.some(ob => ob.x === nx && ob.y === ny);
      if (!invincible && hitsObstacle) return false;
      const body = snake.slice(0, -1);
      const hitsBody = body.some(seg => seg.x === nx && seg.y === ny);
      return invincible || !hitsBody;
    });

    if (!valid.length) return;

    valid.sort((a, b) => {
      const da = Math.abs(head.x + a.x - targetFood.x) + Math.abs(head.y + a.y - targetFood.y);
      const db = Math.abs(head.x + b.x - targetFood.x) + Math.abs(head.y + b.y - targetFood.y);
      return da - db;
    });

    nextDirection = valid[0];
  }

  function fireProjectile(fromX, fromY, targetX, targetY, speed = 0.35, damage = 1, color = 'rgba(255,248,180,0.95)') {
    const dx = targetX + 0.5 - (fromX + 0.5);
    const dy = targetY + 0.5 - (fromY + 0.5);
    const length = Math.hypot(dx, dy) || 1;
    projectiles.push({
      x: fromX + 0.5,
      y: fromY + 0.5,
      vx: (dx / length) * speed,
      vy: (dy / length) * speed,
      damage,
      life: 42,
      color
    });
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
        moveEnemyWander(enemy, 4);
        if (now - enemy.lastShotAt >= 5000) {
          fireProjectile(enemy.x, enemy.y, targetX, targetY, 0.34, 1, 'rgba(255,242,166,0.95)');
          enemy.lastShotAt = now;
        }
      });

      generalAngels.forEach(enemy => {
        moveEnemyWander(enemy, 3);
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
        boss.x += boss.dir * 0.18;
        if (boss.x <= 2 || boss.x >= currentGridSize() - 3) boss.dir *= -1;
        if (now - boss.lastVolleyAt >= 1600) {
          const volleyCount = randomBetween(3, 9);
          for (let i = 0; i < volleyCount; i++) {
            fireProjectile(boss.x + (i % 3) - 1, boss.y + 1, targetX + randomBetween(-1, 1), targetY + randomBetween(-1, 1), 0.36, 1, 'rgba(255,236,120,0.95)');
          }
          boss.lastVolleyAt = now;
        }
        if (now - boss.lastGrenadeAt >= 3200) {
          const grenadeCount = randomBetween(1, 5);
          for (let i = 0; i < grenadeCount; i++) {
            grenades.push({ x: Math.max(1, Math.min(currentGridSize() - 2, targetX + randomBetween(-2, 2))), y: Math.max(1, Math.min(currentGridSize() - 2, targetY + randomBetween(-2, 2))), timer: Math.max(10, Math.round(5000 / Math.max(40, tickMs))), damage: 2, radius: 1, exploding: 0 });
          }
          boss.lastGrenadeAt = now;
        }
        if ((!altar || altar.destroyed) && now - boss.lastAltarAt >= 5000) {
          altar = randomEmptyCell();
          boss.lastAltarAt = now;
        }
      }
    }

    projectiles = projectiles.filter(projectile => {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      projectile.life -= 1;
      const hit = vulnerable.find(seg => seg.x === Math.floor(projectile.x) && seg.y === Math.floor(projectile.y));
      if (hit) {
        applyDamage(projectile.damage, hit.x, hit.y);
        return false;
      }
      return projectile.life > 0 && projectile.x >= -1 && projectile.y >= -1 && projectile.x <= currentGridSize() + 1 && projectile.y <= currentGridSize() + 1;
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
        gameOver = true;
        updateHud();
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
    const bodyToCheck = ateMainFood || ateBonusApple ? snake : snake.slice(0, -1);
    const hitsSelf = bodyToCheck.some(seg => seg.x === newHead.x && seg.y === newHead.y);

    if (!invincible && hitsSelf) {
      gameOver = true;
      updateHud();
      return;
    }

    if (obstacleIndex !== -1) {
      if (invincible) {
        obstacles.splice(obstacleIndex, 1);
        score += 3;
      } else {
        gameOver = true;
        updateHud();
        return;
      }
    }

    if (angelIndex !== -1) {
      angels.splice(angelIndex, 1);
      score += 15;
      gainXp(10);
      emitParticles(newHead.x, newHead.y, 10);
    }

    if (generalIndex !== -1) {
      generalAngels.splice(generalIndex, 1);
      score += 25;
      gainXp(16);
      emitParticles(newHead.x, newHead.y, 12, ['rgba(255,255,255,0.98)', 'rgba(255,228,120,0.95)']);
    }

    if (grabbedHeal) {
      healOrb = null;
      playerHealth = Math.min(maxHealth, playerHealth + 2 + abilities.luck);
      showRealmMessage('Holy heal', 1200);
    }

    if (hitAltar && boss?.active) {
      altar = null;
      boss.hp = Math.max(0, boss.hp - 5);
      score += 30;
      gainXp(20);
      emitParticles(newHead.x, newHead.y, 16, ['rgba(255,255,255,0.98)', 'rgba(255,235,150,0.95)']);
      if (boss.hp <= 0) {
        boss = null;
        angelRealm = false;
        showRealmMessage('Arch Angle defeated!', 2600);
      }
    }

    snake.unshift(newHead);

    if (ateMainFood) {
      score += 10;
      food = null;
      advanceProgress();
    } else if (ateBonusApple) {
      score += 5;
      bonusApples.splice(bonusIndex, 1);
    } else {
      snake.pop();
    }

    spawnFoodIfMissing();
    updateAngelRealmThreats();
    updateHud();
  }

  function drawRoundedCell(x, y, color, radius = 8, scale = 1, glowColor = null) {
    const size = currentCellSize();
    const scaled = (size - 8) * scale;
    const offset = ((size - 8) - scaled) / 2;
    const px = x * size;
    const py = y * size;

    if (glowColor) {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;
    }

    ctx.fillStyle = color;
    roundedRectPath(px + 4 + offset, py + 4 + offset, scaled, scaled, radius);
    ctx.fill();

    if (glowColor) ctx.restore();
  }

  function drawFoodCell(item, now, color, glow) {
    const pulse = 0.88 + Math.sin(now * 0.012 + item.x + item.y) * 0.08;
    drawRoundedCell(item.x, item.y, color, 12, pulse, glow);
  }

  function drawHead(seg, now = performance.now(), drawX = seg.x, drawY = seg.y) {
    const size = currentCellSize();
    const breathe = 0.98 + Math.sin(now * 0.01) * 0.02;
    const bodySize = (size - 8) * breathe;
    const offset = ((size - 8) - bodySize) / 2;
    const px = drawX * size + 4 + offset;
    const py = drawY * size + 4 + offset;
    const headColor = invincible ? '#ffd84d' : '#5ef38c';

    ctx.fillStyle = headColor;
    roundedRectPath(px, py, bodySize, bodySize, 10);
    ctx.fill();

    ctx.fillStyle = '#111';
    let eye1x = px + bodySize * 0.68;
    let eye1y = py + bodySize * 0.28;
    let eye2x = px + bodySize * 0.68;
    let eye2y = py + bodySize * 0.72;
    let mouthFromX = px + bodySize * 0.84;
    let mouthFromY = py + bodySize * 0.38;
    let mouthToX = px + bodySize * 0.84;
    let mouthToY = py + bodySize * 0.62;
    let tongueFromX = px + bodySize * 0.9;
    let tongueFromY = py + bodySize * 0.5;
    let tongueToX = px + bodySize * 1.15;
    let tongueToY = py + bodySize * 0.5;

    if (direction.x === -1) {
      eye1x = px + bodySize * 0.32; eye1y = py + bodySize * 0.28;
      eye2x = px + bodySize * 0.32; eye2y = py + bodySize * 0.72;
      mouthFromX = px + bodySize * 0.16; mouthToX = px + bodySize * 0.16;
      tongueFromX = px + bodySize * 0.1; tongueToX = px - bodySize * 0.15;
    } else if (direction.y === -1) {
      eye1x = px + bodySize * 0.28; eye1y = py + bodySize * 0.32;
      eye2x = px + bodySize * 0.72; eye2y = py + bodySize * 0.32;
      mouthFromX = px + bodySize * 0.38; mouthFromY = py + bodySize * 0.16;
      mouthToX = px + bodySize * 0.62; mouthToY = py + bodySize * 0.16;
      tongueFromX = px + bodySize * 0.5; tongueFromY = py + bodySize * 0.1;
      tongueToX = px + bodySize * 0.5; tongueToY = py - bodySize * 0.15;
    } else if (direction.y === 1) {
      eye1x = px + bodySize * 0.28; eye1y = py + bodySize * 0.68;
      eye2x = px + bodySize * 0.72; eye2y = py + bodySize * 0.68;
      mouthFromX = px + bodySize * 0.38; mouthFromY = py + bodySize * 0.84;
      mouthToX = px + bodySize * 0.62; mouthToY = py + bodySize * 0.84;
      tongueFromX = px + bodySize * 0.5; tongueFromY = py + bodySize * 0.9;
      tongueToX = px + bodySize * 0.5; tongueToY = py + bodySize * 1.15;
    }

    ctx.beginPath();
    ctx.arc(eye1x, eye1y, Math.max(2, bodySize * 0.06), 0, Math.PI * 2);
    ctx.arc(eye2x, eye2y, Math.max(2, bodySize * 0.06), 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouthFromX, mouthFromY);
    ctx.lineTo(mouthToX, mouthToY);
    ctx.stroke();

    if (now >= nextTongueAt) {
      tongueVisibleUntil = now + 450;
      nextTongueAt = now + randomBetween(5000, 12000);
    }

    if (now < tongueVisibleUntil) {
      ctx.strokeStyle = '#ff4b6e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tongueFromX, tongueFromY);
      ctx.lineTo(tongueToX, tongueToY);
      ctx.stroke();
    }
  }

  function drawAngelEnemy(enemy, type = 'angel', now = performance.now()) {
    const size = currentCellSize();
    const bodySize = size - 10;
    const px = enemy.x * size + 5;
    const py = enemy.y * size + 5;
    const bodyColor = type === 'general' ? '#fffdf5' : '#ffe06a';
    const accentColor = type === 'general' ? '#d8b74d' : '#fff6c7';

    ctx.fillStyle = bodyColor;
    ctx.fillRect(px, py, bodySize, bodySize);
    ctx.strokeStyle = '#c89f2c';
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 1, py + 1, bodySize - 2, bodySize - 2);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(px + bodySize / 2, py - 2, bodySize * 0.28, 4, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (type === 'general') {
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.moveTo(px + bodySize * 0.2, py + 2);
      ctx.lineTo(px + bodySize * 0.35, py - 5);
      ctx.lineTo(px + bodySize * 0.5, py + 2);
      ctx.lineTo(px + bodySize * 0.65, py - 5);
      ctx.lineTo(px + bodySize * 0.8, py + 2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillRect(px - 3, py + bodySize * 0.38, 5, bodySize * 0.18);
      ctx.fillRect(px + bodySize - 2, py + bodySize * 0.38, 5, bodySize * 0.18);
    }

    ctx.fillStyle = '#2d2411';
    ctx.fillRect(px + bodySize * 0.24, py + bodySize * 0.28, Math.max(3, bodySize * 0.12), Math.max(3, bodySize * 0.12));
    ctx.fillRect(px + bodySize * 0.64, py + bodySize * 0.28, Math.max(3, bodySize * 0.12), Math.max(3, bodySize * 0.12));
    ctx.strokeStyle = '#2d2411';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + bodySize * 0.28, py + bodySize * 0.72);
    ctx.lineTo(px + bodySize * 0.72, py + bodySize * 0.72);
    ctx.stroke();
  }

  function levelColors() {
    if (angelRealm) {
      return {
        a: 'hsl(48 100% 88%)',
        b: 'hsl(44 96% 73%)'
      };
    }

    const hue = (level * 27) % 360;
    return {
      a: `hsl(${hue} 35% 18%)`,
      b: `hsl(${(hue + 18) % 360} 32% 13%)`
    };
  }

  function ensureBoardCache() {
    const key = `${angelRealm ? 'angel' : 'normal'}-${level}-${currentGridSize()}-${canvas.width}-${canvas.height}`;
    if (boardCache && boardCacheKey === key) return;

    boardCacheKey = key;
    boardCache = document.createElement('canvas');
    boardCache.width = canvas.width;
    boardCache.height = canvas.height;
    const bctx = boardCache.getContext('2d');
    if (!bctx) return;
    const grid = currentGridSize();
    const size = currentCellSize();
    const colors = levelColors();

    bctx.fillStyle = colors.b;
    bctx.fillRect(0, 0, boardCache.width, boardCache.height);

    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        bctx.fillStyle = (x + y) % 2 === 0 ? colors.a : colors.b;
        bctx.fillRect(x * size, y * size, size, size);
      }
    }

    if (angelRealm) {
      const glow = bctx.createRadialGradient(boardCache.width / 2, boardCache.height * 0.15, 10, boardCache.width / 2, boardCache.height / 2, boardCache.width * 0.7);
      glow.addColorStop(0, 'rgba(255,255,255,0.28)');
      glow.addColorStop(0.45, 'rgba(255,248,205,0.14)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      bctx.fillStyle = glow;
      bctx.fillRect(0, 0, boardCache.width, boardCache.height);
    }
  }

  function drawPortal(portal, now) {
    const size = currentCellSize();
    const cx = (portal.x + 0.5) * size;
    const cy = (portal.y + 0.5) * size;
    const phase = Math.min(1, (now - portal.start) / portal.duration);
    const pulse = phase < 0.5 ? phase / 0.5 : (1 - phase) / 0.5;
    const outer = size * (0.1 + pulse * 0.3);
    const inner = size * (0.05 + pulse * 0.18);

    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#8d7bff';

    const fill = ctx.createRadialGradient(cx, cy, inner * 0.2, cx, cy, outer);
    fill.addColorStop(0, 'rgba(164, 120, 255, 0.95)');
    fill.addColorStop(0.55, 'rgba(80, 120, 255, 0.72)');
    fill.addColorStop(1, 'rgba(30, 10, 80, 0.08)');
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#d6c8ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#6ea8ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 + now * 0.01;
      const dist = outer + 4 + Math.sin(now * 0.02 + i) * 4;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(182,140,255,0.85)' : 'rgba(104,196,255,0.8)';
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function draw(now = performance.now()) {
    try {
      ensureBoardCache();
      if (boardCache) {
        ctx.drawImage(boardCache, 0, 0);
      } else {
        // Fallback: draw something if board cache fails
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      obstacles.forEach(ob => drawRoundedCell(ob.x, ob.y, '#6d768a', 6, 0.96));
      bonusApples.forEach(ap => drawFoodCell(ap, now, '#ffbe3b', 'rgba(255,190,59,0.45)'));
      if (food) drawFoodCell(food, now, '#ff7b54', 'rgba(255,123,84,0.5)');
      if (healOrb) drawRoundedCell(healOrb.x, healOrb.y, '#8fffd0', 12, 0.9 + Math.sin(now * 0.012) * 0.07, 'rgba(143,255,208,0.2)');
      if (altar) drawRoundedCell(altar.x, altar.y, '#fff6b0', 10, 0.88 + Math.sin(now * 0.015) * 0.06, 'rgba(255,245,180,0.28)');

      angels.forEach(enemy => drawAngelEnemy(enemy, 'angel', now));
      generalAngels.forEach(enemy => drawAngelEnemy(enemy, 'general', now));

      if (snake.length) {
        snake.slice(1).forEach((seg, index) => {
          const scale = 0.97 + Math.sin(now * 0.008 + index * 0.45) * 0.02;
          drawRoundedCell(seg.x, seg.y, '#2bc866', 8, scale, null);
        });

        drawHead(snake[0], now, snake[0].x, snake[0].y);
      }

      projectiles.forEach(projectile => {
        const size = currentCellSize();
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x * size, projectile.y * size, Math.max(3, size * 0.12), 0, Math.PI * 2);
        ctx.fill();
      });

      grenades.forEach(grenade => {
        const size = currentCellSize();
        const alpha = grenade.exploding > 0 ? 0.34 : 0.16 + Math.sin(now * 0.02) * 0.05;
        ctx.fillStyle = `rgba(255, 235, 160, ${alpha})`;
        ctx.fillRect((grenade.x - 1) * size, (grenade.y - 1) * size, size * 3, size * 3);
      });

      activePortals = activePortals.filter(portal => now < portal.start + portal.duration);
      activePortals.forEach(portal => drawPortal(portal, now));

      if (boss?.active) {
        drawRoundedCell(boss.x - 1, boss.y, '#fff7bf', 10, 1, 'rgba(255,247,191,0.25)');
        drawRoundedCell(boss.x, boss.y, '#ffd54f', 10, 1, 'rgba(255,213,79,0.25)');
        drawRoundedCell(boss.x + 1, boss.y, '#fff7bf', 10, 1, 'rgba(255,247,191,0.25)');

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(16, 12, canvas.width - 32, 16);
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(16, 12, ((canvas.width - 32) * boss.hp) / boss.maxHp, 16);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${boss.name} ${boss.hp}/${boss.maxHp}`, canvas.width / 2, 24);
      }

      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        return particle.life > 0;
      });

      if (angelRealm || jackpotMode) {
        ctx.fillStyle = 'rgba(0,0,0,0.34)';
        ctx.fillRect(0, canvas.height - 26, canvas.width, 26);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`HP ${playerHealth}/${maxHealth}   XP ${xp}   Lv ${xpLevel}`, 10, canvas.height - 9);
      }

      if (realmMessage && now < realmMessageUntil) {
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(realmMessage, canvas.width / 2, canvas.height - 34);
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '16px Arial';
        ctx.fillText('Press R to revive', canvas.width / 2, canvas.height / 2 + 18);
      }
    } catch (e) {
      console.error('Draw error:', e);
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ERROR', canvas.width / 2, canvas.height / 2);
    }
  }

  function frame(now) {
    if (!lastFrameTime) lastFrameTime = now;
    const delta = now - lastFrameTime;
    lastFrameTime = now;

    if (!gameOver && window.location.hash !== '#cheats') {
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

    keyBuffer.push(key);
    if (keyBuffer.length > 40) keyBuffer.shift();

    if (endsWithSequence(portalSequence)) {
      window.location.hash = '#cheats';
      updateView();
    }
    if (endsWithSequence(['g', 'o', 'd'])) {
      invincible = true;
      updateHud();
    }
    if (endsWithSequence(['a', 'n', 'g', 'e', 'l'])) {
      enterAngelRealm();
    }
    if (endsWithSequence(['j', 'a', 'c', 'k', 'p', 'o', 't'])) {
      jackpotMode = true;
      abilities.luck += 1;
      recalcStats();
      playerHealth = maxHealth;
      showRealmMessage('Jackpot skin unlocked', 1800);
      updateHud();
    }

    scheduleSpeedCommandParse();

    if (endsWithSequence(['f', 'o', 'o', 'd'])) {
      fillWorldWithApples();
    }
    if (endsWithSequence(['a', 'i', 'm']) || endsWithSequence(['a', 'i', 'm', 'b', 'o', 't'])) {
      autoAim = !autoAim;
      updateHud();
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
  backBtn.addEventListener('click', () => {
    window.location.hash = '';
    updateView();
  });
  restartBtn.addEventListener('click', resetGame);

  updateView();
  resetGame();
  requestAnimationFrame(frame);
})();
