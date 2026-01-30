/**
 * Theater Mode handler for video player
 * @module player/TheaterMode
 */

export class TheaterMode {
    /**
     * @param {HTMLElement} container - Player container
     * @param {function} onToggle - Callback when mode changes
     */
    constructor(container, onToggle = () => { }) {
        this.container = container;
        this.onToggle = onToggle;
        this.isActive = false;

        // Get or create theater wrapper
        this.wrapper = document.querySelector('.theater-wrapper') || document.body;

        this.bindKeyboard();
    }

    /**
     * Bind keyboard shortcut
     */
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            // 't' for theater mode
            if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
                const target = e.target;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    this.toggle();
                }
            }
        });
    }

    /**
     * Enter theater mode
     */
    enter() {
        this.isActive = true;
        this.container.classList.add('theater-mode');
        document.body.classList.add('theater-active');

        // Scroll to player
        this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.onToggle(true);
    }

    /**
     * Exit theater mode
     */
    exit() {
        this.isActive = false;
        this.container.classList.remove('theater-mode');
        document.body.classList.remove('theater-active');

        this.onToggle(false);
    }

    /**
     * Toggle theater mode
     */
    toggle() {
        if (this.isActive) {
            this.exit();
        } else {
            this.enter();
        }
    }

    /**
     * Get current state
     * @returns {boolean}
     */
    getState() {
        return this.isActive;
    }
}
