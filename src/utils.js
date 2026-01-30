/**
 * Format seconds to MM:SS or HH:MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to human-readable duration (e.g., "2h 30m")
 * @param {number} seconds - Time in seconds
 * @returns {string} Human-readable duration
 */
export function formatDurationHuman(seconds) {
    if (!seconds || isNaN(seconds)) return '0m';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        if (minutes > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${hours}h`;
    }

    return `${minutes}m`;
}
