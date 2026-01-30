/**
 * VaultPlayer - Modern HLS Video Player
 * A customizable, feature-rich HTML5 video player with HLS support
 */

// Main player class
export { VideoPlayer } from './VideoPlayer.js';

// Player modules
export { KeyboardHandler } from './KeyboardHandler.js';
export { QualitySelector } from './QualitySelector.js';
export { FullscreenHandler } from './FullscreenHandler.js';
export { SpeedControl, PLAYBACK_SPEEDS } from './SpeedControl.js';
export { PictureInPicture } from './PictureInPicture.js';
export { TheaterMode } from './TheaterMode.js';
export { GestureControls } from './GestureControls.js';

// Utilities
export { formatDuration, formatDurationHuman } from './utils.js';

// Import styles
import '../styles/player.css';
