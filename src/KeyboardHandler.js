/**
 * Keyboard shortcuts handler for video player
 * @module player/KeyboardHandler
 */

/**
 * @typedef {Object} KeyboardHandlerOptions
 * @property {function} togglePlay - Toggle play/pause
 * @property {function} skip - Skip seconds (positive/negative)
 * @property {function} setVolume - Set volume (0-1)
 * @property {function} getVolume - Get current volume
 * @property {function} toggleFullscreen - Toggle fullscreen
 * @property {function} toggleMute - Toggle mute
 */

export class KeyboardHandler {
    /**
     * @param {KeyboardHandlerOptions} callbacks
     */
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.enabled = true;
        this.boundHandler = this.handleKeyboard.bind(this);
        document.addEventListener('keydown', this.boundHandler);
    }

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e
     */
    handleKeyboard(e) {
        if (!this.enabled) return;

        // Don't handle if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                this.callbacks.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.callbacks.skip(-10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.callbacks.skip(10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.callbacks.setVolume(Math.min(1, this.callbacks.getVolume() + 0.1));
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.callbacks.setVolume(Math.max(0, this.callbacks.getVolume() - 0.1));
                break;
            case 'f':
                this.callbacks.toggleFullscreen();
                break;
            case 'm':
                this.callbacks.toggleMute();
                break;
        }
    }

    /**
     * Enable/disable keyboard handling
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        document.removeEventListener('keydown', this.boundHandler);
    }
}
