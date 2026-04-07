# Changelog

All notable changes to this project will be documented here.

## [0.0.10] - 2026-04-07

### Changed
- Restored the hidden-mode flow so the secret run no longer appears on the home screen, guide, cheat-room list, or locked achievement previews

## [0.0.9] - 2026-04-07

### Added
- GitHub Pages deployment workflow so pushes to `main` can publish the static game as a live site

### Changed
- Release metadata now reflects the deployment-ready build

## [0.0.8] - 2026-04-07

### Added
- More in-game synth audio cues for mode starts, shop and panel navigation, fruit pickups, unequipping, and game over
- A real unequip flow for owned skins that drops you back to `Classic` without rebuying anything

### Changed
- Shop actions now show `Unequip` for the active non-default skin instead of leaving it stuck on an equipped state
- Updated the shop copy so the equip/unequip flow is clearer at a glance

## [0.0.7] - 2026-04-06

### Added
- New ultra-premium collector skins with much higher prices, including endgame-tier vault options like `Worldeater Prime`
- Extra achievement ladders for apples, runs, endless rounds, missions, events, spins, skins, boss defeats, and total coins earned
- Animated lucky-spin wheel panel and a more dramatic featured-event card presentation
- Collector-vault summary card in the shop and a new daily `Launch Queue` challenge type for starting runs

### Changed
- Secret achievements such as `Cheats Found` and the Arch Angel boss line now keep their descriptions hidden until unlocked
- Shop prices, spotlight discounts, and skin tier labels now scale better for expensive late-game cosmetics
- Player stats and reward displays now format larger numbers more cleanly
- Skin previews now have more motion and shine so the expanded shop feels more alive

## [0.0.6] - 2026-04-06

### Added
- Achievement system with 20+ unlocks, coin rewards, an achievements panel, and unlock toasts
- New stats panel with lifetime profile totals, streak tracking, and progression overview
- Redesigned cheat room that matches the home-screen style and awards the `Cheats Found` achievement for 15 coins
- Much larger skin catalog with many new premium colorways and shop variety
- Another 30+ skins across core, rare, epic, legendary, and mythic tiers
- New snake tongue animation with randomized timing between 2 and 17 seconds
- Endless leaderboard override codes for one-time and permanent cheat-safe runs
- Another big skin drop with new premium themes like Jadefire Wyrm, Synthwave Fang, Phantom Wire, and more
- Daily shop spotlight with rotating discounted skins

### Changed
- Cheat activation now requires a hidden `]]` suffix to avoid accidental triggers, while the cheat room still shows clean code names
- Endless leaderboard override mode can now be turned on permanently and back off with dedicated cheat codes
- Improved input responsiveness so turns preview faster and the snake reacts more immediately to controls
- Updated food visuals so normal food looks like apples and the `food` cheat fills the board with pears
- Added icons to the game-over `Try Again` and `Home` buttons
- Tuned rendering for lower-latency, high-refresh gameplay and reduced hidden-screen canvas work
- Reworked the snake render with sharper head details, richer body markings, and a more expressive tail
- Expanded achievements again and added more home-screen progression content
- Secret achievements now hide their details until unlocked, and the long-run achievement ladder now stretches to 100,000 apples, 1,000 runs, and 1,000 endless rounds
- Bottom-dock notifications now clear after you open their panel instead of sticking forever

## [0.0.5] - 2026-04-06

### Added
- Full mobile-style home screen redesign with dock actions, coin bank, mode buttons, and animated presentation
- Shop overlay with unlockable snake skins and equip flow
- Info panels for leaderboard, guide, lucky spin, events, and missions
- Game-over summary overlay, fullscreen control, pause control, and touch controls for mobile play
- Coin economy, daily reward flow, lucky spin rewards, challenge tracking, and local best-score display

### Changed
- Reworked gameplay presentation into a dedicated run screen with bottom-bar stats and cleaner HUD handling
- Expanded progression systems around skins, coins, missions, events, and leaderboard state
- Refreshed the overall UI style across home and gameplay screens for a more polished arcade look

## [0.0.4] - 2026-03-31

### Added
- Home screen with `Normal play`, `Endless`, `Change name`, and `Shop — coming soon`
- Player-name display above the snake during gameplay
- Visible Jackpot skin colors, coin/energy trail, and slot-style bonus HUD

## [0.0.3] - 2026-03-31

### Changed
- Reset obstacle layouts more fairly between later rounds to avoid impossible boards
- Made obstacle hits remove the object and deal health damage instead of hard-ending the run immediately
- Improved `aim` logic to dodge active hazards better and make smarter route choices
- Prevented food from spawning in barricaded positions and cleaned up lingering boss attacks after victory

## [0.0.2] - 2026-03-31

### Changed
- Improved the `aim` cheat to dodge active attacks more intelligently when `god` mode is off
- Added portal-aware pathing so `aim` uses wrap routes to reach apples faster while in `god` mode
- Tuned the auto-navigation behavior for cleaner and safer Angel Realm movement

## [0.0.1] - 2026-03-30

### Added
- Initial `Snake 7x7` browser game setup
- Multi-level gameplay with rounds, obstacles, portals, and hidden codes
- Angel Realm mode, boss fight, health, and XP systems
- Git tracking setup with version file and changelog
