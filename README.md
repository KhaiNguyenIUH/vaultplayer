# VaultPlayer

**Modern HLS Video Player** with custom controls, mobile gestures, and quality switching - from AVVault

## Features

- **HLS Streaming** - Powered by hls.js for adaptive bitrate streaming
- **Fully Customizable** - Themes, CSS variables, icons, and templates
- **Mobile Gestures** - Double-tap to seek, swipe for volume/brightness
- **Quality Switching** - Manual and automatic quality selection
- **Playback Speed** - 0.25x to 2x speed control
- **Picture-in-Picture** - Watch while browsing
- **Theater Mode** - Wider viewing experience
- **Keyboard Shortcuts** - Full keyboard support
- **Storage Hooks** - Optional progress/volume persistence
- **Fully Bundled** - hls.js included, no additional dependencies needed

## Installation

```bash
npm install vaultplayer
```

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/vaultplayer/dist/player.css">
</head>
<body>
  <div id="player"></div>

  <script type="module">
    import { VideoPlayer } from 'vaultplayer';
    
    const player = new VideoPlayer('#player');
    player.loadSource('https://example.com/video.m3u8');
  </script>
</body>
</html>
```

### With Storage (Remember Progress & Volume)

```javascript
import { VideoPlayer } from 'vaultplayer';

const player = new VideoPlayer('#player', {
  movieId: 'movie-123',
  storage: {
    saveProgress: (id, progress, duration) => {
      localStorage.setItem(`progress_${id}`, progress);
    },
    getProgress: (id) => {
      return Number(localStorage.setItem(`progress_${id}`)) || 0;
    },
    saveVolume: (vol) => {
      localStorage.setItem('volume', vol);
    },
    getVolume: () => {
      return Number(localStorage.getItem('volume')) || 1;
    }
  }
});

player.loadSource('https://example.com/video.m3u8');
```

## Customization

### Themes

```javascript
// Dark theme (default)
const player = new VideoPlayer('#player', {
  theme: 'dark'
});

// Light theme
const player = new VideoPlayer('#player', {
  theme: 'light'
});

// Custom theme
const player = new VideoPlayer('#player', {
  theme: 'custom',
  customTheme: {
    primary: '#6366f1',
    bg: '#000000',
    text: '#ffffff'
  }
});
```

### CSS Variables

Override any design token:

```css
:root {
  --vp-primary: #6366f1;
  --vp-bg: #000000;
  --vp-bg-controls: rgba(0, 0, 0, 0.9);
  --vp-text: #ffffff;
  --vp-control-height: 40px;
  --vp-button-size: 40px;
  --vp-progress-height: 4px;
  --vp-radius: 8px;
  --vp-transition: 0.2s ease;
}

[data-vp-theme="light"] {
  --vp-bg: #ffffff;
  --vp-text: #000000;
}
```

### Control Visibility

```javascript
const player = new VideoPlayer('#player', {
  controls: {
    play: true,
    progress: true,
    volume: true,
    quality: true,
    speed: true,
    fullscreen: true,
    pip: true,             // false to hide
    theater: true,         // false to hide
    keyboard: true,        // false to disable
    gestures: true         // false to disable mobile gestures
  }
});
```

### Custom Icons

```javascript
const player = new VideoPlayer('#player', {
  icons: {
    play: '<svg>...</svg>',
    pause: '<svg>...</svg>',
    volume: '<svg>...</svg>',
    volumeMuted: '<svg>...</svg>',
    fullscreen: '<svg>...</svg>',
    // ... all icons customizable
  }
});
```

## API Reference

### Methods

```javascript
const player = new VideoPlayer('#player');

// Playback
player.play();
player.pause();
player.togglePlay();
player.seek(timeInSeconds);
player.skip(seconds);         // +/- relative seek

// Volume
player.setVolume(0.5);        // 0-1
player.toggleMute();

// Quality
player.setQuality(levelIndex);
player.get Qualities();
player.getCurrentQuality();

// Speed
player.setSpeed(1.5);
player.getSpeed();

// View Modes
player.fullscreenHandler.toggle();
player.pip.toggle();
player.theaterMode.toggle();

// State
player.video.currentTime;
player.video.duration;
player.video.volume;
player.isPlaying;

// Cleanup
player.destroy();
```

### Events

```javascript
const player = new VideoPlayer('#player', {
  onReady: () => console.log('Player ready'),
  onPlay: () => console.log('Started playing'),
  onPause: () => console.log('Paused'),
  onEnded: () => console.log('Video ended'),
  onTimeUpdate: (currentTime, duration) => {
    console.log(`Progress: ${currentTime}/${duration}`);
  }
});
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Rewind 10s |
| `→` | Forward 10s |
| `↑` | Volume up |
| `↓` | Volume down |
| `F` | Fullscreen toggle |
| `M` | Mute toggle |
| `0-9` | Seek to 0%-90% |

## Mobile Gestures

- **Single Tap**: Play/Pause
- **Double Tap Left**: Rewind 10s
- **Double Tap Right**: Forward 10s
- **Swipe Up/Down (Left)**: Volume control
- **Swipe Up/Down (Right)**: Brightness control

## Configuration Options

```typescript
interface VideoPlayerOptions {
  // Core
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  movieId?: string;
  
  // Storage (optional)
  storage?: {
    saveProgress?: (id, progress, duration) => void;
    getProgress?: (id) => number;
    saveVolume?: (volume) => void;
    getVolume?: () => number;
  };
  
  // Customization
  theme?: 'dark' | 'light' | 'custom';
  customTheme?: object;
  controls?: object;
  icons?: object;
  
  // Behavior
  seekStep?: number;           // default: 10s
  volumeStep?: number;         // default: 0.1
  hideControlsDelay?: number;  // default: 3000ms
  
  // Events
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time, duration) => void;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

If you find VaultPlayer useful, consider supporting its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/alexer)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

Made with love by [KhaiNguyen](https://github.com/KhaiNguyenIUH)
