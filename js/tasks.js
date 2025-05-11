/**
 * Task management for GratefulMind
 * Handles creating, storing, and retrieving tasks
 */

const taskManager = {
    // Storage keys
    STORAGE_KEYS: {
        TASKS: 'gm_tasks'
    },
    
    /**
     * Add a new task
     * @param {Object} task - Task object
     * @returns {boolean} - Success status
     */
    addTask: function(task) {
        try {
            // Ensure task has required fields
            if (!task.title) {
                console.error('Task must have a title');
                return false;
            }
            
            // Get existing tasks
            const tasks = this.getAllTasks();
            
            // Create new task object
            const newTask = {
                id: this.generateTaskId(),
                title: task.title,
                description: task.description || null,
                completed: false,
                moodBefore: task.moodBefore || null,
                moodAfter: null,
                timestamp: new Date().toISOString()
            };
            
            // Add task to array
            tasks.push(newTask);
            
            // Save tasks
            storage.save(this.STORAGE_KEYS.TASKS, tasks);
            
            // Dispatch event
            this.dispatchTaskEvent('taskAdded', newTask);
            
            return true;
        } catch (error) {
            console.error('Error adding task:', error);
            return false;
        }
    },
    
    /**
     * Update task status
     * @param {string} taskId - Task ID
     * @param {boolean} completed - Completion status
     * @returns {boolean} - Success status
     */
    updateTaskStatus: function(taskId, completed) {
        try {
            // Get existing tasks
            const tasks = this.getAllTasks();
            
            // Find task index
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex === -1) {
                console.error('Task not found');
                return false;
            }
            
            // Update task
            tasks[taskIndex].completed = completed;
            
            // If uncompleting, reset mood after
            if (!completed) {
                tasks[taskIndex].moodAfter = null;
            }
            
            // Save tasks
            storage.save(this.STORAGE_KEYS.TASKS, tasks);
            
            // Dispatch event
            this.dispatchTaskEvent('taskStatusChanged', { 
                taskId, 
                completed,
                task: tasks[taskIndex]
            });
            
            return true;
        } catch (error) {
            console.error('Error updating task status:', error);
            return false;
        }
    },
    
    /**
     * Complete task with mood rating
     * @param {string} taskId - Task ID
     * @param {number} moodAfter - Mood rating after completing task
     * @returns {boolean} - Success status
     */
    completeTaskWithMood: function(taskId, moodAfter) {
        try {
            // Get existing tasks
            const tasks = this.getAllTasks();
            
            // Find task index
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex === -1) {
                console.error('Task not found');
                return false;
            }
            
            // Update task
            tasks[taskIndex].completed = true;
            tasks[taskIndex].moodAfter = moodAfter;
            
            // Save tasks
            storage.save(this.STORAGE_KEYS.TASKS, tasks);
            
            // Dispatch event
            this.dispatchTaskEvent('taskStatusChanged', { 
                taskId, 
                completed: true,
                moodAfter,
                task: tasks[taskIndex]
            });
            
            return true;
        } catch (error) {
            console.error('Error completing task with mood:', error);
            return false;
        }
    },
    
    /**
     * Delete a task
     * @param {string} taskId - Task ID
     * @returns {boolean} - Success status
     */
    deleteTask: function(taskId) {
        try {
            // Get existing tasks
            const tasks = this.getAllTasks();
            
            // Find task index
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex === -1) {
                console.error('Task not found');
                return false;
            }
            
            // Remove task
            const deletedTask = tasks.splice(taskIndex, 1)[0];
            
            // Save tasks
            storage.save(this.STORAGE_KEYS.TASKS, tasks);
            
            // Dispatch event
            this.dispatchTaskEvent('taskDeleted', deletedTask);
            
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            return false;
        }
    },
    
    /**
     * Get all tasks
     * @returns {Array} - Array of task objects
     */
    getAllTasks: function() {
        return storage.get(this.STORAGE_KEYS.TASKS, []);
    },
    
    /**
     * Get task by ID
     * @param {string} taskId - Task ID
     * @returns {Object|null} - Task object or null if not found
     */
    getTaskById: function(taskId) {
        const tasks = this.getAllTasks();
        return tasks.find(task => task.id === taskId) || null;
    },
    
    /**
     * Get today's tasks
     * @returns {Array} - Array of today's task objects
     */
    getTodaysTasks: function() {
        const tasks = this.getAllTasks();
        const today = new Date().toDateString();
        
        return tasks.filter(task => {
            const taskDate = new Date(task.timestamp).toDateString();
            return taskDate === today;
        });
    },
    
    /**
     * Get tasks for the current week
     * @returns {Array} - Array of this week's task objects
     */
    getCurrentWeekTasks: function() {
        const tasks = this.getAllTasks();
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        return tasks.filter(task => {
            const taskDate = new Date(task.timestamp);
            return taskDate >= startOfWeek;
        });
    },
    
    /**
     * Get tasks for the current month
     * @returns {Array} - Array of this month's task objects
     */
    getCurrentMonthTasks: function() {
        const tasks = this.getAllTasks();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return tasks.filter(task => {
            const taskDate = new Date(task.timestamp);
            return taskDate >= startOfMonth;
        });
    },
    
    /**
     * Get statistics for today's tasks
     * @returns {Object} - Task statistics
     */
    getTodayTaskStats: function() {
        const tasks = this.getTodaysTasks();
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.length - completed;
        const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
        
        return {
            total: tasks.length,
            completed,
            pending,
            completionRate
        };
    },
    
    /**
     * Get weekly mood data
     * @returns {Object} - Weekly mood data
     */
    getWeeklyMoodData: function() {
        const tasks = this.getCurrentWeekTasks();
        const moodData = {};
        
        // Initialize days of the week
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            moodData[day] = {
                taskCount: 0,
                completedCount: 0,
                totalBefore: 0,
                totalAfter: 0,
                averageBefore: 0,
                averageAfter: 0,
                change: 0,
                tasks: []
            };
        });
        
        // Process tasks
        tasks.forEach(task => {
            const taskDate = new Date(task.timestamp);
            const day = days[taskDate.getDay()];
            
            moodData[day].taskCount++;
            
            if (task.completed) {
                moodData[day].completedCount++;
            }
            
            if (task.moodBefore !== null) {
                moodData[day].totalBefore += task.moodBefore;
            }
            
            if (task.completed && task.moodAfter !== null) {
                moodData[day].totalAfter += task.moodAfter;
            }
            
            // Add task to day's tasks
            if (task.moodBefore !== null || (task.completed && task.moodAfter !== null)) {
                moodData[day].tasks.push({
                    title: task.title,
                    moodBefore: task.moodBefore,
                    moodAfter: task.moodAfter,
                    change: task.completed && task.moodBefore !== null && task.moodAfter !== null ? 
                        task.moodAfter - task.moodBefore : 0
                });
            }
        });
        
        // Calculate averages and changes
        days.forEach(day => {
            const data = moodData[day];
            
            if (data.taskCount > 0 && data.totalBefore > 0) {
                data.averageBefore = data.totalBefore / data.taskCount;
            }
            
            if (data.completedCount > 0 && data.totalAfter > 0) {
                data.averageAfter = data.totalAfter / data.completedCount;
            }
            
            if (data.averageBefore > 0 && data.averageAfter > 0) {
                data.change = data.averageAfter - data.averageBefore;
            }
        });
        
        return moodData;
    },
    
    /**
     * Get monthly mood data
     * @returns {Object} - Monthly mood data
     */
    getMonthlyMoodData: function() {
        const tasks = this.getCurrentMonthTasks();
        const moodData = {};
        
        // Get current month
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        // Initialize days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            moodData[i] = {
                taskCount: 0,
                completedCount: 0,
                totalBefore: 0,
                totalAfter: 0,
                averageBefore: 0,
                averageAfter: 0,
                change: 0,
                tasks: []
            };
        }
        
        // Process tasks
        tasks.forEach(task => {
            const taskDate = new Date(task.timestamp);
            const day = taskDate.getDate();
            
            moodData[day].taskCount++;
            
            if (task.completed) {
                moodData[day].completedCount++;
            }
            
            if (task.moodBefore !== null) {
                moodData[day].totalBefore += task.moodBefore;
            }
            
            if (task.completed && task.moodAfter !== null) {
                moodData[day].totalAfter += task.moodAfter;
            }
            
            // Add task to day's tasks
            if (task.moodBefore !== null || (task.completed && task.moodAfter !== null)) {
                moodData[day].tasks.push({
                    title: task.title,
                    moodBefore: task.moodBefore,
                    moodAfter: task.moodAfter,
                    change: task.completed && task.moodBefore !== null && task.moodAfter !== null ? 
                        task.moodAfter - task.moodBefore : 0
                });
            }
        });
        
        // Calculate averages and changes
        for (let i = 1; i <= daysInMonth; i++) {
            const data = moodData[i];
            
            if (data.taskCount > 0 && data.totalBefore > 0) {
                data.averageBefore = data.totalBefore / data.taskCount;
            }
            
            if (data.completedCount > 0 && data.totalAfter > 0) {
                data.averageAfter = data.totalAfter / data.completedCount;
            }
            
            if (data.averageBefore > 0 && data.averageAfter > 0) {
                data.change = data.averageAfter - data.averageBefore;
            }
        }
        
        return moodData;
    },
    
    /**
     * Generate insights based on task completion and mood changes
     * @param {string} period - 'week' or 'month'
     * @returns {Array} - Array of insight objects
     */
    generateInsights: function(period = 'week') {
        const insights = [];
        let moodData;
        let tasks;
        
        if (period === 'week') {
            moodData = this.getWeeklyMoodData();
            tasks = this.getCurrentWeekTasks();
        } else {
            moodData = this.getMonthlyMoodData();
            tasks = this.getCurrentMonthTasks();
        }
        
        // Calculate overall stats
        const completedTasks = tasks.filter(task => task.completed);
        const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
        
        // Add completion rate insight
        insights.push({
            type: 'completion',
            title: `${period.charAt(0).toUpperCase() + period.slice(1)}ly Completion Rate`,
            value: `${completionRate.toFixed(0)}%`,
            description: `You've completed ${completedTasks.length} out of ${tasks.length} tasks this ${period}.`,
            icon: 'check-circle'
        });
        
        // Find most productive day
        let mostProductiveDay = null;
        let maxCompleted = 0;
        let mostProductiveDayDate = null;
        
        Object.entries(moodData).forEach(([day, data]) => {
            if (data.taskCount > maxCompleted) {
                maxCompleted = data.taskCount;
                mostProductiveDay = day;
                
                // Create a date object for the current month and this day
                if (period === 'month') {
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const dayNum = parseInt(day);
                    mostProductiveDayDate = new Date(year, month, dayNum);
                }
            }
        });
        
        if (mostProductiveDay) {
            let displayValue = mostProductiveDay;
            
            // Format date as DD-MM-YYYY for monthly insights
            if (period === 'month' && mostProductiveDayDate) {
                displayValue = mostProductiveDayDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
            
            insights.push({
                type: 'productivity',
                title: 'Most Productive Day',
                value: displayValue,
                description: `You completed ${maxCompleted} tasks on this day.`,
                icon: 'star'
            });
        }
        
        // Find best mood improvement
        let bestMoodDay = null;
        let bestMoodImprovement = -Infinity;
        let bestMoodPercentage = 0;
        
        Object.entries(moodData).forEach(([day, data]) => {
            if (data.change > bestMoodImprovement && data.taskCount > 0) {
                bestMoodImprovement = data.change;
                bestMoodDay = day;
                
                // Calculate percentage improvement
                if (data.averageBefore > 0) {
                    bestMoodPercentage = (data.change / data.averageBefore) * 100;
                }
            }
        });
        
        if (bestMoodDay && bestMoodImprovement > 0) {
            insights.push({
                type: 'mood',
                title: 'Best Mood Improvement',
                value: `+${bestMoodPercentage.toFixed(1)}%`,
                description: `Your mood improved the most on ${bestMoodDay} after completing tasks.`,
                icon: 'smile'
            });
        }
        
        // Find most effective task category
        const categoryEffectiveness = {};
        const categoryCounts = {};
        
        completedTasks.forEach(task => {
            if (task.moodBefore !== null && task.moodAfter !== null) {
                const category = task.category || 'general';
                const improvement = task.moodAfter - task.moodBefore;
                
                categoryEffectiveness[category] = (categoryEffectiveness[category] || 0) + improvement;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });
        
        let bestCategory = null;
        let bestImprovement = -Infinity;
        
        Object.entries(categoryEffectiveness).forEach(([category, total]) => {
            const average = total / categoryCounts[category];
            if (average > bestImprovement && categoryCounts[category] >= 2) {
                bestImprovement = average;
                bestCategory = category;
            }
        });
        
        if (bestCategory && bestImprovement > 0) {
            insights.push({
                type: 'category',
                title: 'Most Effective Task Type',
                value: bestCategory.charAt(0).toUpperCase() + bestCategory.slice(1),
                description: `${bestCategory.charAt(0).toUpperCase() + bestCategory.slice(1)} tasks improved your mood by an average of +${bestImprovement.toFixed(1)} points.`,
                icon: 'folder'
            });
        }
        
        return insights;
    },
    
    /**
     * Generate a unique task ID
     * @returns {string} - Unique ID
     */
    generateTaskId: function() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Dispatch a task event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail
     */
    dispatchTaskEvent: function(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
};
