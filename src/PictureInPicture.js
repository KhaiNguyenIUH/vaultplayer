/**
 * Picture-in-Picture handler for video player
 * @module player/PictureInPicture
 */

export class PictureInPicture {
    /**
     * @param {HTMLVideoElement} video - Video element
     * @param {HTMLElement} container - Player container
     */
    constructor(video, container) {
        this.video = video;
        this.container = container;
        this.isSupported = this.checkSupport();

        this.bindEvents();
    }

    /**
     * Check if PiP is supported
     * @returns {boolean}
     */
    checkSupport() {
        return 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;
    }

    /**
     * Bind PiP events
     */
    bindEvents() {
        if (!this.isSupported) return;

        this.video.addEventListener('enterpictureinpicture', () => {
            this.container.classList.add('pip-active');
        });

        this.video.addEventListener('leavepictureinpicture', () => {
            this.container.classList.remove('pip-active');
        });
    }

    /**
     * Check if currently in PiP mode
     * @returns {boolean}
     */
    isActive() {
        return document.pictureInPictureElement === this.video;
    }

    /**
     * Enter PiP mode
     * @returns {Promise<boolean>}
     */
    async enter() {
        if (!this.isSupported) {
            console.warn('Picture-in-Picture is not supported');
            return false;
        }

        try {
            await this.video.requestPictureInPicture();
            return true;
        } catch (error) {
            console.error('Failed to enter PiP:', error);
            return false;
        }
    }

    /**
     * Exit PiP mode
     * @returns {Promise<boolean>}
     */
    async exit() {
        if (!this.isActive()) return false;

        try {
            await document.exitPictureInPicture();
            return true;
        } catch (error) {
            console.error('Failed to exit PiP:', error);
            return false;
        }
    }

    /**
     * Toggle PiP mode
     * @returns {Promise<boolean>}
     */
    async toggle() {
        if (this.isActive()) {
            return this.exit();
        } else {
            return this.enter();
        }
    }
}
