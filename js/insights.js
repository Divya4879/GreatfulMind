/**
 * Insights generation for GratefulMind
 * Analyzes journal entries, tasks, and mood data to generate personalized insights
 */

const insightManager = {
    /**
     * Generate weekly insights based on journal entries and tasks
     * @returns {Array} - Array of insight objects
     */
    generateWeeklyInsights: function() {
        try {
            const insights = [];
            
            // Get data for analysis
            let weekEntries = [];
            if (typeof journalManager !== 'undefined' && journalManager.getCurrentWeekEntries) {
                try {
                    weekEntries = journalManager.getCurrentWeekEntries();
                } catch (error) {
                    console.error('Error getting weekly journal entries:', error);
                }
            }
            
            const weekTasks = taskManager.getCurrentWeekTasks();
            const weeklyMoodData = taskManager.getWeeklyMoodData();
            
            // Add task-based insights
            try {
                const taskInsights = taskManager.generateInsights('week');
                insights.push(...taskInsights);
            } catch (error) {
                console.error('Error generating task insights:', error);
            }
            
            // Add gratitude insights
            if (weekEntries && weekEntries.length > 0) {
                // Most common gratitude themes
                try {
                    const gratitudeThemes = this.extractGratitudeThemes(weekEntries);
                    if (gratitudeThemes.length > 0) {
                        insights.push({
                            type: 'gratitude',
                            title: 'Top Gratitude Themes',
                            value: gratitudeThemes[0],
                            description: `You frequently expressed gratitude for ${gratitudeThemes[0].toLowerCase()} this week.`,
                            icon: 'heart'
                        });
                    }
                } catch (error) {
                    console.error('Error extracting gratitude themes:', error);
                }
                
                // Journaling consistency
                try {
                    const journalingDays = new Set(weekEntries.map(entry => 
                        new Date(entry.timestamp).toDateString()
                    )).size;
                    
                    insights.push({
                        type: 'consistency',
                        title: 'Journaling Consistency',
                        value: `${journalingDays}/7`,
                        description: `You journaled on ${journalingDays} out of 7 days this week.`,
                        icon: 'calendar'
                    });
                } catch (error) {
                    console.error('Error calculating journaling consistency:', error);
                }
            }
            
            // Add mood-related insights
            try {
                let bestMoodDay = null;
                let bestMoodChange = -Infinity;
                
                Object.entries(weeklyMoodData).forEach(([day, data]) => {
                    if (data.change > bestMoodChange && data.taskCount > 0) {
                        bestMoodChange = data.change;
                        bestMoodDay = day;
                    }
                });
                
                if (bestMoodDay && bestMoodChange > 0) {
                    // Find what tasks were completed on the best mood day
                    const bestDayData = weeklyMoodData[bestMoodDay];
                    if (bestDayData.tasks && bestDayData.tasks.length > 0) {
                        // Find the task with the biggest positive impact
                        let bestTask = null;
                        let bestTaskChange = -Infinity;
                        
                        bestDayData.tasks.forEach(task => {
                            if (task.change > bestTaskChange) {
                                bestTaskChange = task.change;
                                bestTask = task;
                            }
                        });
                        
                        if (bestTask) {
                            insights.push({
                                type: 'mood-booster',
                                title: 'Biggest Mood Booster',
                                value: bestTask.title,
                                description: `Completing "${bestTask.title}" improved your mood by +${bestTaskChange} points.`,
                                icon: 'sun'
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error generating mood insights:', error);
            }
            
            return insights;
        } catch (error) {
            console.error('Error generating weekly insights:', error);
            return [];
        }
    },
    
    /**
     * Generate monthly insights based on journal entries and tasks
     * @returns {Array} - Array of insight objects
     */
    generateMonthlyInsights: function() {
        try {
            const insights = [];
            
            // Get data for analysis
            let monthEntries = [];
            if (typeof journalManager !== 'undefined' && journalManager.getCurrentMonthEntries) {
                try {
                    monthEntries = journalManager.getCurrentMonthEntries();
                } catch (error) {
                    console.error('Error getting monthly journal entries:', error);
                }
            }
            
            const monthTasks = taskManager.getCurrentMonthTasks();
            const monthlyMoodData = taskManager.getMonthlyMoodData();
            
            // Add task-based insights
            try {
                const taskInsights = taskManager.generateInsights('month');
                insights.push(...taskInsights);
            } catch (error) {
                console.error('Error generating monthly task insights:', error);
            }
            
            // Add gratitude insights
            if (monthEntries && monthEntries.length > 0) {
                // Most common gratitude themes
                try {
                    const gratitudeThemes = this.extractGratitudeThemes(monthEntries);
                    if (gratitudeThemes.length > 0) {
                        insights.push({
                            type: 'gratitude',
                            title: 'Monthly Gratitude Focus',
                            value: gratitudeThemes.slice(0, 2).join(', '),
                            description: `This month, you've been most grateful for ${gratitudeThemes.slice(0, 2).join(' and ').toLowerCase()}.`,
                            icon: 'heart'
                        });
                    }
                } catch (error) {
                    console.error('Error extracting monthly gratitude themes:', error);
                }
                
                // Journaling consistency
                try {
                    const journalingDays = new Set(monthEntries.map(entry => 
                        new Date(entry.timestamp).toDateString()
                    )).size;
                    
                    const today = new Date();
                    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                    const daysPassed = Math.min(today.getDate(), daysInMonth);
                    
                    insights.push({
                        type: 'consistency',
                        title: 'Monthly Consistency',
                        value: `${Math.round((journalingDays / daysPassed) * 100)}%`,
                        description: `You've journaled on ${journalingDays} out of ${daysPassed} days this month.`,
                        icon: 'calendar'
                    });
                } catch (error) {
                    console.error('Error calculating monthly journaling consistency:', error);
                }
            }
            
            // Add mood trend insights
            try {
                const moodTrend = this.analyzeMoodTrend(monthlyMoodData);
                if (moodTrend) {
                    insights.push({
                        type: 'trend',
                        title: 'Monthly Mood Trend',
                        value: moodTrend.direction === 'up' ? 
                            `+${(moodTrend.slope * 100).toFixed(1)}%` : 
                            (moodTrend.direction === 'down' ? 
                                `-${Math.abs(moodTrend.slope * 100).toFixed(1)}%` : 
                                'Stable'),
                        description: moodTrend.description,
                        icon: moodTrend.direction === 'up' ? 'trending-up' : (moodTrend.direction === 'down' ? 'trending-down' : 'minus')
                    });
                }
            } catch (error) {
                console.error('Error analyzing mood trend:', error);
            }
            
            // Add task category effectiveness
            try {
                const categoryEffectiveness = this.analyzeTaskCategoryEffectiveness(monthTasks);
                if (categoryEffectiveness.category) {
                    insights.push({
                        type: 'effectiveness',
                        title: 'Most Effective Task Type',
                        value: categoryEffectiveness.category.charAt(0).toUpperCase() + categoryEffectiveness.category.slice(1),
                        description: `${categoryEffectiveness.category.charAt(0).toUpperCase() + categoryEffectiveness.category.slice(1)} tasks improved your mood by an average of +${categoryEffectiveness.improvement.toFixed(1)} points.`,
                        icon: 'star'
                    });
                }
            } catch (error) {
                console.error('Error analyzing task category effectiveness:', error);
            }
            
            return insights;
        } catch (error) {
            console.error('Error generating monthly insights:', error);
            return [];
        }
    },
    
    /**
     * Extract common gratitude themes from journal entries
     * @param {Array} entries - Journal entries to analyze
     * @returns {Array} - Array of theme strings
     */
    extractGratitudeThemes: function(entries) {
        // Simple keyword-based theme extraction
        const keywords = {
            'Relationships': ['family', 'friend', 'partner', 'relationship', 'connection', 'love', 'support', 'together'],
            'Health': ['health', 'exercise', 'fitness', 'wellness', 'strength', 'energy', 'sleep'],
            'Nature': ['nature', 'outdoors', 'sun', 'sky', 'trees', 'flowers', 'garden', 'park', 'beach'],
            'Work': ['work', 'job', 'career', 'project', 'achievement', 'success', 'accomplishment'],
            'Personal Growth': ['learn', 'growth', 'improve', 'progress', 'goal', 'challenge', 'overcome'],
            'Creativity': ['create', 'art', 'music', 'write', 'play', 'hobby', 'craft'],
            'Spirituality': ['spiritual', 'faith', 'belief', 'meditation', 'mindful', 'practice', 'peace']
        };
        
        const themeCounts = {};
        
        // Initialize counts
        Object.keys(keywords).forEach(theme => {
            themeCounts[theme] = 0;
        });
        
        // Count keyword occurrences
        entries.forEach(entry => {
            if (!entry.content) return;
            
            const content = entry.content.toLowerCase();
            
            Object.entries(keywords).forEach(([theme, words]) => {
                words.forEach(word => {
                    if (content.includes(word.toLowerCase())) {
                        themeCounts[theme]++;
                    }
                });
            });
        });
        
        // Sort themes by count
        return Object.entries(themeCounts)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([theme]) => theme);
    },
    
    /**
     * Analyze mood trend from monthly data
     * @param {Object} monthlyData - Monthly mood data
     * @returns {Object|null} - Trend object or null
     */
    analyzeMoodTrend: function(monthlyData) {
        const days = Object.keys(monthlyData)
            .filter(day => monthlyData[day].taskCount > 0)
            .sort((a, b) => parseInt(a) - parseInt(b));
        
        if (days.length < 5) return null;
        
        // Get mood values for days with data
        const moodValues = days.map(day => monthlyData[day].averageAfter);
        
        // Calculate trend (simple linear regression)
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        
        for (let i = 0; i < days.length; i++) {
            sumX += i;
            sumY += moodValues[i];
            sumXY += i * moodValues[i];
            sumXX += i * i;
        }
        
        const n = days.length;
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        
        // Determine trend direction
        let direction;
        let description;
        
        if (Math.abs(slope) < 0.05) {
            direction = 'stable';
            description = 'Your mood has been relatively stable throughout the month.';
        } else if (slope > 0) {
            direction = 'up';
            description = `Your mood has been improving by about ${(slope * 100).toFixed(1)}% every 10 days.`;
        } else {
            direction = 'down';
            description = `Your mood has been declining by about ${Math.abs(slope * 100).toFixed(1)}% every 10 days.`;
        }
        
        return { direction, description, slope };
    },
    
    /**
     * Analyze which task categories have the most positive effect on mood
     * @param {Array} tasks - Tasks to analyze
     * @returns {Object} - Most effective category and improvement value
     */
    analyzeTaskCategoryEffectiveness: function(tasks) {
        const completedWithMood = tasks.filter(task => 
            task.completed && task.moodBefore !== null && task.moodAfter !== null
        );
        
        if (completedWithMood.length === 0) {
            return { category: null, improvement: 0 };
        }
        
        // Group by category
        const categoryImprovements = {};
        const categoryCounts = {};
        
        completedWithMood.forEach(task => {
            const category = task.category || 'general';
            const improvement = task.moodAfter - task.moodBefore;
            
            categoryImprovements[category] = (categoryImprovements[category] || 0) + improvement;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        // Calculate average improvement per category
        const categoryAverages = {};
        
        Object.entries(categoryImprovements).forEach(([category, total]) => {
            categoryAverages[category] = total / categoryCounts[category];
        });
        
        // Find category with highest average improvement
        let bestCategory = null;
        let bestImprovement = -Infinity;
        
        Object.entries(categoryAverages).forEach(([category, avg]) => {
            if (avg > bestImprovement && categoryCounts[category] >= 3) { // Require at least 3 tasks
                bestImprovement = avg;
                bestCategory = category;
            }
        });
        
        return {
            category: bestCategory,
            improvement: bestImprovement
        };
    },
    
    /**
     * Identify areas for growth in gratitude practice
     * @param {Array} entries - Journal entries to analyze
     * @returns {Array} - Growth areas
     */
    identifyGrowthAreas: function(entries) {
        const themes = this.extractGratitudeThemes(entries);
        const allThemes = [
            'Relationships', 'Health', 'Nature', 'Work', 
            'Personal Growth', 'Creativity', 'Spirituality'
        ];
        
        // Find themes that are not in the top 3
        const topThemes = new Set(themes.slice(0, 3));
        const growthAreas = allThemes.filter(theme => !topThemes.has(theme));
        
        return growthAreas;
    },
    
    /**
     * Render weekly insights in the specified container
     * @param {string} containerId - Container element ID
     */
    renderWeeklyInsights: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const insights = this.generateWeeklyInsights();
            
            if (insights.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-green-700">Complete tasks and journal entries to generate insights.</p>
                    </div>
                `;
                return;
            }
            
            // Create insights HTML
            const insightsHTML = insights.map(insight => this.createInsightCard(insight)).join('');
            
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${insightsHTML}
                </div>
            `;
        } catch (error) {
            console.error('Error rendering weekly insights:', error);
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-green-700">Unable to display insights. Try adding more tasks with mood data.</p>
                </div>
            `;
        }
    },
    
    /**
     * Render monthly insights in the specified container
     * @param {string} containerId - Container element ID
     */
    renderMonthlyInsights: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const insights = this.generateMonthlyInsights();
            
            if (insights.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-green-700">Complete tasks and journal entries to generate monthly insights.</p>
                    </div>
                `;
                return;
            }
            
            // Create insights HTML
            const insightsHTML = insights.map(insight => this.createInsightCard(insight)).join('');
            
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${insightsHTML}
                </div>
            `;
        } catch (error) {
            console.error('Error rendering monthly insights:', error);
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-green-700">Unable to display monthly insights. Try adding more tasks with mood data.</p>
                </div>
            `;
        }
    },
    
    /**
     * Create HTML for an insight card
     * @param {Object} insight - Insight object
     * @returns {string} - HTML string
     */
    createInsightCard: function(insight) {
        // Define icon based on insight type
        const iconMap = {
            'completion': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
            'productivity': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',
            'mood': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg>',
            'category': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>',
            'gratitude': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>',
            'consistency': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>',
            'mood-booster': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>',
            'correlation': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
            'trend': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path></svg>',
            'effectiveness': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',
            'growth': '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>'
        };
        
        // Get icon or use default
        const icon = iconMap[insight.type] || iconMap.productivity;
        
        // Create card with appropriate styling
        return `
            <div class="bg-white rounded-xl shadow-soft p-5 hover-card">
                <div class="flex items-start">
                    <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                        ${icon}
                    </div>
                    <div class="ml-4">
                        <h4 class="text-lg font-medium text-green-800">${insight.title}</h4>
                        <div class="mt-1 text-2xl font-bold text-green-700">${insight.value}</div>
                        <p class="mt-2 text-sm text-green-700">${insight.description}</p>
                    </div>
                </div>
            </div>
        `;
    }
};
