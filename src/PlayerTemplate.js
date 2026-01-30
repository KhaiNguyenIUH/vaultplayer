/**
 * Player UI controls template
 * @module player/PlayerTemplate
 */

/**
 * Generate player HTML template
 * @returns {string} HTML string
 */
export function getPlayerTemplate() {
    return `
        <div class="player-wrapper" id="playerWrapper">
            <video id="videoPlayer" playsinline></video>
            
            <div class="player-loading" id="playerLoading" style="display:none;"></div>
            
            <button class="player-big-play" id="bigPlayBtn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>
            
            <!-- Double-tap seek indicators -->
            <div class="seek-indicator seek-indicator-left" id="seekLeftIndicator">
                <div class="seek-icon">⏪</div>
                <div class="seek-text">-10s</div>
            </div>
            <div class="seek-indicator seek-indicator-right" id="seekRightIndicator">
                <div class="seek-icon">⏩</div>
                <div class="seek-text">+10s</div>
            </div>
            
            <div class="player-controls" id="playerControls">
                <div class="player-progress" id="progressBar">
                    <div class="player-buffered" id="bufferedBar"></div>
                    <div class="player-progress-bar" id="progressFill" style="width:0%"></div>
                </div>
                
                <div class="player-controls-row">
                    <div class="player-controls-left">
                        <button class="player-btn player-btn-play" id="playPauseBtn">
                            <svg viewBox="0 0 24 24" fill="currentColor" id="playIcon">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <svg viewBox="0 0 24 24" fill="currentColor" id="pauseIcon" style="display:none;">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        </button>
                        
                        <button class="player-btn" id="rewindBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m11 17-5-5 5-5"></path>
                                <path d="m18 17-5-5 5-5"></path>
                            </svg>
                        </button>
                        
                        <button class="player-btn" id="forwardBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m6 17 5-5-5-5"></path>
                                <path d="m13 17 5-5-5-5"></path>
                            </svg>
                        </button>
                        
                        <div class="volume-control">
                            <button class="player-btn" id="volumeBtn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="volumeIcon">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            </button>
                            <div class="volume-slider">
                                <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1">
                            </div>
                        </div>
                        
                        <span class="player-time">
                            <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
                        </span>
                    </div>
                    
                    <div class="player-controls-right">
                        <!-- Speed Selector -->
                        <div class="speed-selector" id="speedSelector">
                            <button class="player-btn" id="speedBtn" title="Playback Speed">
                                <span class="speed-label">1x</span>
                            </button>
                            <div class="speed-menu" id="speedMenu"></div>
                        </div>
                        
                        <!-- Quality Selector -->
                        <div class="quality-selector" id="qualitySelector">
                            <button class="player-btn" id="qualityBtn" title="Quality">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            <div class="quality-menu" id="qualityMenu"></div>
                        </div>
                        
                        <!-- Picture-in-Picture -->
                        <button class="player-btn" id="pipBtn" title="Picture-in-Picture">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                                <rect x="12" y="9" width="8" height="6" rx="1" fill="currentColor"></rect>
                            </svg>
                        </button>
                        
                        <!-- Theater Mode -->
                        <button class="player-btn" id="theaterBtn" title="Theater Mode (t)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            </svg>
                        </button>
                        
                        <!-- Fullscreen -->
                        <button class="player-btn" id="fullscreenBtn" title="Fullscreen (f)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
