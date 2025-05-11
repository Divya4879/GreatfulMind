/**
 * Goal management for GratefulMind
 * Handles creating, storing, and retrieving goals
 */

const goalManager = {
    // Storage keys
    STORAGE_KEYS: {
        GOALS: 'gm_goals',
        LIFE_AREA_DATA: 'gm_life_area_data'
    },
    
    // Life areas
    LIFE_AREAS: {
        WORK: 'work',
        SOCIAL: 'social',
        HEALTH: 'health',
        FINANCE: 'finance'
    },
    
    /**
     * Add a new goal
     * @param {Object} goal - Goal object
     * @returns {boolean} - Success status
     */
    addGoal: function(goal) {
        try {
            // Ensure goal has required fields
            if (!goal.title) {
                console.error('Goal must have a title');
                return false;
            }
            
            // Get existing goals
            const goals = this.getAllGoals();
            
            // Create new goal object
            const newGoal = {
                id: this.generateGoalId(),
                title: goal.title,
                description: goal.description || null,
                category: goal.category || null,
                completed: false,
                timestamp: new Date().toISOString()
            };
            
            // Add goal to array
            goals.push(newGoal);
            
            // Save goals
            storage.save(this.STORAGE_KEYS.GOALS, goals);
            
            return true;
        } catch (error) {
            console.error('Error adding goal:', error);
            return false;
        }
    },
    
    /**
     * Update goal status
     * @param {string} goalId - Goal ID
     * @param {boolean} completed - Completion status
     * @returns {boolean} - Success status
     */
    updateGoalStatus: function(goalId, completed) {
        try {
            // Get existing goals
            const goals = this.getAllGoals();
            
            // Find goal index
            const goalIndex = goals.findIndex(goal => goal.id === goalId);
            
            if (goalIndex === -1) {
                console.error('Goal not found');
                return false;
            }
            
            // Update goal
            goals[goalIndex].completed = completed;
            
            // Save goals
            storage.save(this.STORAGE_KEYS.GOALS, goals);
            
            return true;
        } catch (error) {
            console.error('Error updating goal status:', error);
            return false;
        }
    },
    
    /**
     * Delete a goal
     * @param {string} goalId - Goal ID
     * @returns {boolean} - Success status
     */
    deleteGoal: function(goalId) {
        try {
            // Get existing goals
            const goals = this.getAllGoals();
            
            // Find goal index
            const goalIndex = goals.findIndex(goal => goal.id === goalId);
            
            if (goalIndex === -1) {
                console.error('Goal not found');
                return false;
            }
            
            // Remove goal
            goals.splice(goalIndex, 1);
            
            // Save goals
            storage.save(this.STORAGE_KEYS.GOALS, goals);
            
            return true;
        } catch (error) {
            console.error('Error deleting goal:', error);
            return false;
        }
    },
    
    /**
     * Get all goals
     * @returns {Array} - Array of goal objects
     */
    getAllGoals: function() {
        return storage.get(this.STORAGE_KEYS.GOALS, []);
    },
    
    /**
     * Get goal by ID
     * @param {string} goalId - Goal ID
     * @returns {Object|null} - Goal object or null if not found
     */
    getGoalById: function(goalId) {
        const goals = this.getAllGoals();
        return goals.find(goal => goal.id === goalId) || null;
    },
    
    /**
     * Get today's goals
     * @returns {Array} - Array of today's goal objects
     */
    getTodaysGoals: function() {
        const goals = this.getAllGoals();
        const today = new Date().toDateString();
        
        return goals.filter(goal => {
            const goalDate = new Date(goal.timestamp).toDateString();
            return goalDate === today;
        });
    },
    
    /**
     * Save life area data for today
     * @param {string} areaId - Life area ID
     * @param {Object} data - Life area data
     * @returns {boolean} - Success status
     */
    saveLifeAreaData: function(areaId, data) {
        try {
            // Get existing life area data
            const lifeAreaData = this.getAllLifeAreaData();
            
            // Get today's date
            const today = new Date().toISOString().split('T')[0];
            
            // Initialize today's data if it doesn't exist
            if (!lifeAreaData[today]) {
                lifeAreaData[today] = {};
            }
            
            // Save data for area
            lifeAreaData[today][areaId] = {
                ...data,
                timestamp: new Date().toISOString()
            };
            
            // Save life area data
            storage.save(this.STORAGE_KEYS.LIFE_AREA_DATA, lifeAreaData);
            
            return true;
        } catch (error) {
            console.error('Error saving life area data:', error);
            return false;
        }
    },
    
    /**
     * Get all life area data
     * @returns {Object} - Life area data
     */
    getAllLifeAreaData: function() {
        return storage.get(this.STORAGE_KEYS.LIFE_AREA_DATA, {});
    },
    
    /**
     * Get today's life area data
     * @param {string} areaId - Life area ID
     * @returns {Object|null} - Life area data or null if not found
     */
    getTodaysLifeAreaData: function(areaId) {
        const lifeAreaData = this.getAllLifeAreaData();
        const today = new Date().toISOString().split('T')[0];
        
        if (!lifeAreaData[today] || !lifeAreaData[today][areaId]) {
            return null;
        }
        
        return lifeAreaData[today][areaId];
    },
    
    /**
     * Generate a unique goal ID
     * @returns {string} - Unique ID
     */
    generateGoalId: function() {
        return 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};
