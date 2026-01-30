/**
 * Quality selector for video player
 * @module player/QualitySelector
 */

/**
 * @typedef {Object} QualityOption
 * @property {number|string} id - Quality level ID or URL
 * @property {number} height - Video height in pixels
 * @property {string} label - Display label (e.g., "720p")
 * @property {boolean} isNative - Whether this is a native HLS level
 */

export class QualitySelector {
    /**
     * @param {HTMLElement} menuElement - Quality menu container
     * @param {function} onQualityChange - Callback when quality changes
     */
    constructor(menuElement, onQualityChange) {
        this.menu = menuElement;
        this.onQualityChange = onQualityChange;
        /** @type {QualityOption[]} */
        this.options = [];
        this.currentQuality = -1; // Auto
    }

    /**
     * Setup quality levels from HLS.js
     * @param {Array} levels - HLS.js quality levels
     */
    setupFromHLS(levels) {
        if (!levels || levels.length === 0) return;

        this.options = levels.map((level, index) => ({
            id: index,
            height: level.height,
            label: `${level.height}p`,
            isNative: true
        }));

        this.render();
    }

    /**
     * Setup quality levels from manual list
     * @param {Array<{url: string, resolution: string}>} qualities
     */
    setupManual(qualities) {
        const sorted = [...qualities].sort((a, b) => {
            const hA = parseInt(a.resolution?.split('x')[1] || 0);
            const hB = parseInt(b.resolution?.split('x')[1] || 0);
            return hB - hA;
        });

        this.options = sorted.map(q => ({
            id: q.url,
            height: parseInt(q.resolution?.split('x')[1] || 0),
            label: q.resolution ? `${q.resolution.split('x')[1]}p` : 'Unknown',
            isNative: false
        }));

        this.render();
    }

    /**
     * Render quality menu
     */
    render() {
        const menuItems = [
            { id: -1, label: 'Auto', isNative: this.options[0]?.isNative },
            ...this.options
        ];

        this.menu.innerHTML = menuItems.map(q => `
            <button class="quality-option ${q.id === this.currentQuality ? 'active' : ''}" data-id="${q.id}">
                ${q.label}
            </button>
        `).join('');

        this.menu.querySelectorAll('.quality-option').forEach(btn => {
            btn.addEventListener('click', () => this.selectQuality(btn));
        });
    }

    /**
     * Handle quality selection
     * @param {HTMLButtonElement} btn
     */
    selectQuality(btn) {
        const id = btn.dataset.id;
        const value = (id === '-1') ? -1 : (isNaN(id) ? id : parseInt(id));

        this.currentQuality = value;
        this.menu.querySelectorAll('.quality-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const option = this.options.find(q => q.id === value);
        this.onQualityChange(value, option?.isNative ?? true);
    }

    /**
     * Get current quality options
     * @returns {QualityOption[]}
     */
    getOptions() {
        return this.options;
    }
}
