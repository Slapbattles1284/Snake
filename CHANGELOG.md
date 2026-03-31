# Changelog

All notable changes to this project will be documented here.

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
