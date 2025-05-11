/**
 * User management for GratefulMind
 * Handles user identities and preferences
 */

const userManager = {
    // Storage keys
    STORAGE_KEYS: {
        USER: 'gm_user',
        IDENTITIES: 'gm_identities'
    },
    
    // Identity categories
    IDENTITY_CATEGORIES: {
        PROFESSIONAL: 'professional',
        FAMILY: 'family',
        SITUATION: 'situation',
        CUSTOM: 'custom'
    },
    
    /**
     * Initialize user
     * @returns {Object} - User object
     */
    initUser: function() {
        // Check if user exists
        let user = this.getUser();
        
        if (!user) {
            // Create new user
            user = {
                id: this.generateUserId(),
                name: '',
                created: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                preferences: {
                    morningPrompt: true,
                    afternoonPrompt: true,
                    eveningPrompt: true,
                    notifications: true
                }
            };
            
            // Save user
            this.saveUser(user);
        }
        
        return user;
    },
    
    /**
     * Get user object
     * @returns {Object|null} - User object or null if not found
     */
    getUser: function() {
        return storage.get(this.STORAGE_KEYS.USER, null);
    },
    
    /**
     * Save user object
     * @param {Object} user - User object
     * @returns {boolean} - Success status
     */
    saveUser: function(user) {
        // Update last active timestamp
        user.lastActive = new Date().toISOString();
        
        return storage.save(this.STORAGE_KEYS.USER, user);
    },
    
    /**
     * Update user name
     * @param {string} name - User name
     * @returns {boolean} - Success status
     */
    updateUserName: function(name) {
        const user = this.getUser();
        if (!user) return false;
        
        user.name = name;
        return this.saveUser(user);
    },
    
    /**
     * Update user preference
     * @param {string} preference - Preference key
     * @param {*} value - Preference value
     * @returns {boolean} - Success status
     */
    updatePreference: function(preference, value) {
        const user = this.getUser();
        if (!user) return false;
        
        if (!user.preferences) {
            user.preferences = {};
        }
        
        user.preferences[preference] = value;
        return this.saveUser(user);
    },
    
    /**
     * Reset user data
     * @returns {boolean} - Success status
     */
    resetUser: function() {
        return storage.remove(this.STORAGE_KEYS.USER);
    },
    
    /**
     * Add identity
     * @param {string} category - Identity category
     * @param {string} value - Identity value
     * @returns {boolean} - Success status
     */
    addIdentity: function(category, value) {
        if (!category || !value) return false;
        
        // Get existing identities
        const identities = this.getIdentities();
        
        // Check if identity already exists
        if (!identities[category]) {
            identities[category] = [];
        }
        
        if (identities[category].includes(value)) {
            return true; // Already exists
        }
        
        // Add identity
        identities[category].push(value);
        
        // Save identities
        return storage.save(this.STORAGE_KEYS.IDENTITIES, identities);
    },
    
    /**
     * Remove identity
     * @param {string} category - Identity category
     * @param {string} value - Identity value
     * @returns {boolean} - Success status
     */
    removeIdentity: function(category, value) {
        if (!category || !value) return false;
        
        // Get existing identities
        const identities = this.getIdentities();
        
        // Check if category exists
        if (!identities[category]) {
            return true; // Nothing to remove
        }
        
        // Find index of identity
        const index = identities[category].indexOf(value);
        
        if (index === -1) {
            return true; // Nothing to remove
        }
        
        // Remove identity
        identities[category].splice(index, 1);
        
        // Save identities
        return storage.save(this.STORAGE_KEYS.IDENTITIES, identities);
    },
    
    /**
     * Get identities
     * @returns {Object} - Identities object
     */
    getIdentities: function() {
        return storage.get(this.STORAGE_KEYS.IDENTITIES, {});
    },
    
    /**
     * Get identities for a specific category
     * @param {string} category - Identity category
     * @returns {Array} - Array of identities
     */
    getIdentitiesByCategory: function(category) {
        const identities = this.getIdentities();
        return identities[category] || [];
    },
    
    /**
     * Get all identities as a flat array
     * @returns {Array} - Array of identities
     */
    getAllIdentitiesFlat: function() {
        const identities = this.getIdentities();
        let flat = [];
        
        Object.values(identities).forEach(categoryIdentities => {
            flat = flat.concat(categoryIdentities);
        });
        
        return flat;
    },
    
    /**
     * Check if setup is complete
     * @returns {boolean} - True if setup is complete
     */
    isSetupComplete: function() {
        const identities = this.getIdentities();
        
        // Check if at least one identity is set
        return Object.values(identities).some(categoryIdentities => 
            categoryIdentities && categoryIdentities.length > 0
        );
    },
    
    /**
     * Generate a unique user ID
     * @returns {string} - Unique ID
     */
    generateUserId: function() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};
