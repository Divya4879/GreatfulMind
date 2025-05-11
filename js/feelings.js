/**
 * Feelings management for GratefulMind
 * Handles tracking and analyzing feelings
 */

const feelingsManager = {
    // Storage keys
    STORAGE_KEYS: {
        FEELINGS: 'gm_feelings'
    },
    
    /**
     * Track feeling
     * @param {number} value - Feeling value (1-10)
     * @param {string} note - Optional note
     * @returns {boolean} - Success status
     */
    trackFeeling: function(value, note = '') {
        try {
            // Validate value
            if (value < 1 || value > 10) {
                console.error('Feeling value must be between 1 and 10');
                return false;
            }
            
            // Get existing feelings data
            const feelingsData = this.getFeelingsData();
            
            // Add new feeling
            const today = new Date().toISOString().split('T')[0];
            feelingsData[today] = {
                value,
                note,
                timestamp: new Date().toISOString()
            };
            
            // Save feelings data
            storage.save(this.STORAGE_KEYS.FEELINGS, feelingsData);
            
            return true;
        } catch (error) {
            console.error('Error tracking feeling:', error);
            return false;
        }
    },
    
    /**
     * Get feelings data
     * @returns {Object} - Feelings data
     */
    getFeelingsData: function() {
        return storage.get(this.STORAGE_KEYS.FEELINGS, {});
    },
    
    /**
     * Get feeling for a specific date
     * @param {string} date - Date string (YYYY-MM-DD)
     * @returns {Object|null} - Feeling object or null if not found
     */
    getFeelingByDate: function(date) {
        const feelingsData = this.getFeelingsData();
        return feelingsData[date] || null;
    },
    
    /**
     * Get today's feeling
     * @returns {Object|null} - Feeling object or null if not found
     */
    getTodaysFeeling: function() {
        const today = new Date().toISOString().split('T')[0];
        return this.getFeelingByDate(today);
    },
    
    /**
     * Get feelings for the current week
     * @returns {Object} - Weekly feelings data
     */
    getWeeklyFeelings: function() {
        const feelingsData = this.getFeelingsData();
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const weeklyFeelings = {};
        
        Object.entries(feelingsData).forEach(([date, feeling]) => {
            const feelingDate = new Date(date);
            if (feelingDate >= startOfWeek) {
                weeklyFeelings[date] = feeling;
            }
        });
        
        return weeklyFeelings;
    },
    
    /**
     * Get feelings for the current month
     * @returns {Object} - Monthly feelings data
     */
    getMonthlyFeelings: function() {
        const feelingsData = this.getFeelingsData();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyFeelings = {};
        
        Object.entries(feelingsData).forEach(([date, feeling]) => {
            const feelingDate = new Date(date);
            if (feelingDate >= startOfMonth) {
                monthlyFeelings[date] = feeling;
            }
        });
        
        return monthlyFeelings;
    },
    
    /**
     * Generate insights based on feelings data
     * @returns {Array} - Array of insight strings
     */
    generateInsights: function() {
        const insights = [];
        const feelingsData = this.getFeelingsData();
        
        // Check if we have enough data
        if (Object.keys(feelingsData).length < 3) {
            return insights;
        }
        
        // Calculate average feeling
        const values = Object.values(feelingsData).map(feeling => feeling.value);
        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
        
        insights.push(`Your average feeling is ${average.toFixed(1)} out of 10.`);
        
        // Calculate trend
        const sortedDates = Object.keys(feelingsData).sort();
        const firstDate = sortedDates[0];
        const lastDate = sortedDates[sortedDates.length - 1];
        
        const firstValue = feelingsData[firstDate].value;
        const lastValue = feelingsData[lastDate].value;
        
        if (lastValue > firstValue) {
            insights.push(`Your feelings are trending upward over time.`);
        } else if (lastValue < firstValue) {
            insights.push(`Your feelings are trending downward over time.`);
        } else {
            insights.push(`Your feelings have remained stable over time.`);
        }
        
        // Find best and worst days
        let bestDay = null;
        let bestValue = -Infinity;
        let worstDay = null;
        let worstValue = Infinity;
        
        Object.entries(feelingsData).forEach(([date, feeling]) => {
            if (feeling.value > bestValue) {
                bestValue = feeling.value;
                bestDay = date;
            }
            
            if (feeling.value < worstValue) {
                worstValue = feeling.value;
                worstDay = date;
            }
        });
        
        if (bestDay) {
            const bestDayFormatted = new Date(bestDay).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
            
            insights.push(`Your best day was ${bestDayFormatted} with a feeling of ${bestValue}/10.`);
        }
        
        if (worstDay) {
            const worstDayFormatted = new Date(worstDay).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
            
            insights.push(`Your most challenging day was ${worstDayFormatted} with a feeling of ${worstValue}/10.`);
        }
        
        return insights;
    }
};
