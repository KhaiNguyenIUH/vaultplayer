/**
 * Mobile Gesture Controls for video player
 * @module player/GestureControls
 */

export class GestureControls {
    /**
     * @param {HTMLElement} container - Player container
     * @param {Object} callbacks - Gesture callbacks
     * @param {function} callbacks.onSeek - Called with seek delta in seconds
     * @param {function} callbacks.onVolumeChange - Called with volume delta
     * @param {function} callbacks.onBrightnessChange - Called with brightness delta
     * @param {function} callbacks.onDoubleTap - Called with 'left' or 'right'
     * @param {function} callbacks.onTap - Called on single tap
     */
    constructor(container, callbacks = {}) {
        this.container = container;
        this.callbacks = {
            onSeek: () => { },
            onVolumeChange: () => { },
            onBrightnessChange: () => { },
            onDoubleTap: () => { },
            onTap: () => { },
            ...callbacks
        };

        // Gesture state
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.lastTapTime = 0;
        this.isSwiping = false;
        this.swipeDirection = null; // 'horizontal' or 'vertical'
        this.swipeSide = null; // 'left' or 'right' for vertical swipes

        // Thresholds
        this.SWIPE_THRESHOLD = 30;
        this.DOUBLE_TAP_DELAY = 300;
        this.SEEK_SENSITIVITY = 0.5; // seconds per pixel
        this.VOLUME_SENSITIVITY = 0.005; // volume per pixel

        // Indicator element
        this.indicator = this.createIndicator();

        this.bindEvents();
    }

    /**
     * Create gesture indicator element
     */
    createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'gesture-indicator';
        indicator.innerHTML = `
            <div class="gesture-icon"></div>
            <div class="gesture-text"></div>
        `;
        this.container.appendChild(indicator);
        return indicator;
    }

    /**
     * Show gesture feedback
     * @param {string} icon - Icon HTML or emoji
     * @param {string} text - Feedback text
     */
    showIndicator(icon, text) {
        const iconEl = this.indicator.querySelector('.gesture-icon');
        const textEl = this.indicator.querySelector('.gesture-text');

        iconEl.innerHTML = icon;
        textEl.textContent = text;

        this.indicator.classList.add('visible');

        clearTimeout(this.indicatorTimeout);
        this.indicatorTimeout = setTimeout(() => {
            this.indicator.classList.remove('visible');
        }, 800);
    }

    /**
     * Bind touch events
     */
    bindEvents() {
        // Check if touch device
        if (!('ontouchstart' in window)) return;

        this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
    }

    /**
     * Handle touch start
     * @param {TouchEvent} e
     */
    onTouchStart(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
        this.isSwiping = false;
        this.swipeDirection = null;

        // Determine which side of screen
        const rect = this.container.getBoundingClientRect();
        this.swipeSide = touch.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
    }

    /**
     * Handle touch move
     * @param {TouchEvent} e
     */
    onTouchMove(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Determine swipe direction if not set
        if (!this.swipeDirection && (absDeltaX > this.SWIPE_THRESHOLD || absDeltaY > this.SWIPE_THRESHOLD)) {
            this.swipeDirection = absDeltaX > absDeltaY ? 'horizontal' : 'vertical';
            this.isSwiping = true;
        }

        if (!this.isSwiping) return;

        // Prevent scrolling while swiping
        e.preventDefault();

        if (this.swipeDirection === 'horizontal') {
            // Horizontal swipe = seek
            const seekDelta = deltaX * this.SEEK_SENSITIVITY;
            this.callbacks.onSeek(seekDelta);

            const seekSeconds = Math.round(seekDelta);
            const icon = seekDelta > 0 ? '⏩' : '⏪';
            this.showIndicator(icon, `${seekDelta > 0 ? '+' : ''}${seekSeconds}s`);

        } else if (this.swipeDirection === 'vertical') {
            // Vertical swipe on left = brightness, right = volume
            const delta = -deltaY * this.VOLUME_SENSITIVITY;

            if (this.swipeSide === 'right') {
                this.callbacks.onVolumeChange(delta);
                const percent = Math.round(delta * 100);
                const icon = delta > 0 ? '🔊' : '🔈';
                this.showIndicator(icon, `Volume ${delta > 0 ? '+' : ''}${percent}%`);
            } else {
                this.callbacks.onBrightnessChange(delta);
                const percent = Math.round(delta * 100);
                const icon = delta > 0 ? '☀️' : '🌙';
                this.showIndicator(icon, `Brightness ${delta > 0 ? '+' : ''}${percent}%`);
            }
        }

        // Update start position for continuous feedback
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    /**
     * Handle touch end
     * @param {TouchEvent} e
     */
    onTouchEnd(e) {
        const touchDuration = Date.now() - this.touchStartTime;
        const now = Date.now();

        // If it was a quick tap (not a swipe)
        if (!this.isSwiping && touchDuration < 200) {
            // Check for double tap
            if (now - this.lastTapTime < this.DOUBLE_TAP_DELAY) {
                // Double tap detected
                this.callbacks.onDoubleTap(this.swipeSide);

                const icon = this.swipeSide === 'right' ? '⏩' : '⏪';
                const text = this.swipeSide === 'right' ? '+10s' : '-10s';
                this.showIndicator(icon, text);

                this.lastTapTime = 0; // Reset to prevent triple tap
            } else {
                this.lastTapTime = now;

                // Delay single tap to check for double tap
                setTimeout(() => {
                    if (this.lastTapTime === now) {
                        this.callbacks.onTap();
                    }
                }, this.DOUBLE_TAP_DELAY);
            }
        }

        this.isSwiping = false;
        this.swipeDirection = null;
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.indicator && this.indicator.parentNode) {
            this.indicator.parentNode.removeChild(this.indicator);
        }
    }
}
