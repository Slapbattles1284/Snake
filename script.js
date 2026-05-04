(() => {
  const canvas = document.getElementById('game');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  const levelEl = document.getElementById('level');
  const levelCapEl = document.getElementById('levelCap');
  const roundEl = document.getElementById('round');
  const roundCapEl = document.getElementById('roundCap');
  const paceEl = document.getElementById('pace');
  const scoreEl = document.getElementById('score');
  const bestScoreEl = document.getElementById('bestScore');
  const coinsEl = document.getElementById('coins');
  const healthEl = document.getElementById('health');
  const bottomHealthEl = document.getElementById('bottomHealth');
  const healthPillEl = document.getElementById('healthPill');
  const xpEl = document.getElementById('xp');
  const comboEl = document.getElementById('combo');
  const mapSizeEl = document.getElementById('mapSize');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const homeBtn = document.getElementById('homeBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const gameAudioToggleBtn = document.getElementById('gameAudioToggleBtn');
  const gameFullscreenBtn = document.getElementById('gameFullscreenBtn');
  const backBtn = document.getElementById('backBtn');
  const playNormalBtn = document.getElementById('playNormalBtn');
  const playEndlessBtn = document.getElementById('playEndlessBtn');
  const changeNameBtn = document.getElementById('changeNameBtn');
  const dailyRewardBtn = document.getElementById('dailyRewardBtn');
  const leaderboardBtn = document.getElementById('leaderboardBtn');
  const achievementsBtn = document.getElementById('achievementsBtn');
  const statsBtn = document.getElementById('statsBtn');
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
  const abilityAutoPickButtons = Array.from(document.querySelectorAll('[data-auto-blessing]'));
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
  const gameFrameEl = document.querySelector('.game-frame');
  const homePage = document.getElementById('homePage');
  const gamePage = document.getElementById('gamePage');
  const cheatPage = document.getElementById('cheatPage');
  const cheatHomeBtn = document.getElementById('cheatHomeBtn');
  const cheatCoinLabel = document.getElementById('cheatCoinLabel');
  const cheatCodeListEl = document.getElementById('cheatCodeList');
  const cheatAchievementLabel = document.getElementById('cheatAchievementLabel');
  const gameModeLabel = document.getElementById('gameModeLabel');
  const realmXpWrap = document.getElementById('realmXpWrap');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const gameOverTitleEl = document.getElementById('gameOverTitle');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const gameOverHomeBtn = document.getElementById('gameOverHomeBtn');
  const achievementToast = document.getElementById('achievementToast');
  const achievementToastTitleEl = document.getElementById('achievementToastTitle');
  const achievementToastDescEl = document.getElementById('achievementToastDesc');
  const achievementToastRewardEl = document.getElementById('achievementToastReward');

  const baseGridSize = 7;
  const maxGridSize = 28;
  const baseTickMs = 250;
  const minMapTickMs = 136;
  const minAbsoluteTickMs = 82;
  const maxRounds = 30;
  const maxLevels = 15;
  const angelMaxRounds = 50;
  const angelMaxLevels = 30;
  const mainModeMaxHealth = 20;
  const mainModeObstacleDamage = 5;
  const mainModeAppleHeal = 0.2;
  const priceInflationMultiplier = 2;
  const cheatSuffix = ']]';
  const portalSequence = 'fghj'.repeat(5).split('');
  const tongueVisibleDurationMs = 520;
  const reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const blessingAutoPickDelayMs = 260;
  const tierOrderMap = {
    starter: 0,
    core: 1,
    uncommon: 2,
    enhanced: 3,
    rare: 4,
    epic: 5,
    legendary: 6,
    mythic: 7,
    divine: 8,
    cosmic: 9,
    ascendant: 10,
    snakeifying: 11
  };
  const snakeSkins = [
    { key: 'classic', name: 'Classic', emoji: '🐍', price: 0, desc: 'The default green runner.', body: '#2bc866', head: '#5ef38c', accent: '#9af0b8', label: '#ffffff', bgA: '#193324', bgB: '#0b1711' },
    { key: 'frost', name: 'Frost Byte', emoji: '🧊', price: 12, desc: 'Cold blue scales with an icy glow.', body: '#52c7ff', head: '#d6f6ff', accent: '#91dfff', label: '#effbff', bgA: '#18374d', bgB: '#0a1826' },
    { key: 'lava', name: 'Lava Rush', emoji: '🔥', price: 18, desc: 'Bright ember colors for hot streaks.', body: '#ff6a3d', head: '#ffd166', accent: '#ff9b54', label: '#fff0c4', bgA: '#4a1e14', bgB: '#1b0b07' },
    { key: 'royal', name: 'Royal Circuit', emoji: '👑', price: 26, desc: 'Gold highlights and deep arcade blue.', body: '#6b7cff', head: '#ffd95e', accent: '#b5beff', label: '#fff4b8', bgA: '#1d2754', bgB: '#0d1228' },
    { key: 'shadow', name: 'Shadow Venom', emoji: '🌑', price: 32, desc: 'A stealth skin with neon green edges.', body: '#1e2938', head: '#8effa7', accent: '#4ade80', label: '#d7ffe1', bgA: '#111827', bgB: '#030712' },
    { key: 'bubble', name: 'Bubble Bloom', emoji: '🫧', price: 22, desc: 'Soft aqua scales with a bright candy shine.', body: '#5eead4', head: '#cffafe', accent: '#99f6e4', label: '#effffe', bgA: '#10343a', bgB: '#081b21' },
    { key: 'sunset', name: 'Sunset Coil', emoji: '🌇', price: 24, desc: 'Warm neon orange and pink like an arcade sunset.', body: '#ff7a59', head: '#ffd0a8', accent: '#ff9ac1', label: '#fff1de', bgA: '#4d1f2b', bgB: '#1a1021' },
    { key: 'toxic', name: 'Toxic Byte', emoji: '☣️', price: 29, desc: 'Radioactive green edges with a dark tech body.', body: '#1a2f24', head: '#b7ff3c', accent: '#67e8a5', label: '#f3ffd9', bgA: '#112416', bgB: '#07110a' },
    { key: 'candy', name: 'Candy Coil', emoji: '🍬', price: 21, desc: 'Bright striped colors for a playful run.', body: '#ff5ea8', head: '#ffe27a', accent: '#8bd3ff', label: '#fff7d2', bgA: '#4a1730', bgB: '#1f1333' },
    { key: 'storm', name: 'Storm Fang', emoji: '⛈️', price: 35, desc: 'Electric blue highlights with a thunder-dark frame.', body: '#2b3350', head: '#9bd7ff', accent: '#ffe56d', label: '#eef7ff', bgA: '#12192c', bgB: '#070b14' },
    { key: 'nova', name: 'Nova Pulse', emoji: '☀️', price: 36, desc: 'Solar gold wrapped in a bright cosmic glow.', body: '#ffb703', head: '#ffe7a5', accent: '#fb8500', label: '#fff4da', bgA: '#4b2305', bgB: '#180b05' },
    { key: 'obsidian', name: 'Obsidian Rift', emoji: '🪨', price: 38, desc: 'Volcanic black stone with red seams.', body: '#1f1b24', head: '#5a525f', accent: '#ff6b4a', label: '#f4e9df', bgA: '#20131c', bgB: '#09070b' },
    { key: 'lotus', name: 'Lotus Glide', emoji: '🪷', price: 27, desc: 'A serene pink-and-jade bloom skin.', body: '#ff8dc7', head: '#ffe0f0', accent: '#6ee7b7', label: '#fff6fb', bgA: '#3b1630', bgB: '#111726' },
    { key: 'midnight', name: 'Midnight Mirage', emoji: '🌌', price: 34, desc: 'Deep-space blues and starlight silver.', body: '#223a73', head: '#d9e7ff', accent: '#8b9dff', label: '#eef3ff', bgA: '#0f1c3a', bgB: '#040913' },
    { key: 'cobalt', name: 'Cobalt Dash', emoji: '💠', price: 19, desc: 'A crisp electric cobalt speed skin.', body: '#2667ff', head: '#94c2ff', accent: '#63e6ff', label: '#edf9ff', bgA: '#14274d', bgB: '#08111f' },
    { key: 'emerald', name: 'Emerald Flash', emoji: '💚', price: 23, desc: 'Saturated jewel greens with bright mint highlights.', body: '#1fab5b', head: '#b9ffd6', accent: '#5ef0a2', label: '#f0fff7', bgA: '#133726', bgB: '#08140e' },
    { key: 'pearl', name: 'Pearl Drift', emoji: '🦪', price: 25, desc: 'Creamy whites and opal shimmer.', body: '#d9d5f2', head: '#ffffff', accent: '#c8f1ff', label: '#fffdfd', bgA: '#27233e', bgB: '#0f0d17' },
    { key: 'inferno', name: 'Inferno Coil', emoji: '🌋', price: 41, desc: 'A brutal magma palette with bright-hot edges.', body: '#ff4d2d', head: '#ffd7a8', accent: '#ff9f43', label: '#fff0e1', bgA: '#55180c', bgB: '#180703' },
    { key: 'aurora', name: 'Aurora Drift', emoji: '🌈', price: 39, desc: 'Northern-light gradients across every segment.', body: '#4dd4ac', head: '#b3f8ff', accent: '#b47dff', label: '#f6ffff', bgA: '#12394a', bgB: '#0a1022' },
    { key: 'hazard', name: 'Hazard Tape', emoji: '⚠️', price: 17, desc: 'Industrial yellow with black danger striping.', body: '#facc15', head: '#fff0a6', accent: '#0f172a', label: '#fffbe5', bgA: '#3d2d07', bgB: '#120d03' },
    { key: 'petal', name: 'Petal Pop', emoji: '🌸', price: 16, desc: 'Cherry blossom tones with a glossy finish.', body: '#ff77b7', head: '#ffd6ec', accent: '#ffb0d9', label: '#fff5fb', bgA: '#4e1834', bgB: '#1d1020' },
    { key: 'matrix', name: 'Matrix Coil', emoji: '💻', price: 37, desc: 'Black glass with phosphor green code lines.', body: '#0d1412', head: '#bbff7d', accent: '#35d07f', label: '#efffe4', bgA: '#07110a', bgB: '#010402' },
    { key: 'emberglass', name: 'Ember Glass', emoji: '🧡', price: 28, desc: 'Translucent amber with burnt-orange shine.', body: '#ff8f5a', head: '#ffe0c2', accent: '#ffb36b', label: '#fff4e8', bgA: '#4a2418', bgB: '#170b06' },
    { key: 'reef', name: 'Reef Runner', emoji: '🐠', price: 20, desc: 'Coral pinks and tropical aqua accents.', body: '#ff7c76', head: '#ffe4d1', accent: '#3dd9d6', label: '#fff8f3', bgA: '#163944', bgB: '#0a1620' },
    { key: 'mintchip', name: 'Mint Chip', emoji: '🍨', price: 14, desc: 'Cool dessert greens with chocolate-dark trim.', body: '#8be2bb', head: '#e7fff2', accent: '#4b5563', label: '#f8fff9', bgA: '#17322a', bgB: '#0a110f' },
    { key: 'plasma', name: 'Plasma Arc', emoji: '⚡', price: 33, desc: 'Neon magenta and blue with arcade sparks.', body: '#735cff', head: '#d9d1ff', accent: '#ff5ece', label: '#faf4ff', bgA: '#261543', bgB: '#0c071a' },
    { key: 'steel', name: 'Steel Rail', emoji: '🚆', price: 18, desc: 'Machine grey with polished chrome highlights.', body: '#748096', head: '#dce3ef', accent: '#a8b4c7', label: '#f7fbff', bgA: '#232b38', bgB: '#0c1016' },
    { key: 'wildberry', name: 'Wildberry Rush', emoji: '🫐', price: 26, desc: 'Deep berry tones with juicy violet pop.', body: '#6d28d9', head: '#ddd6fe', accent: '#c084fc', label: '#f6f0ff', bgA: '#2a124e', bgB: '#0d0717' },
    { key: 'goldrush', name: 'Gold Rush', emoji: '🏆', price: 44, desc: 'A premium all-gold finish with amber shine.', body: '#d4a017', head: '#fff1a8', accent: '#ffe08a', label: '#fff7d6', bgA: '#4a3810', bgB: '#150f04' },
    { key: 'moonbeam', name: 'Moonbeam', emoji: '🌙', price: 31, desc: 'Quiet lunar silver with soft blue haze.', body: '#9fb1d9', head: '#f8fbff', accent: '#cfe1ff', label: '#ffffff', bgA: '#1a2440', bgB: '#080b16' },
    { key: 'embermint', name: 'Ember Mint', emoji: '🍃', price: 22, desc: 'Unexpected mint scales with glowing orange embers.', body: '#48c78e', head: '#c7ffe7', accent: '#ff9f68', label: '#f4fff9', bgA: '#133328', bgB: '#120c08' },
    { key: 'prism', name: 'Prism Break', emoji: '🔷', price: 42, desc: 'High-energy rainbow facets for the flashiest runs.', body: '#4cc9f0', head: '#f1fbff', accent: '#f72585', label: '#ffffff', bgA: '#171d4d', bgB: '#090914' },
    { key: 'jadefire', name: 'Jadefire Wyrm', emoji: '🐉', price: 45, desc: 'Dragon-green scales with molten orange seams.', body: '#1d8f63', head: '#dbffd8', accent: '#ff8a3d', stripe: '#67f2bf', belly: '#ffe6b8', eye: '#fff4af', glow: 'rgba(103, 242, 191, 0.28)', pattern: 'diamond', label: '#fbfff8', bgA: '#123b2d', bgB: '#27140d' },
    { key: 'synthwave', name: 'Synthwave Fang', emoji: '🎛️', price: 40, desc: 'Hot pink lights over midnight arcade blue.', body: '#3529a7', head: '#ffb6d9', accent: '#39f0ff', stripe: '#ff5ec8', belly: '#cdd7ff', eye: '#fff6a8', glow: 'rgba(57, 240, 255, 0.26)', pattern: 'chevron', label: '#fbf8ff', bgA: '#221147', bgB: '#0a0d26' },
    { key: 'copperhead', name: 'Copperhead', emoji: '🟠', price: 20, desc: 'Warm copper plates with sharp black marks.', body: '#b45a24', head: '#ffd0a1', accent: '#2b1b16', stripe: '#f59e63', belly: '#ffe5c8', eye: '#fff0b8', glow: 'rgba(245, 158, 99, 0.22)', pattern: 'bands', label: '#fff6ee', bgA: '#46200e', bgB: '#170a05' },
    { key: 'monarch', name: 'Monarch Coil', emoji: '🦋', price: 29, desc: 'Butterfly orange with bold black wing-striping.', body: '#ff8b2c', head: '#ffe1b8', accent: '#18181b', stripe: '#ffb84d', belly: '#fff1cf', eye: '#fff5b2', glow: 'rgba(255, 184, 77, 0.24)', pattern: 'chevron', label: '#fff8f0', bgA: '#4a210d', bgB: '#140b08' },
    { key: 'deepsea', name: 'Deepsea Titan', emoji: '🐋', price: 34, desc: 'Ocean-trench blues with bright bioluminescent edges.', body: '#0f4c81', head: '#b7ebff', accent: '#67f3ff', stripe: '#38bdf8', belly: '#d9f8ff', eye: '#d7fdff', glow: 'rgba(103, 243, 255, 0.28)', pattern: 'rings', label: '#f2feff', bgA: '#082338', bgB: '#04101a' },
    { key: 'rosegold', name: 'Rose Gold', emoji: '🌹', price: 32, desc: 'Polished blush metal with bright champagne shine.', body: '#d98b8b', head: '#ffe0d5', accent: '#ffd166', stripe: '#f7b4b4', belly: '#fff0dc', eye: '#fff8d1', glow: 'rgba(255, 209, 102, 0.24)', pattern: 'ribs', label: '#fff8f6', bgA: '#44202b', bgB: '#180d11' },
    { key: 'cyclone', name: 'Cyclone Circuit', emoji: '🌀', price: 30, desc: 'Stormy cyan coils with turbine-bright bands.', body: '#1d6f8c', head: '#c9f8ff', accent: '#8ef2ff', stripe: '#4fd9ff', belly: '#ddfdff', eye: '#ffffff', glow: 'rgba(79, 217, 255, 0.24)', pattern: 'rings', label: '#f4feff', bgA: '#0d2d3b', bgB: '#08111b' },
    { key: 'koi', name: 'Koi Comet', emoji: '🎏', price: 24, desc: 'Creamy white scales cut with bold red koi splashes.', body: '#f8f1e4', head: '#fff9f1', accent: '#ef4444', stripe: '#fb7185', belly: '#fff2db', eye: '#3f2314', glow: 'rgba(239, 68, 68, 0.2)', pattern: 'spots', label: '#fffdf8', bgA: '#513126', bgB: '#190f0a' },
    { key: 'tundra', name: 'Tundra Howl', emoji: '❄️', price: 21, desc: 'Snowy silver with piercing glacier-blue seams.', body: '#9eb7cf', head: '#f6fbff', accent: '#63c7ff', stripe: '#d7ebff', belly: '#ffffff', eye: '#eaf7ff', glow: 'rgba(99, 199, 255, 0.22)', pattern: 'bands', label: '#ffffff', bgA: '#18293a', bgB: '#09101a' },
    { key: 'rainforest', name: 'Rainforest Ruin', emoji: '🌿', price: 26, desc: 'Mossy jungle greens with stone-gold patterning.', body: '#2f7a45', head: '#c8efb5', accent: '#f5c451', stripe: '#7ddf74', belly: '#f0ffd1', eye: '#fff6b0', glow: 'rgba(125, 223, 116, 0.22)', pattern: 'speckle', label: '#fafff4', bgA: '#16331d', bgB: '#0a160d' },
    { key: 'phantom', name: 'Phantom Wire', emoji: '🕸️', price: 41, desc: 'Ghost-white armor with eerie electric seams.', body: '#cad5e2', head: '#ffffff', accent: '#8a7dff', stripe: '#7ee7ff', belly: '#eef5ff', eye: '#211b3d', glow: 'rgba(138, 125, 255, 0.24)', pattern: 'diamond', label: '#ffffff', bgA: '#222a3d', bgB: '#090c16' },
    { key: 'biohazardx', name: 'Biohazard X', emoji: '🧪', price: 37, desc: 'Mutated acid scales with toxic spill highlights.', body: '#35531b', head: '#dfff86', accent: '#c6ff2e', stripe: '#f8ff6a', belly: '#f6ffd1', eye: '#fff7b0', glow: 'rgba(198, 255, 46, 0.24)', pattern: 'spots', label: '#fbffe9', bgA: '#15240c', bgB: '#070b05' },
    { key: 'sandstriker', name: 'Sandstriker', emoji: '🏜️', price: 23, desc: 'Desert tan scales with sun-baked amber ridges.', body: '#c99b62', head: '#ffe1b8', accent: '#8b5e34', stripe: '#f5bf78', belly: '#fff1d8', eye: '#fff4bc', glow: 'rgba(245, 191, 120, 0.2)', pattern: 'ribs', label: '#fffaf3', bgA: '#49301c', bgB: '#191006' },
    { key: 'starlance', name: 'Starlance', emoji: '🌠', price: 43, desc: 'Midnight cobalt with comet-trail gold flashes.', body: '#2846a1', head: '#e0e9ff', accent: '#ffd36d', stripe: '#8eb7ff', belly: '#f4f6ff', eye: '#fff8bf', glow: 'rgba(255, 211, 109, 0.26)', pattern: 'diamond', label: '#fdfdff', bgA: '#111c49', bgB: '#050711' },
    { key: 'velvet', name: 'Velvet Viper', emoji: '🎭', price: 28, desc: 'Rich burgundy coils with silky magenta highlights.', body: '#7a1f43', head: '#ffd1df', accent: '#ff7eb6', stripe: '#d946ef', belly: '#ffe6ef', eye: '#fff0b8', glow: 'rgba(255, 126, 182, 0.22)', pattern: 'chevron', label: '#fff7fb', bgA: '#341021', bgB: '#130811' },
    { key: 'basalt', name: 'Basalt King', emoji: '🪶', price: 36, desc: 'Dark stone armor cracked with molten gold seams.', body: '#2a2931', head: '#7f7b86', accent: '#f2b84b', stripe: '#ffdd8d', belly: '#d6cfbf', eye: '#fff6c2', glow: 'rgba(242, 184, 75, 0.24)', pattern: 'ribs', label: '#f9f5ec', bgA: '#18151b', bgB: '#08070a' },
    { key: 'glacierfang', name: 'Glacier Fang', emoji: '🧊', price: 33, desc: 'Cut-glass ice plates with razor-bright blue stripes.', body: '#78b8e7', head: '#effaff', accent: '#7af0ff', stripe: '#b6f3ff', belly: '#ffffff', eye: '#d8fbff', glow: 'rgba(122, 240, 255, 0.24)', pattern: 'bands', label: '#fbffff', bgA: '#16344f', bgB: '#08111c' },
    { key: 'thunderclaw', name: 'Thunderclaw', emoji: '⚡', price: 27, desc: 'Charged cobalt scales with vivid lemon sparks.', body: '#2752d9', head: '#dce8ff', accent: '#ffe66d', stripe: '#7ec8ff', belly: '#f3f7ff', eye: '#fff9bf', glow: 'rgba(255, 230, 109, 0.22)', pattern: 'chevron', label: '#f8fbff', bgA: '#111f4a', bgB: '#060b17' },
    { key: 'neonlotus', name: 'Neon Lotus', emoji: '🪷', price: 31, desc: 'Bloom-pink petals wrapped around electric teal glass.', body: '#ff66c7', head: '#ffe6f5', accent: '#57f2d3', stripe: '#ff9de0', belly: '#fff2fb', eye: '#fff5b8', glow: 'rgba(87, 242, 211, 0.24)', pattern: 'ribs', label: '#fff8fd', bgA: '#351339', bgB: '#0d1324' },
    { key: 'ironfang', name: 'Iron Fang', emoji: '🦾', price: 18, desc: 'Gunmetal armor with bright steel bite marks.', body: '#5b6676', head: '#dde4ef', accent: '#a8b6cb', stripe: '#8a97aa', belly: '#eef3f8', eye: '#fdfdfd', glow: 'rgba(168, 182, 203, 0.18)', pattern: 'bands', label: '#fbfdff', bgA: '#1f2633', bgB: '#090d13' },
    { key: 'doomglow', name: 'Doomglow', emoji: '💀', price: 39, desc: 'A cursed midnight shell lit by venom-green cracks.', body: '#16171f', head: '#7fffa6', accent: '#6eff83', stripe: '#293d2b', belly: '#dfffe8', eye: '#fff8bf', glow: 'rgba(110, 255, 131, 0.26)', pattern: 'diamond', label: '#f5fff7', bgA: '#121316', bgB: '#040505' },
    { key: 'marshmint', name: 'Marsh Mint', emoji: '🍃', price: 15, desc: 'Swampy sage tones with soft mint highlights.', body: '#6cb88e', head: '#e5fff1', accent: '#b8f2cf', stripe: '#4e8f6f', belly: '#f4fff9', eye: '#efffef', glow: 'rgba(184, 242, 207, 0.18)', pattern: 'bands', label: '#fbfffd', bgA: '#173028', bgB: '#0a1511' },
    { key: 'crimsonflare', name: 'Crimson Flare', emoji: '🟥', price: 28, desc: 'Hot red scales with polished gold ember seams.', body: '#b91c1c', head: '#ffd6c7', accent: '#f59e0b', stripe: '#ff7d7d', belly: '#fff0e1', eye: '#fff1b2', glow: 'rgba(245, 158, 11, 0.22)', pattern: 'chevron', label: '#fff6f2', bgA: '#451010', bgB: '#160706' },
    { key: 'skyluxe', name: 'Sky Luxe', emoji: '☁️', price: 24, desc: 'Clean sky blues with bright luxury silver trim.', body: '#63a4ff', head: '#eff8ff', accent: '#d7ecff', stripe: '#9fd0ff', belly: '#ffffff', eye: '#f7ffff', glow: 'rgba(215, 236, 255, 0.2)', pattern: 'ribs', label: '#ffffff', bgA: '#173453', bgB: '#09111b' },
    { key: 'venombyte', name: 'Venom Byte', emoji: '🕷️', price: 35, desc: 'Poison-green circuitry over a black shell.', body: '#111917', head: '#ceff8b', accent: '#70ff5f', stripe: '#2fd477', belly: '#efffd4', eye: '#fff8b0', glow: 'rgba(112, 255, 95, 0.24)', pattern: 'diamond', label: '#f8ffe9', bgA: '#0a120d', bgB: '#020403' },
    { key: 'celestial', name: 'Celestial Coil', emoji: '✨', price: 43, desc: 'Star-silver plates with heavenly sapphire fire.', body: '#9fb8ff', head: '#f8fbff', accent: '#ffd670', stripe: '#d2dcff', belly: '#ffffff', eye: '#fff9ca', glow: 'rgba(255, 214, 112, 0.26)', pattern: 'diamond', label: '#ffffff', bgA: '#182448', bgB: '#070a12' },
    { key: 'miragegold', name: 'Mirage Gold', emoji: '🏺', price: 30, desc: 'Desert gold scales that shimmer like heat haze.', body: '#cf9f39', head: '#ffe4a8', accent: '#ffd97a', stripe: '#f5c45d', belly: '#fff1ca', eye: '#fff6c2', glow: 'rgba(255, 217, 122, 0.22)', pattern: 'ribs', label: '#fff9eb', bgA: '#4c3411', bgB: '#160d04' },
    { key: 'blackice', name: 'Black Ice', emoji: '🧊', price: 38, desc: 'Frozen obsidian with dangerous blue-white edges.', body: '#151d29', head: '#dff6ff', accent: '#8cecff', stripe: '#4c89ff', belly: '#f1fbff', eye: '#e7ffff', glow: 'rgba(140, 236, 255, 0.24)', pattern: 'bands', label: '#fbffff', bgA: '#0d1827', bgB: '#04080f' },
    { key: 'coppernova', name: 'Copper Nova', emoji: '🪙', price: 19, desc: 'Fresh copper scales with bright solar sparks.', body: '#c36b38', head: '#ffe0c7', accent: '#ffd166', stripe: '#ea8f5b', belly: '#fff1e5', eye: '#fff3bf', glow: 'rgba(255, 209, 102, 0.18)', pattern: 'bands', label: '#fff8f2', bgA: '#482111', bgB: '#160905' },
    { key: 'peppermint', name: 'Peppermint Twist', emoji: '🍭', price: 17, desc: 'Candy-red stripes over cool cream scales.', body: '#ffe5e5', head: '#fffafa', accent: '#ff5f7a', stripe: '#ff8aa2', belly: '#ffffff', eye: '#7a1028', glow: 'rgba(255, 95, 122, 0.18)', pattern: 'bands', label: '#ffffff', bgA: '#3f1822', bgB: '#14080d' },
    { key: 'duneflare', name: 'Dune Flare', emoji: '🏜️', price: 22, desc: 'Sandy bronze scales with a bright sunset edge.', body: '#c58a4b', head: '#ffe2b8', accent: '#ff9f43', stripe: '#e5b36d', belly: '#fff0d7', eye: '#fff5c1', glow: 'rgba(255, 159, 67, 0.2)', pattern: 'spots', label: '#fffaf3', bgA: '#4a2d18', bgB: '#170d06' },
    { key: 'lunarveil', name: 'Lunar Veil', emoji: '🌙', price: 34, desc: 'Silvery moonlight broken by soft violet shadows.', body: '#7f89b8', head: '#f4f7ff', accent: '#c4a7ff', stripe: '#a8b7ea', belly: '#ffffff', eye: '#fdf8c4', glow: 'rgba(196, 167, 255, 0.22)', pattern: 'diamond', label: '#fcfcff', bgA: '#1d2142', bgB: '#090b14' },
    { key: 'tempestopal', name: 'Tempest Opal', emoji: '🌩️', price: 42, desc: 'Pearled storm scales with shifting lightning color.', body: '#7ad3d6', head: '#f3ffff', accent: '#ff8be0', stripe: '#8ea7ff', belly: '#ffffff', eye: '#fff8ce', glow: 'rgba(255, 139, 224, 0.24)', pattern: 'rings', label: '#ffffff', bgA: '#12354c', bgB: '#0b1021' },
    { key: 'mossforge', name: 'Moss Forge', emoji: '🌲', price: 20, desc: 'Forged green plates with earthy bronze seams.', body: '#52734d', head: '#dff0cb', accent: '#b68d40', stripe: '#7ba56f', belly: '#f3ffe4', eye: '#fff4c7', glow: 'rgba(182, 141, 64, 0.18)', pattern: 'ribs', label: '#fcfff9', bgA: '#1d2817', bgB: '#0a0f08' },
    { key: 'rubystrike', name: 'Ruby Strike', emoji: '♦️', price: 36, desc: 'Deep ruby armor cut with high-polish white facets.', body: '#8f1239', head: '#ffd5e3', accent: '#fca5a5', stripe: '#c0264f', belly: '#fff0f5', eye: '#fff2c0', glow: 'rgba(252, 165, 165, 0.22)', pattern: 'diamond', label: '#fff8fb', bgA: '#360c1d', bgB: '#12060a' },
    { key: 'citrinecoil', name: 'Citrine Coil', emoji: '💎', price: 25, desc: 'Warm gemstone yellow with glossy honey light.', body: '#d9a81f', head: '#fff0b8', accent: '#ffe27a', stripe: '#f7c948', belly: '#fff5d9', eye: '#fff8cb', glow: 'rgba(255, 226, 122, 0.2)', pattern: 'chevron', label: '#fffdf4', bgA: '#43300c', bgB: '#140d04' },
    { key: 'vaporwave', name: 'Vaporwave Coil', emoji: '📼', price: 32, desc: 'Retro pink and cyan lights with arcade-night shine.', body: '#ff5ebc', head: '#ffe3f4', accent: '#54e8ff', stripe: '#9e7bff', belly: '#fff2fb', eye: '#fff7b8', glow: 'rgba(84, 232, 255, 0.24)', pattern: 'chevron', label: '#fff9ff', bgA: '#35114a', bgB: '#0d1022' },
    { key: 'titanblue', name: 'Titan Blue', emoji: '🔵', price: 26, desc: 'Heavy cobalt plates with bright arctic trim.', body: '#1d4ed8', head: '#dbeafe', accent: '#93c5fd', stripe: '#60a5fa', belly: '#eff6ff', eye: '#f8ffff', glow: 'rgba(147, 197, 253, 0.2)', pattern: 'ribs', label: '#f8fbff', bgA: '#132553', bgB: '#060d1d' },
    { key: 'emberroyal', name: 'Ember Royal', emoji: '👑', price: 44, desc: 'Regal purple scales with molten crown-gold seams.', body: '#5b21b6', head: '#efe2ff', accent: '#ffb703', stripe: '#8b5cf6', belly: '#f8f0ff', eye: '#fff2bd', glow: 'rgba(255, 183, 3, 0.26)', pattern: 'diamond', label: '#fffaff', bgA: '#21103d', bgB: '#0b0615' },
    { key: 'polarpulse', name: 'Polar Pulse', emoji: '🐻', price: 23, desc: 'Bright polar whites driven by frozen cyan light.', body: '#dbeafe', head: '#ffffff', accent: '#67e8f9', stripe: '#a5f3fc', belly: '#ffffff', eye: '#defdff', glow: 'rgba(103, 232, 249, 0.2)', pattern: 'bands', label: '#ffffff', bgA: '#17354a', bgB: '#091018' },
    { key: 'eclipsefang', name: 'Eclipse Fang', emoji: '🌘', price: 40, desc: 'Dark violet armor crossed by a solar gold bite.', body: '#1f1634', head: '#d8d0ff', accent: '#facc15', stripe: '#6d52c7', belly: '#f4eeff', eye: '#fff7c1', glow: 'rgba(250, 204, 21, 0.24)', pattern: 'diamond', label: '#fcfaff', bgA: '#120c21', bgB: '#05040a' },
    { key: 'orchardblitz', name: 'Orchard Blitz', emoji: '🍎', price: 16, desc: 'Bright apple-red scales with crisp green leaf accents.', body: '#d92d20', head: '#ffd7d1', accent: '#58cc68', stripe: '#f97373', belly: '#fff1ef', eye: '#fff3c2', glow: 'rgba(88, 204, 104, 0.18)', pattern: 'spots', label: '#fff9f8', bgA: '#451314', bgB: '#110807' },
    { key: 'seafoam', name: 'Seafoam Drift', emoji: '🌊', price: 18, desc: 'Cool teal currents with smooth white sea-spray trim.', body: '#2db6a3', head: '#e6fffb', accent: '#9df6e6', stripe: '#66d9cf', belly: '#f3fffd', eye: '#efffff', glow: 'rgba(157, 246, 230, 0.18)', pattern: 'smooth', label: '#fcfffe', bgA: '#123430', bgB: '#071412' },
    { key: 'chromeghost', name: 'Chrome Ghost', emoji: '👻', price: 37, desc: 'Mirror-steel scales haunted by pale blue glow.', body: '#94a3b8', head: '#f8fbff', accent: '#cbd5e1', stripe: '#7dd3fc', belly: '#ffffff', eye: '#effaff', glow: 'rgba(125, 211, 252, 0.22)', pattern: 'ribs', label: '#ffffff', bgA: '#202a36', bgB: '#0b0f14' },
    { key: 'infernobloom', name: 'Inferno Bloom', emoji: '🌺', price: 29, desc: 'A blazing floral palette with ember-orange petals.', body: '#e11d48', head: '#ffd3dd', accent: '#fb923c', stripe: '#f472b6', belly: '#fff0f5', eye: '#fff4bf', glow: 'rgba(251, 146, 60, 0.22)', pattern: 'spots', label: '#fff8fb', bgA: '#47111f', bgB: '#17080b' },
    { key: 'sapphirestorm', name: 'Sapphire Storm', emoji: '💙', price: 35, desc: 'Royal sapphire scales flashing with storm-white light.', body: '#1d3ea6', head: '#e1ebff', accent: '#f8fafc', stripe: '#60a5fa', belly: '#f8fbff', eye: '#ffffff', glow: 'rgba(248, 250, 252, 0.22)', pattern: 'rings', label: '#ffffff', bgA: '#0f1a47', bgB: '#050811' },
    { key: 'honeycomb', name: 'Honeycomb', emoji: '🍯', price: 21, desc: 'Amber-gold scales stacked like glowing comb cells.', body: '#d97706', head: '#ffe3a3', accent: '#fcd34d', stripe: '#f59e0b', belly: '#fff2c9', eye: '#fff7c2', glow: 'rgba(252, 211, 77, 0.2)', pattern: 'spots', label: '#fffaf0', bgA: '#482f0b', bgB: '#160d03' },
    { key: 'plaguefang', name: 'Plague Fang', emoji: '☣️', price: 38, desc: 'Rot-green venom scales with diseased neon seams.', body: '#365314', head: '#eaffb8', accent: '#a3e635', stripe: '#65a30d', belly: '#f7ffd9', eye: '#fff7bd', glow: 'rgba(163, 230, 53, 0.24)', pattern: 'speckle', label: '#fbffee', bgA: '#18260a', bgB: '#060904' },
    { key: 'pixelprince', name: 'Pixel Prince', emoji: '🕹️', price: 27, desc: 'Retro arcade blues and pinks in a crisp 8-bit palette.', body: '#4f46e5', head: '#e0e7ff', accent: '#f472b6', stripe: '#22d3ee', belly: '#f5f3ff', eye: '#fff6c0', glow: 'rgba(34, 211, 238, 0.22)', pattern: 'bands', label: '#fcfbff', bgA: '#1d1b4b', bgB: '#090915' },
    { key: 'sunforge', name: 'Sunforge Serpent', emoji: '☀️', price: 46, desc: 'Forged in white-hot gold with radiant sunfire seams.', body: '#d4a017', head: '#fff3bf', accent: '#ff7a18', stripe: '#ffe08a', belly: '#fff7dc', eye: '#fff9cf', glow: 'rgba(255, 122, 24, 0.28)', pattern: 'diamond', label: '#fffdf6', bgA: '#4a3107', bgB: '#160d03' },
    { key: 'nightgarden', name: 'Night Garden', emoji: '🌺', price: 24, desc: 'Dark floral violets with mint-lit petal seams.', body: '#5b2c83', head: '#f0ddff', accent: '#6ee7b7', stripe: '#c084fc', belly: '#f8efff', eye: '#fff6c4', glow: 'rgba(110, 231, 183, 0.2)', pattern: 'speckle', label: '#fefaff', bgA: '#221032', bgB: '#0a0c17' },
    { key: 'arcticember', name: 'Arctic Ember', emoji: '🧯', price: 33, desc: 'Frost-white plates cut by sudden ember-red fractures.', body: '#dbeafe', head: '#ffffff', accent: '#ef4444', stripe: '#7dd3fc', belly: '#ffffff', eye: '#fff5c2', glow: 'rgba(239, 68, 68, 0.22)', pattern: 'chevron', label: '#ffffff', bgA: '#163049', bgB: '#120809' },
    { key: 'opaline', name: 'Opaline Rush', emoji: '🪩', price: 31, desc: 'Soft opal color shifts with a disco-bright shimmer.', body: '#9ce7d7', head: '#f7fffe', accent: '#ffa1cf', stripe: '#b7b6ff', belly: '#ffffff', eye: '#fffad1', glow: 'rgba(255, 161, 207, 0.22)', pattern: 'rings', label: '#ffffff', bgA: '#173641', bgB: '#141225' },
    { key: 'voidflare', name: 'Void Flare', emoji: '🕳️', price: 47, desc: 'Near-black cosmic armor torn open by magma light.', body: '#0f0f17', head: '#ffd8b4', accent: '#ff5a36', stripe: '#5b21b6', belly: '#fff0e6', eye: '#fff3bf', glow: 'rgba(255, 90, 54, 0.28)', pattern: 'diamond', label: '#fffaf6', bgA: '#120d1f', bgB: '#040304' },
    { key: 'nightcipherx', name: 'Night Cipher X', emoji: '🛰️', price: 68, desc: 'Encrypted onyx armor traced with bright cyan signal lines.', body: '#090f1d', head: '#dff9ff', accent: '#3dd9ff', stripe: '#7cf8ff', belly: '#d8ecff', eye: '#f2fdff', glow: 'rgba(61, 217, 255, 0.28)', pattern: 'chevron', label: '#f4fcff', bgA: '#07101e', bgB: '#02050b' },
    { key: 'hyperioncrown', name: 'Hyperion Crown', emoji: '🌞', price: 84, desc: 'White-hot gold armor with reactor-bright bands built for long grind flexes.', body: '#d89b0b', head: '#fff0b0', accent: '#fff8dd', stripe: '#ffd668', belly: '#fff6d6', eye: '#ffffff', glow: 'rgba(255, 214, 104, 0.32)', pattern: 'rings', label: '#fffdf1', bgA: '#573000', bgB: '#191003' },
    { key: 'quantumcoilx', name: 'Quantum Coil X', emoji: '🧿', price: 106, desc: 'Glitchy cobalt and magenta panels that look half-loaded from another timeline.', body: '#14245d', head: '#e1e7ff', accent: '#ff5fbd', stripe: '#6ee7ff', belly: '#dce9ff', eye: '#fff7d1', glow: 'rgba(255, 95, 189, 0.28)', pattern: 'spots', label: '#faf8ff', bgA: '#0d1440', bgB: '#060713' },
    { key: 'seraphveilx', name: 'Seraph Veil', emoji: '👼', price: 132, desc: 'Celestial ivory scales wrapped in halo-blue light with a divine afterglow.', body: '#d9d7e8', head: '#ffffff', accent: '#8ad6ff', stripe: '#d8eaff', belly: '#fffdf4', eye: '#ffe7a3', glow: 'rgba(138, 214, 255, 0.34)', pattern: 'ribs', label: '#ffffff', bgA: '#2b314b', bgB: '#0d111c' },
    { key: 'angelskin', name: 'Angel', emoji: '😇', price: 0, tierPrice: 144, unlockMode: 'achievement', unlockHint: 'Beat Arch Angel', desc: 'Achievement-only divine skin with radiant wings, hymn-light seams, and a sanctified halo bloom.', body: '#f1efff', head: '#ffffff', accent: '#8bdcff', stripe: '#fff0b2', belly: '#fffef8', eye: '#ffe7a8', glow: 'rgba(139, 220, 255, 0.42)', pattern: 'angelic', fxVariant: 'angelic', label: '#ffffff', bgA: '#223659', bgB: '#070d18', shine: 'rgba(255,255,255,0.48)' },
    { key: 'voidmiragex', name: 'Void Mirage', emoji: '🌌', price: 158, desc: 'A black-hole finish with violet lensing, cold silver edges, and collector-only menace.', body: '#0c0916', head: '#cfc8ff', accent: '#8f7cff', stripe: '#7ee7ff', belly: '#d9d5f4', eye: '#fff7c8', glow: 'rgba(143, 124, 255, 0.34)', pattern: 'diamond', label: '#f7f4ff', bgA: '#140a24', bgB: '#030309' },
    { key: 'crownstarapex', name: 'Crownstar Apex', emoji: '🌟', price: 188, desc: 'Royal midnight armor splashed with comet gold for people hoarding serious coin.', body: '#18265f', head: '#eef2ff', accent: '#ffd369', stripe: '#91a8ff', belly: '#f8f0d9', eye: '#fff6be', glow: 'rgba(255, 211, 105, 0.36)', pattern: 'chevron', label: '#fffdf8', bgA: '#0d1540', bgB: '#04050d' },
    { key: 'worldeaterprime', name: 'Worldeater Prime', emoji: '🐲', price: 260, desc: 'Ridiculous endgame scales forged for achievement farmers who still need something expensive.', body: '#1f3f34', head: '#e7ffd4', accent: '#ff7a45', stripe: '#83f0bd', belly: '#fff0ce', eye: '#fff8ba', glow: 'rgba(131, 240, 189, 0.38)', pattern: 'diamond', label: '#fbfff7', bgA: '#10281f', bgB: '#170905' },
    { key: 'feverdealer', name: 'Fever Dealer', emoji: '🎰', price: 54, desc: 'Casino-black scales with cream panels, gold trim, and fever-pink lights.', body: '#13151d', head: '#fff3d8', accent: '#ffd54f', stripe: '#ff4fa3', belly: '#effff6', eye: '#70ffd8', glow: 'rgba(255, 79, 163, 0.3)', pattern: 'jackpot', label: '#fff8e8', bgA: '#24110f', bgB: '#090c16' },
    { key: 'loadedluck', name: 'Loaded Luck', emoji: '🎲', price: 58, desc: 'Ivory ceramic plates splashed with emerald odds and black-pip attitude.', body: '#f4f1e8', head: '#ffffff', accent: '#3df2a4', stripe: '#16191f', belly: '#fffdfa', eye: '#101621', glow: 'rgba(61, 242, 164, 0.28)', pattern: 'spots', label: '#ffffff', bgA: '#123024', bgB: '#080b12' },
    { key: 'pitbossprime', name: 'Pit Boss Prime', emoji: '🃏', price: 64, desc: 'Tuxedo noir with platinum shine and a hot-red table-edge streak.', body: '#111318', head: '#e8ecf2', accent: '#ff5a4d', stripe: '#d9dee8', belly: '#f6f8fb', eye: '#ffd36d', glow: 'rgba(255, 90, 77, 0.26)', pattern: 'diamond', label: '#fcfdff', bgA: '#261217', bgB: '#06080d' },
    { key: 'luckyhalo', name: 'Lucky Halo', emoji: '🍀', price: 72, desc: 'Cream suit-white scales caught in mint luck and pink fever light.', body: '#efe8d8', head: '#fffdf7', accent: '#67f7c4', stripe: '#ff70b7', belly: '#ffffff', eye: '#19342c', glow: 'rgba(255, 112, 183, 0.28)', pattern: 'chevron', label: '#fffef8', bgA: '#18312d', bgB: '#190d18' },
    { key: 'midnightraffle', name: 'Midnight Raffle', emoji: '🎟️', price: 82, desc: 'Deep indigo raffle stubs with violet foil and electric cyan edges.', body: '#1b2457', head: '#e6eaff', accent: '#63e6ff', stripe: '#a78bfa', belly: '#eff2ff', eye: '#fff6c5', glow: 'rgba(99, 230, 255, 0.28)', pattern: 'ribs', label: '#fbfcff', bgA: '#0f1440', bgB: '#050712' },
    { key: 'serpentsofchance', name: 'Serpents of Chance', emoji: '🎴', price: 94, desc: 'Card-table crimson and obsidian coils with gleaming gold verdict lines.', body: '#2b0e16', head: '#ffe5d0', accent: '#ffd166', stripe: '#ef4444', belly: '#fff1e4', eye: '#fff7c9', glow: 'rgba(255, 209, 102, 0.3)', pattern: 'bands', label: '#fff9f2', bgA: '#3f1018', bgB: '#0b070d' },
    { key: 'royalflushx', name: 'Royal Flush X', emoji: '♠️', price: 118, desc: 'Jet-black luxury armor with four-suit flashes and collector-grade polish.', body: '#0e1015', head: '#f5f6fb', accent: '#ff4d6d', stripe: '#7cf2ff', belly: '#ffffff', eye: '#ffd166', glow: 'rgba(124, 242, 255, 0.3)', pattern: 'rings', label: '#ffffff', bgA: '#240b13', bgB: '#05070b' },
    { key: 'idledeath', name: 'Idle Death', emoji: '☄️', price: 136, desc: 'A lethal silver-and-burgundy fever skin with hard neon cuts.', body: '#d6d7db', head: '#ffffff', accent: '#8b1e3f', stripe: '#ff66b3', belly: '#fff8f7', eye: '#3b1020', glow: 'rgba(255, 102, 179, 0.28)', pattern: 'diamond', label: '#ffffff', bgA: '#34121f', bgB: '#0d1117' },
    { key: 'housecollapse', name: 'House Collapse', emoji: '💸', price: 168, desc: 'Mint jackpots and champagne gold bursting through a midnight shell.', body: '#141821', head: '#f5efdc', accent: '#6ee7b7', stripe: '#facc15', belly: '#fffaf0', eye: '#eafffa', glow: 'rgba(110, 231, 183, 0.32)', pattern: 'chevron', label: '#fffdf6', bgA: '#10281f', bgB: '#110d18' },
    { key: 'probabilityzero', name: 'Probability Zero', emoji: '🎇', price: 220, desc: 'An absurd fever-dream finish of ivory, noir, pink sparks, and lucky cyan fire.', body: '#111216', head: '#fff8ea', accent: '#58f7e8', stripe: '#ff4da6', belly: '#fffdf8', eye: '#ffe27a', glow: 'rgba(88, 247, 232, 0.34)', pattern: 'jackpot', label: '#fffdf7', bgA: '#2a1118', bgB: '#061018' },
    { key: 'wormholewyrm', name: 'Wormhole Wyrm', emoji: '🌀', price: 176, desc: 'Folded-space indigo coils with cyan tunnel rings and violet tear-light drifting through the void.', body: '#101436', head: '#eef2ff', accent: '#65e9ff', stripe: '#a855f7', belly: '#e7ebff', eye: '#fff1b8', glow: 'rgba(101, 233, 255, 0.34)', pattern: 'orbit', fxVariant: 'nebula', label: '#f8fbff', bgA: '#070b2d', bgB: '#1a062b' },
    { key: 'quasarrail', name: 'Quasar Rail', emoji: '💫', price: 232, desc: 'A star-lanced rail look with cobalt armor, white-hot seams, and blinding comet wake lines.', body: '#0b1330', head: '#f4f8ff', accent: '#7cf8ff', stripe: '#ffd369', belly: '#eef5ff', eye: '#ffffff', glow: 'rgba(124, 248, 255, 0.36)', pattern: 'orbit', label: '#ffffff', bgA: '#050d26', bgB: '#180c3f' },
    { key: 'eventhorizon', name: 'Event Horizon', emoji: '🎯', price: 312, desc: 'An original black-hole marksman finish inspired by sleek sniper energy: obsidian shell, white-metal rails, ember slit lights, and a red optic burn.', body: '#06080d', head: '#eef3fb', accent: '#ff5b2e', stripe: '#f5f7ff', belly: '#d8dfeb', eye: '#ffb54f', glow: 'rgba(255, 91, 46, 0.4)', pattern: 'horizon', fxVariant: 'blackhole', label: '#fffdf9', bgA: '#050608', bgB: '#24080c' },
    { key: 'accretioncrown', name: 'Accretion Crown', emoji: '🌠', price: 328, desc: 'Dead-black armor wrapped in a white-hot accretion ring with royal violet lens flare cutting through the dark.', body: '#04060c', head: '#eef3ff', accent: '#ffb86b', stripe: '#8b5cf6', belly: '#dce5ff', eye: '#fff2b7', glow: 'rgba(255, 184, 107, 0.42)', pattern: 'accretion', fxVariant: 'blackhole', label: '#fffdf8', bgA: '#050816', bgB: '#22071d' },
    { key: 'eclipsemaw', name: 'Eclipse Maw', emoji: '🌘', price: 344, desc: 'A solar-eclipse predator finish with a gold-white crescent, ember corona burn, and a pitch-dark bite line.', body: '#040508', head: '#fff2da', accent: '#ffbe0b', stripe: '#ff6b35', belly: '#efe5d4', eye: '#fff7c6', glow: 'rgba(255, 190, 11, 0.42)', pattern: 'eclipse', fxVariant: 'blackhole', label: '#fffdfa', bgA: '#0a0a12', bgB: '#311007' },
    { key: 'nebulashroud', name: 'Nebula Shroud', emoji: '🌌', price: 368, desc: 'Midnight scales flooded with pink-cyan nebula gas, tiny stars, and galaxy haze spilling over the whole body.', body: '#090d1b', head: '#f2e9ff', accent: '#ff68d6', stripe: '#58f7e8', belly: '#e7edff', eye: '#ffffff', glow: 'rgba(255, 104, 214, 0.42)', pattern: 'nebula', fxVariant: 'nebula', label: '#fffafe', bgA: '#090b1e', bgB: '#220a36' },
    { key: 'voidcathedral', name: 'Void Cathedral', emoji: '🕳️', price: 416, desc: 'Impossible cathedral-black plating with cyan lensing arches and a center that looks way too deep to be real.', body: '#020308', head: '#eef4ff', accent: '#7cf8ff', stripe: '#9b7cff', belly: '#d7def7', eye: '#ffe27a', glow: 'rgba(124, 248, 255, 0.44)', pattern: 'accretion', fxVariant: 'blackhole', label: '#fbfdff', bgA: '#040713', bgB: '#1d0627' },
    { key: 'singularity', name: 'Singularity', emoji: '🕳️', price: 388, desc: 'Collapsed-space royal void with cyan lensing, violet gravity arcs, and impossible light curling around a dead-black core.', body: '#04050a', head: '#edf1ff', accent: '#7f5cff', stripe: '#58f7e8', belly: '#dbe0ff', eye: '#ffe27a', glow: 'rgba(127, 92, 255, 0.42)', pattern: 'singularity', fxVariant: 'blackhole', label: '#fcfdff', bgA: '#050613', bgB: '#21052b' },
    { key: 'gravitonreign', name: 'Graviton Reign', emoji: '👑', price: 452, desc: 'An absurd endgame black-hole sovereign with white accretion fire, royal violet fractures, and comet-cold cyan drag.', body: '#02030a', head: '#f8fbff', accent: '#9d7cff', stripe: '#63f2ff', belly: '#e4e8ff', eye: '#fff1b0', glow: 'rgba(157, 124, 255, 0.46)', pattern: 'singularity', fxVariant: 'blackhole', label: '#ffffff', bgA: '#040611', bgB: '#2a0737' }
  ];

  // Moderate the shop economy so skins usually take 1 to 2 achievement payouts.
  snakeSkins.forEach(skin => {
    skin.catalogPrice = skin.price || 0;
    skin.price = Math.round((skin.catalogPrice || 0) * priceInflationMultiplier);
  });

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
  let lastTurnPreviewAt = 0;
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
  let nextSkinAmbientParticleAt = 0;
  let floatingTexts = [];
  let trackingLasers = [];
  let skyBeams = [];
  let screenShake = 0;
  let screenFlashAlpha = 0;
  let screenFlashColor = 'rgba(255,255,255,0.14)';
  let jackpotMode = false;
  let jackpotLuckBonusActive = false;
  let realmMessage = '';
  let realmMessageUntil = 0;
  let stageBanner = null;
  let currentScreen = 'home';
  let endlessMode = false;
  let playerName = 'Player';
  let jackpotHud = { mode: 'XP', nextRollAt: 0 };
  let audioEnabled = true;
  let activeProfileId = '';
  let accountNotice = '';
  const audioState = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    unlocked: false,
    scene: '',
    nextMusicAt: 0,
    step: 0,
    lastMoveAt: 0,
    lastBossHumAt: 0,
    jackpotVariant: Math.random() < 0.5 ? 'rush' : 'glow'
  };
  const leaderboardStorageKey = 'snakeEndlessLeaderboard';
  const coinStorageKey = 'snakeCoins';
  const dailyRewardStorageKey = 'snakeDailyRewardAt';
  const spinReadyAtStorageKey = 'snakeSpinReadyAt';
  const challengeStateStorageKey = 'snakeChallengeState';
  const missionStreakStorageKey = 'snakeMissionStreak';
  const audioEnabledStorageKey = 'snakeAudioEnabled';
  const coinEconomyVersionKey = 'snakeCoinEconomyVersion';
  const coinEconomyVersion = '2';
  const saveSnapshotVersion = 1;
  const saveLinkParam = 'save';
  const localWebCopyUrl = 'http://127.0.0.1:8000/';
  const localSyncEndpoint = `${localWebCopyUrl}__snake_sync__`;
  const playerNameStorageKey = 'snakePlayerName';
  const bestScoreStorageKey = 'snakeBestScore';
  const ownedSkinsStorageKey = 'snakeOwnedSkins';
  const equippedSkinStorageKey = 'snakeEquippedSkin';
  const achievementStorageKey = 'snakeAchievements';
  const lifetimeStatsStorageKey = 'snakeLifetimeStats';
  const dockNoticeStorageKey = 'snakeDockNoticeSeen';
  const leaderboardOverrideStorageKey = 'snakeLeaderboardOverridePermanent';
  const angelAutoPickStorageKey = 'snakeAngelAutoPickChoice';
  const activeProfileStorageKey = 'snakeActiveProfileId';
  const profileStoragePrefix = 'snakeProfile:';
  const cheatCatalog = [
    { code: 'fghjfghjfghjfghjfghj', title: 'Room Code', desc: 'Opens the hidden cheat room.' },
    { code: 'god', title: 'God Mode', desc: 'Become invincible to walls, obstacles, and self-collisions.' },
    { code: 'jackpot', title: 'Jackpot', desc: 'Unlock the jackpot skin and bonus HUD.' },
    { code: 'leaderboardabusing', title: 'Leaderboard Override Once', desc: 'In endless mode, the next cheat stays leaderboard-safe one time.' },
    { code: 'leaderboardabusingyes', title: 'Leaderboard Override Permanent', desc: 'Turns on permanent endless leaderboard cheat protection until you disable it.' },
    { code: 'leaderboardingabusingno', title: 'Leaderboard Override Off', desc: 'Turns off the permanent endless leaderboard override and clears queued one-time uses.' },
    { code: 'heal', title: 'Heal', desc: 'Refill your health to maximum.' },
    { code: 'clear', title: 'Clear', desc: 'Wipe the arena threats and projectiles.' },
    { code: 'smite', title: 'Smite', desc: 'Delete angels and cash in rewards.' },
    { code: 'halo', title: 'Halo', desc: 'Gain a free vigor and reflex upgrade.' },
    { code: 'bless', title: 'Bless', desc: 'Drop a heal pickup instantly.' },
    { code: 'next', title: 'Next', desc: 'Skip to the next round immediately.' },
    { code: 'food', title: 'Pear Flood', desc: 'Fill the board with bonus pears.' },
    { code: 'aim', title: 'Aim', desc: 'Toggle the smart auto-pilot.' },
    { code: 'aimbot', title: 'Aimbot', desc: 'Same as aim, with the long-form code.' },
    { code: 'zoom', title: 'Zoom', desc: 'Speed up the snake. You can add a number, like zoom3.' },
    { code: 'unzoom', title: 'Unzoom', desc: 'Slow the snake down. You can add a number, like unzoom2.' },
    { code: 'zoom normal', title: 'Zoom Normal', desc: 'Reset the speed cheat back to normal.' },
    { code: 'unzoom normal', title: 'Unzoom Normal', desc: 'Also resets speed back to normal.' }
  ];
  let cheatsUsedThisRun = false;
  let leaderboardAbuseMode = false;
  let leaderboardOverrideCharges = 0;
  let leaderboardOverrideUsedThisRun = false;
  let leaderboardDisqualifyingCheatUsed = false;
  let leaderboardSavedThisLife = false;
  let endlessLeaderboard = [];
  let lastLeaderboardResult = null;
  let paused = false;
  let coins = 0;
  let comboCount = 0;
  let comboTimer = 0;
  let roundDamageTaken = 0;
  let perfectRoundChain = 0;
  let pendingBlessingChoices = 0;
  let currentBlessingOptions = [];
  let blessingSelectionOpen = false;
  let angelAutoPickChoice = 0;
  let blessingAutoPickTimer = null;
  let bestScore = 0;
  let ownedSkins = ['classic'];
  let equippedSkin = 'classic';
  let shopOpen = false;
  let infoPanel = '';
  let spinReadyAt = 0;
  let lastSpinResult = '';
  let spinAnimationState = null;
  let spinAnimationToken = 0;
  let challengeState = null;
  let missionStreak = { count: 0, best: 0, lastCompletedDate: '' };
  let countdownStartedAt = 0;
  let countdownLeadSeconds = 0;
  let lastCountdownActive = false;
  let lastHudHealthValue = null;
  let achievements = {};
  let lifetimeStats = {};
  let dockNoticeSeen = {};
  let achievementToastQueue = [];
  let activeAchievementToast = null;
  let achievementToastUntil = 0;
  let activeAchievementToastSignature = '';
  let syncingAchievements = false;
  let eventCelebrationUntil = 0;
  let eventCelebrationReward = 0;
  let eventCelebrationToken = 0;
  const countdownGoDurationMs = 850;
  const achievementToastDurationMs = 4200;
  const numberFormatter = new Intl.NumberFormat('en-US');
  const achievementDefs = [
    { key: 'first-bite', title: 'First Bite', desc: 'Eat your first apple.', reward: 3, target: 1, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-scout', title: 'Orchard Scout', desc: 'Eat 10 apples.', reward: 5, target: 10, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-lord', title: 'Orchard Lord', desc: 'Eat 50 apples.', reward: 10, target: 50, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-chief', title: 'Orchard Chief', desc: 'Eat 100 apples.', reward: 14, target: 100, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-royal', title: 'Orchard Royal', desc: 'Eat 500 apples.', reward: 22, target: 500, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-mythic', title: 'Orchard Mythic', desc: 'Eat 1,000 apples.', reward: 32, target: 1000, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-galaxy', title: 'Orchard Galaxy', desc: 'Eat 10,000 apples.', reward: 70, target: 10000, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-infinite', title: 'Orchard Infinite', desc: 'Eat 100,000 apples.', reward: 140, target: 100000, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-celestial', title: 'Orchard Celestial', desc: 'Eat 250,000 apples.', reward: 220, target: 250000, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'orchard-apotheosis', title: 'Orchard Apotheosis', desc: 'Eat 500,000 apples.', reward: 320, target: 500000, progress: () => lifetimeStats.applesEaten || 0 },
    { key: 'pear-picker', title: 'Pear Picker', desc: 'Eat your first bonus pear.', reward: 4, target: 1, progress: () => lifetimeStats.bonusPearsEaten || 0 },
    { key: 'pear-storm', title: 'Pear Storm', desc: 'Eat 15 bonus pears.', reward: 8, target: 15, progress: () => lifetimeStats.bonusPearsEaten || 0 },
    { key: 'arcade-starter', title: 'Arcade Starter', desc: 'Start 1 run.', reward: 3, target: 1, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-regular', title: 'Arcade Regular', desc: 'Start 10 runs.', reward: 7, target: 10, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-habit', title: 'Arcade Habit', desc: 'Start 50 runs.', reward: 14, target: 50, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-marathon', title: 'Arcade Marathon', desc: 'Start 100 runs.', reward: 22, target: 100, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-machine', title: 'Arcade Machine', desc: 'Start 250 runs.', reward: 36, target: 250, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-forever', title: 'Arcade Forever', desc: 'Start 500 runs.', reward: 54, target: 500, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-overdrive', title: 'Arcade Overdrive', desc: 'Start 750 runs.', reward: 72, target: 750, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-immortal', title: 'Arcade Immortal', desc: 'Start 1,000 runs.', reward: 95, target: 1000, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-eternal', title: 'Arcade Eternal', desc: 'Start 1,500 runs.', reward: 130, target: 1500, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'arcade-cosmos', title: 'Arcade Cosmos', desc: 'Start 2,000 runs.', reward: 180, target: 2000, progress: () => lifetimeStats.gamesStarted || 0 },
    { key: 'round-runner', title: 'Round Runner', desc: 'Clear 5 rounds.', reward: 6, target: 5, progress: () => lifetimeStats.roundsCleared || 0 },
    { key: 'round-veteran', title: 'Round Veteran', desc: 'Clear 20 rounds.', reward: 10, target: 20, progress: () => lifetimeStats.roundsCleared || 0 },
    { key: 'endless-step', title: 'Endless Step', desc: 'Survive 1 endless round.', reward: 5, target: 1, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-core', title: 'Endless Core', desc: 'Survive 8 endless rounds.', reward: 12, target: 8, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'score-hunter', title: 'Score Hunter', desc: 'Reach a high score of 100.', reward: 8, target: 100, progress: () => bestScore || 0 },
    { key: 'score-beast', title: 'Score Beast', desc: 'Reach a high score of 300.', reward: 14, target: 300, progress: () => bestScore || 0 },
    { key: 'coin-pouch', title: 'Coin Pouch', desc: 'Hold 25 coins at once.', reward: 5, target: 25, progress: () => coins || 0 },
    { key: 'coin-vault', title: 'Coin Vault', desc: 'Hold 120 coins at once.', reward: 14, target: 120, progress: () => coins || 0 },
    { key: 'coin-foundry', title: 'Coin Foundry', desc: 'Earn 250 total coins.', reward: 12, target: 250, progress: () => lifetimeStats.coinsEarned || 0 },
    { key: 'coin-constellation', title: 'Coin Constellation', desc: 'Earn 1,000 total coins.', reward: 28, target: 1000, progress: () => lifetimeStats.coinsEarned || 0 },
    { key: 'coin-singularity', title: 'Coin Singularity', desc: 'Earn 5,000 total coins.', reward: 70, target: 5000, progress: () => lifetimeStats.coinsEarned || 0 },
    { key: 'fresh-name', title: 'Fresh Name', desc: 'Rename yourself once.', reward: 3, target: 1, progress: () => lifetimeStats.nameChanges || 0 },
    { key: 'daily-regular', title: 'Daily Regular', desc: 'Claim 3 daily rewards.', reward: 8, target: 3, progress: () => lifetimeStats.dailyClaims || 0 },
    { key: 'wheel-winner', title: 'Wheel Winner', desc: 'Use Lucky Spin 5 times.', reward: 8, target: 5, progress: () => lifetimeStats.spinsUsed || 0 },
    { key: 'code-breaker', title: 'Code Breaker', desc: 'Use any cheat code.', reward: 6, target: 1, progress: () => lifetimeStats.cheatsUsed || 0 },
    { key: 'cheats-found', title: 'Cheats Found', desc: 'Discover the cheat room.', reward: 15, target: 1, progress: () => lifetimeStats.cheatRoomsFound || 0, secret: 'desc' },
    { key: 'angel-call', title: 'Angel Call', desc: 'Enter the Angel Realm.', reward: 8, target: 1, progress: () => lifetimeStats.angelEntries || 0, secret: 'full' },
    { key: 'boss-breaker', title: 'Boss Breaker', desc: 'Defeat the Arch Angel.', reward: 15, target: 1, progress: () => lifetimeStats.bossDefeats || 0, secret: 'full' },
    { key: 'angelic-ascension', title: 'Angelic Ascension', desc: 'Defeat the Arch Angel and unlock the Angel skin.', reward: 0, rewardText: 'Angel skin', skinReward: 'angelskin', target: 1, progress: () => lifetimeStats.bossDefeats || 0, secret: 'full' },
    { key: 'boss-baron', title: 'Boss Baron', desc: 'Defeat the Arch Angel 3 times.', reward: 28, target: 3, progress: () => lifetimeStats.bossDefeats || 0, secret: 'full' },
    { key: 'boss-overlord', title: 'Boss Overlord', desc: 'Defeat the Arch Angel 10 times.', reward: 60, target: 10, progress: () => lifetimeStats.bossDefeats || 0, secret: 'full' },
    { key: 'closet-open', title: 'Closet Open', desc: 'Buy your first skin.', reward: 5, target: 1, progress: () => lifetimeStats.skinsBought || 0 },
    { key: 'style-shelf', title: 'Style Shelf', desc: 'Own 10 skins.', reward: 10, target: 10, progress: () => Math.max(0, ownedSkins.length - 1) },
    { key: 'skin-hoarder', title: 'Skin Hoarder', desc: 'Own 20 skins.', reward: 18, target: 20, progress: () => Math.max(0, ownedSkins.length - 1) },
    { key: 'skin-vault', title: 'Skin Vault', desc: 'Own 30 skins.', reward: 22, target: 30, progress: () => Math.max(0, ownedSkins.length - 1) },
    { key: 'style-gallery', title: 'Style Gallery', desc: 'Own 40 skins.', reward: 34, target: 40, progress: () => Math.max(0, ownedSkins.length - 1) },
    { key: 'style-archive', title: 'Style Archive', desc: 'Own 50 skins.', reward: 52, target: 50, progress: () => Math.max(0, ownedSkins.length - 1) },
    { key: 'daily-devotee', title: 'Daily Devotee', desc: 'Claim 10 daily rewards.', reward: 12, target: 10, progress: () => lifetimeStats.dailyClaims || 0 },
    { key: 'daily-orbit', title: 'Daily Orbit', desc: 'Claim 25 daily rewards.', reward: 28, target: 25, progress: () => lifetimeStats.dailyClaims || 0 },
    { key: 'wheel-veteran', title: 'Wheel Veteran', desc: 'Use Lucky Spin 15 times.', reward: 15, target: 15, progress: () => lifetimeStats.spinsUsed || 0 },
    { key: 'wheel-galaxy', title: 'Wheel Galaxy', desc: 'Use Lucky Spin 50 times.', reward: 34, target: 50, progress: () => lifetimeStats.spinsUsed || 0 },
    { key: 'code-machine', title: 'Code Machine', desc: 'Use 10 cheat codes.', reward: 12, target: 10, progress: () => lifetimeStats.cheatsUsed || 0 },
    { key: 'halo-hopper', title: 'Halo Hopper', desc: 'Enter the Angel Realm 5 times.', reward: 12, target: 5, progress: () => lifetimeStats.angelEntries || 0, secret: 'full' },
    { key: 'mission-chief', title: 'Mission Chief', desc: 'Claim 15 missions.', reward: 15, target: 15, progress: () => lifetimeStats.missionsClaimed || 0 },
    { key: 'mission-emperor', title: 'Mission Emperor', desc: 'Claim 40 missions.', reward: 32, target: 40, progress: () => lifetimeStats.missionsClaimed || 0 },
    { key: 'event-engine', title: 'Event Engine', desc: 'Claim 8 events.', reward: 16, target: 8, progress: () => lifetimeStats.eventsClaimed || 0 },
    { key: 'event-supernova', title: 'Event Supernova', desc: 'Claim 20 events.', reward: 34, target: 20, progress: () => lifetimeStats.eventsClaimed || 0 },
    { key: 'endless-legend', title: 'Endless Legend', desc: 'Survive 20 endless rounds.', reward: 18, target: 20, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-tower', title: 'Endless Tower', desc: 'Survive 50 endless rounds.', reward: 28, target: 50, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-overdrive', title: 'Endless Overdrive', desc: 'Survive 100 endless rounds.', reward: 42, target: 100, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-odyssey', title: 'Endless Odyssey', desc: 'Survive 250 endless rounds.', reward: 64, target: 250, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-empire', title: 'Endless Empire', desc: 'Survive 500 endless rounds.', reward: 90, target: 500, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-infinite', title: 'Endless Infinite', desc: 'Survive 1,000 endless rounds.', reward: 135, target: 1000, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-singularity', title: 'Endless Singularity', desc: 'Survive 2,500 endless rounds.', reward: 190, target: 2500, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'endless-everafter', title: 'Endless Everafter', desc: 'Survive 5,000 endless rounds.', reward: 280, target: 5000, progress: () => lifetimeStats.endlessRoundsCleared || 0 },
    { key: 'mission-hustle', title: 'Mission Hustle', desc: 'Claim 5 missions.', reward: 9, target: 5, progress: () => lifetimeStats.missionsClaimed || 0 },
    { key: 'event-chaser', title: 'Event Chaser', desc: 'Claim 3 events.', reward: 10, target: 3, progress: () => lifetimeStats.eventsClaimed || 0 },
    { key: 'ranked', title: 'Ranked', desc: 'Post a qualifying endless score.', reward: 10, target: 1, progress: () => lifetimeStats.leaderboardEntries || 0 }
  ];

  const savedName = readStorageText(playerNameStorageKey);
  if (savedName) playerName = savedName;

  coins = Number.parseInt(readStorageText(coinStorageKey) || '0', 10) || 0;
  bestScore = Number.parseInt(readStorageText(bestScoreStorageKey) || '0', 10) || 0;

  const ownedSkinsState = readStorageJson(ownedSkinsStorageKey, ['classic']);
  if (Array.isArray(ownedSkinsState.value) && ownedSkinsState.value.length) {
    ownedSkins = [...new Set(ownedSkinsState.value)];
  }

  const savedEquippedSkin = readStorageText(equippedSkinStorageKey);
  if (savedEquippedSkin) equippedSkin = savedEquippedSkin;

  spinReadyAt = Number.parseInt(readStorageText(spinReadyAtStorageKey) || '0', 10) || 0;

  const challengeStateState = readStorageJson(challengeStateStorageKey, null);
  challengeState = challengeStateState.value;

  const missionStreakState = readStorageJson(missionStreakStorageKey, { count: 0, best: 0, lastCompletedDate: '' });
  missionStreak = missionStreakState.value;

  const achievementState = readStorageJson(achievementStorageKey, {});
  achievements = achievementState.value;

  const lifetimeStatsState = readStorageJson(lifetimeStatsStorageKey, {});
  lifetimeStats = lifetimeStatsState.value;

  const dockNoticeSeenState = readStorageJson(dockNoticeStorageKey, {});
  dockNoticeSeen = dockNoticeSeenState.value;

  const savedAudioEnabled = readStorageText(audioEnabledStorageKey);
  if (savedAudioEnabled === '0') audioEnabled = false;

  leaderboardAbuseMode = readStorageText(leaderboardOverrideStorageKey) === '1';
  angelAutoPickChoice = clampAngelAutoPickChoice(readStorageText(angelAutoPickStorageKey));

  const savedActiveProfileId = readStorageText(activeProfileStorageKey);
  if (savedActiveProfileId) activeProfileId = savedActiveProfileId;

  const savedEconomyVersion = readStorageText(coinEconomyVersionKey);
  if (savedEconomyVersion !== coinEconomyVersion) {
    coins = 0;
    try {
      localStorage.setItem(coinStorageKey, '0');
      localStorage.setItem(coinEconomyVersionKey, coinEconomyVersion);
    } catch {
      // ignore storage errors
    }
  }

  normalizeMissionStreak();
  normalizeLifetimeStats();
  normalizeDockNoticeSeen();
  normalizeSkinState();
  const achievementsNormalizedOnLoad = normalizeAchievements();
  const restoredAchievementsOnLoad = restoreAchievementsWithoutRewards();
  if (achievementsNormalizedOnLoad && restoredAchievementsOnLoad === 0) {
    saveAchievements();
  }
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

  function getVisualFxQuality() {
    if (reducedMotionQuery?.matches) return 0;

    let quality = 2;
    const threadCount = navigator.hardwareConcurrency || 6;
    const memory = navigator.deviceMemory || 6;
    const deviceScale = window.devicePixelRatio || 1;

    if (threadCount <= 4) quality -= 1;
    if (memory <= 4) quality -= 1;
    if (deviceScale >= 2.2) quality -= 1;
    if (currentGridSize() >= 18) quality -= 1;
    if ((snake.length || 0) >= 18) quality -= 1;

    return Math.max(0, quality);
  }

  function getSnakeRenderDetailLevel() {
    const quality = getVisualFxQuality();
    const cellSize = currentCellSize();
    const length = snake.length || 0;

    if (quality <= 0 || cellSize <= 26 || length >= 28) return 0;
    if (quality === 1 || cellSize <= 34 || length >= 18) return 1;
    return 2;
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function fract(value) {
    return value - Math.floor(value);
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

  function formatCount(value) {
    return numberFormatter.format(Math.max(0, Math.round(Number(value) || 0)));
  }

  function roundHealthValue(value) {
    return Math.round((Number(value) || 0) * 10) / 10;
  }

  function formatHealthValue(value) {
    const rounded = roundHealthValue(value);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function clampAngelAutoPickChoice(value) {
    return Math.min(3, Math.max(0, Number.parseInt(value ?? '0', 10) || 0));
  }

  function saveAudioPreference() {
    try {
      localStorage.setItem(audioEnabledStorageKey, audioEnabled ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }

  function setAccountNotice(message = '') {
    accountNotice = String(message || '').trim();
  }

  function cloneJson(value, fallback = null) {
    try {
      return JSON.parse(JSON.stringify(value ?? fallback));
    } catch {
      return fallback;
    }
  }

  function readStorageText(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function readStorageJson(key, fallback = null) {
    const raw = readStorageText(key);
    if (!raw) return { exists: false, error: false, value: fallback };
    try {
      return { exists: true, error: false, value: JSON.parse(raw) };
    } catch {
      return { exists: true, error: true, value: fallback };
    }
  }

  function encodeBase64Url(value) {
    return btoa(unescape(encodeURIComponent(String(value))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  function decodeBase64Url(value) {
    const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
    return decodeURIComponent(escape(atob(padded)));
  }

  function sanitizeProfileId(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 24);
  }

  function sanitizeProfileSecret(value) {
    return String(value || '').trim().slice(0, 24);
  }

  function getProfileStorageKey(profileId, secret) {
    const cleanId = sanitizeProfileId(profileId);
    const cleanSecret = sanitizeProfileSecret(secret);
    if (!cleanId || !cleanSecret) return '';
    return `${profileStoragePrefix}${cleanId.toLowerCase()}:${hashString(cleanSecret)}`;
  }

  function saveActiveProfileId() {
    try {
      if (activeProfileId) localStorage.setItem(activeProfileStorageKey, activeProfileId);
      else localStorage.removeItem(activeProfileStorageKey);
    } catch {
      // ignore storage errors
    }
  }

  function buildSaveSnapshot() {
    normalizeMissionStreak();
    normalizeLifetimeStats();
    normalizeDockNoticeSeen();
    normalizeSkinState();
    return {
      version: saveSnapshotVersion,
      exportedAt: Date.now(),
      playerName,
      coins,
      bestScore,
      ownedSkins: [...new Set(ownedSkins)],
      equippedSkin,
      spinReadyAt,
      challengeState: cloneJson(challengeState, null),
      missionStreak: cloneJson(missionStreak, { count: 0, best: 0, lastCompletedDate: '' }),
      achievements: cloneJson(achievements, {}),
      lifetimeStats: cloneJson(lifetimeStats, {}),
      dockNoticeSeen: cloneJson(dockNoticeSeen, {}),
      endlessLeaderboard: cloneJson(endlessLeaderboard, []),
      leaderboardAbuseMode,
      angelAutoPickChoice,
      audioEnabled,
      dailyRewardAt: Number.parseInt(localStorage.getItem(dailyRewardStorageKey) || '0', 10) || 0
    };
  }

  function encodeSaveSnapshot(snapshot = buildSaveSnapshot()) {
    return encodeBase64Url(JSON.stringify(snapshot));
  }

  function decodeSaveSnapshot(rawValue) {
    if (!rawValue) return null;
    try {
      const decoded = decodeBase64Url(rawValue);
      const parsed = JSON.parse(decoded);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  function sanitizeSaveSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return null;
    const allowedSkinKeys = new Set(snakeSkins.map(skin => skin.key));
    const incomingOwned = Array.isArray(snapshot.ownedSkins) ? snapshot.ownedSkins : ['classic'];
    const nextOwnedSkins = [...new Set(incomingOwned.filter(key => allowedSkinKeys.has(key)))];
    if (!nextOwnedSkins.includes('classic')) nextOwnedSkins.unshift('classic');
    return {
      playerName: String(snapshot.playerName || 'Player').trim().slice(0, 18) || 'Player',
      coins: Math.max(0, Number.parseInt(snapshot.coins || '0', 10) || 0),
      bestScore: Math.max(0, Number.parseInt(snapshot.bestScore || '0', 10) || 0),
      ownedSkins: nextOwnedSkins,
      equippedSkin: nextOwnedSkins.includes(snapshot.equippedSkin) ? snapshot.equippedSkin : 'classic',
      spinReadyAt: Math.max(0, Number.parseInt(snapshot.spinReadyAt || '0', 10) || 0),
      challengeState: snapshot.challengeState && typeof snapshot.challengeState === 'object' ? snapshot.challengeState : null,
      missionStreak: snapshot.missionStreak && typeof snapshot.missionStreak === 'object' ? snapshot.missionStreak : { count: 0, best: 0, lastCompletedDate: '' },
      achievements: snapshot.achievements && typeof snapshot.achievements === 'object' ? snapshot.achievements : {},
      lifetimeStats: snapshot.lifetimeStats && typeof snapshot.lifetimeStats === 'object' ? snapshot.lifetimeStats : {},
      dockNoticeSeen: snapshot.dockNoticeSeen && typeof snapshot.dockNoticeSeen === 'object' ? snapshot.dockNoticeSeen : {},
      endlessLeaderboard: Array.isArray(snapshot.endlessLeaderboard) ? snapshot.endlessLeaderboard.slice(0, 10) : [],
      leaderboardAbuseMode: !!snapshot.leaderboardAbuseMode,
      angelAutoPickChoice: clampAngelAutoPickChoice(snapshot.angelAutoPickChoice),
      audioEnabled: snapshot.audioEnabled !== false,
      dailyRewardAt: Math.max(0, Number.parseInt(snapshot.dailyRewardAt || '0', 10) || 0)
    };
  }

  function applySaveSnapshot(snapshot, sourceLabel = 'Save') {
    const sanitized = sanitizeSaveSnapshot(snapshot);
    if (!sanitized) return false;

    playerName = sanitized.playerName;
    coins = sanitized.coins;
    bestScore = sanitized.bestScore;
    ownedSkins = sanitized.ownedSkins;
    equippedSkin = sanitized.equippedSkin;
    spinReadyAt = sanitized.spinReadyAt;
    challengeState = sanitized.challengeState;
    missionStreak = sanitized.missionStreak;
    achievements = sanitized.achievements;
    lifetimeStats = sanitized.lifetimeStats;
    dockNoticeSeen = sanitized.dockNoticeSeen;
    endlessLeaderboard = sanitized.endlessLeaderboard;
    leaderboardAbuseMode = sanitized.leaderboardAbuseMode;
    angelAutoPickChoice = sanitized.angelAutoPickChoice;
    audioEnabled = sanitized.audioEnabled;
    leaderboardOverrideCharges = 0;
    leaderboardOverrideUsedThisRun = false;
    leaderboardDisqualifyingCheatUsed = false;
    spinAnimationState = null;
    spinAnimationToken += 1;
    lastSpinResult = '';
    activeAchievementToast = null;
    achievementToastQueue = [];
    achievementToastUntil = 0;
    activeAchievementToastSignature = '';
    clearBlessingAutoPickTimer();

    normalizeMissionStreak();
    normalizeLifetimeStats();
    normalizeDockNoticeSeen();
    normalizeSkinState();
    normalizeAchievements();
    restoreAchievementsWithoutRewards();

    try {
      localStorage.setItem(playerNameStorageKey, playerName);
      localStorage.setItem(dailyRewardStorageKey, String(sanitized.dailyRewardAt));
      localStorage.setItem(coinEconomyVersionKey, coinEconomyVersion);
    } catch {
      // ignore storage errors
    }
    saveCoins();
    saveBestScore();
    saveOwnedSkins();
    saveEquippedSkin();
    saveSpinReadyAt();
    saveChallengeState();
    saveMissionStreak();
    saveAchievements();
    saveLifetimeStats();
    saveDockNoticeSeen();
    saveLeaderboardOverrideMode();
    saveAngelAutoPickChoice();
    saveAudioPreference();
    saveEndlessLeaderboard();
    renderAudioButtons();
    renderBlessingAutoPickControls();

    clearJackpotMode();
    currentScreen = 'home';
    shopOpen = false;
    infoPanel = 'account';
    window.location.hash = '';
    resetModeProgress('normal');
    resetGame(false, false);
    setAccountNotice(`${sourceLabel} loaded on this version.`);
    updateView();
    return true;
  }

  function extractSaveToken(input) {
    const raw = String(input || '').trim();
    if (!raw) return '';
    if (!/[/?=&]/.test(raw)) return raw;
    try {
      const url = new URL(raw, window.location.href);
      return url.searchParams.get(saveLinkParam) || '';
    } catch {
      const match = raw.match(/[?&]save=([^&#]+)/i);
      return match ? decodeURIComponent(match[1]) : raw;
    }
  }

  function buildSaveLinkForUrl(baseUrl) {
    const url = new URL(baseUrl, window.location.href);
    url.searchParams.set(saveLinkParam, encodeSaveSnapshot());
    url.hash = '';
    return url.toString();
  }

  function buildPortableSaveLink() {
    return buildSaveLinkForUrl(window.location.href);
  }

  function openLocalWebCopyWithSave() {
    syncCurrentSaveToLocalWeb()
      .then(() => {
        window.location.href = localWebCopyUrl;
      })
      .catch(() => {
        window.location.href = buildSaveLinkForUrl(localWebCopyUrl);
      });
  }

  async function syncCurrentSaveToLocalWeb() {
    const response = await fetch(localSyncEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        snapshot: buildSaveSnapshot(),
        source: 'file-copy',
        savedAt: Date.now()
      })
    });
    if (!response.ok) throw new Error('sync failed');
  }

  async function maybeImportPendingLocalSync() {
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return false;
    try {
      const response = await fetch(localSyncEndpoint, { cache: 'no-store' });
      if (!response.ok) return false;
      const payload = await response.json();
      const snapshot = payload?.snapshot;
      if (!snapshot || !applySaveSnapshot(snapshot, 'Richard file save')) return false;
      activeProfileId = '';
      saveActiveProfileId();
      setAccountNotice('Richard file save loaded here and replaced the old 127 save.');
      updateView();
      await fetch(localSyncEndpoint, { method: 'DELETE' }).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  async function copyTextValue(value, fallbackLabel = 'value') {
    const text = String(value || '');
    if (!text) return false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // ignore and fall back
      }
    }
    window.prompt(`Copy this ${fallbackLabel}:`, text);
    return false;
  }

  async function copyCurrentSaveLink() {
    const copied = await copyTextValue(buildPortableSaveLink(), 'save link');
    setAccountNotice(copied
      ? 'Transfer link copied. Open it on another version to import this save.'
      : 'Transfer link ready. Copy it from the prompt and open it where you want the save.');
    updateView();
  }

  async function copyCurrentSaveCode() {
    const copied = await copyTextValue(encodeSaveSnapshot(), 'save code');
    setAccountNotice(copied
      ? 'Save code copied. Import it on the other version to bring progress over.'
      : 'Save code ready. Copy it from the prompt and import it on the other version.');
    updateView();
  }

  function saveCurrentProfile() {
    const suggestedId = activeProfileId || playerName || 'Player';
    const profileId = sanitizeProfileId(window.prompt('Save to account name', suggestedId));
    if (!profileId) return;
    const secret = sanitizeProfileSecret(window.prompt('Set account PIN or password', ''));
    if (!secret) return;
    const storageKey = getProfileStorageKey(profileId, secret);
    if (!storageKey) return;
    const record = {
      id: profileId,
      savedAt: Date.now(),
      snapshot: buildSaveSnapshot()
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(record));
      activeProfileId = profileId;
      saveActiveProfileId();
      setAccountNotice(`Account ${profileId} saved on this browser.`);
      updateView();
    } catch {
      setAccountNotice('Account save failed. Storage may be blocked or full.');
      updateView();
    }
  }

  function loadSavedProfile() {
    const suggestedId = activeProfileId || playerName || 'Player';
    const profileId = sanitizeProfileId(window.prompt('Log into account name', suggestedId));
    if (!profileId) return;
    const secret = sanitizeProfileSecret(window.prompt('Enter account PIN or password', ''));
    if (!secret) return;
    const storageKey = getProfileStorageKey(profileId, secret);
    if (!storageKey) return;
    try {
      const rawRecord = localStorage.getItem(storageKey);
      if (!rawRecord) {
        setAccountNotice(`No local account named ${profileId} matched that password.`);
        updateView();
        return;
      }
      const record = JSON.parse(rawRecord);
      if (!applySaveSnapshot(record?.snapshot, `Account ${profileId}`)) {
        setAccountNotice(`Account ${profileId} could not be loaded.`);
        updateView();
        return;
      }
      activeProfileId = profileId;
      saveActiveProfileId();
      setAccountNotice(`Account ${profileId} loaded on this browser.`);
      updateView();
    } catch {
      setAccountNotice(`Account ${profileId} could not be loaded.`);
      updateView();
    }
  }

  function importSavePayload() {
    const rawInput = window.prompt('Paste a save link or save code', '');
    if (!rawInput) return;
    const token = extractSaveToken(rawInput);
    const snapshot = decodeSaveSnapshot(token);
    if (!snapshot || !applySaveSnapshot(snapshot, 'Imported save')) {
      setAccountNotice('That save link or code was not valid.');
      updateView();
      return;
    }
    activeProfileId = '';
    saveActiveProfileId();
    setAccountNotice('Imported save loaded. It replaced the save on this version. Local account login cleared until you log in again.');
    updateView();
  }

  function maybeImportSaveFromUrl() {
    const url = new URL(window.location.href);
    const token = url.searchParams.get(saveLinkParam);
    if (!token) return;
    const snapshot = decodeSaveSnapshot(token);
    if (snapshot && applySaveSnapshot(snapshot, 'Save link')) {
      activeProfileId = '';
      saveActiveProfileId();
      setAccountNotice('Save link imported automatically. It replaced the save on this version. Local account login cleared until you log in again.');
    } else {
      setAccountNotice('Save link was found, but it could not be imported.');
    }
    url.searchParams.delete(saveLinkParam);
    window.history.replaceState({}, document.title, url.toString());
  }

  function renderAudioButtons() {
    const fullLabel = audioEnabled ? '🔊 Audio On' : '🔇 Audio Off';
    const compactLabel = audioEnabled ? '🔊' : '🔇';
    const controlLabel = audioEnabled ? 'Turn audio off' : 'Turn audio on';
    if (audioToggleBtn) {
      audioToggleBtn.textContent = fullLabel;
      audioToggleBtn.classList.toggle('is-muted', !audioEnabled);
      audioToggleBtn.setAttribute('aria-pressed', String(audioEnabled));
      audioToggleBtn.setAttribute('aria-label', controlLabel);
      audioToggleBtn.title = controlLabel;
    }
    if (gameAudioToggleBtn) {
      gameAudioToggleBtn.textContent = compactLabel;
      gameAudioToggleBtn.classList.toggle('is-muted', !audioEnabled);
      gameAudioToggleBtn.setAttribute('aria-pressed', String(audioEnabled));
      gameAudioToggleBtn.setAttribute('aria-label', controlLabel);
      gameAudioToggleBtn.title = controlLabel;
    }
  }

  function buildNoiseBuffer(ctx) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }
    return buffer;
  }

  function ensureAudioContext() {
    if (!audioEnabled) return null;
    if (audioState.ctx) return audioState.ctx;

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;

    const ctx = new AudioCtor();
    const masterGain = ctx.createGain();
    const musicGain = ctx.createGain();
    const sfxGain = ctx.createGain();
    masterGain.gain.value = 0.58;
    musicGain.gain.value = 0.22;
    sfxGain.gain.value = 0.26;
    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    audioState.ctx = ctx;
    audioState.masterGain = masterGain;
    audioState.musicGain = musicGain;
    audioState.sfxGain = sfxGain;
    audioState.noiseBuffer = buildNoiseBuffer(ctx);
    return ctx;
  }

  function freqFromMidi(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function playTone(frequency, start, duration, options = {}) {
    const ctx = audioState.ctx;
    if (!ctx || !audioState.unlocked || !audioEnabled || !Number.isFinite(frequency) || frequency <= 0) return;

    const targetBus = options.bus === 'music' ? audioState.musicGain : audioState.sfxGain;
    if (!targetBus) return;

    const attack = Math.max(0.002, options.attack ?? 0.01);
    const sustainUntil = Math.max(start + attack + 0.01, start + duration - (options.release ?? Math.min(0.18, duration * 0.7)));
    const stopAt = start + duration + 0.08;
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = options.filterType || 'lowpass';
    filterNode.frequency.setValueAtTime(options.cutoff ?? 2400, start);
    filterNode.Q.setValueAtTime(options.q ?? 0.7, start);
    gainNode.gain.setValueAtTime(0.0001, start);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, options.volume ?? 0.08), start + attack);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, (options.volume ?? 0.08) * 0.82), sustainUntil);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    filterNode.connect(gainNode);
    gainNode.connect(targetBus);

    const makeOsc = (detune = 0, volumeScale = 1, type = options.type || 'triangle') => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, start);
      if (options.glideTo && options.glideTo > 0) {
        osc.frequency.exponentialRampToValueAtTime(options.glideTo, start + duration);
      }
      osc.detune.setValueAtTime(detune, start);
      oscGain.gain.setValueAtTime(volumeScale, start);
      osc.connect(oscGain);
      oscGain.connect(filterNode);
      osc.start(start);
      osc.stop(stopAt);
    };

    makeOsc(options.detune ?? 0, 1, options.type || 'triangle');
    if (options.unison) makeOsc(-(options.unisonDetune ?? 7), options.unisonMix ?? 0.36, options.unisonType || 'sine');
  }

  function playChord(notes, start, duration, options = {}) {
    notes.forEach((note, index) => {
      playTone(freqFromMidi(note), start + index * (options.strum ?? 0), duration, options);
    });
  }

  function playNoiseBurst(start, duration, options = {}) {
    const ctx = audioState.ctx;
    if (!ctx || !audioState.unlocked || !audioEnabled || !audioState.noiseBuffer || !audioState.sfxGain) return;

    const source = ctx.createBufferSource();
    source.buffer = audioState.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = options.filterType || 'bandpass';
    filter.frequency.setValueAtTime(options.cutoff ?? 1800, start);
    filter.Q.setValueAtTime(options.q ?? 1.2, start);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(options.volume ?? 0.05, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioState.sfxGain);
    source.start(start);
    source.stop(start + duration + 0.05);
  }

  function getAudioScene() {
    if (currentScreen !== 'game') return 'home';
    if (jackpotMode) return 'jackpot';
    if (angelRealm) return 'angel';
    return 'normal';
  }

  function sceneBeatDuration(scene) {
    if (scene === 'home') return 0.56;
    if (scene === 'angel') return 0.5;
    if (scene === 'jackpot') return audioState.jackpotVariant === 'rush' ? 0.34 : 0.44;
    return 0.42;
  }

  function scheduleHomeMusic(step, when, beat) {
    const roots = [57, 60, 62, 55];
    const root = roots[Math.floor(step / 4) % roots.length];
    if (step % 4 === 0) {
      playChord([root, root + 7, root + 12], when, beat * 3.7, {
        bus: 'music',
        type: 'sine',
        volume: 0.042,
        attack: 0.14,
        cutoff: 1300,
        unison: true,
        unisonMix: 0.18
      });
    }
    const melody = [12, 14, 16, 19, 16, 14, 12, 7];
    playTone(freqFromMidi(root + melody[step % melody.length]), when + beat * 0.08, beat * 1.2, {
      bus: 'music',
      type: 'triangle',
      volume: 0.036,
      attack: 0.02,
      cutoff: 2400
    });
  }

  function scheduleNormalMusic(step, when, beat) {
    const roots = [45, 48, 43, 50];
    const root = roots[Math.floor(step / 4) % roots.length];
    if (step % 2 === 0) {
      playTone(freqFromMidi(root), when, beat * 0.9, {
        bus: 'music',
        type: 'square',
        volume: 0.05,
        attack: 0.01,
        cutoff: 900
      });
    }
    const arp = [12, 7, 10, 14, 17, 14, 10, 7];
    playTone(freqFromMidi(root + arp[step % arp.length]), when + beat * 0.04, beat * 0.82, {
      bus: 'music',
      type: 'triangle',
      volume: 0.034,
      attack: 0.01,
      cutoff: 2100,
      unison: step % 4 === 0,
      unisonMix: 0.18
    });
  }

  function scheduleAngelMusic(step, when, beat) {
    const roots = [60, 64, 67, 62];
    const root = roots[Math.floor(step / 4) % roots.length];
    if (step % 4 === 0) {
      playChord([root, root + 4, root + 7], when, beat * 3.8, {
        bus: 'music',
        type: 'sine',
        volume: 0.045,
        attack: 0.18,
        cutoff: 1700,
        unison: true,
        unisonMix: 0.24
      });
    }
    const hymn = [12, 16, 19, 21, 19, 16, 14, 12];
    playTone(freqFromMidi(root + hymn[step % hymn.length]), when + beat * 0.05, beat * 1.45, {
      bus: 'music',
      type: 'triangle',
      volume: 0.032,
      attack: 0.02,
      cutoff: 2800,
      unison: step % 2 === 0,
      unisonMix: 0.14
    });
    if (step % 2 === 1) {
      playTone(freqFromMidi(root + 24), when + beat * 0.18, beat * 0.7, {
        bus: 'music',
        type: 'sine',
        volume: 0.018,
        attack: 0.01,
        cutoff: 3200
      });
    }
  }

  function scheduleJackpotMusic(step, when, beat) {
    if (audioState.jackpotVariant === 'glow') {
      const roots = [57, 60, 64, 62];
      const root = roots[Math.floor(step / 4) % roots.length];
      if (step % 4 === 0) {
        playChord([root, root + 7, root + 11], when, beat * 3.8, {
          bus: 'music',
          type: 'sine',
          volume: 0.04,
          attack: 0.12,
          cutoff: 1500,
          unison: true,
          unisonMix: 0.2
        });
      }
      const melody = [19, 16, 14, 12, 14, 16, 19, 21];
      playTone(freqFromMidi(root + melody[step % melody.length]), when + beat * 0.06, beat * 1.1, {
        bus: 'music',
        type: 'triangle',
        volume: 0.034,
        attack: 0.02,
        cutoff: 2600
      });
      return;
    }

    const roots = [48, 53, 55, 60];
    const root = roots[Math.floor(step / 4) % roots.length];
    if (step % 2 === 0) {
      playTone(freqFromMidi(root), when, beat * 0.88, {
        bus: 'music',
        type: 'square',
        volume: 0.052,
        attack: 0.01,
        cutoff: 980
      });
    }
    const riff = [12, 16, 19, 24, 19, 16, 12, 7];
    playTone(freqFromMidi(root + riff[step % riff.length]), when + beat * 0.03, beat * 0.76, {
      bus: 'music',
      type: 'triangle',
      volume: 0.036,
      attack: 0.01,
      cutoff: 2400,
      unison: step % 4 === 3,
      unisonMix: 0.16
    });
  }

  function scheduleSceneMusic(scene) {
    const ctx = audioState.ctx;
    if (!ctx) return;
    const beat = sceneBeatDuration(scene);
    while (audioState.nextMusicAt < ctx.currentTime + 0.32) {
      if (scene === 'home') scheduleHomeMusic(audioState.step, audioState.nextMusicAt, beat);
      else if (scene === 'angel') scheduleAngelMusic(audioState.step, audioState.nextMusicAt, beat);
      else if (scene === 'jackpot') scheduleJackpotMusic(audioState.step, audioState.nextMusicAt, beat);
      else scheduleNormalMusic(audioState.step, audioState.nextMusicAt, beat);
      audioState.step += 1;
      audioState.nextMusicAt += beat;
    }
  }

  function playUiSfx(kind) {
    const ctx = audioState.ctx;
    if (!ctx || !audioState.unlocked || !audioEnabled) return;
    const start = ctx.currentTime + 0.01;

    if (kind === 'menu') {
      playTone(freqFromMidi(67), start, 0.08, { type: 'triangle', volume: 0.034, cutoff: 2200 });
      playTone(freqFromMidi(74), start + 0.04, 0.12, { type: 'sine', volume: 0.028, cutoff: 2800 });
    } else if (kind === 'start') {
      playChord([60, 64, 67], start, 0.24, { type: 'triangle', volume: 0.05, cutoff: 2300 });
      playTone(freqFromMidi(79), start + 0.12, 0.22, { type: 'sine', volume: 0.04, cutoff: 3000 });
    } else if (kind === 'bite') {
      playTone(freqFromMidi(76), start, 0.07, { type: 'square', volume: 0.03, cutoff: 1800 });
      playTone(freqFromMidi(81), start + 0.03, 0.1, { type: 'triangle', volume: 0.025, cutoff: 2500 });
    } else if (kind === 'bonus') {
      playTone(freqFromMidi(79), start, 0.12, { type: 'triangle', volume: 0.045, cutoff: 2400 });
      playTone(freqFromMidi(86), start + 0.06, 0.18, { type: 'sine', volume: 0.034, cutoff: 3200 });
    } else if (kind === 'coin') {
      playTone(freqFromMidi(79), start, 0.14, { type: 'triangle', volume: 0.06, cutoff: 2600 });
      playTone(freqFromMidi(84), start + 0.08, 0.16, { type: 'triangle', volume: 0.05, cutoff: 3000 });
    } else if (kind === 'skin') {
      playTone(freqFromMidi(72), start, 0.18, { type: 'triangle', volume: 0.05, cutoff: 2600 });
      playTone(freqFromMidi(79), start + 0.08, 0.24, { type: 'sine', volume: 0.04, cutoff: 3200 });
      playTone(freqFromMidi(84), start + 0.16, 0.28, { type: 'sine', volume: 0.038, cutoff: 3400 });
    } else if (kind === 'achievement') {
      playChord([72, 76, 79], start, 0.36, { type: 'triangle', volume: 0.052, cutoff: 2500 });
      playTone(freqFromMidi(84), start + 0.18, 0.32, { type: 'sine', volume: 0.04, cutoff: 3200 });
    } else if (kind === 'heal') {
      playTone(freqFromMidi(67), start, 0.18, { type: 'sine', volume: 0.04, cutoff: 2400 });
      playTone(freqFromMidi(74), start + 0.1, 0.24, { type: 'triangle', volume: 0.034, cutoff: 2800 });
    } else if (kind === 'damage') {
      playTone(freqFromMidi(46), start, 0.22, { type: 'sawtooth', volume: 0.042, cutoff: 900, glideTo: freqFromMidi(38) });
      playNoiseBurst(start, 0.12, { volume: 0.028, cutoff: 1200 });
    } else if (kind === 'toggle') {
      playTone(freqFromMidi(audioEnabled ? 76 : 52), start, 0.12, { type: 'triangle', volume: 0.04, cutoff: 2400 });
    } else if (kind === 'unequip') {
      playTone(freqFromMidi(72), start, 0.12, { type: 'triangle', volume: 0.034, cutoff: 2200 });
      playTone(freqFromMidi(64), start + 0.06, 0.18, { type: 'sine', volume: 0.026, cutoff: 1800 });
    } else if (kind === 'gameover') {
      playTone(freqFromMidi(55), start, 0.28, { type: 'sawtooth', volume: 0.04, cutoff: 1000, glideTo: freqFromMidi(47) });
      playTone(freqFromMidi(48), start + 0.08, 0.36, { type: 'triangle', volume: 0.03, cutoff: 1400, glideTo: freqFromMidi(40) });
      playNoiseBurst(start + 0.06, 0.18, { volume: 0.024, cutoff: 900 });
    } else if (kind === 'jackpot') {
      playChord([72, 76, 79], start, 0.22, { type: 'triangle', volume: 0.05, cutoff: 2600 });
      playTone(freqFromMidi(84), start + 0.14, 0.28, { type: 'sine', volume: 0.038, cutoff: 3200 });
    }
  }

  function playBossSfx(kind) {
    const ctx = audioState.ctx;
    if (!ctx || !audioState.unlocked || !audioEnabled) return;
    const start = ctx.currentTime + 0.01;

    if (kind === 'ambient') {
      playTone(freqFromMidi(52), start, 0.78, { type: 'sine', volume: 0.028, attack: 0.08, cutoff: 900, unison: true, unisonMix: 0.12 });
      playTone(freqFromMidi(64), start + 0.06, 0.52, { type: 'triangle', volume: 0.018, attack: 0.04, cutoff: 1800 });
    } else if (kind === 'enter') {
      playChord([55, 60, 64], start, 0.9, { type: 'sine', volume: 0.05, attack: 0.04, cutoff: 1600, unison: true, unisonMix: 0.16 });
      playNoiseBurst(start, 0.18, { volume: 0.028, cutoff: 1400 });
    } else if (kind === 'volley') {
      playTone(freqFromMidi(74), start, 0.16, { type: 'square', volume: 0.05, cutoff: 1600 });
      playTone(freqFromMidi(79), start + 0.08, 0.18, { type: 'triangle', volume: 0.038, cutoff: 2400 });
    } else if (kind === 'laser') {
      playTone(freqFromMidi(83), start, 0.42, { type: 'sawtooth', volume: 0.046, cutoff: 2200, glideTo: freqFromMidi(95) });
      playNoiseBurst(start, 0.16, { volume: 0.03, cutoff: 2600, q: 2 });
    } else if (kind === 'beam') {
      playChord([76, 81, 88], start, 0.4, { type: 'triangle', volume: 0.042, cutoff: 2600 });
      playTone(freqFromMidi(93), start + 0.06, 0.32, { type: 'sine', volume: 0.032, cutoff: 3400 });
    } else if (kind === 'grenade') {
      playTone(freqFromMidi(55), start, 0.28, { type: 'sawtooth', volume: 0.046, cutoff: 1200, glideTo: freqFromMidi(43) });
      playNoiseBurst(start + 0.1, 0.14, { volume: 0.03, cutoff: 900 });
    } else if (kind === 'altar-hit') {
      playChord([72, 79, 84], start, 0.26, { type: 'triangle', volume: 0.05, cutoff: 2600 });
    } else if (kind === 'defeat') {
      playChord([60, 67, 72], start, 0.52, { type: 'sine', volume: 0.052, attack: 0.03, cutoff: 1800 });
      playTone(freqFromMidi(79), start + 0.18, 0.46, { type: 'triangle', volume: 0.044, cutoff: 3000 });
      playTone(freqFromMidi(84), start + 0.3, 0.64, { type: 'sine', volume: 0.038, cutoff: 3400 });
    }
  }

  function syncAudioState(force = false) {
    renderAudioButtons();
    if (!audioEnabled) return;
    const ctx = audioState.ctx || (audioState.unlocked ? ensureAudioContext() : null);
    if (!ctx || ctx.state !== 'running' || !audioState.unlocked) return;

    const scene = getAudioScene();
    if (force || scene !== audioState.scene) {
      audioState.scene = scene;
      audioState.step = 0;
      audioState.nextMusicAt = ctx.currentTime + 0.02;
      if (scene === 'jackpot') {
        audioState.jackpotVariant = Math.random() < 0.5 ? 'rush' : 'glow';
      }
    }

    scheduleSceneMusic(scene);

    if (boss?.active && ctx.currentTime - audioState.lastBossHumAt >= 1.1) {
      audioState.lastBossHumAt = ctx.currentTime;
      playBossSfx('ambient');
    }
  }

  function unlockAudio() {
    if (!audioEnabled) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;
    ctx.resume().then(() => {
      audioState.unlocked = true;
      audioState.masterGain?.gain.setTargetAtTime(0.58, ctx.currentTime, 0.06);
      syncAudioState(true);
    }).catch(() => {});
  }

  function setAudioEnabled(nextEnabled) {
    audioEnabled = !!nextEnabled;
    saveAudioPreference();
    renderAudioButtons();
    if (!audioEnabled) {
      const ctx = audioState.ctx;
      audioState.scene = '';
      audioState.step = 0;
      if (ctx && audioState.masterGain) {
        audioState.masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
        ctx.suspend().catch(() => {});
      }
      return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) return;
    ctx.resume().then(() => {
      audioState.unlocked = true;
      audioState.scene = '';
      audioState.step = 0;
      audioState.nextMusicAt = ctx.currentTime + 0.02;
      audioState.masterGain?.gain.setTargetAtTime(0.58, ctx.currentTime, 0.08);
      playUiSfx('toggle');
      syncAudioState(true);
    }).catch(() => {});
  }

  function isMainRunMode() {
    return !angelRealm && !endlessMode;
  }

  function currentObstacleDamage() {
    return isMainRunMode() ? mainModeObstacleDamage : 3;
  }

  function currentAppleHealAmount() {
    return isMainRunMode() ? mainModeAppleHeal : 0;
  }

  function cellDistance(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  function roundSpawnSafety(kind = 'food') {
    if (kind === 'hazard') {
      return { minHeadDistance: 3, minSnakeDistance: 2 };
    }
    if (kind === 'enemy') {
      return { minHeadDistance: 4, minSnakeDistance: 2 };
    }
    return { minHeadDistance: 2, minSnakeDistance: 2 };
  }

  function getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function addCoins(amount) {
    if (!amount) return;
    coins = Math.max(0, coins + amount);
    if (amount > 0) {
      normalizeLifetimeStats();
      lifetimeStats.coinsEarned = Math.max(0, (lifetimeStats.coinsEarned || 0) + amount);
      saveLifetimeStats();
    }
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

  function saveAngelAutoPickChoice() {
    try {
      localStorage.setItem(angelAutoPickStorageKey, String(angelAutoPickChoice));
    } catch {
      // ignore storage errors
    }
  }

  function saveAchievements() {
    normalizeAchievements();
    try {
      localStorage.setItem(achievementStorageKey, JSON.stringify(achievements));
    } catch {
      // ignore storage errors
    }
  }

  function saveLifetimeStats() {
    try {
      localStorage.setItem(lifetimeStatsStorageKey, JSON.stringify(lifetimeStats));
    } catch {
      // ignore storage errors
    }
  }

  function normalizeDockNoticeSeen() {
    if (!dockNoticeSeen || typeof dockNoticeSeen !== 'object' || Array.isArray(dockNoticeSeen)) {
      dockNoticeSeen = {};
    }
  }

  function normalizeAchievements() {
    const validDefs = new Map(achievementDefs.map(def => [def.key, def]));
    if (!achievements || typeof achievements !== 'object' || Array.isArray(achievements)) {
      achievements = {};
      return true;
    }

    let changed = false;
    const normalized = {};
    Object.entries(achievements).forEach(([key, value]) => {
      const def = validDefs.get(key);
      if (!def) {
        changed = true;
        return;
      }

      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        normalized[key] = {
          unlockedAt: '',
          reward: def.reward || 0,
          restored: true
        };
        changed = true;
        return;
      }

      normalized[key] = {
        ...value,
        unlockedAt: typeof value.unlockedAt === 'string' ? value.unlockedAt : '',
        reward: Math.max(0, Number.parseInt(value.reward ?? def.reward ?? 0, 10) || 0)
      };
    });

    achievements = normalized;
    return changed;
  }

  function saveDockNoticeSeen() {
    try {
      localStorage.setItem(dockNoticeStorageKey, JSON.stringify(dockNoticeSeen));
    } catch {
      // ignore storage errors
    }
  }

  function saveLeaderboardOverrideMode() {
    try {
      localStorage.setItem(leaderboardOverrideStorageKey, leaderboardAbuseMode ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }

  function normalizeLifetimeStats() {
    const defaults = {
      applesEaten: 0,
      bonusPearsEaten: 0,
      roundsCleared: 0,
      endlessRoundsCleared: 0,
      gamesStarted: 0,
      coinsEarned: 0,
      nameChanges: 0,
      dailyClaims: 0,
      spinsUsed: 0,
      cheatsUsed: 0,
      cheatRoomsFound: 0,
      angelEntries: 0,
      bossDefeats: 0,
      perfectRounds: 0,
      skinsBought: 0,
      missionsClaimed: 0,
      eventsClaimed: 0,
      leaderboardEntries: 0
    };

    if (!lifetimeStats || typeof lifetimeStats !== 'object') {
      lifetimeStats = { ...defaults };
      return;
    }

    Object.entries(defaults).forEach(([key, value]) => {
      lifetimeStats[key] = Math.max(0, Number.parseInt(lifetimeStats[key] ?? value, 10) || 0);
    });
  }

  function restoreAchievementsWithoutRewards() {
    normalizeLifetimeStats();
    normalizeSkinState();
    normalizeAchievements();

    let restoredCount = 0;
    let restoredSkin = false;
    const restoredAt = new Date().toISOString();

    for (const def of achievementDefs) {
      if (achievementUnlocked(def.key)) continue;
      if ((def.progress?.() || 0) < def.target) continue;

      achievements[def.key] = {
        unlockedAt: restoredAt,
        reward: def.reward || 0,
        restored: true
      };
      restoredCount += 1;

      if (def.skinReward && !isSkinOwned(def.skinReward)) {
        ownedSkins.push(def.skinReward);
        restoredSkin = true;
      }
    }

    if (restoredSkin) saveOwnedSkins();
    if (restoredCount > 0) saveAchievements();
    return restoredCount;
  }

  function incrementStat(key, amount = 1) {
    normalizeLifetimeStats();
    lifetimeStats[key] = Math.max(0, (lifetimeStats[key] || 0) + amount);
    saveLifetimeStats();
  }

  function achievementUnlocked(key) {
    return !!(achievements && Object.prototype.hasOwnProperty.call(achievements, key));
  }

  function getAchievementRewardText(def) {
    if (!def) return '';
    if (def.rewardText) return def.rewardText;
    if (def.reward > 0) return `+${formatCount(def.reward)} coins`;
    return '';
  }

  function unlockAchievementSkin(def, autoEquip = true) {
    if (!def?.skinReward) return false;
    if (isSkinOwned(def.skinReward)) return false;
    ownedSkins.push(def.skinReward);
    saveOwnedSkins();
    if (autoEquip) {
      equippedSkin = def.skinReward;
      saveEquippedSkin();
    }
    playUiSfx('skin');
    return true;
  }

  function queueAchievementToast(def) {
    const wasIdle = !activeAchievementToast && achievementToastQueue.length === 0;
    achievementToastQueue.push(def);
    if (wasIdle) playUiSfx('achievement');
    if (!activeAchievementToast) {
      activeAchievementToast = achievementToastQueue.shift() || null;
      achievementToastUntil = performance.now() + achievementToastDurationMs;
    }
    renderAchievementToast();
  }

  function renderAchievementToast(now = performance.now()) {
    if (activeAchievementToast && now >= achievementToastUntil) {
      activeAchievementToast = achievementToastQueue.shift() || null;
      achievementToastUntil = activeAchievementToast ? now + achievementToastDurationMs : 0;
    }

    if (!achievementToast) return;
    if (!activeAchievementToast) {
      achievementToast.classList.add('hidden');
      achievementToast.classList.remove('toast-live');
      activeAchievementToastSignature = '';
      return;
    }

    if (achievementToastTitleEl) achievementToastTitleEl.textContent = activeAchievementToast.title;
    if (achievementToastDescEl) achievementToastDescEl.textContent = activeAchievementToast.desc;
    if (achievementToastRewardEl) {
      const rewardText = getAchievementRewardText(activeAchievementToast);
      achievementToastRewardEl.textContent = rewardText || 'Unlocked';
    }
    achievementToast.classList.remove('hidden');

    const signature = `${activeAchievementToast.key || activeAchievementToast.title}:${achievementToastUntil}`;
    if (signature !== activeAchievementToastSignature) {
      if (activeAchievementToastSignature) playUiSfx('achievement');
      activeAchievementToastSignature = signature;
      achievementToast.classList.remove('toast-live');
      void achievementToast.offsetWidth;
      achievementToast.classList.add('toast-live');
    }
  }

  function syncAchievements() {
    if (syncingAchievements) return;
    if (cheatsUsedThisRun) return;
    syncingAchievements = true;
    try {
      normalizeLifetimeStats();
      normalizeSkinState();
      for (const def of achievementDefs) {
        if (achievementUnlocked(def.key)) continue;
        if ((def.progress?.() || 0) < def.target) continue;

        achievements[def.key] = {
          unlockedAt: new Date().toISOString(),
          reward: def.reward
        };
        if (def.reward > 0) addCoins(def.reward);
        unlockAchievementSkin(def);
        saveAchievements();
        queueAchievementToast(def);
      }
    } finally {
      syncingAchievements = false;
    }
  }

  function renderCheatRoom() {
    if (cheatCoinLabel) cheatCoinLabel.textContent = formatCount(coins);
    if (cheatAchievementLabel) {
      cheatAchievementLabel.textContent = achievementUnlocked('cheats-found')
        ? 'Cheats Found +15'
        : 'Cheats Found';
    }
    if (!cheatCodeListEl) return;

    cheatCodeListEl.innerHTML = cheatCatalog.map(item => `
      <article class="cheat-code-card">
        <code>${item.code}</code>
        <strong>${item.title}</strong>
        <p>${item.desc}</p>
      </article>
    `).join('');
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

  function getAchievementMaskMode(def, unlocked = achievementUnlocked(def.key)) {
    if (unlocked) return 'none';
    if (def.secret === 'desc') return 'desc';
    return def.secret ? 'full' : 'none';
  }

  function normalizeTransientUiState(now = Date.now()) {
    if (spinAnimationState && !spinAnimationState.spinning && spinAnimationState.expiresAt <= now) {
      spinAnimationState = null;
    }
    if (eventCelebrationUntil && eventCelebrationUntil <= now) {
      eventCelebrationUntil = 0;
      eventCelebrationReward = 0;
    }
  }

  function eventCelebrationActive(now = Date.now()) {
    return eventCelebrationUntil > now;
  }

  function startEventCelebration(reward) {
    eventCelebrationReward = reward;
    eventCelebrationUntil = Date.now() + 1800;
    const token = ++eventCelebrationToken;
    window.setTimeout(() => {
      if (token !== eventCelebrationToken) return;
      normalizeTransientUiState();
      if (currentScreen === 'home') updateView();
    }, 1850);
  }

  function buildSpinSegments() {
    return [
      { type: 'coins', amount: 3, label: '+3', icon: '3', color: '#ffb347' },
      { type: 'coins', amount: 5, label: '+5', icon: '5', color: '#ffd157' },
      { type: 'coins', amount: 8, label: '+8', icon: '8', color: '#7ce9ff' },
      { type: 'skin', label: 'Skin', icon: '★', color: '#9f8cff' },
      { type: 'coins', amount: 10, label: '+10', icon: '10', color: '#8ef2ba' },
      { type: 'coins', amount: 8, label: '+8', icon: '8', color: '#5df0ff' },
      { type: 'coins', amount: 5, label: '+5', icon: '5', color: '#ffcf72' },
      { type: 'coins', amount: 3, label: '+3', icon: '3', color: '#ff9c67' }
    ];
  }

  function chooseRandomItem(items = []) {
    if (!items.length) return null;
    return items[Math.floor(Math.random() * items.length)] || null;
  }

  function resolveLuckySpinOutcome() {
    const roll = Math.random();
    if (roll < 0.45) return { type: 'coins', amount: 3 };
    if (roll < 0.73) return { type: 'coins', amount: 5 };
    if (roll < 0.91) return { type: 'coins', amount: 8 };

    const locked = snakeSkins.filter(skin => !isSkinOwned(skin.key) && skin.key !== 'classic' && !isAchievementOnlySkin(skin));
    const unlocked = chooseRandomItem(locked);
    if (unlocked) return { type: 'skin', skin: unlocked };
    return { type: 'coins', amount: 10 };
  }

  function spinOutcomeLabel(outcome) {
    if (!outcome) return '';
    return outcome.type === 'skin' ? `${outcome.skin.name} skin` : `+${formatCount(outcome.amount)} coins`;
  }

  function spinSegmentMatchesOutcome(segment, outcome) {
    if (!segment || !outcome) return false;
    if (outcome.type === 'skin') return segment.type === 'skin';
    return segment.type === 'coins' && segment.amount === outcome.amount;
  }

  function spinHighlightIndexForOutcome(outcome, segments = buildSpinSegments()) {
    const matches = segments
      .map((segment, index) => (spinSegmentMatchesOutcome(segment, outcome) ? index : -1))
      .filter(index => index >= 0);
    return matches.length ? chooseRandomItem(matches) : 0;
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
      { type: 'bonus', title: 'Bonus Hunt', desc: 'Eat {target} bonus pears', target: [1, 2, 3], reward: [5, 7, 9] },
      { type: 'endless', title: 'Endless Push', desc: 'Clear {target} endless rounds', target: [1, 2, 3], reward: [5, 8, 10] },
      { type: 'games', title: 'Launch Queue', desc: 'Start {target} runs', target: [2, 3, 5], reward: [4, 6, 9] }
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
    if (kind === 'event') incrementStat('eventsClaimed', 1);
    if (kind === 'mission') incrementStat('missionsClaimed', 1);
    saveChallengeState();
    const streakResult = kind === 'mission' ? maybeCompleteMissionStreak(challengeState.date) : null;
    if (streakResult) {
      showRealmMessage(`+${formatCount(challenge.reward)} coins • Streak x${formatCount(streakResult.streakCount)} +${formatCount(streakResult.bonus)}`, 2200);
    } else {
      showRealmMessage(`+${formatCount(challenge.reward)} coins`, 1400);
    }
    if (kind === 'event') startEventCelebration(challenge.reward);
    updateHud();
  }

  function spinCooldownLabel() {
    const remaining = spinReadyAt - Date.now();
    return remaining <= 0 ? 'ready' : formatTimeRemaining(remaining);
  }

  function runLuckySpin() {
    if (spinAnimationState?.spinning) return;
    if (Date.now() < spinReadyAt) {
      showRealmMessage(`Spin in ${spinCooldownLabel()}`, 1400);
      updateView();
      return;
    }

    incrementStat('spinsUsed', 1);
    const outcome = resolveLuckySpinOutcome();
    const segments = buildSpinSegments();
    const highlightIndex = spinHighlightIndexForOutcome(outcome, segments);
    const segmentAngle = 360 / Math.max(1, segments.length);
    const durationMs = 5600 + (Math.floor(Math.random() * 3) * 360);
    const fullTurns = 12 + randomBetween(0, 3);
    const rotationDeg = -((fullTurns * 360) + (highlightIndex * segmentAngle));
    const token = ++spinAnimationToken;

    spinAnimationState = {
      spinning: true,
      segments,
      highlightIndex,
      rotationDeg,
      durationMs,
      resolveAt: Date.now() + durationMs
    };
    updateView();

    window.setTimeout(() => {
      if (token !== spinAnimationToken) return;

      if (outcome.type === 'skin') {
        if (!isSkinOwned(outcome.skin.key)) ownedSkins.push(outcome.skin.key);
        saveOwnedSkins();
        equippedSkin = outcome.skin.key;
        saveEquippedSkin();
      } else {
        addCoins(outcome.amount);
      }

      const rewardText = spinOutcomeLabel(outcome);
      spinReadyAt = Date.now() + (4 * 60 * 60 * 1000);
      saveSpinReadyAt();
      lastSpinResult = rewardText;
      spinAnimationState = {
        spinning: false,
        segments,
        highlightIndex,
        rotationDeg,
        durationMs,
        rewardText,
        rare: outcome.type === 'skin' || outcome.amount >= 10,
        expiresAt: Date.now() + 5200
      };
      showRealmMessage(`Lucky Spin: ${rewardText}`, 1800);
      playUiSfx(outcome.type === 'skin' ? 'skin' : 'coin');
      updateHud();
      updateView();
    }, durationMs);
  }

  function isSkinOwned(key) {
    return ownedSkins.includes(key);
  }

  function isAchievementOnlySkin(skin) {
    return skin?.unlockMode === 'achievement';
  }

  function getSkinUnlockHint(skin) {
    return skin?.unlockHint || 'Unlock through gameplay';
  }

  function getSkinActionConfig(skin, priceOverride = null) {
    const owned = isSkinOwned(skin.key);
    const active = equippedSkin === skin.key;
    const achievementOnly = isAchievementOnlySkin(skin);
    const price = priceOverride ?? getSkinPrice(skin);

    if (active) {
      if (skin.key === 'classic') {
        return { label: 'Default equipped', className: 'skin-action owned' };
      }
      return { label: 'Unequip', className: 'skin-action unequip' };
    }

    if (owned) return { label: 'Equip', className: 'skin-action equip' };
    if (achievementOnly) return { label: getSkinUnlockHint(skin), className: 'skin-action locked' };

    return {
      label: coins >= price ? `Buy for ${formatCount(price)}` : `Need ${formatCount(price - coins)}`,
      className: 'skin-action'
    };
  }

  function getActiveSkin() {
    normalizeSkinState();
    return snakeSkins.find(skin => skin.key === equippedSkin) || snakeSkins[0];
  }

  function getSkinCatalogPrice(skin) {
    return skin?.tierPrice ?? skin?.catalogPrice ?? skin?.price ?? 0;
  }

  function getSkinTier(skin) {
    const price = getSkinCatalogPrice(skin);
    if (!price) return { label: 'Starter', color: '#8ef2ba', slug: 'starter' };
    if (price >= 300) return { label: 'Snakeifying', color: '#ff8be0', slug: 'snakeifying' };
    if (price >= 230) return { label: 'Ascendant', color: '#ffe08a', slug: 'ascendant' };
    if (price >= 170) return { label: 'Cosmic', color: '#8f9cff', slug: 'cosmic' };
    if (price >= 120) return { label: 'Divine', color: '#7cf8ff', slug: 'divine' };
    if (price >= 80) return { label: 'Mythic', color: '#ffd369', slug: 'mythic' };
    if (price >= 54) return { label: 'Legendary', color: '#ff9a6b', slug: 'legendary' };
    if (price >= 38) return { label: 'Epic', color: '#8fa6ff', slug: 'epic' };
    if (price >= 28) return { label: 'Rare', color: '#79e8ff', slug: 'rare' };
    if (price >= 20) return { label: 'Enhanced', color: '#6fe5ff', slug: 'enhanced' };
    if (price >= 14) return { label: 'Uncommon', color: '#7ee7c9', slug: 'uncommon' };
    return { label: 'Core', color: '#9ff1a9', slug: 'core' };
  }

  function getSkinArtProfile(skin = getActiveSkin()) {
    const tier = getSkinTier(skin);
    const price = getSkinCatalogPrice(skin);
    let pattern = skin.pattern;
    if (!pattern) {
      if (price >= 38) pattern = 'diamond';
      else if (price >= 28) pattern = 'chevron';
      else if (price >= 18) pattern = 'ribs';
      else if (price >= 10) pattern = 'bands';
      else pattern = 'smooth';
    }

    return {
      tier,
      pattern,
      stripe: skin.stripe || skin.accent,
      belly: skin.belly || skin.head,
      eye: skin.eye || (price >= 28 ? '#fff0a8' : '#081018'),
      glow: skin.glow || (tier.label === 'Snakeifying'
        ? 'rgba(255, 139, 224, 0.42)'
        : tier.label === 'Ascendant'
          ? 'rgba(255, 224, 138, 0.34)'
          : tier.label === 'Cosmic'
            ? 'rgba(143, 156, 255, 0.32)'
            : tier.label === 'Mythic'
              ? 'rgba(255, 211, 105, 0.32)'
              : tier.label === 'Legendary'
                ? 'rgba(255, 154, 107, 0.24)'
                : 'rgba(255, 255, 255, 0.12)'),
      shine: skin.shine || 'rgba(255,255,255,0.2)'
    };
  }

  function getSkinTierFxProfile(skin = getActiveSkin()) {
    const tier = getSkinTier(skin);
    const variant = skin?.fxVariant || tier.slug;
    switch (tier.slug) {
      case 'mythic':
        return {
          slug: tier.slug,
          variant,
          interval: 126,
          burst: 2,
          spread: 0.56,
          speed: 0.74,
          lifeMin: 22,
          lifeMax: 38,
          radiusMin: 1.9,
          radiusMax: 3.4,
          shapes: ['diamond', 'circle', 'ring'],
          colors: ['rgba(255, 211, 105, 0.98)', 'rgba(255, 244, 190, 0.94)', 'rgba(255, 164, 74, 0.82)', 'rgba(255,255,255,0.86)'],
          alpha: 0.96,
          drag: 0.988,
          lineWidth: 1.5,
          twinkle: 0.002,
          trailLift: -0.08
        };
      case 'divine':
        return {
          slug: tier.slug,
          variant,
          interval: variant === 'angelic' ? 74 : 96,
          burst: variant === 'angelic' ? 4 : 3,
          spread: variant === 'angelic' ? 0.7 : 0.56,
          speed: variant === 'angelic' ? 0.76 : 0.62,
          lifeMin: 24,
          lifeMax: 44,
          radiusMin: 1.7,
          radiusMax: variant === 'angelic' ? 3.7 : 3.2,
          shapes: variant === 'angelic' ? ['ring', 'shard', 'circle'] : ['ring', 'circle', 'diamond'],
          colors: variant === 'angelic'
            ? ['rgba(124, 248, 255, 0.96)', 'rgba(255, 244, 191, 0.92)', 'rgba(255,255,255,0.94)', 'rgba(151, 214, 255, 0.82)']
            : ['rgba(124, 248, 255, 0.95)', 'rgba(225, 255, 255, 0.92)', 'rgba(151, 214, 255, 0.76)', 'rgba(255,255,255,0.82)'],
          alpha: 0.94,
          drag: 0.989,
          lineWidth: variant === 'angelic' ? 1.8 : 1.6,
          twinkle: variant === 'angelic' ? 0.0026 : 0.0018,
          trailLift: variant === 'angelic' ? -0.13 : -0.07
        };
      case 'cosmic': {
        const isNebula = variant === 'nebula';
        return {
          slug: tier.slug,
          variant,
          interval: isNebula ? 82 : 94,
          burst: isNebula ? 5 : 4,
          spread: isNebula ? 0.74 : 0.64,
          speed: isNebula ? 0.92 : 0.86,
          lifeMin: 24,
          lifeMax: isNebula ? 46 : 42,
          radiusMin: 1.6,
          radiusMax: isNebula ? 3.5 : 3.2,
          shapes: isNebula ? ['circle', 'diamond', 'ring', 'shard'] : ['circle', 'diamond', 'ring'],
          colors: isNebula
            ? ['rgba(255, 104, 214, 0.92)', 'rgba(143, 156, 255, 0.92)', 'rgba(88, 247, 232, 0.84)', 'rgba(255,255,255,0.94)']
            : ['rgba(143, 156, 255, 0.94)', 'rgba(255, 255, 255, 0.96)', 'rgba(88, 247, 232, 0.82)', 'rgba(127, 92, 255, 0.76)'],
          alpha: 0.92,
          drag: 0.99,
          lineWidth: isNebula ? 1.6 : 1.5,
          twinkle: isNebula ? 0.0031 : 0.0028,
          trailLift: isNebula ? -0.06 : -0.05
        };
      }
      case 'ascendant':
        return {
          slug: tier.slug,
          variant,
          interval: 84,
          burst: 4,
          spread: 0.6,
          speed: 0.88,
          lifeMin: 24,
          lifeMax: 42,
          radiusMin: 1.8,
          radiusMax: 3.4,
          shapes: ['shard', 'diamond', 'ring'],
          colors: ['rgba(255, 224, 138, 0.96)', 'rgba(255, 249, 214, 0.96)', 'rgba(255, 158, 99, 0.78)', 'rgba(255,255,255,0.84)'],
          alpha: 0.95,
          drag: 0.988,
          lineWidth: 1.7,
          twinkle: 0.0024,
          trailLift: -0.12
        };
      case 'snakeifying': {
        const isBlackhole = variant === 'blackhole';
        const isNebula = variant === 'nebula';
        return {
          slug: tier.slug,
          variant,
          interval: isBlackhole ? 54 : (isNebula ? 62 : 68),
          burst: isBlackhole ? 6 : 5,
          spread: isBlackhole ? 0.84 : (isNebula ? 0.8 : 0.74),
          speed: isBlackhole ? 1.08 : 1,
          lifeMin: 30,
          lifeMax: isBlackhole ? 58 : 52,
          radiusMin: 2,
          radiusMax: isBlackhole ? 4.6 : 4.1,
          shapes: isBlackhole ? ['ring', 'diamond', 'shard', 'circle'] : ['circle', 'diamond', 'ring', 'shard'],
          colors: isBlackhole
            ? ['rgba(255, 139, 224, 0.98)', 'rgba(127, 92, 255, 0.98)', 'rgba(88, 247, 232, 0.88)', 'rgba(255, 241, 250, 0.94)', 'rgba(16, 18, 33, 0.72)']
            : isNebula
              ? ['rgba(255, 104, 214, 0.96)', 'rgba(143, 156, 255, 0.94)', 'rgba(88, 247, 232, 0.86)', 'rgba(255,255,255,0.9)']
              : ['rgba(255, 139, 224, 0.98)', 'rgba(127, 92, 255, 0.96)', 'rgba(255, 241, 250, 0.9)', 'rgba(88, 247, 232, 0.78)'],
          alpha: 0.97,
          drag: 0.992,
          lineWidth: isBlackhole ? 2.1 : 1.95,
          twinkle: isBlackhole ? 0.0042 : 0.0038,
          trailLift: isBlackhole ? -0.08 : -0.07
        };
      }
      default:
        return null;
    }
  }

  function buildSkinPreviewStyle(skin) {
    const art = getSkinArtProfile(skin);
    return [
      `--skin-bg-a:${skin.bgA}`,
      `--skin-bg-b:${skin.bgB}`,
      `--skin-body:${skin.body}`,
      `--skin-head:${skin.head}`,
      `--skin-accent:${skin.accent}`,
      `--skin-stripe:${art.stripe}`,
      `--skin-belly:${art.belly}`,
      `--skin-eye:${art.eye}`,
      `--skin-glow:${art.glow}`,
      `--skin-shine:${art.shine}`,
      `--skin-tier:${art.tier.color}`
    ].join(';');
  }

  function getTierRibbonProfile(skin = getActiveSkin()) {
    const tier = getSkinTier(skin);
    const rank = tierOrderMap[tier.slug] ?? 0;
    if (rank <= tierOrderMap.mythic) return null;

    const art = getSkinArtProfile(skin);
    const variant = skin?.fxVariant || art.pattern || tier.slug;
    const base = {
      glow: art.glow,
      outerWidth: 0.48,
      innerWidth: 0.18,
      outerAlpha: 0.24,
      innerAlpha: 0.66,
      shadowBlur: 0.58,
      pulseSpeed: 0.004,
      nodeStep: 2,
      nodeRadius: 0.11,
      nodeSize: 0.05,
      nodeAlpha: 0.72,
      colors: [art.accent, art.stripe, art.head, art.accent],
      coreColor: 'rgba(255,255,255,0.42)'
    };

    if (tier.slug === 'divine') {
      return {
        ...base,
        outerWidth: 0.42,
        innerWidth: 0.16,
        outerAlpha: 0.18,
        innerAlpha: 0.54,
        shadowBlur: 0.46,
        nodeRadius: 0.09,
        nodeAlpha: 0.46,
        colors: ['rgba(255,255,255,0.82)', art.stripe, art.accent, 'rgba(255,255,255,0.72)'],
        coreColor: 'rgba(255,255,255,0.52)'
      };
    }

    if (tier.slug === 'cosmic') {
      return {
        ...base,
        outerWidth: 0.5,
        innerWidth: 0.18,
        outerAlpha: variant === 'nebula' ? 0.28 : 0.24,
        innerAlpha: 0.6,
        shadowBlur: 0.62,
        nodeStep: 2,
        nodeRadius: 0.12,
        colors: variant === 'nebula'
          ? [art.accent, art.stripe, art.head, 'rgba(255,255,255,0.72)']
          : [art.stripe, art.accent, art.head, art.stripe],
        coreColor: 'rgba(255,255,255,0.48)'
      };
    }

    if (tier.slug === 'ascendant') {
      return {
        ...base,
        outerWidth: 0.54,
        innerWidth: 0.2,
        outerAlpha: 0.26,
        innerAlpha: 0.64,
        shadowBlur: 0.68,
        nodeStep: 2,
        nodeRadius: 0.12,
        nodeAlpha: 0.7,
        colors: [art.accent, art.stripe, art.head, 'rgba(255,255,255,0.68)'],
        coreColor: 'rgba(255,249,214,0.56)'
      };
    }

    return {
      ...base,
      outerWidth: variant === 'blackhole' ? 0.62 : 0.58,
      innerWidth: variant === 'blackhole' ? 0.24 : 0.21,
      outerAlpha: variant === 'blackhole' ? 0.36 : 0.32,
      innerAlpha: variant === 'blackhole' ? 0.82 : 0.72,
      shadowBlur: variant === 'blackhole' ? 0.8 : 0.72,
      pulseSpeed: variant === 'blackhole' ? 0.0052 : 0.0046,
      nodeStep: 1,
      nodeRadius: variant === 'blackhole' ? 0.15 : 0.13,
      nodeSize: variant === 'blackhole' ? 0.06 : 0.052,
      nodeAlpha: 0.84,
      colors: variant === 'blackhole'
        ? [art.accent, art.stripe, art.head, art.stripe, art.accent]
        : [art.accent, art.head, art.stripe, art.accent],
      coreColor: variant === 'blackhole' ? 'rgba(255,255,255,0.72)' : 'rgba(255,241,250,0.58)'
    };
  }

  function getDailyShopSpotlight() {
    const saleCandidates = snakeSkins.filter(skin => skin.price > 0);
    if (!saleCandidates.length) return null;

    const seed = hashString(`${getLocalDateKey()}-shop-spotlight`);
    const skin = saleCandidates[seed % saleCandidates.length];
    const catalogPrice = getSkinCatalogPrice(skin);
    const discountRate = catalogPrice >= 300 ? 0.06
      : catalogPrice >= 230 ? 0.08
      : catalogPrice >= 120 ? 0.1
      : catalogPrice >= 70 ? 0.12
      : catalogPrice >= 36 ? 0.18
      : catalogPrice >= 24 ? 0.16
      : 0.14;
    const salePrice = Math.max(1, Math.round(skin.price * (1 - discountRate)));
    const discountPercent = Math.max(10, Math.round((1 - (salePrice / skin.price)) * 100));

    return {
      skin,
      salePrice,
      basePrice: skin.price,
      discountPercent
    };
  }

  function getSkinPrice(skin) {
    if (!skin) return 0;
    const spotlight = getDailyShopSpotlight();
    if (spotlight?.skin.key === skin.key) return spotlight.salePrice;
    return skin.price;
  }

  function compareShopSkins(a, b) {
    const aTier = getSkinTier(a);
    const bTier = getSkinTier(b);
    const tierDiff = (tierOrderMap[aTier.slug] ?? 0) - (tierOrderMap[bTier.slug] ?? 0);
    if (tierDiff !== 0) return tierDiff;

    const achievementDiff = Number(isAchievementOnlySkin(a)) - Number(isAchievementOnlySkin(b));
    if (achievementDiff !== 0) return achievementDiff;

    const priceDiff = getSkinCatalogPrice(a) - getSkinCatalogPrice(b);
    if (priceDiff !== 0) return priceDiff;

    return a.name.localeCompare(b.name);
  }

  function getDockNoticeToken(kind) {
    ensureChallengeState();

    if (kind === 'achievements') {
      const unlockedCount = achievementDefs.filter(def => achievementUnlocked(def.key)).length;
      return unlockedCount > 0 ? `achievements:${unlockedCount}` : '';
    }

    if (kind === 'stats') {
      return bestScore > 0 ? `stats:${bestScore}` : '';
    }

    if (kind === 'spin') {
      return Date.now() >= spinReadyAt ? `spin:${spinReadyAt}` : '';
    }

    if (kind === 'event') {
      const event = challengeState?.event;
      return event && event.progress >= event.target && !event.claimed
        ? `event:${challengeState.date}:${event.title}:${event.target}`
        : '';
    }

    if (kind === 'missions') {
      const readyMissionIds = (challengeState?.missions || [])
        .map((mission, index) => (mission.progress >= mission.target && !mission.claimed ? index : null))
        .filter(index => index !== null)
        .join(',');
      return readyMissionIds ? `missions:${challengeState?.date || getLocalDateKey()}:${readyMissionIds}` : '';
    }

    if (kind === 'shop') {
      const spotlight = getDailyShopSpotlight();
      return spotlight && !isSkinOwned(spotlight.skin.key)
        ? `shop:${getLocalDateKey()}:${spotlight.skin.key}`
        : '';
    }

    return '';
  }

  function hasUnseenDockNotice(kind) {
    normalizeDockNoticeSeen();
    const token = getDockNoticeToken(kind);
    return !!token && dockNoticeSeen[kind] !== token;
  }

  function markDockNoticeSeen(kind) {
    const token = getDockNoticeToken(kind);
    if (!token) return;
    normalizeDockNoticeSeen();
    dockNoticeSeen[kind] = token;
    saveDockNoticeSeen();
  }

  function renderShop() {
    normalizeSkinState();
    if (shopCoinLabel) shopCoinLabel.textContent = formatCount(coins);
    if (!shopItemsEl) return;
    const spotlight = getDailyShopSpotlight();
    const vaultSkins = snakeSkins.filter(skin => getSkinCatalogPrice(skin) >= 70 && !isAchievementOnlySkin(skin));
    const remainingVaultSkins = vaultSkins.filter(skin => !isSkinOwned(skin.key));
    const affordableVaultSkins = remainingVaultSkins.filter(skin => getSkinPrice(skin) <= coins);
    const vaultMarkup = vaultSkins.length ? `
      <article class="shop-vault">
        <div>
          <span class="info-tag">Collector Vault</span>
          <h3>Luxury skins are live</h3>
          <p>The top shelf now has genuinely expensive flex skins so achievement coins still have somewhere to go.</p>
        </div>
        <div class="shop-vault-stats">
          <div class="shop-vault-stat">
            <strong>${formatCount(vaultSkins.length)}</strong>
            <span>vault skins</span>
          </div>
          <div class="shop-vault-stat">
            <strong>${formatCount(remainingVaultSkins.length)}</strong>
            <span>left to own</span>
          </div>
          <div class="shop-vault-stat">
            <strong>${formatCount(affordableVaultSkins.length)}</strong>
            <span>you can buy</span>
          </div>
        </div>
      </article>
    ` : '';
    const spotlightMarkup = spotlight ? (() => {
      const spotlightSkin = spotlight.skin;
      const previewStyle = buildSkinPreviewStyle(spotlightSkin);
      const spotlightArt = getSkinArtProfile(spotlightSkin);
      const spotlightTier = getSkinTier(spotlightSkin);
      const buttonAction = getSkinActionConfig(spotlightSkin, spotlight.salePrice);
      return `
        <article class="shop-spotlight tier-${spotlightTier.slug}">
          <div class="shop-spotlight-copy">
            <span class="info-tag">Today only • ${spotlight.discountPercent}% off</span>
            <h3>${spotlightSkin.emoji} ${spotlightSkin.name}</h3>
            <p>${spotlightSkin.desc}</p>
            <div class="shop-spotlight-price">
              <strong>${formatCount(spotlight.salePrice)}</strong>
              <span>${formatCount(spotlight.basePrice)}</span>
            </div>
            <button class="${buttonAction.className}" type="button" data-skin="${spotlightSkin.key}">${buttonAction.label}</button>
          </div>
          <div class="skin-preview spotlight-preview tier-${spotlightTier.slug} pattern-${spotlightArt.pattern}" style="${previewStyle}">
            <span class="skin-preview-fx tier-${spotlightTier.slug}" aria-hidden="true"></span>
            <span class="skin-tier-chip">Spotlight</span>
          </div>
        </article>
      `;
    })() : '';

    const orderedSkins = [...snakeSkins].sort(compareShopSkins);

    const skinsMarkup = orderedSkins.map(skin => {
      const active = equippedSkin === skin.key;
      const achievementOnly = isAchievementOnlySkin(skin);
      const price = getSkinPrice(skin);
      const spotlighted = spotlight?.skin.key === skin.key;
      const tier = getSkinTier(skin);
      const previewStyle = buildSkinPreviewStyle(skin);
      const art = getSkinArtProfile(skin);
      const buttonAction = getSkinActionConfig(skin);
      const priceMarkup = achievementOnly
        ? '<span class="skin-price reward-only">Achievement only</span>'
        : skin.price
        ? `<span class="skin-price"><img src="coin.svg" class="coin-icon" alt="Coin" /> ${formatCount(price)}${spotlighted ? ` <small class="skin-sale-cut">${formatCount(skin.price)}</small>` : ''}</span>`
        : '<span class="skin-price">Free</span>';

      return `
        <article class="skin-card tier-${tier.slug}${active ? ' active' : ''}${spotlighted ? ' sale' : ''}">
          <div class="skin-preview tier-${tier.slug} pattern-${art.pattern}" style="${previewStyle}">
            <span class="skin-preview-fx tier-${tier.slug}" aria-hidden="true"></span>
            <span class="skin-tier-chip tier-${tier.slug}">${spotlighted ? `${tier.label} • Sale` : tier.label}</span>
          </div>
          <div class="skin-meta">
            <div>
              <p class="skin-name">${skin.emoji} ${skin.name}</p>
            </div>
            ${priceMarkup}
          </div>
          <p class="skin-desc">${skin.desc}</p>
          <button class="${buttonAction.className}" type="button" data-skin="${skin.key}">${buttonAction.label}</button>
        </article>
      `;
    }).join('');

    shopItemsEl.innerHTML = `${vaultMarkup}${spotlightMarkup}${skinsMarkup}`;
  }

  function toggleShop(force) {
    if (currentScreen !== 'home') return;
    infoPanel = '';
    const nextState = typeof force === 'boolean' ? force : !shopOpen;
    const changed = nextState !== shopOpen;
    shopOpen = nextState;
    if (shopOpen) markDockNoticeSeen('shop');
    if (changed) playUiSfx('menu');
    renderShop();
    updateView();
  }

  function openInfoPanel(kind) {
    if (currentScreen !== 'home') return;
    const changed = infoPanel !== kind || shopOpen;
    shopOpen = false;
    if (kind === 'achievements') markDockNoticeSeen('achievements');
    if (kind === 'stats') markDockNoticeSeen('stats');
    if (kind === 'spin') markDockNoticeSeen('spin');
    if (kind === 'events') markDockNoticeSeen('event');
    if (kind === 'missions') markDockNoticeSeen('missions');
    infoPanel = kind;
    if (changed) playUiSfx('menu');
    updateView();
  }

  function closeInfoPanel() {
    const hadPanel = !!infoPanel;
    infoPanel = '';
    if (hadPanel) playUiSfx('menu');
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
        ? board.map((entry, index) => `<div class="info-card"><strong>#${index + 1} ${entry.name}</strong>Score ${formatCount(entry.score)} • Level ${formatCount(entry.level)} • Round ${formatCount(entry.round)}</div>`).join('')
        : '<div class="info-card"><strong>No scores yet</strong>Finish an endless run to start filling the board.</div>';
      return;
    }

    if (infoPanel === 'account') {
      const currentTransferHost = window.location.protocol === 'file:'
        ? 'file copy'
        : `${window.location.hostname || 'localhost'}:${window.location.port || (window.location.protocol === 'https:' ? '443' : '80')}`;
      const isFileCopy = window.location.protocol === 'file:';
      infoTitleEl.textContent = 'account';
      infoSubtitleEl.textContent = 'This game saves in this browser on this device for this site address. Use transfer links or save codes to move progress between copies.';
      infoContentEl.innerHTML = `
        <div class="info-card">
          <strong>Current player</strong>
          <div>Player <span class="info-tag">${playerName}</span>${activeProfileId ? ` • Account <span class="info-tag">${activeProfileId}</span>` : ' • No local account loaded'}</div>
          <div style="margin-top:10px">This copy is running on <span class="info-tag">${currentTransferHost}</span>.</div>
          <div style="margin-top:10px">${accountNotice || 'Save Account creates a local login in this browser on this device. Transfer links and save codes move progress between copies.'}</div>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <strong>Profile</strong>
            <div>Create or update a local account save for this browser and site address.</div>
            <button class="info-action" type="button" data-action="save-account">Save account</button>
            <button class="info-action alt" type="button" data-action="load-account">Log in to account</button>
          </div>
          <div class="info-card">
            <strong>Transfer</strong>
            <div>${isFileCopy ? 'Move this file-copy save into the 127 local web copy. The imported save will replace the 127 save.' : 'Move your progress between the file version and the localhost version.'}</div>
            ${isFileCopy ? '<button class="info-action" type="button" data-action="open-local-web-save">Open 127 copy with this save</button>' : ''}
            <button class="info-action" type="button" data-action="copy-save-link">Copy transfer link</button>
            <button class="info-action alt" type="button" data-action="copy-save-code">Copy save code</button>
            <button class="info-action alt" type="button" data-action="import-save">Import save link/code</button>
          </div>
          <div class="info-card">
            <strong>Identity</strong>
            <div>Rename the player label shown on home and during runs.</div>
            <button class="info-action alt" type="button" data-action="rename-player">Rename player</button>
          </div>
        </div>
      `;
      return;
    }

    if (infoPanel === 'guide') {
      infoTitleEl.textContent = 'quick guide';
      infoSubtitleEl.textContent = 'Fast inputs, smooth runs, and a few tips before you jump in.';
      infoContentEl.innerHTML = [
        '<div class="info-card"><strong>Controls</strong>Use arrow keys, WASD, or the touch pad on mobile. The snake now previews turns instantly.</div>',
        '<div class="info-card"><strong>Shop</strong>Buy skins with coins, equip what you like, and switch back to Classic any time.</div>',
        '<div class="info-card"><strong>Lucky Spin</strong>Spin every 4 hours for coins or a surprise skin.</div>',
        '<div class="info-card"><strong>Progress</strong>Events, missions, and achievements track automatically while you play.</div>'
      ].join('');
      return;
    }

    if (infoPanel === 'achievements') {
      const unlockedCount = achievementDefs.filter(def => achievementUnlocked(def.key)).length;
      infoTitleEl.textContent = 'achievements';
      infoSubtitleEl.textContent = `${unlockedCount}/${achievementDefs.length} unlocked. Rewards are paid automatically when you earn them.`;
      infoContentEl.innerHTML = `
        <div class="info-card">
          <strong>Progress</strong>
          <div>You have unlocked ${formatCount(unlockedCount)} achievements so far.</div>
          <div class="info-progress"><span style="width:${Math.round((unlockedCount / achievementDefs.length) * 100)}%"></span></div>
        </div>
        <div class="info-grid">
          ${achievementDefs.map(def => {
            const unlocked = achievementUnlocked(def.key);
            const rawProgress = Math.min(def.target, def.progress?.() || 0);
            const maskMode = getAchievementMaskMode(def, unlocked);
            const hiddenTitle = maskMode === 'full';
            const hiddenDesc = maskMode === 'full' || maskMode === 'desc';
            const hiddenProgress = maskMode !== 'none';
            const percent = hiddenProgress ? 0 : Math.min(100, Math.round((rawProgress / def.target) * 100));
            const rewardText = getAchievementRewardText(def) || 'Special reward';
            const displayTitle = hiddenTitle ? 'Secret Achievement' : def.title;
            const displayDesc = hiddenDesc ? 'Description hidden until unlocked.' : def.desc;
            const statusText = unlocked
              ? 'Unlocked'
              : (hiddenProgress ? `Hidden goal • Reward ${rewardText}` : `${formatCount(rawProgress)}/${formatCount(def.target)} progress • Reward ${rewardText}`);
            return `
              <div class="info-card">
                <strong>${displayTitle}</strong>
                <div>${displayDesc}</div>
                <div class="info-progress"><span style="width:${percent}%"></span></div>
                <div style="margin-top:10px">${statusText}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
      return;
    }

    if (infoPanel === 'stats') {
      const unlockedCount = achievementDefs.filter(def => achievementUnlocked(def.key)).length;
      const ownedCount = Math.max(0, ownedSkins.length - 1);
      const spotlight = getDailyShopSpotlight();
      const statCards = [
        ['Best score', bestScore],
        ['Coins banked', coins],
        ['Coins earned', lifetimeStats.coinsEarned || 0],
        ['Runs started', lifetimeStats.gamesStarted || 0],
        ['Rounds cleared', lifetimeStats.roundsCleared || 0],
        ['Endless rounds', lifetimeStats.endlessRoundsCleared || 0],
        ['Apples eaten', lifetimeStats.applesEaten || 0],
        ['Bonus pears', lifetimeStats.bonusPearsEaten || 0],
        ['Skins owned', ownedCount],
        ['Skins bought', lifetimeStats.skinsBought || 0],
        ['Spin uses', lifetimeStats.spinsUsed || 0],
        ['Daily claims', lifetimeStats.dailyClaims || 0],
        ['Cheats used', lifetimeStats.cheatsUsed || 0],
        ...(lifetimeStats.angelEntries > 0 ? [['Angel entries', lifetimeStats.angelEntries || 0]] : []),
        ...(lifetimeStats.bossDefeats > 0 ? [['Boss defeats', lifetimeStats.bossDefeats || 0]] : []),
        ...(lifetimeStats.perfectRounds > 0 ? [['Flawless rounds', lifetimeStats.perfectRounds || 0]] : []),
        ['Mission claims', lifetimeStats.missionsClaimed || 0],
        ['Event claims', lifetimeStats.eventsClaimed || 0],
        ['Leaderboard posts', lifetimeStats.leaderboardEntries || 0],
        ['Achievement count', unlockedCount]
      ];

      infoTitleEl.textContent = 'player stats';
      infoSubtitleEl.textContent = 'Your local profile totals, streaks, and progression history.';
      infoContentEl.innerHTML = `
        <div class="info-card">
          <strong>Account snapshot</strong>
          <div>Player <span class="info-tag">${playerName}</span></div>
          <div style="margin-top:10px">Mission streak ${formatCount(missionStreak.count)} • Best streak ${formatCount(missionStreak.best)}</div>
          <div style="margin-top:10px">${spotlight ? `Shop spotlight: ${spotlight.skin.name} for ${formatCount(spotlight.salePrice)} coins today.` : 'Shop spotlight unavailable.'}</div>
        </div>
        <div class="stats-grid">
          ${statCards.map(([label, value]) => `
            <div class="stat-card">
              <div class="stat-value">${formatCount(value)}</div>
              <div class="stat-label">${label}</div>
            </div>
          `).join('')}
        </div>
      `;
      return;
    }

    if (infoPanel === 'spin') {
      const activeSpin = spinAnimationState;
      const segments = activeSpin?.segments || buildSpinSegments();
      const highlightIndex = activeSpin?.highlightIndex ?? -1;
      const segmentAngle = 360 / Math.max(1, segments.length);
      const segmentDistance = segments.length >= 10 ? 114 : 122;
      const ready = Date.now() >= spinReadyAt;
      const spinning = !!activeSpin?.spinning;
      const settled = !!activeSpin && !activeSpin.spinning;
      const statusText = spinning ? 'Wheel spinning now' : (ready ? 'Ready now' : `Next spin in ${spinCooldownLabel()}`);
      const wheelTarget = activeSpin?.rotationDeg ?? (-(segmentAngle * Math.max(0, highlightIndex)));
      const wheelStyle = ` style="--spin-target:${wheelTarget}deg;--spin-duration:${activeSpin?.durationMs || 5600}ms;--segment-angle:${segmentAngle}deg;--segment-distance:${segmentDistance}px"`;
      infoTitleEl.textContent = 'lucky spin';
      infoSubtitleEl.textContent = 'The wheel now takes a longer, smoother full run with a cleaner lock-on at the end.';
      infoContentEl.innerHTML = `
        <div class="spin-stage${spinning ? ' spinning' : ''}${settled ? ' settled' : ''}${activeSpin?.rare ? ' rare' : ''}">
          <div class="spin-wheel-shell">
            <div class="spin-pointer"></div>
            <div class="spin-wheel"${wheelStyle}>
              ${segments.map((segment, index) => `
                <span class="spin-segment${highlightIndex === index ? ' hit' : ''}" style="--segment:${index};--segment-color:${segment.color}">
                  <strong>${segment.icon}</strong>
                  <small>${segment.label}</small>
                </span>
              `).join('')}
            </div>
            <div class="spin-center">${spinning ? '...' : 'Spin'}</div>
          </div>
          <div class="spin-stage-copy">
            <span class="info-tag">${statusText}</span>
            <h3>${spinning ? 'Spinning the wheel' : (settled ? 'Reward landed' : 'Daily lucky wheel')}</h3>
            <p>${spinning ? 'The wheel is cooking up coins or a surprise skin.' : (settled ? `This spin landed on ${activeSpin.rewardText}.` : 'Spin every 4 hours for coins or a surprise skin, now with a proper arcade-style reveal.')}</p>
            <button class="info-action" type="button" data-action="spin" ${(ready && !spinning) ? '' : 'disabled'}>${spinning ? 'Spinning...' : (ready ? 'Spin now' : 'Cooling down')}</button>
            ${lastSpinResult ? `<div class="spin-last-result">Last result: <strong>${lastSpinResult}</strong></div>` : ''}
          </div>
        </div>
      `;
      return;
    }

    if (infoPanel === 'events') {
      const event = challengeState?.event;
      if (!event) return;
      const percent = Math.min(100, Math.round((event.progress / event.target) * 100));
      const canClaim = event.progress >= event.target && !event.claimed;
      const typeLabel = event.type === 'games'
        ? 'Run Starts'
        : event.type === 'endless'
          ? 'Endless'
          : event.type === 'bonus'
            ? 'Pear Hunt'
            : event.type === 'rounds'
              ? 'Round Rush'
              : 'Apple Hunt';
      const celebration = eventCelebrationActive();
      infoTitleEl.textContent = 'daily event';
      infoSubtitleEl.textContent = `One featured challenge that refreshes each day. Reset in ${timeUntilNextLocalResetLabel()}.`;
      infoContentEl.innerHTML = `
        <div class="event-stage${canClaim ? ' ready' : ''}${celebration ? ' celebrate' : ''}">
          <div class="event-orb event-orb-a"></div>
          <div class="event-orb event-orb-b"></div>
          <div class="event-orb event-orb-c"></div>
          <div class="event-stage-copy">
            <span class="info-tag">${typeLabel}</span>
            <h3>${event.title}</h3>
            <p>${event.desc}</p>
            <div class="event-stage-meta">
              <strong>${formatCount(event.progress)}/${formatCount(event.target)}</strong>
              <span>${event.claimed ? 'Reward claimed' : (canClaim ? 'Ready to claim' : `${formatCount(event.target - event.progress)} left`)}</span>
            </div>
          </div>
          <div class="event-stage-reward">+${formatCount(celebration ? eventCelebrationReward : event.reward)}</div>
        </div>
        <div class="info-card">
          <strong>Featured reward</strong>
          <div>${celebration ? `Reward launched: +${formatCount(eventCelebrationReward)} coins.` : 'Featured events now pulse when they are ready and burst when claimed.'}</div>
          <div class="info-progress"><span style="width:${percent}%"></span></div>
          <div style="margin-top:10px">${formatCount(event.progress)}/${formatCount(event.target)} complete • Reward ${formatCount(event.reward)} coins</div>
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
        <div class="info-card mission-streak-card">
          <strong>Mission streak</strong>
          <div>${streakLockedToday ? `Today's streak is locked in at x${formatCount(missionStreak.count)}.` : `Claim all 3 missions today for +${formatCount(streakBonus)} bonus coins.`}</div>
          <div style="margin-top:10px">Current streak ${formatCount(missionStreak.count)} • Best ${formatCount(missionStreak.best)}</div>
        </div>
        <div class="info-grid">${missions.map((mission, index) => {
          const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));
          const canClaim = mission.progress >= mission.target && !mission.claimed;
          return `
            <div class="info-card">
              <strong>${mission.title}</strong>
              <div>${mission.desc}</div>
              <div class="info-progress"><span style="width:${percent}%"></span></div>
              <div style="margin-top:10px">${formatCount(mission.progress)}/${formatCount(mission.target)} complete • Reward ${formatCount(mission.reward)} coins</div>
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
    const price = getSkinPrice(skin);

    if (!isSkinOwned(key)) {
      if (isAchievementOnlySkin(skin)) {
        showRealmMessage(getSkinUnlockHint(skin), 1800);
        updateView();
        return;
      }
      if (coins < price) {
        showRealmMessage(`Need ${formatCount(price - coins)} more coins`, 1400);
        updateView();
        return;
      }
      coins -= price;
      saveCoins();
      ownedSkins.push(key);
      saveOwnedSkins();
      equippedSkin = key;
      saveEquippedSkin();
      incrementStat('skinsBought', 1);
      showRealmMessage(price < skin.price ? `${skin.name} unlocked on spotlight sale` : `${skin.name} unlocked`, 1600);
      playUiSfx('skin');
    } else if (equippedSkin === key) {
      if (key === 'classic') {
        showRealmMessage('Classic is already active', 1200);
      } else {
        equippedSkin = 'classic';
        saveEquippedSkin();
        showRealmMessage(`${skin.name} unequipped`, 1200);
        playUiSfx('unequip');
      }
    } else if (equippedSkin !== key) {
      equippedSkin = key;
      saveEquippedSkin();
      showRealmMessage(`${skin.name} equipped`, 1200);
      playUiSfx('toggle');
    }

    renderShop();
    updateHud();
    updateView();
  }

  function toggleFullscreen() {
    const target = currentScreen === 'game' ? gamePage : cardWrap;
    if (!getFullscreenElement()) {
      if (target?.requestFullscreen) target.requestFullscreen().catch(() => {});
      else target?.webkitRequestFullscreen?.();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else document.webkitExitFullscreen?.();
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
    incrementStat('dailyClaims', 1);
    try {
      localStorage.setItem(dailyRewardStorageKey, String(Date.now()));
    } catch {
      // ignore storage errors
    }
    showRealmMessage('+8 daily coins', 1800);
    playUiSfx('coin');
    updateHud();
    updateView();
  }

  function togglePause(force) {
    if ((blessingSelectionOpen || isCountdownActive()) && force !== false) return;
    paused = typeof force === 'boolean' ? force : !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    updateHud();
  }

  function registerLeaderboardCheatUse() {
    if (!endlessMode) return;
    if (leaderboardAbuseMode) {
      leaderboardOverrideUsedThisRun = true;
      return;
    }
    if (leaderboardOverrideCharges > 0) {
      leaderboardOverrideCharges -= 1;
      leaderboardOverrideUsedThisRun = true;
      return;
    }
    leaderboardDisqualifyingCheatUsed = true;
  }

  function markCheatUsed() {
    const firstCheatThisRun = !cheatsUsedThisRun;
    cheatsUsedThisRun = true;
    incrementStat('cheatsUsed', 1);
    registerLeaderboardCheatUse();
    if (firstCheatThisRun) {
      showRealmMessage('Cheats used: achievements disabled for this run', 2200);
    }
  }

  function armLeaderboardOverrideOnce() {
    incrementStat('cheatsUsed', 1);
    if (leaderboardAbuseMode) {
      showRealmMessage('Permanent leaderboard override already on', 1800);
      updateHud();
      return;
    }
    leaderboardOverrideCharges += 1;
    showRealmMessage(`Endless leaderboard override armed x${leaderboardOverrideCharges}`, 1800);
    updateHud();
  }

  function setLeaderboardOverridePermanent(enabled) {
    incrementStat('cheatsUsed', 1);
    leaderboardAbuseMode = enabled;
    if (!enabled) leaderboardOverrideCharges = 0;
    saveLeaderboardOverrideMode();
    showRealmMessage(enabled ? 'Permanent endless leaderboard override enabled' : 'Endless leaderboard override disabled', 1800);
    updateHud();
  }

  function recordEndlessLeaderboardResult() {
    if (!endlessMode || leaderboardSavedThisLife) return;

    leaderboardSavedThisLife = true;
    const overrideApplied = leaderboardOverrideUsedThisRun || leaderboardAbuseMode;
    const qualifies = !leaderboardDisqualifyingCheatUsed;
    const result = {
      qualifies,
      cheated: cheatsUsedThisRun,
      override: overrideApplied,
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
        override: overrideApplied,
        createdAt: new Date().toISOString()
      };

      endlessLeaderboard = [...endlessLeaderboard, entry]
        .sort((a, b) => (b.score - a.score) || (b.level - a.level) || (b.round - a.round))
        .slice(0, 10);

      saveEndlessLeaderboard();
      incrementStat('leaderboardEntries', 1);
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
    clearBlessingAutoPickTimer();
    clearCountdown();
    triggerScreenJuice(14, 0.22, 'rgba(255, 82, 82, 0.2)');
    playUiSfx('gameover');
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

  function renderBlessingAutoPickControls() {
    if (!abilityAutoPickButtons.length) return;
    abilityAutoPickButtons.forEach(button => {
      const buttonValue = clampAngelAutoPickChoice(button.dataset.autoBlessing);
      const active = buttonValue === angelAutoPickChoice;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function clearBlessingAutoPickTimer() {
    if (blessingAutoPickTimer === null) return;
    window.clearTimeout(blessingAutoPickTimer);
    blessingAutoPickTimer = null;
  }

  function maybeScheduleBlessingAutoPick() {
    clearBlessingAutoPickTimer();
    const optionIndex = angelAutoPickChoice - 1;
    const option = currentBlessingOptions[optionIndex];
    if (!angelRealm || !blessingSelectionOpen || currentScreen !== 'game' || gameOver || !option) return;

    blessingAutoPickTimer = window.setTimeout(() => {
      blessingAutoPickTimer = null;
      if (!angelRealm || !blessingSelectionOpen || currentScreen !== 'game' || gameOver) return;
      const autoOption = currentBlessingOptions[angelAutoPickChoice - 1];
      if (autoOption) chooseBlessing(autoOption.key);
    }, blessingAutoPickDelayMs);
  }

  function setAngelAutoPickChoice(value) {
    angelAutoPickChoice = clampAngelAutoPickChoice(value);
    saveAngelAutoPickChoice();
    renderBlessingAutoPickControls();
    if (angelAutoPickChoice > 0) maybeScheduleBlessingAutoPick();
    else clearBlessingAutoPickTimer();
  }

  function renderBlessingChoices() {
    renderBlessingAutoPickControls();
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
    maybeScheduleBlessingAutoPick();
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
    clearBlessingAutoPickTimer();
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

  function cheatSequence(code) {
    return `${code}${cheatSuffix}`.split('');
  }

  function matchesCheat(code) {
    return endsWithSequence(cheatSequence(code));
  }

  function facingDirection() {
    return directionQueue[0] || nextDirection || direction;
  }

  function queueTurn(turn) {
    const reference = directionQueue.length ? directionQueue[directionQueue.length - 1] : nextDirection;
    if (reference.x === turn.x && reference.y === turn.y) return;
    if (snake.length > 1 && reference.x === -turn.x && reference.y === -turn.y) return;
    if (!directionQueue.length) nextDirection = turn;
    directionQueue.push(turn);
    if (directionQueue.length > 3) directionQueue.shift();
    if (currentScreen === 'game' && !gameOver && !paused && window.location.hash !== '#cheats') {
      const now = performance.now();
      if (getVisualFxQuality() > 0 && now - lastTurnPreviewAt > 48) {
        lastTurnPreviewAt = now;
        draw(now);
      }
    }
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
    syncAchievements();
    normalizeTransientUiState();
    const inCheatRoom = window.location.hash === '#cheats';
    const onHome = currentScreen === 'home';
    if (!onHome) {
      shopOpen = false;
      infoPanel = '';
    }

    if (playerNameLabel) playerNameLabel.textContent = playerName;
    if (coinBankLabel && onHome) coinBankLabel.textContent = formatCount(coins);
    if (shopCoinLabel && onHome && shopOpen) shopCoinLabel.textContent = formatCount(coins);
    if (cheatCoinLabel && inCheatRoom) cheatCoinLabel.textContent = formatCount(coins);
    if (gameModeLabel) {
      gameModeLabel.textContent = angelRealm ? 'Angel Realm' : (endlessMode ? 'Endless Run' : 'Normal Run');
    }
    if (gameOverTitleEl) {
      gameOverTitleEl.textContent = endlessMode ? 'Endless Run Over' : 'Game Over';
    }
    if (onHome) {
      setDockLabel(leaderboardBtn, 'Leaderboard', 'Ranks');
      setDockBadge(leaderboardBtn);
      const unlockedAchievements = achievementDefs.filter(def => achievementUnlocked(def.key)).length;
      const achievementNotice = hasUnseenDockNotice('achievements');
      setDockLabel(achievementsBtn, `Achievements ${unlockedAchievements}/${achievementDefs.length}`, 'Goals');
      setDockBadge(achievementsBtn, achievementNotice ? unlockedAchievements : '');
      setDockLabel(statsBtn, 'Stats', 'Data');
      setDockBadge(statsBtn, hasUnseenDockNotice('stats') ? '!' : '');
      setDockLabel(guideBtn, 'Guide', 'Guide');
      setDockBadge(guideBtn);
      const spinReady = Date.now() >= spinReadyAt;
      const spinNotice = hasUnseenDockNotice('spin');
      setDockLabel(spinBtn, spinReady ? 'Lucky Spin' : `Spin ${spinCooldownLabel()}`, 'Spin');
      if (spinBtn) spinBtn.classList.toggle('reward-ready', spinNotice);
      setDockBadge(spinBtn, spinNotice ? '!' : '');
      setDockLabel(changeNameBtn, activeProfileId ? `Account ${activeProfileId}` : 'Account & Save', 'Account');
      setDockBadge(changeNameBtn);
      const missionReadyCount = (challengeState?.missions || []).filter(mission => mission.progress >= mission.target && !mission.claimed).length;
      const eventNotice = hasUnseenDockNotice('event');
      const missionNotice = hasUnseenDockNotice('missions');
      const missionBadge = missionNotice ? missionReadyCount : '';
      const missionLabel = missionNotice
        ? `Missions ${formatCount(missionReadyCount)} ready • Streak ${formatCount(missionStreak.count)}`
        : (missionStreak.count > 0 ? `Missions • Streak ${formatCount(missionStreak.count)}` : 'Missions');
      setDockLabel(eventsBtn, eventNotice ? 'Event Ready' : 'Events', 'Events');
      if (eventsBtn) eventsBtn.classList.toggle('reward-ready', eventNotice);
      setDockBadge(eventsBtn, eventNotice ? '!' : '');
      setDockLabel(missionsBtn, missionLabel, 'Tasks');
      if (missionsBtn) missionsBtn.classList.toggle('reward-ready', missionNotice);
      setDockBadge(missionsBtn, missionBadge);
      setDockLabel(shopBtn, 'Shop', 'Shop');
      const shopNotice = hasUnseenDockNotice('shop');
      setDockBadge(shopBtn, shopNotice ? '★' : '');
      if (dailyRewardBtn) {
        const rewardState = getDailyRewardState();
        dailyRewardBtn.disabled = false;
        dailyRewardBtn.classList.toggle('reward-ready', rewardState.ready);
        setDockLabel(dailyRewardBtn, rewardState.ready ? 'Daily reward ready' : `Daily reward in ${rewardState.label}`, rewardState.ready ? 'Ready' : rewardState.shortLabel);
        setDockBadge(dailyRewardBtn, rewardState.ready ? '!' : '');
      }
      if (fullscreenBtn) {
        const label = getFullscreenElement() ? 'Exit fullscreen' : 'Fullscreen';
        setDockLabel(fullscreenBtn, label, 'Full');
        setDockBadge(fullscreenBtn);
      }
    }
    if (gameFullscreenBtn) {
      const isFullscreen = Boolean(getFullscreenElement());
      const label = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
      gameFullscreenBtn.textContent = isFullscreen ? '🗗' : '⛶';
      gameFullscreenBtn.setAttribute('aria-label', label);
      gameFullscreenBtn.title = label;
      gameFullscreenBtn.setAttribute('aria-pressed', isFullscreen ? 'true' : 'false');
    }
    if (pauseBtn) {
      pauseBtn.textContent = paused && !blessingSelectionOpen ? 'Resume' : 'Pause';
      pauseBtn.disabled = blessingSelectionOpen || gameOver || isCountdownActive();
    }
    if (realmXpWrap) {
      const showRealmXp = currentScreen === 'game' && !inCheatRoom && angelRealm && !gameOver;
      realmXpWrap.classList.toggle('hidden', !showRealmXp);
    }

    if (shopOpen && onHome) renderShop();
    if (infoPanel && onHome) renderInfoPanel();
    if (currentScreen === 'game' && inCheatRoom) renderCheatRoom();
    renderAchievementToast();

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

  function resetModeProgress(mode = 'normal') {
    angelRealm = mode === 'angel';
    endlessMode = mode === 'endless';
    xp = 0;
    xpLevel = 1;
    abilities = { vigor: 0, reflex: 0, luck: 0, shield: 0, bounty: 0 };
    recalcStats();
    playerHealth = maxHealth;
  }

  function startMode(mode = 'normal') {
    resetModeProgress(mode);
    currentScreen = 'game';
    shopOpen = false;
    window.location.hash = '';
    incrementStat('gamesStarted', 1);
    updateChallengeProgress('games', 1);
    if (angelRealm) incrementStat('angelEntries', 1);
    resetGame(false, true);
    showRealmMessage(angelRealm ? 'Angel Realm awakened' : (endlessMode ? 'Endless mode' : 'Normal mode'), 1400);
    announceCurrentStage(2200);
    playUiSfx('start');
    updateView();
  }

  function clearJackpotMode() {
    if (jackpotLuckBonusActive) {
      abilities.luck = Math.max(0, abilities.luck - 1);
      jackpotLuckBonusActive = false;
    }
    jackpotMode = false;
    jackpotHud.mode = 'XP';
    jackpotHud.nextRollAt = 0;
    recalcStats();
    playerHealth = Math.min(playerHealth, maxHealth);
  }

  function returnHome() {
    clearBlessingAutoPickTimer();
    blessingSelectionOpen = false;
    currentBlessingOptions = [];
    stageBanner = null;
    clearJackpotMode();
    currentScreen = 'home';
    shopOpen = false;
    window.location.hash = '';
    clearCountdown();
    togglePause(false);
    playUiSfx('menu');
    updateView();
  }

  function changePlayerName() {
    const entered = window.prompt('Enter your name', playerName);
    if (entered === null) return;

    const cleaned = entered.trim().slice(0, 18) || 'Player';
    if (cleaned !== playerName) incrementStat('nameChanges', 1);
    playerName = cleaned;
    try {
      localStorage.setItem(playerNameStorageKey, playerName);
    } catch {
      // ignore storage errors
    }
    updateView();
  }

  function showRealmMessage(message, duration = 1600) {
    realmMessage = message;
    realmMessageUntil = performance.now() + duration;
  }

  function showStageBanner(title, subtitle = '', duration = 1900, tone = 'normal') {
    const startedAt = performance.now();
    stageBanner = {
      title: String(title || '').trim(),
      subtitle: String(subtitle || '').trim(),
      tone,
      startedAt,
      until: startedAt + duration
    };
  }

  function getStageFlavor(targetLevel = level, targetRound = round) {
    const modeKey = angelRealm ? 'angel' : (endlessMode ? 'endless' : 'normal');
    const bank = modeKey === 'angel'
      ? ['Halo Corridor', 'Ivory Storm', 'Sun Choir', 'Choirglass Run', 'Seraph Steps', 'Heavenrail Drift', 'Goldwing Spiral', 'Radiant Lattice']
      : modeKey === 'endless'
        ? ['Infinite Lattice', 'Void Sprint', 'Afterlight Loop', 'Turbo Singularity', 'Neon Everrun', 'Chrome Afterburn', 'Nightdrive Circuit', 'Starvault Spiral']
        : ['Neon Orchard', 'Chrome Maze', 'Turbo Circuit', 'Emerald Run', 'Pixel Garden', 'Sunset Grid', 'Arcade Drift', 'Stormline Track'];
    const seed = Math.abs(hashString(`${modeKey}:${targetLevel}:${targetRound}`));
    return bank[seed % bank.length];
  }

  function announceCurrentStage(duration = 1900) {
    const title = angelRealm
      ? `Angel Realm • ${formatCount(level)}-${formatCount(round)}`
      : endlessMode
        ? `Endless • Round ${formatCount(round)}`
        : `Level ${formatCount(level)} • Round ${formatCount(round)}`;
    showStageBanner(title, getStageFlavor(level, round), duration, angelRealm ? 'angel' : (endlessMode ? 'endless' : 'normal'));
  }

  function resetRoundPerformance() {
    roundDamageTaken = 0;
  }

  function awardFlawlessRoundBonus() {
    if (roundDamageTaken > 0 || !snake[0]) {
      perfectRoundChain = 0;
      return false;
    }

    perfectRoundChain += 1;
    incrementStat('perfectRounds', 1);
    const bonusCoins = 2 + Math.min(4, Math.floor(level / 3)) + (angelRealm ? 1 : 0) + (endlessMode ? 1 : 0) + Math.min(2, perfectRoundChain - 1);
    addCoins(bonusCoins);
    emitParticles(snake[0].x, snake[0].y, 14, ['rgba(255,255,255,0.98)', 'rgba(124,248,255,0.94)', 'rgba(255,211,105,0.92)']);
    emitFloatingText(snake[0].x, snake[0].y, `Flawless +${formatCount(bonusCoins)}`, '#dffcff', { life: 38, scale: 1.12 });
    showStageBanner(
      perfectRoundChain >= 3 ? 'Flawless Chain' : 'Flawless Clear',
      `+${formatCount(bonusCoins)} coins${perfectRoundChain > 1 ? ` • Chain x${formatCount(perfectRoundChain)}` : ''}`,
      1800,
      'perfect'
    );
    showRealmMessage(`Flawless clear bonus +${formatCount(bonusCoins)}`, 1600);
    return true;
  }

  function maybeAdvanceBossPhase() {
    if (!boss?.active) return;

    const phases = [
      { threshold: 0.75, title: 'Halo Break', subtitle: 'The hymn starts cracking' },
      { threshold: 0.5, title: 'Judgement Arc', subtitle: 'Lances split the sky' },
      { threshold: 0.25, title: 'Final Hymn', subtitle: 'The realm turns brutal' }
    ];

    while (boss.phaseIndex < phases.length && (boss.hp / boss.maxHp) <= phases[boss.phaseIndex].threshold) {
      const phase = phases[boss.phaseIndex];
      boss.phaseIndex += 1;
      boss.lastVolleyAt = 0;
      boss.lastLaserAt = 0;
      boss.lastBeamAt = 0;
      triggerScreenJuice(8, 0.16, 'rgba(255, 224, 138, 0.16)');
      if (snake[0]) {
        emitParticles(snake[0].x, snake[0].y, 18, ['rgba(255,255,255,0.98)', 'rgba(255,236,130,0.95)', 'rgba(124,248,255,0.9)']);
      }
      showStageBanner(phase.title, phase.subtitle, 2200, 'boss');
      showRealmMessage(phase.title, 1600);
    }
  }

  function pulseHudPill(target) {
    if (!target) return;
    target.classList.remove('is-popping');
    void target.offsetWidth;
    target.classList.add('is-popping');
  }

  function triggerClassAnimation(element, className, duration = 720) {
    if (!element) return;
    const timerKey = `__${className}Timer`;
    if (element[timerKey]) clearTimeout(element[timerKey]);
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    element[timerKey] = window.setTimeout(() => {
      element.classList.remove(className);
      element[timerKey] = null;
    }, duration);
  }

  function setHudValue(element, value, pulse = false) {
    if (!element) return;
    const nextValue = String(value);
    if (element.textContent !== nextValue) {
      element.textContent = nextValue;
      if (pulse) pulseHudPill(element.closest('.bottom-stat-pill'));
      return;
    }
    element.textContent = nextValue;
  }

  function triggerScreenJuice(shake = 0, flash = 0.1, color = 'rgba(255,255,255,0.14)') {
    screenShake = Math.max(screenShake, shake);
    if (flash > 0) {
      screenFlashAlpha = Math.max(screenFlashAlpha, flash);
      screenFlashColor = color;
    }
  }

  function emitFloatingText(cellX, cellY, text, color = '#fff6c8', options = {}) {
    const size = currentCellSize();
    const life = options.life ?? 34;
    floatingTexts.push({
      x: (cellX + 0.5) * size + (options.offsetX || 0),
      y: (cellY + 0.42) * size + (options.offsetY || 0),
      vy: options.vy ?? -0.72,
      life,
      maxLife: life,
      scale: options.scale ?? 1,
      color,
      text,
      glow: options.glow || 'rgba(6, 12, 20, 0.42)'
    });
    if (floatingTexts.length > 32) floatingTexts.shift();
  }

  function recalcStats() {
    maxHealth = isMainRunMode()
      ? mainModeMaxHealth
      : (jackpotMode ? 14 : 10) + abilities.vigor * 2;
    maxHealth = roundHealthValue(maxHealth);
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
      playerHealth = roundHealthValue(Math.min(maxHealth, playerHealth + 1 + abilities.luck));
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
      const life = 12 + Math.random() * 18;
      pushParticle({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * (1.6 + Math.random() * 2),
        vy: (Math.random() - 0.5) * (1.6 + Math.random() * 2),
        life,
        radius: 1.5 + Math.random() * 2.5,
        color: colors[i % colors.length]
      });
    }
  }

  function pushParticle(spec) {
    const life = Math.max(1, spec.life ?? 18);
    const grid = currentGridSize();
    const fxQuality = getVisualFxQuality();
    let cap = grid >= 19 ? 72 : grid >= 14 ? 96 : 128;
    if (fxQuality === 1) cap = Math.max(32, Math.round(cap * 0.78));
    if (fxQuality === 0) cap = Math.max(24, Math.round(cap * 0.55));
    if (particles.length >= cap) {
      particles.splice(0, Math.max(1, particles.length - cap + 1));
    }
    particles.push({
      x: spec.x,
      y: spec.y,
      vx: spec.vx ?? 0,
      vy: spec.vy ?? 0,
      life,
      maxLife: life,
      radius: spec.radius ?? 2,
      color: spec.color ?? 'rgba(255,255,255,0.95)',
      shape: spec.shape || 'circle',
      alpha: spec.alpha ?? 1,
      lineWidth: spec.lineWidth ?? 1.4,
      rotation: spec.rotation ?? 0,
      spinSpeed: spec.spinSpeed ?? 0,
      drag: spec.drag ?? 1,
      twinkle: spec.twinkle ?? 0
    });
  }

  function applyDamage(amount, hitX, hitY) {
    if (invincible || amount <= 0) return;
    const reducedAmount = roundHealthValue(Math.max(1, amount - abilities.shield));
    playerHealth = roundHealthValue(Math.max(0, playerHealth - reducedAmount));
    roundDamageTaken = roundHealthValue(roundDamageTaken + reducedAmount);
    emitParticles(hitX, hitY, 10, ['rgba(255,255,255,0.95)', 'rgba(255,225,120,0.9)']);
    emitFloatingText(hitX, hitY, `-${formatHealthValue(reducedAmount)} HP`, '#ffb8b8', { life: 30, scale: 1.05 });
    triggerScreenJuice(9, 0.14, 'rgba(255, 92, 92, 0.18)');
    playUiSfx('damage');
    if (playerHealth <= 0) {
      triggerGameOver(angelRealm ? 'Fallen in the Angel Realm' : 'Health depleted');
    }
    updateHud();
  }

  function enterAngelRealm() {
    startMode('angel');
  }

  function getSpeedForState() {
    const sizeGrowth = currentGridSize() - baseGridSize;
    const effectiveLevel = Math.min(level, boardGrowthCapLevel());
    const mapSpeedBoost = sizeGrowth * 1.12;
    const roundSpeedBoost = Math.min(7, (round - 1) * 0.32);
    const levelSpeedBoost = Math.min(5, (effectiveLevel - 1) * 0.4);
    const naturalTick = Math.max(
      minMapTickMs,
      baseTickMs - mapSpeedBoost - roundSpeedBoost - levelSpeedBoost - abilities.reflex * 4 - (angelRealm ? 6 : 0)
    );
    const speedMultiplier = speedLevel >= 0
      ? Math.pow(0.91, speedLevel)
      : Math.pow(1.08, Math.abs(speedLevel));
    return Math.max(minAbsoluteTickMs, Math.floor(naturalTick * speedMultiplier));
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

  function randomEmptyCell(options = {}) {
    const config = typeof options === 'boolean' ? { preferReachable: options } : options;
    const {
      preferReachable = false,
      minHeadDistance = 0,
      minSnakeDistance = 0
    } = config;
    const grid = currentGridSize();
    const cells = [];
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
          cells.push({ x, y });
        }
      }
    }

    const reachable = preferReachable && snake.length
      ? cells.filter(cell => countOpenNeighbors(cell.x, cell.y) >= 1 && canReachCell(snake[0], cell, obstacles, false))
      : cells;
    const safetyFiltered = snake.length
      ? reachable.filter(cell => {
        if (minHeadDistance > 0 && cellDistance(cell, snake[0]) < minHeadDistance) return false;
        if (minSnakeDistance > 0 && snake.some(seg => cellDistance(cell, seg) < minSnakeDistance)) return false;
        return true;
      })
      : reachable;

    const pool = safetyFiltered.length ? safetyFiltered : (reachable.length ? reachable : cells);
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function spawnFoodIfMissing(options = {}) {
    const config = typeof options === 'boolean' ? { preferReachable: options } : { preferReachable: true, ...options };
    if (!boss?.active && !food) food = randomEmptyCell(config);
  }

  function ensureObstaclesForRound(options = {}) {
    const grid = currentGridSize();
    const target = obstacleTargetForState();
    const nextObstacles = [];
    let attempts = 0;
    const config = {
      minHeadDistance: 0,
      minSnakeDistance: 0,
      ...options
    };

    while (nextObstacles.length < target && attempts < grid * grid * 6) {
      const pos = randomEmptyCell(config);
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
    const enemySafety = roundSpawnSafety('enemy');

    const angelTarget = level >= 10 ? Math.min(1 + Math.floor((level - 10) / 4), 4) : 0;
    while (angels.length < angelTarget) {
      const pos = randomEmptyCell(enemySafety);
      if (!pos) break;
      angels.push({ ...pos, lastShotAt: 0, moveCooldown: randomBetween(2, 5) });
    }

    const generalTarget = round >= 20 ? Math.min(1 + Math.floor((round - 20) / 10), 3) : 0;
    while (generalAngels.length < generalTarget) {
      const pos = randomEmptyCell(enemySafety);
      if (!pos) break;
      generalAngels.push({ ...pos, lastShotAt: 0, lastGrenadeAt: 0, moveCooldown: randomBetween(2, 4) });
    }

    if (!healOrb && Math.random() < 0.1) {
      healOrb = randomEmptyCell(roundSpawnSafety('food'));
    }
  }

  function startBossFight() {
    if (boss?.active) return;
    const startedAt = performance.now();
    angels = [];
    generalAngels = [];
    projectiles = [];
    grenades = [];
    trackingLasers = [];
    skyBeams = [];
    healOrb = null;
    food = null;
    boss = {
      name: 'Arch Angel',
      hp: 150,
      maxHp: 150,
      x: Math.max(2, Math.floor(currentGridSize() / 2)),
      y: 1,
      dir: 1,
      floatSeed: Math.random() * Math.PI * 2,
      haloSeed: Math.random() * Math.PI * 2,
      entranceAt: startedAt,
      attackType: 'enter',
      attackUntil: startedAt + 900,
      lastVolleyAt: 0,
      lastGrenadeAt: 0,
      lastAltarAt: 0,
      lastLaserAt: 0,
      lastBeamAt: 0,
      phaseIndex: 0,
      active: true
    };
    resetRoundPerformance();
    audioState.lastBossHumAt = 0;
    altar = randomEmptyCell();
    playBossSfx('enter');
    showRealmMessage('Arch Angel descends', 2400);
    showStageBanner('Arch Angel', 'Celestial Judgement', 2600, 'boss');
  }

  function markBossAttack(type, duration = 680) {
    if (!boss?.active) return;
    boss.attackType = type;
    boss.attackUntil = performance.now() + duration;
    triggerScreenJuice(3, 0.04, type === 'laser' ? 'rgba(124, 248, 255, 0.12)' : 'rgba(255, 224, 138, 0.1)');
    if (type === 'volley') playBossSfx('volley');
    else if (type === 'laser') playBossSfx('laser');
    else if (type === 'beam') playBossSfx('beam');
    else if (type === 'grenade') playBossSfx('grenade');
  }

  function setupLevel(resetSnakePosition = true) {
    const spawnSafety = roundSpawnSafety('food');
    const obstacleSafety = roundSpawnSafety('hazard');
    resetRoundPerformance();
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
      spawnFoodIfMissing(spawnSafety);
      ensureObstaclesForRound(obstacleSafety);
      spawnAngelEntities();
    } else {
      ensureObstaclesForRound(obstacleSafety);
    }
  }

  function scheduleTongue(now = performance.now(), resetVisible = true) {
    nextTongueAt = now + randomBetween(2000, 17000);
    if (resetVisible) tongueVisibleUntil = 0;
  }

  function resetGame(preserveCheatState = false, useCountdown = false) {
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
    nextSkinAmbientParticleAt = 0;
    floatingTexts = [];
    trackingLasers = [];
    skyBeams = [];
    screenShake = 0;
    screenFlashAlpha = 0;
    screenFlashColor = 'rgba(255,255,255,0.14)';
    comboCount = 0;
    comboTimer = 0;
    stageBanner = null;
    xp = 0;
    xpLevel = 1;
    abilities = { vigor: 0, reflex: 0, luck: 0, shield: 0, bounty: 0 };
    if (jackpotMode && jackpotLuckBonusActive) abilities.luck = 1;
    lastHudHealthValue = null;
    roundDamageTaken = 0;
    perfectRoundChain = 0;
    pendingBlessingChoices = 0;
    currentBlessingOptions = [];
    blessingSelectionOpen = false;
    clearBlessingAutoPickTimer();
    leaderboardSavedThisLife = false;
    lastLeaderboardResult = null;
    leaderboardOverrideUsedThisRun = false;
    leaderboardDisqualifyingCheatUsed = false;
    if (!preserveCheatState) {
      cheatsUsedThisRun = !!jackpotMode;
    } else {
      cheatsUsedThisRun = cheatsUsedThisRun || !!jackpotMode;
    }
    if (cheatsUsedThisRun) registerLeaderboardCheatUse();
    recalcStats();
    playerHealth = maxHealth;
    setupLevel(true);
    tickMs = getSpeedForState();
    accumulator = 0;
    scheduleTongue(performance.now(), true);
    if (useCountdown) startCountdown(2);
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
    floatingTexts = [];
    trackingLasers = [];
    skyBeams = [];
    screenShake = 0;
    screenFlashAlpha = 0;
    lastHudHealthValue = null;
    playerHealth = Math.max(1, Math.ceil(maxHealth * 0.6));
    scheduleTongue(performance.now(), true);
    clearCountdown();
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

  function getSnakePalette() {
    const skin = getActiveSkin();
    if (jackpotMode) {
      return {
        body: '#090b12',
        head: '#fff6e6',
        accent: '#ffd54f',
        stripe: '#ff4fa3',
        belly: '#f6fffb',
        eye: '#7dffe2',
        pattern: 'jackpot',
        shine: 'rgba(255,255,255,0.42)',
        label: '#fff9ea',
        outline: 'rgba(5, 8, 18, 0.94)',
        glow: 'rgba(255, 79, 163, 0.34)'
      };
    }

    if (invincible) {
      return {
        body: '#2f445c',
        head: '#ffe37d',
        accent: '#f7f0bb',
        stripe: '#7dd8ff',
        belly: '#fff6c4',
        eye: '#0b1822',
        pattern: 'ribs',
        shine: 'rgba(255,255,255,0.24)',
        label: '#fff7d6',
        outline: 'rgba(12, 18, 24, 0.74)',
        glow: 'rgba(255, 227, 125, 0.28)'
      };
    }

    const art = getSkinArtProfile(skin);

    return {
      body: skin.body,
      head: skin.head,
      accent: skin.accent,
      stripe: art.stripe,
      belly: art.belly,
      eye: art.eye,
      pattern: art.pattern,
      shine: art.shine,
      label: skin.label,
      outline: 'rgba(5, 12, 20, 0.52)',
      glow: art.glow
    };
  }

  function getAnimatedSegment(index, progress) {
    const seg = snake[index];
    if (!seg) return null;

    const previous = prevSnake[index] || seg;
    const safePrevX = Math.abs(previous.x - seg.x) > 1 ? seg.x : previous.x;
    const safePrevY = Math.abs(previous.y - seg.y) > 1 ? seg.y : previous.y;

    return {
      x: lerp(safePrevX, seg.x, progress),
      y: lerp(safePrevY, seg.y, progress)
    };
  }

  function getSafeStep(from, to) {
    if (!from || !to) return { x: 0, y: 0 };
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return {
      x: Math.abs(dx) > 1 ? 0 : Math.sign(dx),
      y: Math.abs(dy) > 1 ? 0 : Math.sign(dy)
    };
  }

  function getSegmentOrientation(index) {
    const seg = snake[index];
    if (!seg) return { horizontal: true, vertical: false, tailDx: 0, tailDy: 0 };

    const toPrev = getSafeStep(seg, snake[index - 1]);
    const toNext = getSafeStep(seg, snake[index + 1]);
    return {
      horizontal: toPrev.x !== 0 || toNext.x !== 0 || (toPrev.y === 0 && toNext.y === 0),
      vertical: toPrev.y !== 0 || toNext.y !== 0,
      tailDx: snake[index - 1] ? -toPrev.x : 0,
      tailDy: snake[index - 1] ? -toPrev.y : 0
    };
  }

  function drawSnakeMarkings(px, py, bodySize, palette, orientation, index, now = performance.now()) {
    const detail = getSnakeRenderDetailLevel();
    const stripeThickness = Math.max(4, bodySize * 0.14);

    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = palette.belly;

    if (orientation.horizontal && !orientation.vertical) {
      roundedRectPath(px + bodySize * 0.12, py + bodySize * 0.44, bodySize * 0.76, stripeThickness, stripeThickness / 2);
      ctx.fill();
    } else if (orientation.vertical && !orientation.horizontal) {
      roundedRectPath(px + bodySize * 0.44, py + bodySize * 0.12, stripeThickness, bodySize * 0.76, stripeThickness / 2);
      ctx.fill();
    } else {
      roundedRectPath(px + bodySize * 0.42, py + bodySize * 0.18, stripeThickness, bodySize * 0.64, stripeThickness / 2);
      ctx.fill();
      roundedRectPath(px + bodySize * 0.18, py + bodySize * 0.42, bodySize * 0.64, stripeThickness, stripeThickness / 2);
      ctx.fill();
    }

    if (detail < 2) {
      ctx.globalAlpha = detail === 1 ? 0.52 : 0.36;
      ctx.fillStyle = palette.stripe;

      if (orientation.horizontal && !orientation.vertical) {
        roundedRectPath(px + bodySize * 0.26, py + bodySize * 0.22, bodySize * 0.18, bodySize * 0.14, bodySize * 0.06);
        ctx.fill();
        roundedRectPath(px + bodySize * 0.58, py + bodySize * 0.64, bodySize * 0.18, bodySize * 0.14, bodySize * 0.06);
        ctx.fill();
      } else if (orientation.vertical && !orientation.horizontal) {
        roundedRectPath(px + bodySize * 0.22, py + bodySize * 0.26, bodySize * 0.14, bodySize * 0.18, bodySize * 0.06);
        ctx.fill();
        roundedRectPath(px + bodySize * 0.64, py + bodySize * 0.58, bodySize * 0.14, bodySize * 0.18, bodySize * 0.06);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, Math.max(1.8, bodySize * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }

      if (detail === 1) {
        ctx.globalAlpha = 0.82;
        ctx.fillStyle = palette.eye;
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, Math.max(1.4, bodySize * 0.04), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return;
    }

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = palette.stripe;
    ctx.strokeStyle = palette.stripe;
    ctx.lineWidth = Math.max(1.3, bodySize * 0.05);
    const pulse = Math.sin(now * 0.005 + index * 0.8) * (bodySize * 0.01);

    switch (palette.pattern) {
      case 'jackpot': {
        const slots = orientation.vertical && !orientation.horizontal
          ? [
              [0.3, 0.16, 0.4, 0.14],
              [0.24, 0.43, 0.52, 0.14],
              [0.3, 0.7, 0.4, 0.14]
            ]
          : [
              [0.16, 0.3, 0.14, 0.4],
              [0.43, 0.24, 0.14, 0.52],
              [0.7, 0.3, 0.14, 0.4]
            ];

        slots.forEach(([sx, sy, sw, sh], slotIndex) => {
          ctx.globalAlpha = 0.48;
          ctx.fillStyle = 'rgba(5, 8, 16, 0.34)';
          roundedRectPath(px + bodySize * sx, py + bodySize * sy, bodySize * sw, bodySize * sh, bodySize * 0.05);
          ctx.fill();

          ctx.globalAlpha = 0.82;
          ctx.strokeStyle = slotIndex === 1 ? palette.accent : palette.stripe;
          ctx.lineWidth = Math.max(1.2, bodySize * 0.036);
          roundedRectPath(px + bodySize * sx, py + bodySize * sy, bodySize * sw, bodySize * sh, bodySize * 0.05);
          ctx.stroke();

          const cx = px + bodySize * (sx + sw / 2);
          const cy = py + bodySize * (sy + sh / 2);
          ctx.fillStyle = slotIndex === 1 ? palette.accent : palette.belly;
          if (slotIndex === 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(1.8, bodySize * 0.055), 0, Math.PI * 2);
            ctx.fill();
          } else if (slotIndex === 1) {
            const radius = bodySize * 0.07;
            ctx.beginPath();
            ctx.moveTo(cx, cy - radius);
            ctx.lineTo(cx + radius, cy);
            ctx.lineTo(cx, cy + radius);
            ctx.lineTo(cx - radius, cy);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(cx, cy - bodySize * 0.07);
            ctx.lineTo(cx + bodySize * 0.03, cy - bodySize * 0.02);
            ctx.lineTo(cx + bodySize * 0.08, cy - bodySize * 0.02);
            ctx.lineTo(cx + bodySize * 0.04, cy + bodySize * 0.02);
            ctx.lineTo(cx + bodySize * 0.06, cy + bodySize * 0.08);
            ctx.lineTo(cx, cy + bodySize * 0.04);
            ctx.lineTo(cx - bodySize * 0.06, cy + bodySize * 0.08);
            ctx.lineTo(cx - bodySize * 0.04, cy + bodySize * 0.02);
            ctx.lineTo(cx - bodySize * 0.08, cy - bodySize * 0.02);
            ctx.lineTo(cx - bodySize * 0.03, cy - bodySize * 0.02);
            ctx.closePath();
            ctx.fill();
          }
        });

        ctx.globalAlpha = 0.82;
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = Math.max(1.4, bodySize * 0.038);
        roundedRectPath(px + bodySize * 0.1, py + bodySize * 0.1, bodySize * 0.8, bodySize * 0.8, bodySize * 0.12);
        ctx.stroke();

        ctx.globalAlpha = 0.72;
        ctx.fillStyle = palette.eye;
        const bulbs = orientation.vertical && !orientation.horizontal
          ? [
              [0.5, 0.13],
              [0.5, 0.87],
              [0.18, 0.28],
              [0.82, 0.72]
            ]
          : [
              [0.13, 0.5],
              [0.87, 0.5],
              [0.28, 0.18],
              [0.72, 0.82]
            ];
        bulbs.forEach(([sx, sy], bulbIndex) => {
          ctx.globalAlpha = 0.62 + (bulbIndex % 2) * 0.16;
          ctx.beginPath();
          ctx.arc(px + bodySize * sx, py + bodySize * sy, Math.max(1.4, bodySize * 0.028), 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }
      case 'angelic':
        ctx.globalAlpha = 0.84;
        ctx.strokeStyle = palette.stripe;
        ctx.lineWidth = Math.max(1.4, bodySize * 0.038);
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.17, bodySize * 0.17, Math.PI, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.76;
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = Math.max(1.2, bodySize * 0.032);
        const featherLines = orientation.vertical && !orientation.horizontal
          ? [
              [0.34, 0.22, 0.22, 0.68],
              [0.5, 0.18, 0.5, 0.74],
              [0.66, 0.22, 0.78, 0.68]
            ]
          : [
              [0.22, 0.34, 0.68, 0.22],
              [0.18, 0.5, 0.74, 0.5],
              [0.22, 0.66, 0.68, 0.78]
            ];
        featherLines.forEach(([sx, sy, ex, ey]) => {
          ctx.beginPath();
          ctx.moveTo(px + bodySize * sx, py + bodySize * sy);
          ctx.lineTo(px + bodySize * ex, py + bodySize * ey);
          ctx.stroke();
        });

        ctx.globalAlpha = 0.92;
        ctx.fillStyle = palette.eye;
        [
          [0.22, 0.5],
          [0.78, 0.5],
          [0.5, 0.26],
          [0.5, 0.74]
        ].forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.arc(px + bodySize * sx, py + bodySize * sy, Math.max(1.6, bodySize * 0.032), 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      case 'orbit':
        ctx.globalAlpha = 0.76;
        ctx.strokeStyle = palette.stripe;
        ctx.lineWidth = Math.max(1.4, bodySize * 0.04);
        ctx.beginPath();
        ctx.ellipse(
          px + bodySize * 0.5,
          py + bodySize * 0.5,
          bodySize * 0.31,
          bodySize * 0.13,
          0.26 + Math.sin(now * 0.0018 + index * 0.4) * 0.12,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.strokeStyle = palette.accent;
        ctx.beginPath();
        ctx.ellipse(
          px + bodySize * 0.5,
          py + bodySize * 0.5,
          bodySize * 0.2,
          bodySize * 0.34,
          -0.34 + Math.cos(now * 0.0016 + index * 0.5) * 0.08,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.globalAlpha = 0.32;
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.13, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.94;
        for (let node = 0; node < 3; node += 1) {
          const angle = now * 0.003 + index * 0.36 + node * (Math.PI * 0.66);
          const radiusX = node === 1 ? bodySize * 0.18 : bodySize * 0.29;
          const radiusY = node === 1 ? bodySize * 0.31 : bodySize * 0.12;
          const x = px + bodySize * 0.5 + Math.cos(angle) * radiusX;
          const y = py + bodySize * 0.5 + Math.sin(angle) * radiusY;
          ctx.fillStyle = node === 1 ? palette.eye : palette.accent;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(1.8, bodySize * (node === 1 ? 0.04 : 0.046)), 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'accretion': {
        const tilt = 0.62 + Math.sin(now * 0.0019 + index * 0.45) * 0.12;
        const swirl = now * 0.0034 + index * 0.55;
        ctx.globalAlpha = 0.68;
        ctx.fillStyle = 'rgba(0,0,0,0.58)';
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.16, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.84;
        ctx.strokeStyle = palette.stripe;
        ctx.lineWidth = Math.max(1.6, bodySize * 0.044);
        ctx.beginPath();
        ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.33, bodySize * 0.11, tilt, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = Math.max(1.2, bodySize * 0.032);
        ctx.beginPath();
        ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.26, bodySize * 0.08, tilt, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.92;
        for (let dust = 0; dust < 4; dust += 1) {
          const angle = swirl + dust * (Math.PI / 2);
          const x = px + bodySize * 0.5 + Math.cos(angle) * bodySize * 0.24;
          const y = py + bodySize * 0.5 + Math.sin(angle) * bodySize * 0.09;
          ctx.fillStyle = dust % 2 === 0 ? palette.eye : palette.accent;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(1.4, bodySize * 0.032), 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'nebula':
        ctx.globalAlpha = 0.26;
        ctx.fillStyle = palette.stripe;
        [
          [0.3, 0.34, 0.22, 0.12, -0.3],
          [0.58, 0.46, 0.24, 0.14, 0.18],
          [0.44, 0.7, 0.18, 0.1, 0.42]
        ].forEach(([sx, sy, rx, ry, rot]) => {
          ctx.beginPath();
          ctx.ellipse(px + bodySize * sx, py + bodySize * sy, bodySize * rx, bodySize * ry, rot, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 0.34;
        ctx.fillStyle = palette.accent;
        [
          [0.64, 0.28, 0.18, 0.1, 0.2],
          [0.28, 0.64, 0.16, 0.09, -0.4]
        ].forEach(([sx, sy, rx, ry, rot]) => {
          ctx.beginPath();
          ctx.ellipse(px + bodySize * sx, py + bodySize * sy, bodySize * rx, bodySize * ry, rot, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 0.94;
        ctx.fillStyle = palette.eye;
        [
          [0.22, 0.22, 0.03],
          [0.76, 0.34, 0.026],
          [0.62, 0.74, 0.024],
          [0.36, 0.56, 0.022]
        ].forEach(([sx, sy, sr]) => {
          ctx.beginPath();
          ctx.arc(px + bodySize * sx, py + bodySize * sy, Math.max(1.3, bodySize * sr), 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      case 'eclipse': {
        const flare = Math.sin(now * 0.0048 + index * 0.6) * bodySize * 0.014;
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = palette.accent;
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.57, py + bodySize * 0.48, bodySize * 0.18 + flare, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.74)';
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.72;
        ctx.strokeStyle = palette.stripe;
        ctx.lineWidth = Math.max(1.3, bodySize * 0.036);
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.29, now * 0.0032, now * 0.0032 + Math.PI * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.34, -now * 0.0028, -now * 0.0028 + Math.PI * 0.74);
        ctx.stroke();
        break;
      }
      case 'horizon':
        ctx.globalAlpha = 0.34;
        ctx.fillStyle = 'rgba(0,0,0,0.24)';
        roundedRectPath(px + bodySize * 0.12, py + bodySize * 0.12, bodySize * 0.76, bodySize * 0.76, bodySize * 0.1);
        ctx.fill();

        ctx.globalAlpha = 0.84;
        ctx.fillStyle = palette.stripe;
        if (orientation.vertical && !orientation.horizontal) {
          roundedRectPath(px + bodySize * 0.24, py + bodySize * 0.14, bodySize * 0.08, bodySize * 0.72, bodySize * 0.04);
          ctx.fill();
          roundedRectPath(px + bodySize * 0.68, py + bodySize * 0.14, bodySize * 0.08, bodySize * 0.72, bodySize * 0.04);
          ctx.fill();
          ctx.fillStyle = palette.accent;
          roundedRectPath(px + bodySize * 0.44, py + bodySize * 0.22, bodySize * 0.12, bodySize * 0.56, bodySize * 0.06);
          ctx.fill();
        } else {
          roundedRectPath(px + bodySize * 0.14, py + bodySize * 0.24, bodySize * 0.72, bodySize * 0.08, bodySize * 0.04);
          ctx.fill();
          roundedRectPath(px + bodySize * 0.14, py + bodySize * 0.68, bodySize * 0.72, bodySize * 0.08, bodySize * 0.04);
          ctx.fill();
          ctx.fillStyle = palette.accent;
          roundedRectPath(px + bodySize * 0.22, py + bodySize * 0.44, bodySize * 0.56, bodySize * 0.12, bodySize * 0.06);
          ctx.fill();
        }
        ctx.globalAlpha = 0.94;
        ctx.fillStyle = palette.eye;
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, Math.max(1.8, bodySize * 0.045), 0, Math.PI * 2);
        ctx.arc(px + bodySize * 0.32, py + bodySize * 0.5, Math.max(1.1, bodySize * 0.022), 0, Math.PI * 2);
        ctx.arc(px + bodySize * 0.68, py + bodySize * 0.5, Math.max(1.1, bodySize * 0.022), 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'singularity':
        ctx.globalAlpha = 0.82;
        ctx.strokeStyle = palette.stripe;
        ctx.lineWidth = Math.max(1.4, bodySize * 0.04);
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.28, now * 0.004 + index * 0.3, now * 0.004 + index * 0.3 + Math.PI * 1.45);
        ctx.stroke();
        ctx.strokeStyle = palette.accent;
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.2, -now * 0.003 - index * 0.2, -now * 0.003 - index * 0.2 + Math.PI * 1.28);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.24)';
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.36, now * 0.0017 + index * 0.15, now * 0.0017 + index * 0.15 + Math.PI * 0.82);
        ctx.stroke();
        ctx.globalAlpha = 0.56;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.54)';
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.5, py + bodySize * 0.5, bodySize * 0.11, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = palette.eye;
        ctx.beginPath();
        ctx.arc(px + bodySize * 0.72, py + bodySize * 0.34, Math.max(1.6, bodySize * 0.036), 0, Math.PI * 2);
        ctx.arc(px + bodySize * 0.3, py + bodySize * 0.68, Math.max(1.4, bodySize * 0.03), 0, Math.PI * 2);
        ctx.arc(px + bodySize * 0.58, py + bodySize * 0.78, Math.max(1.2, bodySize * 0.026), 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'diamond':
        for (let row = 0; row < 2; row += 1) {
          for (let col = 0; col < 3; col += 1) {
            const cx = px + bodySize * (0.28 + col * 0.22);
            const cy = py + bodySize * (0.34 + row * 0.22 + (col % 2 ? 0.05 : 0));
            const radius = bodySize * (0.055 + pulse);
            ctx.beginPath();
            ctx.moveTo(cx, cy - radius);
            ctx.lineTo(cx + radius, cy);
            ctx.lineTo(cx, cy + radius);
            ctx.lineTo(cx - radius, cy);
            ctx.closePath();
            ctx.fill();
          }
        }
        break;
      case 'spots':
      case 'speckle': {
        const spots = palette.pattern === 'spots'
          ? [
              [0.28, 0.3, 0.09],
              [0.62, 0.24, 0.06],
              [0.48, 0.56, 0.08],
              [0.72, 0.7, 0.07]
            ]
          : [
              [0.26, 0.28, 0.05],
              [0.48, 0.24, 0.035],
              [0.68, 0.34, 0.04],
              [0.36, 0.6, 0.038],
              [0.6, 0.68, 0.045]
            ];
        for (const [sx, sy, sr] of spots) {
          ctx.beginPath();
          ctx.arc(px + bodySize * sx, py + bodySize * sy, Math.max(2, bodySize * sr), 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'chevron':
        ctx.beginPath();
        for (let row = 0; row < 3; row += 1) {
          const y = py + bodySize * (0.26 + row * 0.19);
          ctx.moveTo(px + bodySize * 0.22, y);
          ctx.lineTo(px + bodySize * 0.5, y + bodySize * 0.12);
          ctx.lineTo(px + bodySize * 0.78, y);
        }
        ctx.stroke();
        break;
      case 'rings':
        for (let ring = 0; ring < 2; ring += 1) {
          ctx.beginPath();
          ctx.ellipse(px + bodySize * 0.5, py + bodySize * (0.36 + ring * 0.24), bodySize * 0.22, bodySize * 0.08, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      case 'bands':
        for (let band = 0; band < 3; band += 1) {
          if (orientation.vertical && !orientation.horizontal) {
            roundedRectPath(px + bodySize * 0.18, py + bodySize * (0.2 + band * 0.2), bodySize * 0.64, bodySize * 0.08, bodySize * 0.04);
          } else {
            roundedRectPath(px + bodySize * (0.18 + band * 0.2), py + bodySize * 0.18, bodySize * 0.08, bodySize * 0.64, bodySize * 0.04);
          }
          ctx.fill();
        }
        break;
      case 'smooth':
        ctx.globalAlpha = 0.24;
        ctx.beginPath();
        ctx.ellipse(px + bodySize * 0.42, py + bodySize * 0.34, bodySize * 0.2, bodySize * 0.1, -0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'ribs':
      default:
        ctx.beginPath();
        for (let rib = 0; rib < 3; rib += 1) {
          if (orientation.vertical && !orientation.horizontal) {
            const y = py + bodySize * (0.24 + rib * 0.2);
            ctx.moveTo(px + bodySize * 0.22, y);
            ctx.lineTo(px + bodySize * 0.78, y);
          } else {
            const x = px + bodySize * (0.24 + rib * 0.2);
            ctx.moveTo(x, py + bodySize * 0.22);
            ctx.lineTo(x, py + bodySize * 0.78);
          }
        }
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  function drawTailTip(px, py, bodySize, palette, orientation) {
    const { tailDx, tailDy } = orientation;
    if (!tailDx && !tailDy) return;

    ctx.save();
    ctx.fillStyle = palette.stripe;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    if (tailDx > 0) {
      ctx.moveTo(px + bodySize * 0.78, py + bodySize * 0.24);
      ctx.lineTo(px + bodySize * 1.18, py + bodySize * 0.5);
      ctx.lineTo(px + bodySize * 0.78, py + bodySize * 0.76);
    } else if (tailDx < 0) {
      ctx.moveTo(px + bodySize * 0.22, py + bodySize * 0.24);
      ctx.lineTo(px - bodySize * 0.18, py + bodySize * 0.5);
      ctx.lineTo(px + bodySize * 0.22, py + bodySize * 0.76);
    } else if (tailDy > 0) {
      ctx.moveTo(px + bodySize * 0.24, py + bodySize * 0.78);
      ctx.lineTo(px + bodySize * 0.5, py + bodySize * 1.18);
      ctx.lineTo(px + bodySize * 0.76, py + bodySize * 0.78);
    } else {
      ctx.moveTo(px + bodySize * 0.24, py + bodySize * 0.22);
      ctx.lineTo(px + bodySize * 0.5, py - bodySize * 0.18);
      ctx.lineTo(px + bodySize * 0.76, py + bodySize * 0.22);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawRoundedCell(x, y, color, radius = 8, scale = 1, glowColor = null) {
    const size = currentCellSize();
    const scaled = (size - 8) * scale;
    const offset = ((size - 8) - scaled) / 2;
    const px = x * size;
    const py = y * size;

    ctx.save();
    if (glowColor) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = glowColor;
    }

    ctx.fillStyle = color;
    roundedRectPath(px + 4 + offset, py + 4 + offset, scaled, scaled, radius);
    ctx.fill();
    ctx.restore();
  }

  function drawApple(item, now = performance.now()) {
    const size = currentCellSize();
    const detail = getSnakeRenderDetailLevel();
    const pulse = 0.96 + Math.sin(now * 0.012 + item.x * 0.7 + item.y * 0.9) * 0.06;
    const cx = (item.x + 0.5) * size;
    const cy = (item.y + 0.56) * size;
    const scale = (size / 46) * pulse;

    ctx.save();
    if (detail === 0 || size <= 30) {
      const radius = Math.max(5, size * 0.24 * pulse);
      ctx.shadowBlur = detail === 0 ? 0 : 8;
      ctx.shadowColor = 'rgba(214, 52, 52, 0.24)';
      ctx.fillStyle = '#df443a';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.arc(cx - radius * 0.24, cy - radius * 0.28, Math.max(1.8, radius * 0.26), 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#6d3b19';
      ctx.lineWidth = Math.max(1.4, size * 0.05);
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius * 0.72);
      ctx.lineTo(cx + radius * 0.14, cy - radius * 1.24);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.shadowBlur = 16;
    ctx.shadowColor = 'rgba(214, 52, 52, 0.34)';

    const body = ctx.createLinearGradient(-10, -16, 10, 18);
    body.addColorStop(0, '#ffb3a5');
    body.addColorStop(0.35, '#ff6952');
    body.addColorStop(1, '#b11824');

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.bezierCurveTo(9, -20, 18, -8, 14, 6);
    ctx.bezierCurveTo(12, 16, 6, 20, 0, 20);
    ctx.bezierCurveTo(-6, 20, -12, 16, -14, 6);
    ctx.bezierCurveTo(-18, -8, -9, -20, 0, -12);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.24)';
    ctx.beginPath();
    ctx.ellipse(-5, -3, 4, 7, -0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#6d3b19';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-0.5, -12);
    ctx.lineTo(1.8, -22);
    ctx.stroke();

    ctx.fillStyle = '#4fb35c';
    ctx.beginPath();
    ctx.ellipse(8, -16, 6, 3.8, -0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPear(item, now = performance.now()) {
    const size = currentCellSize();
    const detail = getSnakeRenderDetailLevel();
    const pulse = 0.95 + Math.sin(now * 0.011 + item.x * 0.6 + item.y * 0.8) * 0.05;
    const cx = (item.x + 0.5) * size;
    const cy = (item.y + 0.56) * size;
    const scale = (size / 48) * pulse;

    ctx.save();
    if (detail === 0 || size <= 30) {
      const radiusX = Math.max(4, size * 0.2 * pulse);
      const radiusY = Math.max(6, size * 0.27 * pulse);
      ctx.shadowBlur = detail === 0 ? 0 : 8;
      ctx.shadowColor = 'rgba(108, 176, 66, 0.24)';
      ctx.fillStyle = '#8dcf52';
      ctx.beginPath();
      ctx.ellipse(cx, cy + radiusY * 0.05, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.24)';
      ctx.beginPath();
      ctx.ellipse(cx - radiusX * 0.22, cy, Math.max(1.8, radiusX * 0.26), Math.max(2.6, radiusY * 0.22), -0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#765224';
      ctx.lineWidth = Math.max(1.4, size * 0.05);
      ctx.beginPath();
      ctx.moveTo(cx, cy - radiusY * 0.9);
      ctx.lineTo(cx + radiusX * 0.14, cy - radiusY * 1.45);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.shadowBlur = 16;
    ctx.shadowColor = 'rgba(108, 176, 66, 0.34)';

    const body = ctx.createLinearGradient(-10, -18, 10, 22);
    body.addColorStop(0, '#f5ef95');
    body.addColorStop(0.45, '#9cda5e');
    body.addColorStop(1, '#5fa037');

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.bezierCurveTo(7, -18, 9, -10, 7, -5);
    ctx.bezierCurveTo(16, -1, 18, 8, 15, 15);
    ctx.bezierCurveTo(12, 22, 7, 25, 0, 25);
    ctx.bezierCurveTo(-7, 25, -12, 22, -15, 15);
    ctx.bezierCurveTo(-18, 8, -16, -1, -7, -5);
    ctx.bezierCurveTo(-9, -10, -7, -18, 0, -18);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(-4, 2, 4.5, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#765224';
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(0.5, -18);
    ctx.lineTo(2.2, -28);
    ctx.stroke();

    ctx.fillStyle = '#5ab454';
    ctx.beginPath();
    ctx.ellipse(8, -20, 6, 3.4, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSnakeSegment(seg, index, now = performance.now(), drawX = seg.x, drawY = seg.y) {
    const size = currentCellSize();
    const detail = getSnakeRenderDetailLevel();
    const palette = getSnakePalette();
    const orientation = getSegmentOrientation(index);
    const taper = Math.min(0.24, index * 0.024);
    const sway = Math.sin(now * 0.01 + index * 0.5) * 0.015;
    const tailBoost = index === snake.length - 1 ? 0.04 : 0;
    const scale = Math.max(0.72, 1.01 - taper + sway + tailBoost);
    const bodySize = (size - 8) * scale;
    const offset = ((size - 8) - bodySize) / 2;
    const px = drawX * size + 4 + offset;
    const py = drawY * size + 4 + offset;

    ctx.save();
    ctx.shadowBlur = detail === 2 ? 10 : (detail === 1 ? 5 : 0);
    ctx.shadowColor = palette.glow;

    if (detail === 2) {
      const fill = ctx.createLinearGradient(px, py, px + bodySize, py + bodySize);
      fill.addColorStop(0, palette.head);
      fill.addColorStop(0.3, palette.accent);
      fill.addColorStop(0.66, palette.body);
      fill.addColorStop(1, palette.body);
      ctx.fillStyle = fill;
    } else {
      ctx.fillStyle = detail === 1 ? palette.accent : palette.body;
    }
    roundedRectPath(px, py, bodySize, bodySize, Math.max(8, bodySize * 0.22));
    ctx.fill();

    drawSnakeMarkings(px, py, bodySize, palette, orientation, index, now);

    ctx.shadowBlur = 0;
    if (detail > 0) {
      ctx.fillStyle = palette.shine;
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.34, py + bodySize * 0.28, bodySize * 0.18, bodySize * 0.1, -0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = Math.max(detail === 0 ? 1.2 : 1.5, size * 0.04);
    roundedRectPath(px, py, bodySize, bodySize, Math.max(8, bodySize * 0.22));
    ctx.stroke();

    if (index === snake.length - 1) drawTailTip(px, py, bodySize, palette, orientation);
    ctx.restore();
  }

  function drawHead(seg, now = performance.now(), drawX = seg.x, drawY = seg.y) {
    const size = currentCellSize();
    const detail = getSnakeRenderDetailLevel();
    const palette = getSnakePalette();
    const facing = facingDirection();
    const breathe = 0.985 + Math.sin(now * 0.01) * 0.02;
    const bodySize = (size - 8) * breathe;
    const offset = ((size - 8) - bodySize) / 2;
    const px = drawX * size + 4 + offset;
    const py = drawY * size + 4 + offset;

    ctx.save();
    ctx.shadowBlur = detail === 2 ? 12 : (detail === 1 ? 6 : 0);
    ctx.shadowColor = palette.glow;

    if (detail === 2) {
      const fill = ctx.createLinearGradient(px, py, px + bodySize, py + bodySize);
      fill.addColorStop(0, palette.head);
      fill.addColorStop(0.55, palette.accent);
      fill.addColorStop(1, palette.body);
      ctx.fillStyle = fill;
    } else {
      ctx.fillStyle = detail === 1 ? palette.head : palette.body;
    }
    roundedRectPath(px, py, bodySize, bodySize, Math.max(10, bodySize * 0.26));
    ctx.fill();

    ctx.shadowBlur = 0;
    if (detail > 0) {
      ctx.fillStyle = palette.shine;
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.34, py + bodySize * 0.28, bodySize * 0.2, bodySize * 0.11, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = Math.max(detail === 0 ? 1.4 : 2, size * 0.04);
    roundedRectPath(px, py, bodySize, bodySize, Math.max(10, bodySize * 0.26));
    ctx.stroke();

    if (detail < 2) {
      let eye1x = px + bodySize * 0.68;
      let eye1y = py + bodySize * 0.3;
      let eye2x = px + bodySize * 0.68;
      let eye2y = py + bodySize * 0.7;
      let mouthFromX = px + bodySize * 0.8;
      let mouthFromY = py + bodySize * 0.42;
      let mouthToX = px + bodySize * 0.8;
      let mouthToY = py + bodySize * 0.58;
      let tongueFromX = mouthToX;
      let tongueFromY = (mouthFromY + mouthToY) / 2;
      let tongueToX = tongueFromX + facing.x * bodySize * 0.22;
      let tongueToY = tongueFromY + facing.y * bodySize * 0.22;

      if (facing.x === -1) {
        eye1x = px + bodySize * 0.32;
        eye1y = py + bodySize * 0.3;
        eye2x = px + bodySize * 0.32;
        eye2y = py + bodySize * 0.7;
        mouthFromX = px + bodySize * 0.2;
        mouthToX = px + bodySize * 0.2;
        tongueFromX = mouthToX;
        tongueFromY = (mouthFromY + mouthToY) / 2;
        tongueToX = tongueFromX - bodySize * 0.22;
      } else if (facing.y === -1) {
        eye1x = px + bodySize * 0.3;
        eye1y = py + bodySize * 0.32;
        eye2x = px + bodySize * 0.7;
        eye2y = py + bodySize * 0.32;
        mouthFromX = px + bodySize * 0.42;
        mouthFromY = py + bodySize * 0.2;
        mouthToX = px + bodySize * 0.58;
        mouthToY = py + bodySize * 0.2;
        tongueFromX = (mouthFromX + mouthToX) / 2;
        tongueFromY = mouthToY;
        tongueToX = tongueFromX;
        tongueToY = tongueFromY - bodySize * 0.22;
      } else if (facing.y === 1) {
        eye1x = px + bodySize * 0.3;
        eye1y = py + bodySize * 0.68;
        eye2x = px + bodySize * 0.7;
        eye2y = py + bodySize * 0.68;
        mouthFromX = px + bodySize * 0.42;
        mouthFromY = py + bodySize * 0.8;
        mouthToX = px + bodySize * 0.58;
        mouthToY = py + bodySize * 0.8;
        tongueFromX = (mouthFromX + mouthToX) / 2;
        tongueFromY = mouthToY;
        tongueToX = tongueFromX;
        tongueToY = tongueFromY + bodySize * 0.22;
      }

      ctx.fillStyle = palette.stripe;
      if (Math.abs(facing.x) > 0) {
        roundedRectPath(px + bodySize * 0.22, py + bodySize * 0.43, bodySize * 0.34, bodySize * 0.14, bodySize * 0.06);
      } else {
        roundedRectPath(px + bodySize * 0.43, py + bodySize * 0.22, bodySize * 0.14, bodySize * 0.34, bodySize * 0.06);
      }
      ctx.fill();

      ctx.fillStyle = palette.eye;
      ctx.beginPath();
      ctx.arc(eye1x, eye1y, Math.max(2.2, bodySize * 0.074), 0, Math.PI * 2);
      ctx.arc(eye2x, eye2y, Math.max(2.2, bodySize * 0.074), 0, Math.PI * 2);
      ctx.fill();

      if (detail === 1) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eye1x + 1, eye1y - 1, Math.max(0.9, bodySize * 0.02), 0, Math.PI * 2);
        ctx.arc(eye2x + 1, eye2y - 1, Math.max(0.9, bodySize * 0.02), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = palette.eye;
      ctx.lineWidth = Math.max(1.8, size * 0.03);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mouthFromX, mouthFromY);
      ctx.lineTo(mouthToX, mouthToY);
      ctx.stroke();

      if (now >= nextTongueAt) {
        tongueVisibleUntil = now + tongueVisibleDurationMs;
        scheduleTongue(now, false);
      }

      if (now < tongueVisibleUntil) {
        ctx.strokeStyle = '#ff5f82';
        ctx.lineWidth = Math.max(2, size * 0.04);
        ctx.beginPath();
        ctx.moveTo(tongueFromX, tongueFromY);
        ctx.lineTo(tongueToX, tongueToY);
        ctx.stroke();
      }

      ctx.restore();
      return;
    }

    let eye1x = px + bodySize * 0.68;
    let eye1y = py + bodySize * 0.28;
    let eye2x = px + bodySize * 0.68;
    let eye2y = py + bodySize * 0.72;
    let mouthFromX = px + bodySize * 0.8;
    let mouthFromY = py + bodySize * 0.38;
    let mouthToX = px + bodySize * 0.8;
    let mouthToY = py + bodySize * 0.62;
    let snoutA = { x: px + bodySize * 0.74, y: py + bodySize * 0.22 };
    let snoutTip = { x: px + bodySize * 1.02, y: py + bodySize * 0.5 };
    let snoutB = { x: px + bodySize * 0.74, y: py + bodySize * 0.78 };
    let stripeRect = { x: px + bodySize * 0.18, y: py + bodySize * 0.43, w: bodySize * 0.5, h: bodySize * 0.14, r: bodySize * 0.07 };
    let nostril1x = px + bodySize * 0.87;
    let nostril1y = py + bodySize * 0.42;
    let nostril2x = px + bodySize * 0.87;
    let nostril2y = py + bodySize * 0.58;
    let irisShiftX = bodySize * 0.025;
    let irisShiftY = 0;

    if (facing.x === -1) {
      eye1x = px + bodySize * 0.32;
      eye1y = py + bodySize * 0.28;
      eye2x = px + bodySize * 0.32;
      eye2y = py + bodySize * 0.72;
      mouthFromX = px + bodySize * 0.2;
      mouthToX = px + bodySize * 0.2;
      snoutA = { x: px + bodySize * 0.26, y: py + bodySize * 0.22 };
      snoutTip = { x: px - bodySize * 0.02, y: py + bodySize * 0.5 };
      snoutB = { x: px + bodySize * 0.26, y: py + bodySize * 0.78 };
      stripeRect = { x: px + bodySize * 0.32, y: py + bodySize * 0.43, w: bodySize * 0.5, h: bodySize * 0.14, r: bodySize * 0.07 };
      nostril1x = px + bodySize * 0.13;
      nostril1y = py + bodySize * 0.42;
      nostril2x = px + bodySize * 0.13;
      nostril2y = py + bodySize * 0.58;
      irisShiftX = -bodySize * 0.025;
    } else if (facing.y === -1) {
      eye1x = px + bodySize * 0.28;
      eye1y = py + bodySize * 0.32;
      eye2x = px + bodySize * 0.72;
      eye2y = py + bodySize * 0.32;
      mouthFromX = px + bodySize * 0.38;
      mouthFromY = py + bodySize * 0.2;
      mouthToX = px + bodySize * 0.62;
      mouthToY = py + bodySize * 0.2;
      snoutA = { x: px + bodySize * 0.22, y: py + bodySize * 0.26 };
      snoutTip = { x: px + bodySize * 0.5, y: py - bodySize * 0.02 };
      snoutB = { x: px + bodySize * 0.78, y: py + bodySize * 0.26 };
      stripeRect = { x: px + bodySize * 0.43, y: py + bodySize * 0.2, w: bodySize * 0.14, h: bodySize * 0.5, r: bodySize * 0.07 };
      nostril1x = px + bodySize * 0.42;
      nostril1y = py + bodySize * 0.13;
      nostril2x = px + bodySize * 0.58;
      nostril2y = py + bodySize * 0.13;
      irisShiftX = 0;
      irisShiftY = -bodySize * 0.025;
    } else if (facing.y === 1) {
      eye1x = px + bodySize * 0.28;
      eye1y = py + bodySize * 0.68;
      eye2x = px + bodySize * 0.72;
      eye2y = py + bodySize * 0.68;
      mouthFromX = px + bodySize * 0.38;
      mouthFromY = py + bodySize * 0.8;
      mouthToX = px + bodySize * 0.62;
      mouthToY = py + bodySize * 0.8;
      snoutA = { x: px + bodySize * 0.22, y: py + bodySize * 0.74 };
      snoutTip = { x: px + bodySize * 0.5, y: py + bodySize * 1.02 };
      snoutB = { x: px + bodySize * 0.78, y: py + bodySize * 0.74 };
      stripeRect = { x: px + bodySize * 0.43, y: py + bodySize * 0.3, w: bodySize * 0.14, h: bodySize * 0.5, r: bodySize * 0.07 };
      nostril1x = px + bodySize * 0.42;
      nostril1y = py + bodySize * 0.87;
      nostril2x = px + bodySize * 0.58;
      nostril2y = py + bodySize * 0.87;
      irisShiftX = 0;
      irisShiftY = bodySize * 0.025;
    }

    let tongueFromX = snoutTip.x;
    let tongueFromY = snoutTip.y;
    let tongueToX = snoutTip.x + facing.x * bodySize * 0.26;
    let tongueToY = snoutTip.y + facing.y * bodySize * 0.26;
    if (facing.x !== 0) tongueFromX -= facing.x * bodySize * 0.04;
    if (facing.y !== 0) tongueFromY -= facing.y * bodySize * 0.04;

    const snoutFill = ctx.createLinearGradient(snoutA.x, snoutA.y, snoutTip.x, snoutTip.y);
    snoutFill.addColorStop(0, palette.head);
    snoutFill.addColorStop(0.72, palette.accent);
    snoutFill.addColorStop(1, palette.body);
    ctx.fillStyle = snoutFill;
    ctx.beginPath();
    ctx.moveTo(snoutA.x, snoutA.y);
    ctx.lineTo(snoutTip.x, snoutTip.y);
    ctx.lineTo(snoutB.x, snoutB.y);
    ctx.quadraticCurveTo(px + bodySize * 0.56, py + bodySize * 0.5, snoutA.x, snoutA.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = Math.max(1.8, size * 0.035);
    ctx.stroke();

    ctx.globalAlpha = 0.82;
    ctx.fillStyle = palette.stripe;
    roundedRectPath(stripeRect.x, stripeRect.y, stripeRect.w, stripeRect.h, stripeRect.r);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (palette.pattern === 'jackpot') {
      ctx.save();
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.moveTo(px + bodySize * 0.28, py + bodySize * 0.04);
      ctx.lineTo(px + bodySize * 0.4, py - bodySize * 0.12);
      ctx.lineTo(px + bodySize * 0.5, py + bodySize * 0.02);
      ctx.lineTo(px + bodySize * 0.6, py - bodySize * 0.12);
      ctx.lineTo(px + bodySize * 0.72, py + bodySize * 0.04);
      ctx.lineTo(px + bodySize * 0.66, py + bodySize * 0.16);
      ctx.lineTo(px + bodySize * 0.34, py + bodySize * 0.16);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = palette.stripe;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.05, Math.max(1.8, bodySize * 0.045), 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.84;
      ctx.strokeStyle = palette.eye;
      ctx.lineWidth = Math.max(1.5, bodySize * 0.035);
      ctx.beginPath();
      ctx.moveTo(px + bodySize * 0.24, py + bodySize * 0.24);
      ctx.lineTo(px + bodySize * 0.76, py + bodySize * 0.24);
      ctx.stroke();

      const bulbs = [
        [0.22, 0.11],
        [0.34, 0.08],
        [0.66, 0.08],
        [0.78, 0.11]
      ];
      bulbs.forEach(([sx, sy], bulbIndex) => {
        ctx.globalAlpha = 0.7 + (bulbIndex % 2) * 0.16;
        ctx.fillStyle = bulbIndex % 2 === 0 ? palette.stripe : palette.eye;
        ctx.beginPath();
        ctx.arc(px + bodySize * sx, py + bodySize * sy, Math.max(1.4, bodySize * 0.028), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 0.86;
      ctx.fillStyle = 'rgba(5, 8, 16, 0.46)';
      roundedRectPath(px + bodySize * 0.3, py + bodySize * 0.18, bodySize * 0.4, bodySize * 0.11, bodySize * 0.05);
      ctx.fill();
      ctx.strokeStyle = palette.stripe;
      ctx.lineWidth = Math.max(1.2, bodySize * 0.026);
      roundedRectPath(px + bodySize * 0.3, py + bodySize * 0.18, bodySize * 0.4, bodySize * 0.11, bodySize * 0.05);
      ctx.stroke();

      ctx.strokeStyle = palette.belly;
      ctx.lineWidth = Math.max(1.1, bodySize * 0.03);
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.16, bodySize * 0.2, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (palette.pattern === 'angelic') {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = palette.stripe;
      ctx.lineWidth = Math.max(1.3, bodySize * 0.03);
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.08, bodySize * 0.18, bodySize * 0.055, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.beginPath();
      ctx.moveTo(px + bodySize * 0.22, py + bodySize * 0.18);
      ctx.quadraticCurveTo(px + bodySize * 0.08, py + bodySize * 0.1, px + bodySize * 0.14, py + bodySize * 0.34);
      ctx.quadraticCurveTo(px + bodySize * 0.2, py + bodySize * 0.28, px + bodySize * 0.3, py + bodySize * 0.26);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(px + bodySize * 0.78, py + bodySize * 0.18);
      ctx.quadraticCurveTo(px + bodySize * 0.92, py + bodySize * 0.1, px + bodySize * 0.86, py + bodySize * 0.34);
      ctx.quadraticCurveTo(px + bodySize * 0.8, py + bodySize * 0.28, px + bodySize * 0.7, py + bodySize * 0.26);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.84;
      ctx.fillStyle = palette.accent;
      roundedRectPath(px + bodySize * 0.38, py + bodySize * 0.1, bodySize * 0.24, bodySize * 0.06, bodySize * 0.03);
      ctx.fill();
      ctx.restore();
    } else if (palette.pattern === 'accretion') {
      ctx.save();
      const crownTilt = 0.22 + Math.sin(now * 0.0032) * 0.08;
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = palette.stripe;
      ctx.lineWidth = Math.max(1.2, bodySize * 0.028);
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.12, bodySize * 0.22, bodySize * 0.07, crownTilt, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = palette.accent;
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.12, bodySize * 0.16, bodySize * 0.045, crownTilt, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.56)';
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.12, Math.max(1.8, bodySize * 0.045), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (palette.pattern === 'nebula') {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = palette.stripe;
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.34, py + bodySize * 0.13, bodySize * 0.16, bodySize * 0.075, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.66, py + bodySize * 0.11, bodySize * 0.14, bodySize * 0.065, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = palette.eye;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.36, py + bodySize * 0.08, Math.max(1.2, bodySize * 0.022), 0, Math.PI * 2);
      ctx.arc(px + bodySize * 0.62, py + bodySize * 0.1, Math.max(1.4, bodySize * 0.025), 0, Math.PI * 2);
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.15, Math.max(1.2, bodySize * 0.02), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (palette.pattern === 'eclipse') {
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.57, py + bodySize * 0.11, bodySize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.51, py + bodySize * 0.11, bodySize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.72;
      ctx.strokeStyle = palette.stripe;
      ctx.lineWidth = Math.max(1.2, bodySize * 0.028);
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.12, bodySize * 0.18, Math.PI * 1.08, Math.PI * 1.9);
      ctx.stroke();
      ctx.restore();
    } else if (palette.pattern === 'singularity') {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = palette.stripe;
      ctx.lineWidth = Math.max(1.2, bodySize * 0.03);
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.16, bodySize * 0.2, Math.PI * 1.02, Math.PI * 1.96);
      ctx.stroke();
      ctx.strokeStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.16, bodySize * 0.13, Math.PI * 1.14, Math.PI * 1.86);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.24)';
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.16, bodySize * 0.26, Math.PI * 1.14, Math.PI * 1.74);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.54)';
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.14, Math.max(2, bodySize * 0.05), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = palette.eye;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.67, py + bodySize * 0.11, Math.max(1.4, bodySize * 0.026), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (palette.pattern === 'horizon') {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = palette.stripe;
      roundedRectPath(px + bodySize * 0.24, py + bodySize * 0.08, bodySize * 0.52, bodySize * 0.06, bodySize * 0.03);
      ctx.fill();
      ctx.fillStyle = palette.accent;
      roundedRectPath(px + bodySize * 0.38, py + bodySize * 0.02, bodySize * 0.24, bodySize * 0.07, bodySize * 0.03);
      ctx.fill();
      ctx.fillStyle = palette.eye;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.5, py + bodySize * 0.055, Math.max(1.6, bodySize * 0.03), 0, Math.PI * 2);
      ctx.arc(px + bodySize * 0.38, py + bodySize * 0.1, Math.max(1.1, bodySize * 0.02), 0, Math.PI * 2);
      ctx.arc(px + bodySize * 0.62, py + bodySize * 0.1, Math.max(1.1, bodySize * 0.02), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (palette.pattern === 'orbit') {
      ctx.save();
      ctx.globalAlpha = 0.86;
      ctx.strokeStyle = palette.stripe;
      ctx.lineWidth = Math.max(1.2, bodySize * 0.028);
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.14, bodySize * 0.2, bodySize * 0.07, Math.sin(now * 0.0024) * 0.16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = palette.accent;
      ctx.beginPath();
      ctx.ellipse(px + bodySize * 0.5, py + bodySize * 0.14, bodySize * 0.11, bodySize * 0.17, -Math.sin(now * 0.0021) * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(px + bodySize * 0.66, py + bodySize * 0.11, Math.max(1.6, bodySize * 0.03), 0, Math.PI * 2);
      ctx.arc(px + bodySize * 0.36, py + bodySize * 0.18, Math.max(1.3, bodySize * 0.024), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = palette.eye;
    ctx.beginPath();
    ctx.arc(eye1x, eye1y, Math.max(2.4, bodySize * 0.078), 0, Math.PI * 2);
    ctx.arc(eye2x, eye2y, Math.max(2.4, bodySize * 0.078), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(eye1x + irisShiftX, eye1y + irisShiftY, Math.max(1.1, bodySize * 0.034), 0, Math.PI * 2);
    ctx.arc(eye2x + irisShiftX, eye2y + irisShiftY, Math.max(1.1, bodySize * 0.034), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eye1x + Math.sign(irisShiftX || 1), eye1y - 1, Math.max(0.9, bodySize * 0.02), 0, Math.PI * 2);
    ctx.arc(eye2x + Math.sign(irisShiftX || 1), eye2y - 1, Math.max(0.9, bodySize * 0.02), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.eye;
    ctx.beginPath();
    ctx.arc(nostril1x, nostril1y, Math.max(1, bodySize * 0.018), 0, Math.PI * 2);
    ctx.arc(nostril2x, nostril2y, Math.max(1, bodySize * 0.018), 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = palette.eye;
    ctx.lineWidth = Math.max(1.8, size * 0.03);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mouthFromX, mouthFromY);
    ctx.quadraticCurveTo(
      (mouthFromX + mouthToX) / 2 + facing.y * bodySize * 0.06,
      (mouthFromY + mouthToY) / 2 + facing.x * bodySize * 0.06,
      mouthToX,
      mouthToY
    );
    ctx.stroke();

    if (now >= nextTongueAt) {
      tongueVisibleUntil = now + tongueVisibleDurationMs;
      scheduleTongue(now, false);
    }

    if (now < tongueVisibleUntil) {
      ctx.strokeStyle = '#ff5f82';
      ctx.lineWidth = Math.max(2.2, size * 0.045);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tongueFromX, tongueFromY);
      ctx.lineTo(tongueToX, tongueToY);
      if (facing.x !== 0) {
        ctx.moveTo(tongueToX, tongueToY);
        ctx.lineTo(tongueToX + facing.x * 7, tongueToY - 5);
        ctx.moveTo(tongueToX, tongueToY);
        ctx.lineTo(tongueToX + facing.x * 7, tongueToY + 5);
      } else {
        ctx.moveTo(tongueToX, tongueToY);
        ctx.lineTo(tongueToX - 5, tongueToY + facing.y * 7);
        ctx.moveTo(tongueToX, tongueToY);
        ctx.lineTo(tongueToX + 5, tongueToY + facing.y * 7);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAngelEnemy(enemy, type = 'angel', now = performance.now()) {
    const size = currentCellSize();
    const bodySize = size - 6;
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

  function drawBossAvatar(now = performance.now()) {
    if (!boss?.active) return;

    const attackLive = boss.attackUntil > now;
    const attackType = attackLive ? boss.attackType : 'idle';
    const attackPower = attackLive ? 1 - ((boss.attackUntil - now) / 820) : 0;
    const entrance = Math.min(1, Math.max(0, (now - (boss.entranceAt || now)) / 900));
    const floatX = canvas.width / 2 + Math.sin(now * 0.0018 + boss.floatSeed) * 118;
    const floatY = 92 + Math.sin(now * 0.003 + boss.floatSeed) * 12 - (1 - entrance) * 42;
    const wingLift = Math.sin(now * 0.01 + boss.floatSeed) * 12 + attackPower * 10;
    const wingSpread = attackType === 'volley' ? 1.18 : (attackType === 'beam' ? 1.1 : 1);
    const bodyGlow = 0.22 + Math.sin(now * 0.006 + boss.haloSeed) * 0.06 + attackPower * 0.12;

    const drawWing = (dir) => {
      const inner = dir * 38;
      const outer = dir * 118 * wingSpread;
      const mid = dir * 84 * wingSpread;

      ctx.save();
      ctx.globalAlpha = 0.82;
      const wingFill = ctx.createLinearGradient(inner, -20, outer, 44);
      wingFill.addColorStop(0, 'rgba(255,255,255,0.96)');
      wingFill.addColorStop(0.55, 'rgba(226, 245, 255, 0.86)');
      wingFill.addColorStop(1, 'rgba(161, 214, 255, 0.28)');
      ctx.fillStyle = wingFill;
      ctx.beginPath();
      ctx.moveTo(inner, -10);
      ctx.quadraticCurveTo(mid, -68 - wingLift, outer, -18);
      ctx.quadraticCurveTo(dir * 96, -2, dir * 90, 20);
      ctx.quadraticCurveTo(dir * 78, 10, dir * 58, 24);
      ctx.quadraticCurveTo(dir * 44, 8, inner, 2);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.94;
      ctx.strokeStyle = attackType === 'laser' ? 'rgba(124,248,255,0.74)' : 'rgba(255, 248, 212, 0.54)';
      ctx.lineWidth = 2;
      for (let feather = 0; feather < 4; feather += 1) {
        const startX = dir * (40 + feather * 10);
        const startY = -4 + feather * 4;
        const endX = dir * (70 + feather * 14) * wingSpread;
        const endY = -26 - feather * 6 - wingLift * 0.4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      ctx.restore();
    };

    ctx.save();
    ctx.translate(floatX, floatY);
    ctx.scale(0.88 + entrance * 0.12, 0.88 + entrance * 0.12);

    ctx.globalCompositeOperation = 'screen';
    const halo = ctx.createRadialGradient(0, -44, 8, 0, -44, 76);
    halo.addColorStop(0, `rgba(255,255,255,${0.22 + attackPower * 0.12})`);
    halo.addColorStop(0.35, `rgba(255,228,140,${bodyGlow})`);
    halo.addColorStop(1, 'rgba(124,248,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, -10, 84, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = attackType === 'beam' ? 'rgba(124,248,255,0.72)' : 'rgba(255,230,156,0.76)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -62, 42 + Math.sin(now * 0.007) * 4, 12 + attackPower * 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -62, 28, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(floatX, floatY);
    ctx.scale(0.88 + entrance * 0.12, 0.88 + entrance * 0.12);
    drawWing(-1);
    drawWing(1);

    const robe = ctx.createLinearGradient(0, -12, 0, 92);
    robe.addColorStop(0, '#fff8ea');
    robe.addColorStop(0.34, '#f7e0a2');
    robe.addColorStop(0.72, '#9ad8ff');
    robe.addColorStop(1, '#11233e');
    ctx.fillStyle = robe;
    ctx.beginPath();
    ctx.moveTo(-34, -18);
    ctx.quadraticCurveTo(-46, 10, -26, 46);
    ctx.lineTo(-14, 88);
    ctx.lineTo(14, 88);
    ctx.lineTo(26, 46);
    ctx.quadraticCurveTo(46, 10, 34, -18);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,232,165,0.78)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 84);
    ctx.moveTo(-14, 20);
    ctx.lineTo(14, 20);
    ctx.moveTo(-18, 44);
    ctx.lineTo(18, 44);
    ctx.stroke();

    const face = ctx.createLinearGradient(-24, -34, 24, 34);
    face.addColorStop(0, '#fffdf5');
    face.addColorStop(0.65, '#ffe7b0');
    face.addColorStop(1, '#cfdcff');
    ctx.fillStyle = face;
    roundedRectPath(-28, -34, 56, 60, 18);
    ctx.fill();
    ctx.strokeStyle = '#d8b24b';
    ctx.lineWidth = 3;
    roundedRectPath(-28, -34, 56, 60, 18);
    ctx.stroke();

    ctx.fillStyle = attackType === 'laser' ? '#7cf8ff' : '#2d2411';
    ctx.shadowBlur = attackType === 'laser' ? 18 : 0;
    ctx.shadowColor = 'rgba(124,248,255,0.54)';
    ctx.fillRect(-12, -10, 7, 7);
    ctx.fillRect(5, -10, 7, 7);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2d2411';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, 12);
    ctx.quadraticCurveTo(0, 18 + attackPower * 4, 12, 12);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.moveTo(-22, -34);
    ctx.lineTo(-10, -54);
    ctx.lineTo(0, -38);
    ctx.lineTo(10, -54);
    ctx.lineTo(22, -34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,128,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = attackType === 'beam' ? 'rgba(124,248,255,0.42)' : 'rgba(255,230,156,0.28)';
    ctx.beginPath();
    ctx.arc(0, 6, 12 + attackPower * 6, 0, Math.PI * 2);
    ctx.fill();

    if (attackType === 'laser') {
      ctx.strokeStyle = 'rgba(124,248,255,0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(0, 82);
      ctx.stroke();
    } else if (attackType === 'volley') {
      ctx.strokeStyle = 'rgba(255, 224, 138, 0.8)';
      ctx.lineWidth = 2.4;
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.beginPath();
        ctx.arc(0, 8, 14 + ring * 9 + attackPower * 8, -Math.PI * 0.15, Math.PI * 1.15);
        ctx.stroke();
      }
    } else if (attackType === 'beam') {
      ctx.fillStyle = 'rgba(124,248,255,0.26)';
      ctx.beginPath();
      ctx.moveTo(-12, -78);
      ctx.lineTo(0, -110);
      ctx.lineTo(12, -78);
      ctx.closePath();
      ctx.fill();
    } else if (attackType === 'grenade') {
      ctx.strokeStyle = 'rgba(255, 160, 90, 0.82)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-30, 12, 10, 0, Math.PI * 2);
      ctx.arc(30, 12, 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
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

    const glow = bctx.createRadialGradient(boardCache.width / 2, boardCache.height * 0.2, 10, boardCache.width / 2, boardCache.height / 2, boardCache.width * 0.75);
    if (angelRealm) {
      glow.addColorStop(0, 'rgba(255,255,255,0.28)');
      glow.addColorStop(0.45, 'rgba(255,248,205,0.14)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
    } else {
      glow.addColorStop(0, 'rgba(71,255,161,0.12)');
      glow.addColorStop(0.45, 'rgba(71,255,161,0.06)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
    }
    bctx.fillStyle = glow;
    bctx.fillRect(0, 0, boardCache.width, boardCache.height);
  }

  function drawAmbientBoardEffects(now) {
    const width = canvas.width;
    const height = canvas.height;
    const time = now * 0.00016;
    const grid = currentGridSize();
    const fxQuality = getVisualFxQuality();
    const count = fxQuality === 0
      ? Math.min(6, Math.max(3, Math.round(grid * 0.2)))
      : fxQuality === 1
        ? Math.min(10, Math.max(4, Math.round(grid * 0.32)))
        : Math.min(14, Math.max(5, Math.round(grid * 0.42)));
    const drawCrossFlares = fxQuality > 1 && grid <= 12;
    const activeTier = getSkinTier(getActiveSkin());
    const activeTierRank = tierOrderMap[activeTier.slug] ?? 0;
    const meteorCap = fxQuality === 0 ? 1 : fxQuality === 1 ? 2 : 4;
    const meteorCount = Math.min(meteorCap, Math.max(0,
      (level >= 6 ? 1 : 0)
      + (comboCount >= 6 ? 1 : 0)
      + (activeTierRank >= tierOrderMap.cosmic ? 1 : 0)
      + (activeTierRank >= tierOrderMap.snakeifying ? 1 : 0)
    ));
    const glowHalo = angelRealm
      ? 'rgba(255, 246, 200, 0.18)'
      : jackpotMode
        ? 'rgba(255, 79, 163, 0.14)'
        : 'rgba(83, 243, 149, 0.12)';
    const glowCore = angelRealm
      ? 'rgba(255, 255, 255, 0.84)'
      : jackpotMode
        ? 'rgba(118, 255, 216, 0.84)'
        : 'rgba(124, 248, 255, 0.74)';

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let index = 0; index < count; index += 1) {
      const seed = level * 0.73 + index * 17.37 + (angelRealm ? 3.8 : 0) + (jackpotMode ? 6.2 : 0);
      const baseX = fract(Math.sin(seed * 12.9898) * 43758.5453);
      const baseY = fract(Math.sin(seed * 78.233) * 96321.9123);
      const driftX = Math.sin(time * (0.9 + baseY * 1.5) + index * 1.3) * (10 + baseX * 18);
      const driftY = Math.cos(time * (1.1 + baseX * 1.4) + index * 1.7) * (8 + baseY * 16);
      const x = baseX * width + driftX;
      const y = baseY * height + driftY;
      const radius = 1.2 + baseX * 2.2 + (angelRealm ? 0.5 : 0);
      const alpha = 0.18 + Math.sin(time * 5.4 + index * 1.1) * 0.06;

      ctx.globalAlpha = Math.max(0.06, alpha);
      ctx.fillStyle = glowHalo;
      ctx.beginPath();
      ctx.arc(x, y, radius * 3.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = Math.max(0.16, alpha + 0.08);
      ctx.fillStyle = glowCore;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      if (drawCrossFlares && index % 4 === 0) {
        ctx.strokeStyle = glowCore;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.14 + baseY * 0.16;
        ctx.beginPath();
        ctx.moveTo(x - radius * 2.3, y);
        ctx.lineTo(x + radius * 2.3, y);
        ctx.moveTo(x, y - radius * 2.3);
        ctx.lineTo(x, y + radius * 2.3);
        ctx.stroke();
      }
    }

    if (meteorCount > 0) {
      for (let index = 0; index < meteorCount; index += 1) {
        const seed = level * 0.91 + comboCount * 0.47 + index * 19.3 + activeTierRank * 0.6;
        const travel = fract(Math.sin(seed * 4.17 + time * (11 + index * 1.7)) * 817.17);
        const lane = fract(Math.sin(seed * 9.23) * 437.27);
        const startX = width * (0.08 + lane * 0.84);
        const startY = height * (-0.18 + travel * 1.26);
        const length = 30 + activeTierRank * 2 + index * 10;
        const endX = startX - length;
        const endY = startY + length * 0.62;
        ctx.globalAlpha = 0.28 + index * 0.08;
        if (fxQuality === 0) {
          ctx.strokeStyle = activeTierRank >= tierOrderMap.snakeifying ? 'rgba(255, 139, 224, 0.74)' : 'rgba(255, 244, 191, 0.68)';
        } else {
          const meteor = ctx.createLinearGradient(startX, startY, endX, endY);
          meteor.addColorStop(0, activeTierRank >= tierOrderMap.snakeifying ? 'rgba(255, 139, 224, 0.92)' : 'rgba(255, 244, 191, 0.86)');
          meteor.addColorStop(0.45, 'rgba(124, 248, 255, 0.46)');
          meteor.addColorStop(1, 'rgba(124, 248, 255, 0)');
          ctx.strokeStyle = meteor;
        }
        ctx.lineWidth = 1.6 + index * 0.34;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.globalAlpha = fxQuality === 0 ? 0.56 : 0.7;
        ctx.fillStyle = activeTierRank >= tierOrderMap.snakeifying ? 'rgba(255,241,250,0.84)' : 'rgba(255,255,255,0.82)';
        ctx.beginPath();
        ctx.arc(startX, startY, 1.8 + index * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawPickupAura(item, now, palette = {}) {
    if (!item) return;

    const size = currentCellSize();
    const fxQuality = getVisualFxQuality();
    const cx = (item.x + 0.5) * size;
    const cy = (item.y + 0.5) * size;
    const pulse = 0.9 + Math.sin(now * (palette.speed || 0.01) + item.x * 0.7 + item.y * 0.9) * 0.08;
    const outer = size * (palette.radius || 0.56) * pulse;
    const inner = size * 0.14;
    const sparkleCap = fxQuality === 0
      ? 0
      : fxQuality === 1
        ? (currentGridSize() >= 14 ? 1 : 2)
        : currentGridSize() >= 18
          ? 1
          : currentGridSize() >= 12
            ? 2
            : 3;
    const sparkleCount = Math.min(palette.sparkles || 2, sparkleCap);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const glow = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    glow.addColorStop(0, palette.core || 'rgba(255,255,255,0.2)');
    glow.addColorStop(0.55, palette.mid || palette.core || 'rgba(255,255,255,0.14)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.78;
    ctx.lineWidth = palette.lineWidth || 2;
    ctx.strokeStyle = palette.ring || 'rgba(255,255,255,0.58)';
    ctx.beginPath();
    ctx.arc(cx, cy, outer * 0.86, 0, Math.PI * 2);
    ctx.stroke();

    if (sparkleCount > 0) {
      ctx.fillStyle = palette.spark || '#fff';
      for (let index = 0; index < sparkleCount; index += 1) {
        const angle = now * (palette.orbitSpeed || 0.0032) + item.x * 0.8 + item.y * 0.6 + (index / sparkleCount) * Math.PI * 2;
        const orbitX = cx + Math.cos(angle) * outer * (0.62 + index * 0.14);
        const orbitY = cy + Math.sin(angle) * outer * 0.58;
        ctx.globalAlpha = 0.78 - index * 0.14;
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, Math.max(1.6, size * 0.045), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawComboAura(head, now) {
    if (!head || comboCount <= 1 || gameOver) return;

    const size = currentCellSize();
    const fxQuality = getVisualFxQuality();
    const cx = (head.x + 0.5) * size;
    const cy = (head.y + 0.5) * size;
    const intensity = Math.min(1, comboCount / 8);
    const supernova = comboCount >= 6;
    const cataclysm = comboCount >= 10;
    const outer = size * (0.66 + intensity * 0.34 + Math.sin(now * 0.018) * 0.04);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const aura = ctx.createRadialGradient(cx, cy, size * 0.14, cx, cy, outer);
    aura.addColorStop(0, cataclysm ? 'rgba(255, 139, 224, 0.28)' : jackpotMode ? 'rgba(255, 79, 163, 0.22)' : 'rgba(125, 255, 178, 0.18)');
    aura.addColorStop(0.45, supernova ? 'rgba(124, 248, 255, 0.2)' : 'rgba(255, 228, 140, 0.18)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = jackpotMode ? 'rgba(118,255,216,0.78)' : 'rgba(255,228,140,0.82)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outer * 0.78, now * 0.006, now * 0.006 + Math.PI * 1.45);
    ctx.stroke();

    if (fxQuality === 0) {
      ctx.restore();
      return;
    }

    if (supernova) {
      ctx.globalAlpha = cataclysm ? 0.56 : 0.42;
      ctx.strokeStyle = cataclysm ? 'rgba(255, 139, 224, 0.74)' : 'rgba(124,248,255,0.64)';
      ctx.lineWidth = cataclysm ? 2.6 : 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, outer * 1.02, -now * 0.004, -now * 0.004 + Math.PI * 1.62);
      ctx.stroke();

      ctx.translate(cx, cy);
      const rayCount = cataclysm ? (fxQuality === 1 ? 6 : 8) : (fxQuality === 1 ? 4 : 6);
      for (let ray = 0; ray < rayCount; ray += 1) {
        ctx.save();
        ctx.rotate(now * 0.0012 + ray * (Math.PI * 2 / rayCount));
        ctx.strokeStyle = ray % 2 === 0 ? 'rgba(255,255,255,0.34)' : 'rgba(124,248,255,0.3)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(size * 0.22, 0);
        ctx.lineTo(size * (cataclysm ? 0.72 : 0.58), 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.translate(-cx, -cy);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    const sparkCount = fxQuality === 1
      ? (cataclysm ? 4 : supernova ? 3 : 2)
      : cataclysm
        ? 5
        : supernova
          ? 4
          : 3;
    for (let index = 0; index < sparkCount; index += 1) {
      const angle = now * 0.005 + index * (Math.PI * 2 / sparkCount);
      const sparkX = cx + Math.cos(angle) * outer * (0.86 + index * 0.05);
      const sparkY = cy + Math.sin(angle) * outer * (supernova ? 0.84 : 0.72);
      ctx.globalAlpha = Math.max(0.22, 0.82 - index * 0.13);
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, Math.max(1.8, size * (cataclysm ? 0.064 : 0.05)), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawComboBanner(now) {
    if (comboCount <= 1 || gameOver) return;

    const supernova = comboCount >= 6;
    const cataclysm = comboCount >= 10;
    const label = cataclysm ? `Cataclysm x${comboCount}` : supernova ? `Supernova x${comboCount}` : `Combo x${comboCount}`;
    const x = 12;
    const y = 12;
    const height = 38;
    const pulse = 0.92 + Math.sin(now * 0.016) * 0.05;

    ctx.save();
    ctx.font = 'bold 16px Arial';
    const width = Math.max(108, ctx.measureText(label).width + 30);

    const fill = ctx.createLinearGradient(x, y, x + width, y + height);
    fill.addColorStop(0, 'rgba(18, 23, 34, 0.92)');
    fill.addColorStop(1, cataclysm
      ? 'rgba(82, 16, 74, 0.94)'
      : supernova
        ? 'rgba(26, 52, 82, 0.94)'
        : jackpotMode
          ? 'rgba(88, 18, 54, 0.94)'
          : 'rgba(78, 56, 16, 0.92)');

    roundedRectPath(x, y, width, height, 14);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = cataclysm
      ? 'rgba(255, 139, 224, 0.82)'
      : supernova
        ? 'rgba(124, 248, 255, 0.76)'
        : jackpotMode
          ? 'rgba(255, 112, 183, 0.72)'
          : 'rgba(255, 228, 140, 0.74)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    roundedRectPath(x, y, width, height, 14);
    ctx.clip();
    const sweepX = ((Math.sin(now * 0.005) + 1) / 2) * (width + 42) - 42;
    ctx.globalAlpha = 0.16 * pulse;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(x + sweepX, y - 6, 22, height + 12);
    ctx.restore();

    ctx.fillStyle = cataclysm ? '#fff0fb' : supernova ? '#dffcff' : '#ffeeb9';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 14, y + 24);
    ctx.restore();
  }

  function drawJackpotHud(now) {
    if (!jackpotMode) return;

    const x = canvas.width - 132;
    const y = 34;
    const width = 116;
    const height = 50;

    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = 'rgba(255, 79, 163, 0.24)';

    const shell = ctx.createLinearGradient(x, y, x + width, y + height);
    shell.addColorStop(0, 'rgba(12, 14, 22, 0.94)');
    shell.addColorStop(1, 'rgba(44, 14, 30, 0.96)');
    roundedRectPath(x, y, width, height, 14);
    ctx.fillStyle = shell;
    ctx.fill();

    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    roundedRectPath(x, y, width, height, 14);
    ctx.clip();
    const sweepX = ((Math.sin(now * 0.0044) + 1) / 2) * (width + 42) - 42;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(x + sweepX, y - 6, 20, height + 12);
    ctx.restore();

    for (let index = 0; index < 4; index += 1) {
      const bulbX = x + 16 + index * 24;
      const bulbY = y + 10;
      const lit = 0.55 + Math.sin(now * 0.012 + index * 1.4) * 0.25;
      ctx.globalAlpha = Math.max(0.28, lit);
      ctx.fillStyle = index % 2 === 0 ? '#ff78ba' : '#7dffe2';
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff9bd1';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FEVER', x + width / 2, y + 21);
    ctx.fillStyle = '#76ffd8';
    ctx.fillText(jackpotHud.mode, x + width / 2, y + 38);
    ctx.restore();
  }

  function drawRealmBanner(now) {
    if (!realmMessage || now >= realmMessageUntil) return;

    const height = 30;
    const y = canvas.height - 54;
    const shadowColor = angelRealm
      ? 'rgba(255, 232, 176, 0.24)'
      : jackpotMode
        ? 'rgba(255, 79, 163, 0.24)'
        : 'rgba(110, 231, 183, 0.2)';

    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    const width = Math.min(canvas.width - 24, ctx.measureText(realmMessage).width + 54);
    const x = (canvas.width - width) / 2;

    const fill = ctx.createLinearGradient(x, y, x + width, y + height);
    if (angelRealm) {
      fill.addColorStop(0, 'rgba(69, 50, 12, 0.92)');
      fill.addColorStop(1, 'rgba(120, 82, 18, 0.94)');
    } else if (jackpotMode) {
      fill.addColorStop(0, 'rgba(40, 12, 25, 0.92)');
      fill.addColorStop(1, 'rgba(86, 18, 56, 0.94)');
    } else {
      fill.addColorStop(0, 'rgba(9, 17, 31, 0.9)');
      fill.addColorStop(1, 'rgba(19, 48, 39, 0.92)');
    }

    ctx.shadowBlur = 18;
    ctx.shadowColor = shadowColor;
    roundedRectPath(x, y, width, height, 15);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = angelRealm
      ? 'rgba(255, 231, 164, 0.76)'
      : jackpotMode
        ? 'rgba(255, 112, 183, 0.72)'
        : 'rgba(110, 231, 183, 0.72)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = angelRealm ? '#fff3cf' : '#f8fbff';
    ctx.fillText(realmMessage, canvas.width / 2, y + 21);
    ctx.restore();
  }

  function drawStageBanner(now) {
    if (!stageBanner || now >= stageBanner.until) return;

    const lifeProgress = Math.min(1, (now - stageBanner.startedAt) / 260);
    const fadeOut = Math.min(1, (stageBanner.until - now) / 260);
    const alpha = Math.max(0, Math.min(lifeProgress, fadeOut));
    const title = stageBanner.title || '';
    const subtitle = stageBanner.subtitle || '';
    const yBase = boss?.active ? 42 : 20;
    const y = yBase - (1 - alpha) * 16;
    const height = subtitle ? 48 : 36;

    const tone = stageBanner.tone || 'normal';
    const palette = tone === 'angel'
      ? { start: 'rgba(88, 62, 16, 0.94)', end: 'rgba(154, 114, 28, 0.96)', edge: 'rgba(255, 236, 166, 0.84)', title: '#fff6da', subtitle: '#fff0bf', glow: 'rgba(255, 224, 138, 0.26)' }
      : tone === 'boss'
        ? { start: 'rgba(46, 16, 18, 0.96)', end: 'rgba(104, 36, 18, 0.98)', edge: 'rgba(255, 182, 116, 0.86)', title: '#fff1df', subtitle: '#ffd9bb', glow: 'rgba(255, 115, 64, 0.28)' }
        : tone === 'perfect'
          ? { start: 'rgba(10, 34, 44, 0.96)', end: 'rgba(18, 78, 108, 0.98)', edge: 'rgba(124, 248, 255, 0.86)', title: '#f1feff', subtitle: '#d8fbff', glow: 'rgba(124, 248, 255, 0.24)' }
          : tone === 'endless'
            ? { start: 'rgba(22, 17, 52, 0.96)', end: 'rgba(44, 28, 100, 0.98)', edge: 'rgba(168, 139, 250, 0.84)', title: '#f4efff', subtitle: '#e1d7ff', glow: 'rgba(168, 139, 250, 0.24)' }
            : { start: 'rgba(11, 18, 31, 0.94)', end: 'rgba(19, 52, 45, 0.96)', edge: 'rgba(110, 231, 183, 0.82)', title: '#f6fffb', subtitle: '#d8fff0', glow: 'rgba(110, 231, 183, 0.22)' };

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px Arial';
    const titleWidth = ctx.measureText(title).width;
    ctx.font = 'bold 12px Arial';
    const subtitleWidth = subtitle ? ctx.measureText(subtitle).width : 0;
    const width = Math.min(canvas.width - 32, Math.max(160, Math.max(titleWidth, subtitleWidth) + 40));
    const x = (canvas.width - width) / 2;

    const fill = ctx.createLinearGradient(x, y, x + width, y + height);
    fill.addColorStop(0, palette.start);
    fill.addColorStop(1, palette.end);
    ctx.shadowBlur = 18;
    ctx.shadowColor = palette.glow;
    roundedRectPath(x, y, width, height, 18);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    roundedRectPath(x, y, width, height, 18);
    ctx.clip();
    const sweepX = ((Math.sin(now * 0.0052) + 1) / 2) * (width + 46) - 46;
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.fillRect(x + sweepX, y - 6, 24, height + 12);
    ctx.restore();

    ctx.shadowBlur = 0;
    ctx.fillStyle = palette.title;
    ctx.font = 'bold 18px Arial';
    ctx.fillText(title, canvas.width / 2, y + (subtitle ? 20 : 24));
    if (subtitle) {
      ctx.fillStyle = palette.subtitle;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(subtitle, canvas.width / 2, y + 36);
    }
    ctx.restore();
  }

  function drawCountdownBackdrop(countdownState, now) {
    if (!countdownState) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const pulse = countdownState.go
      ? 0.98 + Math.sin(now * 0.02) * 0.06
      : 0.92 + Math.sin(now * 0.014 + countdownState.phase * 5) * 0.05;
    const baseRadius = Math.min(canvas.width, canvas.height) * (countdownState.go ? 0.19 : 0.23) * pulse;
    const coreColor = countdownState.go ? 'rgba(125, 255, 178, 0.3)' : 'rgba(255, 244, 196, 0.26)';
    const ringColor = countdownState.go ? 'rgba(125, 255, 178, 0.84)' : 'rgba(255, 228, 140, 0.78)';
    const sparkColor = countdownState.go ? 'rgba(222,255,233,0.96)' : 'rgba(255,251,225,0.94)';

    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';

    const glow = ctx.createRadialGradient(0, 0, baseRadius * 0.18, 0, 0, baseRadius * 1.04);
    glow.addColorStop(0, coreColor);
    glow.addColorStop(0.55, countdownState.go ? 'rgba(84, 216, 144, 0.16)' : 'rgba(255, 214, 110, 0.14)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.78, -Math.PI / 2 + now * 0.005, Math.PI * 0.95 + now * 0.005);
    ctx.stroke();

    ctx.globalAlpha = 0.42;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.96, Math.PI / 2 - now * 0.0035, Math.PI * 1.82 - now * 0.0035);
    ctx.stroke();

    ctx.fillStyle = sparkColor;
    for (let index = 0; index < 6; index += 1) {
      const angle = now * 0.0036 + (index / 6) * Math.PI * 2;
      const orbit = baseRadius * (0.88 + (index % 2) * 0.12);
      const sparkX = Math.cos(angle) * orbit;
      const sparkY = Math.sin(angle) * orbit * 0.88;
      ctx.globalAlpha = 0.86 - index * 0.08;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 3.4 - index * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawPauseBadge(now) {
    const width = 224;
    const height = 92;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2 - 8;
    const bob = Math.sin(now * 0.0085) * 3;

    ctx.save();
    const fill = ctx.createLinearGradient(x, y, x + width, y + height);
    fill.addColorStop(0, 'rgba(15, 22, 36, 0.92)');
    fill.addColorStop(1, 'rgba(31, 44, 70, 0.9)');
    roundedRectPath(x, y, width, height, 24);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = 'rgba(158, 219, 255, 0.28)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    roundedRectPath(x, y, width, height, 24);
    ctx.clip();
    const sweepX = ((Math.sin(now * 0.0045) + 1) / 2) * (width + 52) - 52;
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.fillRect(x + sweepX, y - 8, 24, height + 16);
    ctx.restore();

    ctx.fillStyle = '#f8fbff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px Arial';
    ctx.fillText('PAUSE', canvas.width / 2, y + 28 + bob * 0.2);
    ctx.font = 'bold 42px Arial';
    ctx.fillText('Paused', canvas.width / 2, y + 63 + bob);
    ctx.restore();
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
    ctx.restore();
  }

  function drawSnakeTrail(progress) {
    if (!snake.length || progress >= 1) return;
    const palette = getSnakePalette();
    const fx = getSkinTierFxProfile();
    const premiumTrail = fx ? (tierOrderMap[fx.slug] ?? 0) : 0;
    ctx.save();

    for (let index = Math.min(currentGridSize() >= 15 ? 3 : 4 + Math.min(2, Math.floor(premiumTrail / 4)), snake.length - 1); index >= 0; index -= 1) {
      const seg = snake[index];
      const previous = prevSnake[index] || seg;
      if (!seg || (previous.x === seg.x && previous.y === seg.y)) continue;

      const ghostProgress = Math.max(0, progress * 0.58 - index * 0.05);
      const ghostX = lerp(previous.x, seg.x, ghostProgress);
      const ghostY = lerp(previous.y, seg.y, ghostProgress);
      const alphaBoost = fx ? 0.06 + premiumTrail * 0.006 : 0;
      const alpha = Math.max(0.04, 0.18 + alphaBoost - index * 0.024) * (1 - progress * 0.4);
      const trailColor = fx && index === 0
        ? fx.colors[Math.min(fx.colors.length - 1, Math.floor((progress * 10) % fx.colors.length))]
        : (index === 0 ? palette.head : palette.accent);

      ctx.globalAlpha = alpha;
      drawRoundedCell(
        ghostX,
        ghostY,
        trailColor,
        Math.max(8, currentCellSize() * 0.24),
        Math.max(0.44, 0.68 + alphaBoost - index * 0.04),
        palette.glow
      );
    }

    ctx.restore();
  }

  function traceSnakeRibbonPath(points) {
    if (!points.length) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    if (points.length === 1) return;

    for (let index = 1; index < points.length - 1; index += 1) {
      const point = points[index];
      const next = points[index + 1];
      const midpointX = (point.x + next.x) / 2;
      const midpointY = (point.y + next.y) / 2;
      ctx.quadraticCurveTo(point.x, point.y, midpointX, midpointY);
    }

    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
  }

  function drawTierBodyRibbon(progress, now = performance.now()) {
    const profile = getTierRibbonProfile();
    if (!profile || snake.length < 2) return;
    const fxQuality = getVisualFxQuality();
    if (fxQuality === 0 && snake.length > 10) return;

    const size = currentCellSize();
    const points = snake.map((seg, index) => {
      const animated = getAnimatedSegment(index, progress) || seg;
      return {
        x: (animated.x + 0.5) * size,
        y: (animated.y + 0.5) * size
      };
    });

    const tail = points[points.length - 1];
    const head = points[0];
    const ribbonGradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    const stops = profile.colors;
    stops.forEach((color, index) => {
      ribbonGradient.addColorStop(stops.length === 1 ? 0 : index / (stops.length - 1), color);
    });

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = Math.max(8, size * profile.shadowBlur * (fxQuality === 1 ? 0.76 : 1));
    ctx.shadowColor = profile.glow;
    ctx.globalAlpha = (profile.outerAlpha + Math.sin(now * profile.pulseSpeed) * 0.05) * (fxQuality === 1 ? 0.82 : 1);
    ctx.strokeStyle = ribbonGradient;
    ctx.lineWidth = Math.max(5, size * profile.outerWidth);
    traceSnakeRibbonPath(points);
    ctx.stroke();

    if (fxQuality > 0) {
      ctx.shadowBlur = Math.max(6, size * profile.shadowBlur * 0.48);
      ctx.globalAlpha = profile.innerAlpha * (fxQuality === 1 ? 0.88 : 1);
      ctx.strokeStyle = profile.coreColor;
      ctx.lineWidth = Math.max(2.4, size * profile.innerWidth);
      traceSnakeRibbonPath(points);
      ctx.stroke();
    }

    if (fxQuality > 0) {
      const nodeStep = (snake.length > 18 ? profile.nodeStep + 1 : profile.nodeStep) + (fxQuality === 1 ? 1 : 0);
      for (let index = 0; index < points.length; index += nodeStep) {
        const point = points[index];
        const angle = now * 0.0032 + index * 0.78;
        const orbitRadius = size * profile.nodeRadius * (0.78 + Math.sin(now * 0.0024 + index) * 0.18);
        const nodeSize = Math.max(1.8, size * profile.nodeSize);

        ctx.globalAlpha = Math.max(0.12, profile.nodeAlpha - index * 0.02);
        ctx.fillStyle = index % 2 === 0 ? profile.colors[index % profile.colors.length] : profile.coreColor;
        ctx.beginPath();
        ctx.arc(
          point.x + Math.cos(angle) * orbitRadius,
          point.y + Math.sin(angle) * orbitRadius,
          nodeSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawFloatingTexts() {
    floatingTexts = floatingTexts.filter(item => {
      item.y += item.vy;
      item.life -= 1;

      const alpha = Math.max(0, item.life / item.maxLife);
      const scale = 0.96 + (1 - alpha) * 0.16 + (item.scale - 1) * 0.28;

      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = item.color;
      ctx.shadowBlur = 16;
      ctx.shadowColor = item.glow;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.text, 0, 0);
      ctx.restore();

      return item.life > 0;
    });
  }

  function drawParticles(now = performance.now()) {
    particles = particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= particle.drag ?? 1;
      particle.vy *= particle.drag ?? 1;
      particle.rotation = (particle.rotation || 0) + (particle.spinSpeed || 0);
      particle.life -= 1;

      const maxLife = Math.max(1, particle.maxLife || particle.life || 1);
      const lifeRatio = Math.max(0, particle.life / maxLife);
      const twinkle = particle.twinkle
        ? 0.72 + Math.sin(now * particle.twinkle + (particle.rotation || 0) * 12) * 0.28
        : 1;
      const drawRadius = Math.max(0.35, particle.radius * (0.45 + lifeRatio * 0.55));

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation || 0);
      ctx.globalAlpha = Math.max(0, (particle.alpha ?? 1) * lifeRatio * twinkle);
      ctx.fillStyle = particle.color;
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = particle.lineWidth || 1.4;

      if (particle.shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(0, -drawRadius);
        ctx.lineTo(drawRadius, 0);
        ctx.lineTo(0, drawRadius);
        ctx.lineTo(-drawRadius, 0);
        ctx.closePath();
        ctx.fill();
      } else if (particle.shape === 'ring') {
        ctx.beginPath();
        ctx.arc(0, 0, drawRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (particle.shape === 'shard') {
        ctx.beginPath();
        ctx.moveTo(0, -drawRadius * 1.4);
        ctx.lineTo(drawRadius * 0.7, drawRadius * 0.2);
        ctx.lineTo(0, drawRadius * 1.2);
        ctx.lineTo(-drawRadius * 0.7, drawRadius * 0.2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, drawRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return particle.life > 0;
    });
  }

  function drawSkinTierAura(head, now = performance.now()) {
    const fx = getSkinTierFxProfile();
    if (!fx || !head) return;

    const size = currentCellSize();
    const fxQuality = getVisualFxQuality();
    const cx = (head.x + 0.5) * size;
    const cy = (head.y + 0.5) * size;
    const pulse = Math.sin(now * 0.006);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    if (fxQuality === 0) {
      const arcRadius = size * (fx.slug === 'snakeifying' ? 0.5 : fx.slug === 'cosmic' ? 0.46 : 0.4);
      ctx.globalAlpha = 0.5 + pulse * 0.04;
      ctx.strokeStyle = fx.colors?.[0] || 'rgba(255,255,255,0.72)';
      ctx.lineWidth = fx.slug === 'snakeifying' ? 2.4 : 1.9;
      ctx.beginPath();
      ctx.arc(cx, cy, arcRadius, now * 0.0022, now * 0.0022 + Math.PI * 1.56);
      ctx.stroke();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = fx.colors?.[1] || 'rgba(255,255,255,0.38)';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const liteTierFx = fxQuality === 1;

    if (fx.slug === 'mythic') {
      const outer = size * 0.62 + pulse * size * 0.05;
      const fill = ctx.createRadialGradient(cx, cy, size * 0.08, cx, cy, outer);
      fill.addColorStop(0, 'rgba(255, 248, 214, 0.28)');
      fill.addColorStop(0.34, 'rgba(255, 211, 105, 0.2)');
      fill.addColorStop(0.72, 'rgba(255, 164, 74, 0.08)');
      fill.addColorStop(1, 'rgba(255, 164, 74, 0)');
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(cx, cy);
      const rayCount = liteTierFx ? 4 : 6;
      for (let ray = 0; ray < rayCount; ray += 1) {
        ctx.save();
        ctx.rotate(now * 0.001 + ray * (Math.PI * 2 / rayCount));
        ctx.strokeStyle = ray % 2 === 0 ? 'rgba(255, 211, 105, 0.38)' : 'rgba(255, 245, 196, 0.26)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(size * 0.18, 0);
        ctx.lineTo(size * 0.44, 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = 'rgba(255, 211, 105, 0.52)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.38, now * 0.0021, now * 0.0021 + Math.PI * 1.55);
      ctx.stroke();
    } else if (fx.slug === 'divine') {
      const haloY = cy - size * 0.44;
      const isAngelic = fx.variant === 'angelic';
      ctx.strokeStyle = isAngelic ? 'rgba(255, 244, 191, 0.72)' : 'rgba(124, 248, 255, 0.52)';
      ctx.lineWidth = isAngelic ? 2.4 : 2;
      ctx.beginPath();
      ctx.ellipse(cx, haloY, size * (isAngelic ? 0.28 : 0.22), size * (isAngelic ? 0.105 : 0.085), 0, 0, Math.PI * 2);
      ctx.stroke();
      if (isAngelic) {
        ctx.strokeStyle = 'rgba(124, 248, 255, 0.36)';
        ctx.beginPath();
        ctx.ellipse(cx, haloY, size * 0.18, size * 0.07, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const beam = ctx.createLinearGradient(cx, cy - size * 0.92, cx, cy + size * 0.2);
      beam.addColorStop(0, 'rgba(225,255,255,0)');
      beam.addColorStop(0.28, isAngelic ? 'rgba(255,244,191,0.16)' : 'rgba(124,248,255,0.16)');
      beam.addColorStop(0.62, isAngelic ? 'rgba(124,248,255,0.22)' : 'rgba(124,248,255,0.12)');
      beam.addColorStop(1, 'rgba(124,248,255,0)');
      ctx.fillStyle = beam;
      ctx.fillRect(cx - size * (isAngelic ? 0.14 : 0.1), cy - size * 0.9, size * (isAngelic ? 0.28 : 0.2), size * 1.14);

      if (isAngelic) {
        ctx.fillStyle = 'rgba(255,255,255,0.26)';
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.16, cy - size * 0.1);
        ctx.quadraticCurveTo(cx - size * 0.52, cy - size * 0.28, cx - size * 0.42, cy + size * 0.14);
        ctx.quadraticCurveTo(cx - size * 0.22, cy + size * 0.08, cx - size * 0.05, cy + size * 0.02);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + size * 0.16, cy - size * 0.1);
        ctx.quadraticCurveTo(cx + size * 0.52, cy - size * 0.28, cx + size * 0.42, cy + size * 0.14);
        ctx.quadraticCurveTo(cx + size * 0.22, cy + size * 0.08, cx + size * 0.05, cy + size * 0.02);
        ctx.closePath();
        ctx.fill();
      }
    } else if (fx.slug === 'cosmic') {
      const isNebula = fx.variant === 'nebula';
      const cosmicFill = ctx.createRadialGradient(cx, cy, size * 0.08, cx, cy, size * 0.78);
      cosmicFill.addColorStop(0, isNebula ? 'rgba(255, 104, 214, 0.16)' : 'rgba(255,255,255,0.08)');
      cosmicFill.addColorStop(0.34, isNebula ? 'rgba(143, 156, 255, 0.14)' : 'rgba(143, 156, 255, 0.14)');
      cosmicFill.addColorStop(0.66, isNebula ? 'rgba(88, 247, 232, 0.12)' : 'rgba(88, 247, 232, 0.1)');
      cosmicFill.addColorStop(1, 'rgba(88, 247, 232, 0)');
      ctx.fillStyle = cosmicFill;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.78, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(cx, cy);
      ctx.strokeStyle = isNebula ? 'rgba(255, 104, 214, 0.42)' : 'rgba(143, 156, 255, 0.46)';
      ctx.lineWidth = 1.9;
      ctx.rotate(now * 0.0005);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.44, size * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(-now * 0.0011);
      ctx.strokeStyle = 'rgba(88, 247, 232, 0.34)';
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.26, size * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (!liteTierFx) {
        ctx.rotate(now * 0.0016);
        ctx.strokeStyle = 'rgba(255,255,255,0.24)';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.36, size * 0.36, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (isNebula) {
        ctx.fillStyle = 'rgba(255, 104, 214, 0.18)';
        ctx.beginPath();
        ctx.ellipse(-size * 0.12, size * 0.06, size * 0.3, size * 0.16, -0.3, 0, Math.PI * 2);
        ctx.fill();
        if (!liteTierFx) {
          ctx.beginPath();
          ctx.ellipse(size * 0.16, -size * 0.04, size * 0.24, size * 0.12, 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(size * 0.3, -size * 0.04, 2.2, 0, Math.PI * 2);
      ctx.arc(-size * 0.18, size * 0.31, 1.7, 0, Math.PI * 2);
      if (!liteTierFx) {
        ctx.arc(size * 0.02, -size * 0.34, 1.5, 0, Math.PI * 2);
        ctx.arc(-size * 0.3, -size * 0.18, 1.3, 0, Math.PI * 2);
      }
      ctx.fill();
    } else if (fx.slug === 'ascendant') {
      const beam = ctx.createLinearGradient(cx, cy - size * 1.02, cx, cy + size * 0.16);
      beam.addColorStop(0, 'rgba(255, 255, 240, 0)');
      beam.addColorStop(0.28, 'rgba(255, 224, 138, 0.22)');
      beam.addColorStop(0.62, 'rgba(255, 160, 90, 0.14)');
      beam.addColorStop(1, 'rgba(255, 160, 90, 0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.96);
      ctx.lineTo(cx + size * 0.28, cy + size * 0.08);
      ctx.lineTo(cx - size * 0.28, cy + size * 0.08);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 249, 214, 0.62)';
      ctx.lineWidth = 1.9;
      for (let shard = -1; shard <= 1; shard += 1) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - size * 0.74);
        ctx.lineTo(cx + shard * size * 0.16, cy - size * 0.12);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.24, cy - size * 0.46);
      ctx.lineTo(cx + size * 0.24, cy - size * 0.46);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 224, 138, 0.34)';
      ctx.beginPath();
      ctx.arc(cx, cy - size * 0.22, size * 0.28, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else if (fx.slug === 'snakeifying') {
      const isBlackhole = fx.variant === 'blackhole';
      const isNebula = fx.variant === 'nebula';
      const fill = ctx.createRadialGradient(cx, cy, size * 0.04, cx, cy, size * (isBlackhole ? 0.84 : 0.76));
      fill.addColorStop(0, isBlackhole ? 'rgba(0, 0, 0, 0.72)' : 'rgba(0, 0, 0, 0.6)');
      fill.addColorStop(0.16, isBlackhole ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.48)');
      fill.addColorStop(0.34, isNebula ? 'rgba(255, 104, 214, 0.18)' : 'rgba(127, 92, 255, 0.24)');
      fill.addColorStop(0.54, 'rgba(88, 247, 232, 0.14)');
      fill.addColorStop(0.7, 'rgba(255, 139, 224, 0.12)');
      fill.addColorStop(1, 'rgba(255, 139, 224, 0)');
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(cx, cy, size * (isBlackhole ? 0.84 : 0.76), 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(cx, cy);
      ctx.strokeStyle = isBlackhole ? 'rgba(255, 139, 224, 0.62)' : 'rgba(255, 139, 224, 0.54)';
      ctx.lineWidth = isBlackhole ? 2.5 : 2.3;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.42, now * 0.0028, now * 0.0028 + Math.PI * 1.52);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(127, 92, 255, 0.46)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, -now * 0.0034, -now * 0.0034 + Math.PI * 1.42);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(88, 247, 232, 0.24)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.58, now * 0.0018, now * 0.0018 + Math.PI * 1.18);
      ctx.stroke();
      if (isBlackhole) {
        ctx.fillStyle = 'rgba(0,0,0,0.66)';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.16, 0, Math.PI * 2);
        ctx.fill();
      }
      if (isNebula) {
        ctx.fillStyle = 'rgba(255, 104, 214, 0.16)';
        ctx.beginPath();
        ctx.ellipse(-size * 0.12, size * 0.08, size * 0.32, size * 0.16, 0.22, 0, Math.PI * 2);
        ctx.fill();
        if (!liteTierFx) {
          ctx.beginPath();
          ctx.ellipse(size * 0.16, -size * 0.1, size * 0.26, size * 0.12, -0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (let spiral = 0; spiral < (liteTierFx ? 2 : 4); spiral += 1) {
        ctx.beginPath();
        const start = now * 0.0021 + spiral * (Math.PI * 0.5);
        ctx.moveTo(Math.cos(start) * size * 0.16, Math.sin(start) * size * 0.16);
        ctx.lineTo(Math.cos(start + 0.34) * size * 0.34, Math.sin(start + 0.34) * size * 0.34);
        ctx.lineTo(Math.cos(start + 0.68) * size * 0.52, Math.sin(start + 0.68) * size * 0.52);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(Math.cos(now * 0.0025) * size * 0.34, Math.sin(now * 0.0025) * size * 0.34, 2, 0, Math.PI * 2);
      if (!liteTierFx) {
        ctx.arc(Math.cos(-now * 0.0021 + 1.8) * size * 0.48, Math.sin(-now * 0.0021 + 1.8) * size * 0.48, 1.6, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    ctx.restore();
  }

  function emitSkinTierAmbientParticles(head, now = performance.now()) {
    const fx = getSkinTierFxProfile();
    if (!fx || !head || now < nextSkinAmbientParticleAt) return;
    const fxQuality = getVisualFxQuality();
    const intervalScale = fxQuality === 0 ? 2.3 : fxQuality === 1 ? 1.45 : 1;

    nextSkinAmbientParticleAt = now + (fx.interval * intervalScale);
    const size = currentCellSize();
    const anchors = [head];
    if (fxQuality > 0 && snake.length > 5) anchors.push(snake[Math.max(1, Math.floor(snake.length * 0.45))]);
    if (fxQuality > 1 && snake.length > 10 && currentGridSize() <= 12) anchors.push(snake[snake.length - 1]);

    const burstBudget = fxQuality === 0 ? 1 : fxQuality === 1 ? Math.max(1, fx.burst - 2) : fx.burst;
    const bursts = Math.min(anchors.length, burstBudget);
    for (let index = 0; index < bursts; index += 1) {
      const anchor = anchors[index];
      const angle = Math.random() * Math.PI * 2;
      const speed = fx.speed * (0.45 + Math.random() * 0.75);
      const life = fx.lifeMin + Math.random() * (fx.lifeMax - fx.lifeMin);
      const radius = fx.radiusMin + Math.random() * (fx.radiusMax - fx.radiusMin);
      const color = fx.colors[randomBetween(0, fx.colors.length - 1)];
      const shape = fx.shapes[randomBetween(0, fx.shapes.length - 1)];

      pushParticle({
        x: (anchor.x + 0.5) * size + (Math.random() - 0.5) * size * fx.spread,
        y: (anchor.y + 0.5) * size + (Math.random() - 0.5) * size * fx.spread,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + fx.trailLift,
        life,
        radius,
        color,
        shape,
        alpha: fx.alpha,
        lineWidth: fx.lineWidth,
        rotation: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.22,
        drag: fx.drag,
        twinkle: fx.twinkle
      });
    }
  }

  function currentPaceLabel() {
    const stepsPerSecond = Math.max(1, Math.round(1000 / Math.max(1, tickMs)));
    let mood = 'Chill';
    if (stepsPerSecond >= 10) mood = 'Wild';
    else if (stepsPerSecond >= 8) mood = 'Zippy';
    else if (stepsPerSecond >= 7) mood = 'Cruise';
    return `${mood} ${stepsPerSecond}/s`;
  }

  function draw(now = performance.now()) {
    try {
      const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
      const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
      ctx.fillStyle = '#121b2d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(shakeX, shakeY);

      ensureBoardCache();
      if (boardCache) ctx.drawImage(boardCache, 0, 0);
      else {
        ctx.fillStyle = '#121b2d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      drawAmbientBoardEffects(now);

      obstacles.forEach(ob => drawRoundedCell(ob.x, ob.y, '#6d768a', 6, 0.96));
      bonusApples.forEach(item => {
        drawPickupAura(item, now, {
          core: 'rgba(172, 229, 93, 0.24)',
          mid: 'rgba(240, 255, 176, 0.14)',
          ring: 'rgba(239, 255, 190, 0.6)',
          spark: 'rgba(255,255,230,0.94)',
          radius: 0.56,
          sparkles: 2
        });
        drawPear(item, now);
      });
      if (food) {
        drawPickupAura(food, now, {
          core: 'rgba(255, 110, 96, 0.24)',
          mid: 'rgba(255, 196, 170, 0.14)',
          ring: 'rgba(255, 231, 214, 0.66)',
          spark: 'rgba(255,247,236,0.96)',
          radius: 0.58,
          sparkles: 3
        });
        drawApple(food, now);
      }
      if (healOrb) {
        drawPickupAura(healOrb, now, {
          core: 'rgba(143,255,208,0.28)',
          mid: 'rgba(206,255,241,0.16)',
          ring: 'rgba(210,255,240,0.74)',
          spark: 'rgba(255,255,255,0.92)',
          radius: 0.52,
          sparkles: 2
        });
        drawRoundedCell(healOrb.x, healOrb.y, '#8fffd0', 12, 0.9 + Math.sin(now * 0.012) * 0.07, 'rgba(143,255,208,0.2)');
      }
      if (altar) {
        drawPickupAura(altar, now, {
          core: 'rgba(255,246,176,0.26)',
          mid: 'rgba(255,255,216,0.16)',
          ring: 'rgba(255,247,204,0.72)',
          spark: 'rgba(255,255,255,0.92)',
          radius: 0.6,
          sparkles: 3
        });
        drawRoundedCell(altar.x, altar.y, '#fff6b0', 10, 0.88 + Math.sin(now * 0.015) * 0.06, 'rgba(255,245,180,0.28)');
      }

      angels.forEach(enemy => drawAngelEnemy(enemy, 'angel', now));
      generalAngels.forEach(enemy => drawAngelEnemy(enemy, 'general', now));

      const animProgress = (currentScreen === 'game' && !gameOver && !paused && !isCountdownActive(now))
        ? Math.min(1, accumulator / Math.max(1, tickMs))
        : 1;

      if (snake.length) {
        drawSnakeTrail(animProgress);
        drawTierBodyRibbon(animProgress, now);
        for (let index = snake.length - 1; index >= 1; index -= 1) {
          const seg = snake[index];
          const animated = getAnimatedSegment(index, animProgress) || seg;
          drawSnakeSegment(seg, index, now, animated.x, animated.y);
        }

        const headAnimated = getAnimatedSegment(0, animProgress) || snake[0];
        drawComboAura(headAnimated, now);
        drawSkinTierAura(headAnimated, now);
        drawHead(snake[0], now, headAnimated.x, headAnimated.y);
        if (!paused && !gameOver && !isCountdownActive(now)) emitSkinTierAmbientParticles(headAnimated, now);

        const palette = getSnakePalette();
        const size = currentCellSize();
        ctx.fillStyle = palette.label;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(playerName, headAnimated.x * size + size / 2, Math.max(12, headAnimated.y * size - 8));

        if (jackpotMode) {
          if (now >= jackpotHud.nextRollAt) {
            jackpotHud.mode = Math.random() < 0.5 ? 'XP' : '%XP';
            jackpotHud.nextRollAt = now + 5000;
          }
          if (Math.random() < 0.18) {
            const tail = snake[snake.length - 1];
            if (tail) emitParticles(tail.x, tail.y, 2, ['rgba(255,213,79,0.95)', 'rgba(118,255,216,0.92)', 'rgba(255,79,163,0.88)']);
          }
        }
      }

      skyBeams.forEach(beam => {
        const size = currentCellSize();
        ctx.fillStyle = beam.warning > 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,236,130,0.32)';
        ctx.fillRect(beam.x * size, 0, size, canvas.height);
      });

      projectiles.forEach(projectile => {
        const size = currentCellSize();
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x * size, projectile.y * size, Math.max(3, size * 0.12), 0, Math.PI * 2);
        ctx.fill();
      });

      trackingLasers.forEach(laser => {
        const size = currentCellSize();
        ctx.strokeStyle = 'rgba(255,248,180,0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo((laser.x - laser.vx * 4) * size, (laser.y - laser.vy * 4) * size);
        ctx.lineTo(laser.x * size, laser.y * size);
        ctx.stroke();
        ctx.fillStyle = '#fff3b0';
        ctx.beginPath();
        ctx.arc(laser.x * size, laser.y * size, Math.max(4, size * 0.14), 0, Math.PI * 2);
        ctx.fill();
      });

      grenades.forEach(grenade => {
        const size = currentCellSize();
        const alpha = grenade.exploding > 0 ? 0.34 : 0.16 + Math.sin(now * 0.02) * 0.05;
        ctx.fillStyle = `rgba(255, 70, 70, ${alpha})`;
        ctx.fillRect((grenade.x - 1) * size, (grenade.y - 1) * size, size * 3, size * 3);
      });

      activePortals = activePortals.filter(portal => now < portal.start + portal.duration);
      activePortals.forEach(portal => drawPortal(portal, now));

      if (boss?.active) {
        drawBossAvatar(now);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(16, 12, canvas.width - 32, 16);
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(16, 12, ((canvas.width - 32) * boss.hp) / boss.maxHp, 16);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${boss.name} ${boss.hp}/${boss.maxHp}`, canvas.width / 2, 24);
      }

      if (jackpotMode) {
        drawJackpotHud(now);
      }

      drawParticles(now);
      drawFloatingTexts();

      drawComboBanner(now);

      if (angelRealm || (jackpotMode && !isMainRunMode())) {
        ctx.fillStyle = 'rgba(0,0,0,0.34)';
        ctx.fillRect(0, canvas.height - 26, canvas.width, 26);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`HP ${formatHealthValue(playerHealth)}/${formatHealthValue(maxHealth)}   XP ${xp}   Lv ${xpLevel}`, 10, canvas.height - 9);
      }

      drawRealmBanner(now);
      drawStageBanner(now);

      const countdownState = getCountdownState(now);
      if (countdownState) {
        ctx.fillStyle = 'rgba(4, 8, 18, 0.42)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawCountdownBackdrop(countdownState, now);
        ctx.fillStyle = countdownState.go ? '#7dffb2' : '#fff4c4';
        ctx.shadowBlur = countdownState.go ? 26 : 22;
        ctx.shadowColor = countdownState.go ? 'rgba(125,255,178,0.34)' : 'rgba(255,228,140,0.32)';
        const countdownScale = countdownState.go
          ? 1 + Math.sin(now * 0.022) * 0.04
          : 1 + Math.sin(now * 0.014 + countdownState.phase * 8) * 0.03;
        ctx.font = `bold ${Math.round((countdownState.go ? 72 : 90) * countdownScale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(countdownState.text, canvas.width / 2, canvas.height / 2 + 24);
        ctx.shadowBlur = 0;
      } else if (paused && !gameOver) {
        ctx.fillStyle = 'rgba(4, 8, 18, 0.34)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawPauseBadge(now);
      } else if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.restore();

      if (screenFlashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = screenFlashAlpha;
        ctx.fillStyle = screenFlashColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    } catch (e) {
      console.error('Draw error:', e);
      ctx.restore();
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function updateHud() {
    const tags = [];
    if (angelRealm) tags.push('angel realm');
    if (boss?.active) tags.push('boss');
    if (jackpotMode) tags.push('jackpot');
    if (leaderboardAbuseMode) tags.push('lb override perm');
    else if (leaderboardOverrideCharges > 0) tags.push(`lb override x${leaderboardOverrideCharges}`);
    if (leaderboardDisqualifyingCheatUsed) tags.push('lb blocked');
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
    setHudValue(levelEl, level, true);
    setHudValue(roundEl, round, true);
    setHudValue(paceEl, currentPaceLabel(), true);
    if (scoreEl) scoreEl.textContent = formatCount(score);
    if (bestScoreEl) bestScoreEl.textContent = formatCount(bestScore);
    if (coinsEl) coinsEl.textContent = formatCount(coins);
    const healthText = `${formatHealthValue(playerHealth)}/${formatHealthValue(maxHealth)}`;
    if (healthEl) healthEl.textContent = healthText;
    if (bottomHealthEl) bottomHealthEl.textContent = healthText;
    if (healthPillEl) healthPillEl.classList.toggle('hidden', !isMainRunMode());
    if (healthPillEl && currentScreen === 'game' && isMainRunMode()) {
      const currentHealthValue = roundHealthValue(playerHealth);
      if (lastHudHealthValue != null) {
        if (currentHealthValue > lastHudHealthValue) {
          triggerClassAnimation(healthPillEl, 'is-healing', 760);
        } else if (currentHealthValue < lastHudHealthValue) {
          triggerClassAnimation(healthPillEl, 'is-damaged', 760);
        }
      }
      healthPillEl.classList.toggle('is-critical', currentHealthValue <= Math.max(2, maxHealth * 0.35) && !gameOver);
      lastHudHealthValue = currentHealthValue;
    } else if (healthPillEl) {
      healthPillEl.classList.remove('is-critical');
      lastHudHealthValue = null;
    }
    if (comboEl) comboEl.textContent = comboCount > 1 ? `x${comboCount}` : 'x1';
    if (mapSizeEl) {
      const size = currentGridSize();
      mapSizeEl.textContent = `${size}x${size}`;
    }
    if (levelCapEl) levelCapEl.textContent = Number.isFinite(currentMaxLevels()) ? String(currentMaxLevels()) : '∞';
    if (roundCapEl) roundCapEl.textContent = String(currentMaxRounds());
    if (xpEl) xpEl.textContent = angelRealm ? `${xp} • Lv ${xpLevel}` : '';
    if (statusEl) statusEl.textContent = tags.join(' + ');
    if (gameFrameEl) {
      gameFrameEl.classList.toggle('combo-live', currentScreen === 'game' && comboCount > 1 && !gameOver);
      gameFrameEl.classList.toggle('combo-supernova', currentScreen === 'game' && comboCount >= 6 && !gameOver);
    }
    if (pauseBtn) {
      pauseBtn.textContent = paused && !blessingSelectionOpen ? 'Resume' : 'Pause';
      pauseBtn.disabled = blessingSelectionOpen || gameOver || isCountdownActive();
    }
    if (realmXpWrap) {
      const inCheatRoom = window.location.hash === '#cheats';
      const showRealmXp = currentScreen === 'game' && !inCheatRoom && angelRealm && !gameOver;
      realmXpWrap.classList.toggle('hidden', !showRealmXp);
    }
    const needsFullViewRefresh = currentScreen !== 'game'
      || blessingSelectionOpen
      || gameOver
      || window.location.hash === '#cheats';
    if (needsFullViewRefresh) updateView();
  }

  function scheduleSpeedCommandParse() {
    if (pendingSpeedTimer) clearTimeout(pendingSpeedTimer);

    pendingSpeedTimer = setTimeout(() => {
      const bufferString = keyBuffer.join('');
      if (bufferString === lastProcessedSpeedBuffer) return;

      if (/(^|[^a-z])zoom\s*normal\]\]$/.test(bufferString) || /(^|[^a-z])unzoom\s*normal\]\]$/.test(bufferString)) {
        markCheatUsed();
        speedLevel = 0;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
        return;
      }

      const zoomMatch = bufferString.match(/(^|[^a-z])zoom\s*(\d+)?\]\]$/);
      const unzoomMatch = bufferString.match(/(^|[^a-z])unzoom\s*(\d+)?\]\]$/);

      if (zoomMatch) {
        markCheatUsed();
        const typedValue = zoomMatch[2] ? Number.parseInt(zoomMatch[2], 10) : 1;
        const amount = Math.max(1, typedValue || 1);
        speedLevel += amount;
        tickMs = getSpeedForState();
        lastProcessedSpeedBuffer = bufferString;
        updateHud();
      } else if (unzoomMatch) {
        markCheatUsed();
        const typedValue = unzoomMatch[2] ? Number.parseInt(unzoomMatch[2], 10) : 1;
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
    const canAdvanceStage = round < maxRoundCount || level < maxLevelCount || angelRealm;
    const flawlessClear = canAdvanceStage ? awardFlawlessRoundBonus() : false;

    if (round < maxRoundCount) {
      round += 1;
      incrementStat('roundsCleared', 1);
      updateChallengeProgress('rounds', 1);
      if (endlessMode) {
        incrementStat('endlessRoundsCleared', 1);
        updateChallengeProgress('endless', 1);
      }
      const spawnSafety = roundSpawnSafety('food');
      const obstacleSafety = roundSpawnSafety('hazard');
      obstacles = [];
      spawnFoodIfMissing(spawnSafety);
      ensureObstaclesForRound(obstacleSafety);
      spawnAngelEntities();
      resetRoundPerformance();
      if (!flawlessClear) announceCurrentStage(1700);
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
      startCountdown(2);
      triggerScreenJuice(5, 0.12, 'rgba(104, 255, 172, 0.16)');
      if (snake[0]) {
        emitParticles(snake[0].x, snake[0].y, 18, ['rgba(255,255,255,0.98)', 'rgba(104,255,172,0.92)', 'rgba(104,188,255,0.88)']);
        emitFloatingText(snake[0].x, snake[0].y, `Level ${level}`, '#baffd7', { life: 40, scale: 1.2 });
      }
      showRealmMessage(`Level ${level} • fresh board`, 1800);
      if (!flawlessClear) announceCurrentStage(2200);
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
          markBossAttack('volley', 520);
          const volleyCount = randomBetween(4, 9);
          for (let i = 0; i < volleyCount; i++) {
            fireProjectile(boss.x + (i % 3) - 1, boss.y + 1, targetX + randomBetween(-3, 3), targetY + randomBetween(-2, 2), 0.32, 1, 'rgba(255,236,120,0.95)', true);
          }
          boss.lastVolleyAt = now;
        }

        if (now - boss.lastLaserAt >= 2600) {
          markBossAttack('laser', 720);
          spawnTrackingLaser(boss.x, boss.y + 1);
          if (Math.random() < 0.5) spawnTrackingLaser(boss.x + randomBetween(-1, 1), boss.y + 1);
          boss.lastLaserAt = now;
        }

        if (now - boss.lastBeamAt >= 2200) {
          markBossAttack('beam', 760);
          const beamCount = randomBetween(1, 3);
          for (let i = 0; i < beamCount; i++) {
            spawnSkyBeam(targetX + randomBetween(-2, 2), 1);
          }
          boss.lastBeamAt = now;
        }

        if (now - boss.lastGrenadeAt >= 2800) {
          markBossAttack('grenade', 680);
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
    const bodyToCheck = ateMainFood || ateBonusApple ? snake : snake.slice(0, -1);
    const hitsSelf = bodyToCheck.some(seg => seg.x === newHead.x && seg.y === newHead.y);

    if (!invincible && hitsSelf) {
      triggerGameOver(endlessMode ? 'Endless run over' : 'Snake crash');
      return;
    }

    if (obstacleIndex !== -1) {
      obstacles.splice(obstacleIndex, 1);
      if (invincible) {
        score += 3;
      } else {
        applyDamage(currentObstacleDamage(), newHead.x, newHead.y);
        if (gameOver) {
          updateHud();
          return;
        }
      }
    }

    if (angelIndex !== -1) {
      angels.splice(angelIndex, 1);
      score += 15;
      gainXp(10);
      emitParticles(newHead.x, newHead.y, 10);
      emitFloatingText(newHead.x, newHead.y, '+15', '#ffe59f', { scale: 1.05 });
    }

    if (generalIndex !== -1) {
      generalAngels.splice(generalIndex, 1);
      score += 25;
      gainXp(16);
      emitParticles(newHead.x, newHead.y, 12, ['rgba(255,255,255,0.98)', 'rgba(255,228,120,0.95)']);
      emitFloatingText(newHead.x, newHead.y, '+25', '#fff3ba', { scale: 1.1 });
    }

    if (grabbedHeal) {
      healOrb = null;
      playerHealth = roundHealthValue(Math.min(maxHealth, playerHealth + 2 + abilities.luck));
      emitFloatingText(newHead.x, newHead.y, '+HP', '#b4ffe0');
      showRealmMessage('Holy heal', 1200);
      playUiSfx('heal');
    }

    if (hitAltar && boss?.active) {
      altar = null;
      boss.hp = Math.max(0, boss.hp - 5);
      score += 30;
      gainXp(20);
      emitParticles(newHead.x, newHead.y, 16, ['rgba(255,255,255,0.98)', 'rgba(255,235,150,0.95)']);
      emitFloatingText(newHead.x, newHead.y, 'Boss -5', '#ffeab0', { life: 38, scale: 1.15 });
      triggerScreenJuice(6, 0.12, 'rgba(255, 235, 150, 0.14)');
      playBossSfx('altar-hit');
      if (boss.hp <= 0) {
        const earnsAngelSkin = !isSkinOwned('angelskin');
        incrementStat('bossDefeats', 1);
        boss = null;
        angelRealm = false;
        projectiles = [];
        trackingLasers = [];
        skyBeams = [];
        grenades = [];
        altar = null;
        healOrb = null;
        playBossSfx('defeat');
        showRealmMessage(earnsAngelSkin ? 'Arch Angel defeated! Angel skin earned' : 'Arch Angel defeated!', 2600);
        showStageBanner('Realm Cleansed', earnsAngelSkin ? 'Angel skin unlocked' : 'Arch Angel defeated', 2600, 'perfect');
      } else {
        maybeAdvanceBossPhase();
      }
    }

    snake.unshift(newHead);

    if (ateMainFood) {
      score += 10;
      comboCount += 1;
      comboTimer = 2600;
      incrementStat('applesEaten', 1);
      updateChallengeProgress('apples', 1);
      addCoins(1 + abilities.bounty);
      emitParticles(newHead.x, newHead.y, 10, ['rgba(255,255,255,0.95)', 'rgba(255,106,82,0.92)', 'rgba(185,24,36,0.88)']);
      emitFloatingText(newHead.x, newHead.y, '+10', '#ffdba6');
      triggerScreenJuice(4, 0.08, 'rgba(255, 116, 86, 0.14)');
      const appleHeal = currentAppleHealAmount();
      if (appleHeal > 0) {
        const beforeHeal = playerHealth;
        playerHealth = roundHealthValue(Math.min(maxHealth, playerHealth + appleHeal));
        if (playerHealth > beforeHeal) {
          emitFloatingText(newHead.x, newHead.y, `+${formatHealthValue(playerHealth - beforeHeal)} HP`, '#b7ffe1', {
            life: 34,
            offsetY: 18,
            scale: 0.96
          });
        }
      }
      food = null;
      playUiSfx('bite');
      advanceProgress();
    } else if (ateBonusApple) {
      score += 6;
      comboCount += 1;
      comboTimer = 2600;
      incrementStat('bonusPearsEaten', 1);
      updateChallengeProgress('bonus', 1);
      addCoins(2 + abilities.bounty);
      bonusApples.splice(bonusIndex, 1);
      emitParticles(newHead.x, newHead.y, 9, ['rgba(255,255,255,0.95)', 'rgba(188,231,104,0.92)', 'rgba(96,168,54,0.88)']);
      emitFloatingText(newHead.x, newHead.y, '+6', '#e4ffac');
      triggerScreenJuice(3, 0.06, 'rgba(146, 214, 84, 0.12)');
      playUiSfx('bonus');
    } else {
      snake.pop();
    }

    spawnFoodIfMissing();
    updateAngelRealmThreats();
    updateHud();
  }

  function frame(now) {
    if (!lastFrameTime) lastFrameTime = now;
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    const countdownActive = isCountdownActive(now);
    renderAchievementToast(now);
    syncAudioState();
    if (screenShake > 0) screenShake = Math.max(0, screenShake - delta * 0.03);
    if (screenFlashAlpha > 0) screenFlashAlpha = Math.max(0, screenFlashAlpha - delta * 0.0011);

    if (currentScreen !== 'game' || window.location.hash === '#cheats') {
      requestAnimationFrame(frame);
      return;
    }

    if (countdownActive !== lastCountdownActive) {
      lastCountdownActive = countdownActive;
      updateHud();
    }

    if (!gameOver && currentScreen === 'game' && !paused && !countdownActive && comboTimer > 0) {
      comboTimer -= delta;
      if (comboTimer <= 0 && comboCount !== 0) {
        comboCount = 0;
        updateHud();
      }
    }

    if (!gameOver && currentScreen === 'game' && !paused && !countdownActive) {
      accumulator += delta;
      const maxStepsThisFrame = Math.max(1, getVisualFxQuality() + 1);
      let stepsThisFrame = 0;
      while (accumulator >= tickMs && stepsThisFrame < maxStepsThisFrame) {
        step();
        accumulator -= tickMs;
        stepsThisFrame += 1;
      }
      if (accumulator >= tickMs) {
        accumulator = Math.min(accumulator % tickMs, tickMs * 0.5);
      }
    }

    draw(now);
    requestAnimationFrame(frame);
  }

  document.addEventListener('keydown', (event) => {
    unlockAudio();
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
      incrementStat('cheatRoomsFound', 1);
      window.location.hash = '#cheats';
      updateView();
    }
    if (matchesCheat('god')) {
      markCheatUsed();
      invincible = true;
      updateHud();
    }
    if (matchesCheat('angel')) {
      enterAngelRealm();
    }
    if (matchesCheat('jackpot')) {
      markCheatUsed();
      jackpotMode = true;
      if (!jackpotLuckBonusActive) {
        abilities.luck += 1;
        jackpotLuckBonusActive = true;
      }
      jackpotHud.mode = 'XP';
      jackpotHud.nextRollAt = 0;
      recalcStats();
      playerHealth = maxHealth;
      showRealmMessage('Jackpot skin unlocked', 1800);
      playUiSfx('jackpot');
      updateHud();
    }

    if (matchesCheat('leaderboardabusingyes')) {
      setLeaderboardOverridePermanent(true);
    }
    if (matchesCheat('leaderboardabusingno') || matchesCheat('leaderboardingabusingno')) {
      setLeaderboardOverridePermanent(false);
    }
    if (matchesCheat('leaderboardabusing')) {
      armLeaderboardOverrideOnce();
    }
    if (matchesCheat('heal')) {
      markCheatUsed();
      playerHealth = maxHealth;
      showRealmMessage('Full heal', 1200);
      playUiSfx('heal');
      updateHud();
    }
    if (matchesCheat('clear')) {
      markCheatUsed();
      obstacles = [];
      grenades = [];
      projectiles = [];
      trackingLasers = [];
      skyBeams = [];
      showRealmMessage('Arena cleared', 1200);
      updateHud();
    }
    if (matchesCheat('smite')) {
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
    if (matchesCheat('halo')) {
      markCheatUsed();
      abilities.vigor += 1;
      abilities.reflex += 1;
      recalcStats();
      playerHealth = maxHealth;
      tickMs = getSpeedForState();
      showRealmMessage('Halo blessing', 1400);
      updateHud();
    }
    if (matchesCheat('bless')) {
      markCheatUsed();
      healOrb = randomEmptyCell();
      gainXp(15);
      showRealmMessage('Blessing dropped', 1400);
      updateHud();
    }
    if (matchesCheat('next')) {
      markCheatUsed();
      advanceProgress();
      showRealmMessage('Round skipped', 1200);
    }

    scheduleSpeedCommandParse();

    if (matchesCheat('food')) {
      markCheatUsed();
      fillWorldWithApples();
    }
    if (matchesCheat('aim') || matchesCheat('aimbot')) {
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

    if (window.location.hash !== '#cheats') {
      if (key === 'arrowup' || key === 'w') queueTurn({ x: 0, y: -1 });
      if (key === 'arrowdown' || key === 's') queueTurn({ x: 0, y: 1 });
      if (key === 'arrowleft' || key === 'a') queueTurn({ x: -1, y: 0 });
      if (key === 'arrowright' || key === 'd') queueTurn({ x: 1, y: 0 });
    }
  });

  window.addEventListener('hashchange', updateView);
  document.addEventListener('fullscreenchange', updateView);
  document.addEventListener('webkitfullscreenchange', updateView);
  backBtn.addEventListener('click', () => {
    window.location.hash = '';
    updateView();
  });
  restartBtn.addEventListener('click', () => resetGame(false, true));
  if (pauseBtn) pauseBtn.addEventListener('click', () => togglePause());
  if (homeBtn) homeBtn.addEventListener('click', returnHome);
  if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => resetGame(false, true));
  if (gameOverHomeBtn) gameOverHomeBtn.addEventListener('click', returnHome);
  if (playNormalBtn) playNormalBtn.addEventListener('click', () => startMode('normal'));
  if (playEndlessBtn) playEndlessBtn.addEventListener('click', () => startMode('endless'));
  if (changeNameBtn) changeNameBtn.addEventListener('click', () => openInfoPanel('account'));
  if (dailyRewardBtn) dailyRewardBtn.addEventListener('click', claimDailyReward);
  if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => openInfoPanel('leaderboard'));
  if (achievementsBtn) achievementsBtn.addEventListener('click', () => openInfoPanel('achievements'));
  if (statsBtn) statsBtn.addEventListener('click', () => openInfoPanel('stats'));
  if (guideBtn) guideBtn.addEventListener('click', () => openInfoPanel('guide'));
  if (spinBtn) spinBtn.addEventListener('click', () => openInfoPanel('spin'));
  if (eventsBtn) eventsBtn.addEventListener('click', () => openInfoPanel('events'));
  if (missionsBtn) missionsBtn.addEventListener('click', () => openInfoPanel('missions'));
  if (shopBtn) shopBtn.addEventListener('click', () => toggleShop(true));
  if (cheatHomeBtn) cheatHomeBtn.addEventListener('click', returnHome);
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
    if (button.dataset.action === 'rename-player') {
      changePlayerName();
      setAccountNotice(`Player name set to ${playerName}.`);
    }
    if (button.dataset.action === 'save-account') saveCurrentProfile();
    if (button.dataset.action === 'load-account') loadSavedProfile();
    if (button.dataset.action === 'open-local-web-save') openLocalWebCopyWithSave();
    if (button.dataset.action === 'copy-save-link') copyCurrentSaveLink();
    if (button.dataset.action === 'copy-save-code') copyCurrentSaveCode();
    if (button.dataset.action === 'import-save') importSavePayload();
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
  if (audioToggleBtn) audioToggleBtn.addEventListener('click', () => setAudioEnabled(!audioEnabled));
  if (gameAudioToggleBtn) gameAudioToggleBtn.addEventListener('click', () => setAudioEnabled(!audioEnabled));
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (gameFullscreenBtn) gameFullscreenBtn.addEventListener('click', toggleFullscreen);
  abilityAutoPickButtons.forEach(button => {
    button.addEventListener('click', () => {
      setAngelAutoPickChoice(button.dataset.autoBlessing);
    });
  });
  document.addEventListener('pointerdown', unlockAudio, { passive: true });
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
  maybeImportSaveFromUrl();
  maybeImportPendingLocalSync();
  renderAudioButtons();
  renderBlessingAutoPickControls();
  updateView();
  resetGame();
  window.setInterval(() => {
    if (currentScreen === 'home' && !spinAnimationState?.spinning) updateView();
  }, 1000);
  requestAnimationFrame(frame);
})();
