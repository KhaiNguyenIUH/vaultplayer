# Changelog

All notable changes to VaultPlayer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-30

### Added

**Core Features**

- HLS streaming support powered by hls.js
- Custom video player with modern UI controls
- Configurable storage system for progress and volume persistence
- Zero hardcoded dependencies - fully pluggable architecture

**Playback Controls**

- Play/pause with custom button styling
- Progress bar with seeking support
- Volume control with slider
- Quality selector (manual and automatic quality switching)
- Playback speed control (0.25x to 2x)
- Picture-in-Picture mode
- Theater mode for wider viewing
- Fullscreen support

**Mobile Experience**

- Touch gesture controls
- Double-tap left/right to seek ±10 seconds
- Swipe up/down (left side) for volume control
- Swipe up/down (right side) for brightness control
- Single tap to play/pause

**Keyboard Support**

- Space: Play/pause
- Arrow keys: Seek (left/right) and volume (up/down)
- F: Toggle fullscreen
- M: Toggle mute
- 0-9: Seek to percentage

**Customization**

- Theme support (dark, light, custom)
- CSS variable system for full design control
- Customizable icons (all SVGs replaceable)
- Configurable control visibility
- Event hooks (onReady, onPlay, onPause, onEnded, onTimeUpdate)

**Build & Distribution**

- ESM bundle (39.45 KB)
- UMD bundle (26.42 KB) for script tag usage
- Standalone CSS bundle (8.99 KB)
- Source maps included
- TypeScript-ready with type definitions
- Total package size: 50.3 KB compressed

### Technical Details

- Built with Vite for optimal bundling
- hls.js externalized as peer dependency
- No runtime dependencies
- Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## [Unreleased]

### Planned Features

- Additional gesture customization options
- More theme presets
- Analytics hooks
- Advanced quality selection UI

---

**Note**: This is the initial release of VaultPlayer as a standalone npm package extracted from AVVault streaming site.
