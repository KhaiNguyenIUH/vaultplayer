/**
 * Fullscreen handler for video player (cross-browser)
 * @module player/FullscreenHandler
 */

export class FullscreenHandler {
    /**
     * @param {HTMLElement} container - Player container element
     * @param {HTMLVideoElement} video - Video element
     */
    constructor(container, video) {
        this.container = container;
        this.video = video;
        this.isIOSFullscreen = false;

        this.bindEvents();
    }

    /**
     * Bind fullscreen change events
     */
    bindEvents() {
        // Standard fullscreen events
        document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.onFullscreenChange());

        // iOS-specific events
        this.video.addEventListener('webkitbeginfullscreen', () => this.onIOSEnter());
        this.video.addEventListener('webkitendfullscreen', () => this.onIOSExit());
    }

    /**
     * Check if currently in fullscreen
     * @returns {boolean}
     */
    isFullscreen() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            this.isIOSFullscreen
        );
    }

    /**
     * Toggle fullscreen mode
     */
    toggle() {
        if (this.isFullscreen()) {
            this.exit();
        } else {
            this.enter();
        }
    }

    /**
     * Enter fullscreen
     */
    enter() {
        if (this.container.requestFullscreen) {
            this.container.requestFullscreen().catch(() => this.enterVideoFullscreen());
        } else if (this.container.webkitRequestFullscreen) {
            this.container.webkitRequestFullscreen();
        } else if (this.container.mozRequestFullScreen) {
            this.container.mozRequestFullScreen();
        } else if (this.container.msRequestFullscreen) {
            this.container.msRequestFullscreen();
        } else {
            this.enterVideoFullscreen();
        }
        this.container.classList.add('fullscreen');
    }

    /**
     * Exit fullscreen
     */
    exit() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if (this.video.webkitExitFullscreen) {
            this.video.webkitExitFullscreen();
        }
        this.container.classList.remove('fullscreen');
        this.isIOSFullscreen = false;
    }

    /**
     * Enter video element fullscreen (iOS/mobile fallback)
     */
    enterVideoFullscreen() {
        if (this.video.webkitEnterFullscreen) {
            this.video.webkitEnterFullscreen();
        } else if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.webkitRequestFullscreen) {
            this.video.webkitRequestFullscreen();
        }
    }

    /**
     * Handle fullscreen change event
     */
    onFullscreenChange() {
        if (this.isFullscreen()) {
            this.container.classList.add('fullscreen');
        } else {
            this.container.classList.remove('fullscreen');
        }
    }

    /**
     * Handle iOS fullscreen enter
     */
    onIOSEnter() {
        this.container.classList.add('fullscreen');
        this.isIOSFullscreen = true;
    }

    /**
     * Handle iOS fullscreen exit
     */
    onIOSExit() {
        this.container.classList.remove('fullscreen');
        this.isIOSFullscreen = false;
    }
}
