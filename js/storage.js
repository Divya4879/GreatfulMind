/**
 * Storage utility for GratefulMind
 * Handles saving and retrieving data from localStorage
 */

const storage = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to save
     * @returns {boolean} - Success status
     */
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} - Retrieved data or default value
     */
    get: function(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return defaultValue;
        }
    },
    
    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    /**
     * Clear all app data from localStorage
     * @returns {boolean} - Success status
     */
    clearAll: function() {
        try {
            // Get all keys
            const keys = Object.keys(localStorage);
            
            // Remove only app-specific keys (starting with 'gm_')
            keys.forEach(key => {
                if (key.startsWith('gm_')) {
                    localStorage.removeItem(key);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};
