/**
 * HLS Video Player with custom controls
 * Refactored into modular components with enhanced features
 * @module player/VideoPlayer
 */
import Hls from 'hls.js';
import { formatDuration } from './utils.js';
import { KeyboardHandler } from './KeyboardHandler.js';
import { QualitySelector } from './QualitySelector.js';
import { FullscreenHandler } from './FullscreenHandler.js';
import { getPlayerTemplate } from './PlayerTemplate.js';
import { SpeedControl } from './SpeedControl.js';
import { PictureInPicture } from './PictureInPicture.js';
import { TheaterMode } from './TheaterMode.js';
import { GestureControls } from './GestureControls.js';

/**
 * @typedef {Object} VideoPlayerOptions
 * @property {boolean} [autoplay=false] - Autoplay on load
 * @property {string|null} [movieId=null] - Movie ID for history tracking
 * @property {function} [onReady] - Called when player is ready
 * @property {function} [onPlay] - Called on play
 * @property {function} [onPause] - Called on pause
 * @property {function} [onEnded] - Called when video ends
 * @property {function} [onTimeUpdate] - Called on time update
 * @property {Array} [qualities=[]] - Manual quality list
 */

export class VideoPlayer {
    /**
     * Create a video player
     * @param {string} containerSelector - CSS selector for container
     * @param {VideoPlayerOptions} options - Player options
     */
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('Player container not found');
            return;
        }

        this.options = {
            autoplay: false,
            movieId: null,
            onReady: () => { },
            onPlay: () => { },
            onPause: () => { },
            onEnded: () => { },
            onTimeUpdate: () => { },
            qualities: [],
            ...options
        };

        // Configurable storage with defaults
        this.storage = {
            saveProgress: () => { }, // no-op by default
            getProgress: () => 0,
            saveVolume: () => { },
            getVolume: () => 1,
            ...this.options.storage
        };

        /** @type {Hls|null} */
        this.hls = null;
        this.isPlaying = false;
        this.brightness = 1;

        this.init();
    }

    /**
     * Initialize player
     */
    init() {
        this.render();
        this.video = this.container.querySelector('video');
        this.setupModules();
        this.bindEvents();
        this.video.volume = this.storage.getVolume();
    }

    /**
     * Render player HTML
     */
    render() {
        this.container.innerHTML = getPlayerTemplate();
    }

    /**
     * Setup helper modules
     */
    setupModules() {
        const wrapper = this.container.querySelector('#playerWrapper');
        const qualityMenu = this.container.querySelector('#qualityMenu');
        const speedMenu = this.container.querySelector('#speedMenu');

        // Fullscreen handler
        this.fullscreenHandler = new FullscreenHandler(wrapper, this.video);

        // Quality selector
        this.qualitySelector = new QualitySelector(qualityMenu, (value, isNative) => {
            this.setQuality(value, isNative);
        });

        // Speed control
        this.speedControl = new SpeedControl(speedMenu, this.video, (speed) => {
            const label = this.container.querySelector('.speed-label');
            if (label) label.textContent = speed === 1 ? '1x' : speed + 'x';
        });

        // Picture-in-Picture
        this.pip = new PictureInPicture(this.video, wrapper);

        // Theater Mode
        this.theaterMode = new TheaterMode(wrapper, (isActive) => {
            const btn = this.container.querySelector('#theaterBtn');
            if (btn) btn.classList.toggle('active', isActive);
        });

        // Gesture Controls (mobile)
        this.gestureControls = new GestureControls(wrapper, {
            onSeek: (delta) => {
                // Cumulative seek feedback (actual seek happens on touch end)
            },
            onVolumeChange: (delta) => {
                const newVol = Math.max(0, Math.min(1, this.video.volume + delta));
                this.setVolume(newVol);
            },
            onBrightnessChange: (delta) => {
                this.brightness = Math.max(0.2, Math.min(1, this.brightness + delta));
                this.video.style.filter = `brightness(${this.brightness})`;
            },
            onDoubleTap: (side) => {
                const seekTime = side === 'right' ? 10 : -10;
                this.skip(seekTime);
                this.showSeekIndicator(side);
            },
            onTap: () => this.togglePlay()
        });

        // Keyboard handler with additional shortcuts
        this.keyboardHandler = new KeyboardHandler({
            togglePlay: () => this.togglePlay(),
            skip: (seconds) => this.skip(seconds),
            setVolume: (v) => this.setVolume(v),
            getVolume: () => this.video.volume,
            toggleFullscreen: () => this.fullscreenHandler.toggle(),
            toggleMute: () => this.toggleMute()
        });
    }

    /**
     * Show seek indicator for double-tap
     * @param {string} side - 'left' or 'right'
     */
    showSeekIndicator(side) {
        const indicator = this.container.querySelector(`#seek${side === 'left' ? 'Left' : 'Right'}Indicator`);
        if (indicator) {
            indicator.classList.add('visible');
            setTimeout(() => indicator.classList.remove('visible'), 500);
        }
    }

    /**
     * Bind DOM events
     */
    bindEvents() {
        const wrapper = this.container.querySelector('#playerWrapper');
        const playPauseBtn = this.container.querySelector('#playPauseBtn');
        const bigPlayBtn = this.container.querySelector('#bigPlayBtn');
        const progressBar = this.container.querySelector('#progressBar');
        const volumeBtn = this.container.querySelector('#volumeBtn');
        const volumeSlider = this.container.querySelector('#volumeSlider');
        const fullscreenBtn = this.container.querySelector('#fullscreenBtn');
        const rewindBtn = this.container.querySelector('#rewindBtn');
        const forwardBtn = this.container.querySelector('#forwardBtn');
        const pipBtn = this.container.querySelector('#pipBtn');
        const theaterBtn = this.container.querySelector('#theaterBtn');
        const speedBtn = this.container.querySelector('#speedBtn');
        const speedSelector = this.container.querySelector('#speedSelector');
        const qualityBtn = this.container.querySelector('#qualityBtn');
        const qualitySelector = this.container.querySelector('#qualitySelector');

        // Play/Pause (desktop only - mobile uses gesture)
        playPauseBtn.addEventListener('click', () => this.togglePlay());
        bigPlayBtn.addEventListener('click', () => this.togglePlay());

        // Only bind video click on desktop
        if (!('ontouchstart' in window)) {
            this.video.addEventListener('click', () => this.togglePlay());
        }

        // Video events
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());
        this.video.addEventListener('ended', () => this.onEnded());
        this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.video.addEventListener('loadedmetadata', () => this.onLoaded());
        this.video.addEventListener('waiting', () => this.showLoading(true));
        this.video.addEventListener('canplay', () => this.showLoading(false));
        this.video.addEventListener('progress', () => this.updateBuffered());

        // Progress bar
        progressBar.addEventListener('click', (e) => this.seek(e));

        // Volume
        volumeBtn.addEventListener('click', () => this.toggleMute());
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Fullscreen
        fullscreenBtn.addEventListener('click', () => this.fullscreenHandler.toggle());

        // Skip buttons
        rewindBtn.addEventListener('click', () => this.skip(-10));
        forwardBtn.addEventListener('click', () => this.skip(10));

        // PiP button
        if (pipBtn) {
            if (!this.pip.isSupported) {
                pipBtn.style.display = 'none';
            } else {
                pipBtn.addEventListener('click', () => this.pip.toggle());
            }
        }

        // Theater button
        if (theaterBtn) {
            theaterBtn.addEventListener('click', () => this.theaterMode.toggle());
        }

        // Speed menu toggle
        if (speedBtn && speedSelector) {
            speedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                speedSelector.classList.toggle('open');
                qualitySelector?.classList.remove('open');
            });
        }

        // Quality menu toggle
        if (qualityBtn && qualitySelector) {
            qualityBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                qualitySelector.classList.toggle('open');
                speedSelector?.classList.remove('open');
            });
        }

        // Close menus on outside click
        document.addEventListener('click', () => {
            speedSelector?.classList.remove('open');
            qualitySelector?.classList.remove('open');
        });

        // Hide controls after inactivity
        let timeout;
        wrapper.addEventListener('mousemove', () => {
            wrapper.classList.add('active');
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.isPlaying) wrapper.classList.remove('active');
            }, 3000);
        });
    }

    /**
     * Load HLS source
     * @param {string} url - M3U8 URL
     */
    loadSource(url) {
        const loading = this.container.querySelector('#playerLoading');
        loading.style.display = 'block';

        if (Hls.isSupported()) {
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            this.hls.loadSource(url);
            this.hls.attachMedia(this.video);

            this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                this.qualitySelector.setupFromHLS(data.levels);
                loading.style.display = 'none';
                this.restorePosition();
                this.options.onReady();

                if (this.options.autoplay) {
                    this.play();
                }
            });

            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
                if (data.fatal) {
                    this.hls.destroy();
                }
            });
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            this.video.src = url;
            this.video.addEventListener('loadedmetadata', () => {
                loading.style.display = 'none';

                if (this.options.qualities?.length > 0) {
                    this.qualitySelector.setupManual(this.options.qualities);
                }

                this.restorePosition();
                this.options.onReady();

                if (this.options.autoplay) {
                    this.play();
                }
            });
        } else {
            console.error('HLS is not supported in this browser');
        }
    }

    /**
     * Restore last playback position
     */
    restorePosition() {
        if (this.options.movieId) {
            const lastPos = this.storage.getProgress(this.options.movieId);
            if (lastPos > 0) {
                this.video.currentTime = lastPos;
            }
        }
    }

    /**
     * Set quality level
     * @param {number|string} value - Quality level ID or URL
     * @param {boolean} isNative - Whether native HLS switching
     */
    setQuality(value, isNative) {
        if (this.hls && (value === -1 || isNative)) {
            this.hls.currentLevel = value;
        } else if (value !== -1 && !isNative) {
            const currentTime = this.video.currentTime;
            const isPaused = this.video.paused;

            if (this.hls) {
                this.hls.loadSource(value);
            } else {
                this.video.src = value;
            }

            const restore = () => {
                this.video.currentTime = currentTime;
                if (!isPaused) this.video.play();
                this.video.removeEventListener('loadedmetadata', restore);
            };
            this.video.addEventListener('loadedmetadata', restore);
        }
    }

    // ========== Playback Controls ==========

    togglePlay() {
        this.video.paused ? this.play() : this.pause();
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    skip(seconds) {
        this.video.currentTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + seconds));
    }

    // ========== Volume Controls ==========

    setVolume(value) {
        this.video.volume = value;
        this.video.muted = value == 0;
        this.storage.saveVolume(value);

        // Update slider
        const slider = this.container.querySelector('#volumeSlider');
        if (slider) slider.value = value;
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.container.querySelector('#volumeSlider').value = this.video.muted ? 0 : this.video.volume;
    }

    // ========== Event Handlers ==========

    onPlay() {
        this.isPlaying = true;
        const wrapper = this.container.querySelector('#playerWrapper');
        wrapper.classList.add('playing');
        wrapper.classList.remove('paused');

        this.container.querySelector('#playIcon').style.display = 'none';
        this.container.querySelector('#pauseIcon').style.display = 'block';

        this.options.onPlay();
    }

    onPause() {
        this.isPlaying = false;
        const wrapper = this.container.querySelector('#playerWrapper');
        wrapper.classList.remove('playing');
        wrapper.classList.add('paused');

        this.container.querySelector('#playIcon').style.display = 'block';
        this.container.querySelector('#pauseIcon').style.display = 'none';

        // Save progress
        if (this.options.movieId) {
            this.storage.saveProgress(this.options.movieId, this.video.currentTime, this.video.duration);
        }

        this.options.onPause();
    }

    onEnded() {
        this.isPlaying = false;
        if (this.options.movieId) {
            this.storage.saveProgress(this.options.movieId, this.video.duration, this.video.duration);
        }
        this.options.onEnded();
    }

    onLoaded() {
        this.container.querySelector('#duration').textContent = formatDuration(this.video.duration);
    }

    onTimeUpdate() {
        const current = this.video.currentTime;
        const duration = this.video.duration;
        const progress = (current / duration) * 100;

        this.container.querySelector('#progressFill').style.width = `${progress}%`;
        this.container.querySelector('#currentTime').textContent = formatDuration(current);

        this.options.onTimeUpdate(current, duration);
    }

    updateBuffered() {
        if (this.video.buffered.length > 0) {
            const buffered = (this.video.buffered.end(0) / this.video.duration) * 100;
            this.container.querySelector('#bufferedBar').style.width = `${buffered}%`;
        }
    }

    seek(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }

    showLoading(show) {
        this.container.querySelector('#playerLoading').style.display = show ? 'block' : 'none';
    }

    // ========== Cleanup ==========

    destroy() {
        if (this.hls) {
            this.hls.destroy();
        }
        if (this.keyboardHandler) {
            this.keyboardHandler.destroy();
        }
        if (this.gestureControls) {
            this.gestureControls.destroy();
        }
    }
}
