/**
 * Journal entry management for GratefulMind
 * Handles creating, storing, and retrieving journal entries
 */

const journalManager = {
    // Storage keys
    STORAGE_KEYS: {
        ENTRIES: 'gm_journal_entries',
        LAST_ENTRY_DATE: 'gm_last_entry_date',
        STREAK: 'gm_journal_streak'
    },

    /**
     * Save a journal entry
     * @param {Object} entry - Journal entry object
     * @returns {Promise<boolean>} - Success status
     */
    saveEntry: async function(entry) {
        try {
            // Ensure entry has required fields
            if (!entry.content || !entry.prompt || !entry.timestamp) {
                console.error('Invalid entry format');
                return false;
            }
            
            // Get existing entries
            const entries = await this.getAllEntries();
            
            // Add ID if not present
            if (!entry.id) {
                entry.id = this.generateEntryId();
            }
            
            // Add entry to the beginning of the array
            entries.unshift(entry);
            
            // Save entries
            storage.save(this.STORAGE_KEYS.ENTRIES, entries);
            
            // Update last entry date and streak
            this.updateLastEntryDate(new Date(entry.timestamp));
            
            return true;
        } catch (error) {
            console.error('Error saving journal entry:', error);
            return false;
        }
    },

    /**
     * Get all journal entries
     * @returns {Promise<Array>} - Array of journal entries
     */
    getAllEntries: async function() {
        return storage.get(this.STORAGE_KEYS.ENTRIES, []);
    },

    /**
     * Get a specific journal entry by ID
     * @param {string} id - Entry ID
     * @returns {Promise<Object|null>} - Journal entry or null if not found
     */
    getEntryById: async function(id) {
        const entries = await this.getAllEntries();
        return entries.find(entry => entry.id === id) || null;
    },

    /**
     * Get entries for a specific date
     * @param {Date} date - Date to filter by
     * @returns {Promise<Array>} - Filtered entries
     */
    getEntriesByDate: async function(date) {
        const entries = await this.getAllEntries();
        const dateString = date.toDateString();
        
        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp).toDateString();
            return entryDate === dateString;
        });
    },

    /**
     * Get entries for the current week
     * @returns {Promise<Array>} - Entries from the current week
     */
    getCurrentWeekEntries: async function() {
        const entries = await this.getAllEntries();
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);
        
        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= startOfWeek;
        });
    },

    /**
     * Get entries for the current month
     * @returns {Promise<Array>} - Entries from the current month
     */
    getCurrentMonthEntries: async function() {
        const entries = await this.getAllEntries();
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= startOfMonth;
        });
    },

    /**
     * Delete a journal entry
     * @param {string} id - Entry ID
     * @returns {Promise<boolean>} - Success status
     */
    deleteEntry: async function(id) {
        try {
            const entries = await this.getAllEntries();
            const filteredEntries = entries.filter(entry => entry.id !== id);
            
            if (filteredEntries.length === entries.length) {
                // No entry was removed
                return false;
            }
            
            storage.save(this.STORAGE_KEYS.ENTRIES, filteredEntries);
            return true;
        } catch (error) {
            console.error('Error deleting journal entry:', error);
            return false;
        }
    },

    /**
     * Update a journal entry
     * @param {string} id - Entry ID
     * @param {Object} updatedData - Updated entry data
     * @returns {Promise<boolean>} - Success status
     */
    updateEntry: async function(id, updatedData) {
        try {
            const entries = await this.getAllEntries();
            const entryIndex = entries.findIndex(entry => entry.id === id);
            
            if (entryIndex === -1) {
                return false;
            }
            
            // Update entry with new data
            entries[entryIndex] = {
                ...entries[entryIndex],
                ...updatedData,
                lastModified: new Date().toISOString()
            };
            
            storage.save(this.STORAGE_KEYS.ENTRIES, entries);
            return true;
        } catch (error) {
            console.error('Error updating journal entry:', error);
            return false;
        }
    },

    /**
     * Generate a unique ID for an entry
     * @returns {string} - Unique ID
     */
    generateEntryId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    /**
     * Update the last entry date and streak
     * @param {Date} entryDate - Date of the entry
     */
    updateLastEntryDate: function(entryDate) {
        const lastEntryDateStr = storage.get(this.STORAGE_KEYS.LAST_ENTRY_DATE, null);
        const currentStreak = storage.get(this.STORAGE_KEYS.STREAK, 0);
        
        // Format dates for comparison (remove time component)
        const entryDateStr = entryDate.toDateString();
        const todayStr = new Date().toDateString();
        const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
        
        // If this is the first entry ever
        if (!lastEntryDateStr) {
            storage.save(this.STORAGE_KEYS.LAST_ENTRY_DATE, entryDateStr);
            storage.save(this.STORAGE_KEYS.STREAK, 1);
            return;
        }
        
        // If entry is for today and we already journaled today, don't update streak
        if (entryDateStr === todayStr && lastEntryDateStr === todayStr) {
            return;
        }
        
        // If entry is for today and we last journaled yesterday, increment streak
        if (entryDateStr === todayStr && lastEntryDateStr === yesterdayStr) {
            storage.save(this.STORAGE_KEYS.LAST_ENTRY_DATE, entryDateStr);
            storage.save(this.STORAGE_KEYS.STREAK, currentStreak + 1);
            return;
        }
        
        // If entry is for today but we missed days, reset streak to 1
        if (entryDateStr === todayStr) {
            storage.save(this.STORAGE_KEYS.LAST_ENTRY_DATE, entryDateStr);
            storage.save(this.STORAGE_KEYS.STREAK, 1);
            return;
        }
        
        // For backdated entries, just update the last entry date if it's more recent
        const lastEntryDate = new Date(lastEntryDateStr);
        if (entryDate > lastEntryDate) {
            storage.save(this.STORAGE_KEYS.LAST_ENTRY_DATE, entryDateStr);
        }
    },

    /**
     * Get the current streak
     * @returns {number} - Current streak
     */
    getCurrentStreak: function() {
        return storage.get(this.STORAGE_KEYS.STREAK, 0);
    },

    /**
     * Check if user has journaled today
     * @returns {boolean} - True if user has journaled today
     */
    hasJournaledToday: function() {
        const lastEntryDateStr = storage.get(this.STORAGE_KEYS.LAST_ENTRY_DATE, null);
        if (!lastEntryDateStr) return false;
        
        const todayStr = new Date().toDateString();
        return lastEntryDateStr === todayStr;
    },

    /**
     * Get mood statistics from entries
     * @param {Array} entries - Journal entries to analyze
     * @returns {Object} - Mood statistics
     */
    getMoodStats: function(entries) {
        if (!entries || entries.length === 0) {
            return {
                moodCounts: {},
                topMood: null,
                averageMood: null
            };
        }
        
        // Count occurrences of each mood
        const moodCounts = {};
        let moodSum = 0;
        let moodEntries = 0;
        
        entries.forEach(entry => {
            if (entry.mood) {
                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
                
                // For numeric mood values, calculate average
                const moodValue = parseInt(entry.mood);
                if (!isNaN(moodValue)) {
                    moodSum += moodValue;
                    moodEntries++;
                }
            }
        });
        
        // Find the most common mood
        let topMood = null;
        let maxCount = 0;
        
        for (const mood in moodCounts) {
            if (moodCounts[mood] > maxCount) {
                maxCount = moodCounts[mood];
                topMood = mood;
            }
        }
        
        // Calculate average mood if applicable
        const averageMood = moodEntries > 0 ? (moodSum / moodEntries).toFixed(1) : null;
        
        return {
            moodCounts,
            topMood,
            averageMood
        };
    }
};
