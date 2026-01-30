/**
 * Playback Speed Control for video player
 * @module player/SpeedControl
 */

/** @type {number[]} Available playback speeds */
export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export class SpeedControl {
    /**
     * @param {HTMLElement} menuElement - Speed menu container
     * @param {HTMLVideoElement} video - Video element
     * @param {function} onSpeedChange - Callback when speed changes
     */
    constructor(menuElement, video, onSpeedChange = () => {}) {
        this.menu = menuElement;
        this.video = video;
        this.onSpeedChange = onSpeedChange;
        this.currentSpeed = 1;
        
        this.render();
    }

    /**
     * Render speed menu
     */
    render() {
        this.menu.innerHTML = PLAYBACK_SPEEDS.map(speed => `
            <button class="speed-option ${speed === this.currentSpeed ? 'active' : ''}" data-speed="${speed}">
                ${speed === 1 ? 'Normal' : speed + 'x'}
            </button>
        `).join('');

        this.menu.querySelectorAll('.speed-option').forEach(btn => {
            btn.addEventListener('click', () => this.setSpeed(parseFloat(btn.dataset.speed)));
        });
    }

    /**
     * Set playback speed
     * @param {number} speed - Playback rate
     */
    setSpeed(speed) {
        this.currentSpeed = speed;
        this.video.playbackRate = speed;
        
        // Update UI
        this.menu.querySelectorAll('.speed-option').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
        });
        
        this.onSpeedChange(speed);
    }

    /**
     * Get current speed
     * @returns {number}
     */
    getSpeed() {
        return this.currentSpeed;
    }

    /**
     * Cycle to next speed
     */
    cycleSpeed() {
        const currentIndex = PLAYBACK_SPEEDS.indexOf(this.currentSpeed);
        const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
        this.setSpeed(PLAYBACK_SPEEDS[nextIndex]);
    }

    /**
     * Reset to normal speed
     */
    reset() {
        this.setSpeed(1);
    }
}
