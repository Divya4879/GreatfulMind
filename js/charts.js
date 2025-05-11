/**
 * Chart functionality for GratefulMind
 * Handles creating and updating charts
 */

const chartManager = {
    /**
     * Initialize charts
     */
    initCharts: function() {
        this.initTaskCompletionChart();
        this.initDailyMoodChart();
        this.initWeeklyMoodChart();
        this.initMonthlyMoodChart();
        this.initWeeklyTrendsChart();
        this.initMonthlyTrendsChart();
    },
    
    /**
     * Initialize task completion chart
     */
    initTaskCompletionChart: function() {
        const container = document.getElementById('task-completion-chart');
        if (!container) return;
        
        // Get task stats
        const stats = taskManager.getTodayTaskStats();
        
        // Create chart
        const taskChart = new Chart(container, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [stats.completed, stats.pending],
                    backgroundColor: [
                        '#3ba164', // Green for completed
                        '#e5e7eb'  // Gray for pending
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#215538',
                            font: {
                                size: 14,
                                family: "'Inter', sans-serif"
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 85, 56, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        titleFont: {
                            size: 16,
                            weight: 'bold',
                            family: "'Inter', sans-serif"
                        },
                        bodyFont: {
                            size: 14,
                            family: "'Inter', sans-serif"
                        },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            },
                            afterLabel: function(context) {
                                // Get tasks for the selected segment
                                const tasks = taskManager.getTodaysTasks();
                                const isCompleted = context.dataIndex === 0;
                                
                                // Filter tasks based on completion status
                                const filteredTasks = tasks.filter(task => task.completed === isCompleted);
                                
                                // Return task titles
                                return filteredTasks.map(task => `• ${task.title}`);
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 2
                    }
                }
            }
        });
        
        // No center text plugin - removed as requested
        
        return taskChart;
    },
    
    /**
     * Initialize daily mood chart
     */
    initDailyMoodChart: function() {
        const container = document.getElementById('daily-mood-chart');
        if (!container) return;
        
        // Get today's tasks
        const tasks = taskManager.getTodaysTasks();
        
        // Filter tasks with mood data
        const tasksWithMood = tasks.filter(task => task.moodBefore !== null && task.completed && task.moodAfter !== null);
        
        // If no tasks with mood data, show message
        if (tasksWithMood.length === 0) {
            const parent = container.parentElement;
            parent.innerHTML = `
                <div class="flex items-center justify-center h-64">
                    <p class="text-green-700">No mood data available for today. Complete tasks to see your mood changes.</p>
                </div>
            `;
            return;
        }
        
        // Prepare data
        const labels = tasksWithMood.map(task => task.title);
        const moodBefore = tasksWithMood.map(task => task.moodBefore);
        const moodAfter = tasksWithMood.map(task => task.moodAfter);
        
        // Create chart
        const dailyMoodChart = new Chart(container, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Before',
                        data: moodBefore,
                        backgroundColor: 'rgba(156, 163, 175, 0.5)',
                        borderColor: 'rgb(156, 163, 175)',
                        borderWidth: 1
                    },
                    {
                        label: 'After',
                        data: moodAfter,
                        backgroundColor: 'rgba(59, 161, 100, 0.5)',
                        borderColor: 'rgb(59, 161, 100)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Mood Level (1-10)',
                            color: '#215538',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 12
                            },
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(33, 85, 56, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tasks',
                            color: '#215538',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#215538',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 85, 56, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            afterBody: function(context) {
                                const index = context[0].dataIndex;
                                const task = tasksWithMood[index];
                                const change = task.moodAfter - task.moodBefore;
                                const changeText = change > 0 ? `+${change}` : change;
                                return `Mood change: ${changeText}`;
                            }
                        }
                    }
                }
            }
        });
        
        return dailyMoodChart;
    },
    
    /**
     * Initialize weekly mood chart
     */
    initWeeklyMoodChart: function() {
        const container = document.getElementById('weekly-mood-chart');
        if (!container) return;
        
        try {
            // Get weekly mood data
            const moodData = taskManager.getWeeklyMoodData();
            
            // Prepare data
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const beforeData = days.map(day => moodData[day].averageBefore || null);
            const afterData = days.map(day => moodData[day].averageAfter || null);
            
            // Create chart
            const weeklyMoodChart = new Chart(container, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [
                        {
                            label: 'Before Tasks',
                            data: beforeData,
                            backgroundColor: 'rgba(156, 163, 175, 0.2)',
                            borderColor: 'rgb(156, 163, 175)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 3
                        },
                        {
                            label: 'After Tasks',
                            data: afterData,
                            backgroundColor: 'rgba(59, 161, 100, 0.2)',
                            borderColor: 'rgb(59, 161, 100)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Average Mood (1-10)',
                                color: '#215538',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#215538',
                                font: {
                                    size: 12
                                },
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(33, 85, 56, 0.1)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Day of Week',
                                color: '#215538',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#215538',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#215538',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(33, 85, 56, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 12
                            },
                            padding: 10,
                            cornerRadius: 6,
                            callbacks: {
                                afterBody: function(context) {
                                    const index = context[0].dataIndex;
                                    const day = days[index];
                                    const data = moodData[day];
                                    
                                    if (data.taskCount === 0) {
                                        return 'No tasks recorded';
                                    }
                                    
                                    const lines = [
                                        `Tasks: ${data.taskCount}`,
                                        `Completed: ${data.completedCount}`
                                    ];
                                    
                                    if (data.change !== 0) {
                                        const changeText = data.change > 0 ? `+${data.change.toFixed(1)}` : data.change.toFixed(1);
                                        lines.push(`Average mood change: ${changeText}`);
                                    }
                                    
                                    return lines;
                                }
                            }
                        }
                    },
                    onClick: function(event, elements) {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const day = days[index];
                            const data = moodData[day];
                            
                            if (data.tasks && data.tasks.length > 0) {
                                showDayTasksModal(day, data.tasks);
                            }
                        }
                    }
                }
            });
            
            return weeklyMoodChart;
        } catch (error) {
            console.error('Error initializing weekly mood chart:', error);
            if (container) {
                container.parentElement.innerHTML = `
                    <div class="flex items-center justify-center h-64">
                        <p class="text-green-700">Unable to display weekly mood chart. Try adding more tasks with mood data.</p>
                    </div>
                `;
            }
            return null;
        }
    },
    
    /**
     * Initialize monthly mood chart
     */
    initMonthlyMoodChart: function() {
        const container = document.getElementById('monthly-mood-chart');
        if (!container) return;
        
        // Get monthly mood data
        const moodData = taskManager.getMonthlyMoodData();
        
        // Get current month
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        // Prepare data
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const beforeData = days.map(day => moodData[day].averageBefore || null);
        const afterData = days.map(day => moodData[day].averageAfter || null);
        
        // Format labels
        const labels = days.map(day => {
            const date = new Date(now.getFullYear(), now.getMonth(), day);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        });
        
        // Create chart
        const monthlyMoodChart = new Chart(container, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Before Tasks',
                        data: beforeData,
                        backgroundColor: 'rgba(156, 163, 175, 0.2)',
                        borderColor: 'rgb(156, 163, 175)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0 // Remove dots
                    },
                    {
                        label: 'After Tasks',
                        data: afterData,
                        backgroundColor: 'rgba(59, 161, 100, 0.2)',
                        borderColor: 'rgb(59, 161, 100)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0 // Remove dots
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Average Mood (1-10)',
                            color: '#215538',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 12
                            },
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(33, 85, 56, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                            color: '#215538',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 12
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#215538',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 85, 56, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            afterBody: function(context) {
                                const index = context[0].dataIndex;
                                const day = days[index];
                                const data = moodData[day];
                                
                                if (data.taskCount === 0) {
                                    return 'No tasks recorded';
                                }
                                
                                const lines = [
                                    `Tasks: ${data.taskCount}`,
                                    `Completed: ${data.completedCount}`
                                ];
                                
                                if (data.change !== 0) {
                                    const changeText = data.change > 0 ? `+${data.change.toFixed(1)}` : data.change.toFixed(1);
                                    lines.push(`Average mood change: ${changeText}`);
                                }
                                
                                return lines;
                            }
                        }
                    }
                },
                onClick: function(event, elements) {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const day = days[index];
                        const data = moodData[day];
                        
                        if (data.tasks.length > 0) {
                            const date = new Date(now.getFullYear(), now.getMonth(), day);
                            const dateStr = date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            });
                            
                            showDayTasksModal(dateStr, data.tasks);
                        }
                    }
                }
            }
        });
        
        return monthlyMoodChart;
    }
};

/**
 * Show modal with tasks for a specific day
 * @param {string} day - Day label
 * @param {Array} tasks - Tasks for the day
 */
function showDayTasksModal(day, tasks) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('day-tasks-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'day-tasks-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        document.body.appendChild(modal);
    }
    
    // Create tasks HTML
    const tasksHTML = tasks.map(task => `
        <div class="mb-3 p-3 bg-green-50 rounded-lg">
            <p class="font-medium text-green-900">${task.title}</p>
            <div class="mt-2 flex items-center text-sm">
                <span class="text-green-700">Mood change: </span>
                <span class="ml-1 font-medium ${task.change > 0 ? 'text-green-600' : task.change < 0 ? 'text-red-600' : 'text-gray-600'}">
                    ${task.change > 0 ? '+' : ''}${task.change}
                </span>
                <span class="mx-2">•</span>
                <span class="text-green-700">Before: </span>
                <span class="ml-1 font-medium">${task.moodBefore}/10</span>
                <span class="mx-1">→</span>
                <span class="text-green-700">After: </span>
                <span class="ml-1 font-medium">${task.moodAfter}/10</span>
            </div>
        </div>
    `).join('');
    
    // Set modal content
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div class="px-6 py-4 bg-green-50 border-b border-green-100">
                <h3 class="text-lg font-medium text-green-900">Tasks for ${day}</h3>
            </div>
            <div class="p-6">
                ${tasksHTML}
                <div class="mt-4 flex justify-end">
                    <button id="close-modal-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener to close button
    setTimeout(() => {
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });
        }
    }, 0);
}

/**
 * Initialize weekly trends chart
 */
chartManager.initWeeklyTrendsChart = function() {
    const container = document.getElementById('weekly-trends-chart');
    if (!container) return;
    
    try {
        // Get data for the last 7 days
        const days = [];
        const now = new Date();
        const completionData = [];
        const moodData = [];
        const streakData = [];
        
        // Generate labels for the last 7 days and collect real data
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            // Get tasks for this day
            const dayTasks = taskManager.getAllTasks().filter(task => {
                const taskDate = new Date(task.timestamp);
                return taskDate.toDateString() === date.toDateString();
            });
            
            // Calculate completion percentage
            const totalTasks = dayTasks.length;
            const completedTasks = dayTasks.filter(task => task.completed).length;
            const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            completionData.push(completionPercentage);
            
            // Calculate average mood after tasks
            const tasksWithMood = dayTasks.filter(task => task.completed && task.moodAfter !== null);
            const avgMood = tasksWithMood.length > 0 
                ? tasksWithMood.reduce((sum, task) => sum + task.moodAfter, 0) / tasksWithMood.length 
                : null;
            moodData.push(avgMood);
            
            // Calculate streak (consecutive days with completed tasks)
            // For simplicity, we'll just count the number of completed tasks for now
            streakData.push(completedTasks);
        }
        
        // Create chart
        const weeklyTrendsChart = new Chart(container, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Task Completion %',
                        data: completionData,
                        backgroundColor: 'rgba(59, 161, 100, 0.7)',
                        borderColor: 'rgb(59, 161, 100)',
                        borderWidth: 1,
                        yAxisID: 'y',
                        order: 2
                    },
                    {
                        label: 'Avg Mood (1-10)',
                        data: moodData,
                        backgroundColor: 'rgba(156, 163, 175, 0)',
                        borderColor: 'rgb(156, 163, 175)',
                        borderWidth: 2,
                        type: 'line',
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgb(156, 163, 175)',
                        yAxisID: 'y1',
                        order: 1
                    },
                    {
                        label: 'Completed Tasks',
                        data: streakData,
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                        borderColor: 'rgb(245, 158, 11)',
                        borderWidth: 1,
                        yAxisID: 'y2',
                        type: 'line',
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgb(245, 158, 11)',
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Completion %',
                            color: '#215538',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(33, 85, 56, 0.1)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        max: 10,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Mood (1-10)',
                            color: '#6B7280',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y2: {
                        display: false,
                        beginAtZero: true,
                        suggestedMax: 5
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Day',
                            color: '#215538',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#215538',
                            font: {
                                size: 11
                            },
                            boxWidth: 12,
                            padding: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 85, 56, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 8,
                        cornerRadius: 6,
                        callbacks: {
                            afterBody: function(context) {
                                const index = context[0].dataIndex;
                                const date = new Date(now);
                                date.setDate(now.getDate() - (6 - index));
                                
                                // Get tasks for this day
                                const dayTasks = taskManager.getAllTasks().filter(task => {
                                    const taskDate = new Date(task.timestamp);
                                    return taskDate.toDateString() === date.toDateString();
                                });
                                
                                if (dayTasks.length === 0) {
                                    return 'No tasks recorded';
                                }
                                
                                const totalTasks = dayTasks.length;
                                const completedTasks = dayTasks.filter(task => task.completed).length;
                                
                                return [
                                    `Total tasks: ${totalTasks}`,
                                    `Completed: ${completedTasks}`,
                                    `Completion rate: ${Math.round((completedTasks / totalTasks) * 100)}%`
                                ];
                            }
                        }
                    }
                }
            }
        });
        
        return weeklyTrendsChart;
    } catch (error) {
        console.error('Error initializing weekly trends chart:', error);
        if (container) {
            container.parentElement.innerHTML = `
                <div class="flex items-center justify-center h-64">
                    <p class="text-green-700">Unable to display weekly trends. Try adding more tasks with mood data.</p>
                </div>
            `;
        }
        return null;
    }
};

/**
 * Initialize monthly trends chart
 */
chartManager.initMonthlyTrendsChart = function() {
    const container = document.getElementById('monthly-trends-chart');
    if (!container) return;
    
    try {
        // Get current month data
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const currentDay = now.getDate();
        
        // Generate labels for days in the current month (up to current day)
        const days = [];
        const completedTasks = [];
        const journalEntries = [];
        const avgMood = [];
        
        // Get all tasks
        const allTasks = taskManager.getAllTasks();
        
        // Check if journalManager exists and get entries
        let allJournalEntries = [];
        if (typeof journalManager !== 'undefined' && journalManager.getAllEntries) {
            try {
                allJournalEntries = journalManager.getAllEntries();
            } catch (error) {
                console.error('Error getting journal entries:', error);
            }
        }
        
        // Collect real data for each day of the month
        for (let i = 1; i <= currentDay; i++) {
            const date = new Date(year, month, i);
            days.push(i); // Just show the day number for simplicity
            
            // Get tasks for this day
            const dayTasks = allTasks.filter(task => {
                const taskDate = new Date(task.timestamp);
                return taskDate.getDate() === i && 
                       taskDate.getMonth() === month && 
                       taskDate.getFullYear() === year;
            });
            
            // Get journal entries for this day
            const dayEntries = allJournalEntries.filter(entry => {
                if (!entry || !entry.timestamp) return false;
                const entryDate = new Date(entry.timestamp);
                return entryDate.getDate() === i && 
                       entryDate.getMonth() === month && 
                       entryDate.getFullYear() === year;
            });
            
            // Count completed tasks
            const completed = dayTasks.filter(task => task.completed).length;
            completedTasks.push(completed);
            
            // Count journal entries
            journalEntries.push(dayEntries.length);
            
            // Calculate average mood after tasks
            const tasksWithMood = dayTasks.filter(task => task.completed && task.moodAfter !== null);
            const dayAvgMood = tasksWithMood.length > 0 
                ? tasksWithMood.reduce((sum, task) => sum + task.moodAfter, 0) / tasksWithMood.length 
                : null;
            avgMood.push(dayAvgMood);
        }
        
        // Create chart
        const monthlyTrendsChart = new Chart(container, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Completed Tasks',
                        data: completedTasks,
                        backgroundColor: 'rgba(59, 161, 100, 0.2)',
                        borderColor: 'rgb(59, 161, 100)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Journal Entries',
                        data: journalEntries,
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: 'rgb(79, 70, 229)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Avg Mood (1-10)',
                        data: avgMood,
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        borderColor: 'rgb(245, 158, 11)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Count',
                            color: '#215538',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 11
                            },
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(33, 85, 56, 0.1)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        max: 10,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Mood (1-10)',
                            color: '#F59E0B',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#F59E0B',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: `Day of ${now.toLocaleString('default', { month: 'long' })}`,
                            color: '#215538',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: '#215538',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#215538',
                            font: {
                                size: 11
                            },
                            boxWidth: 12,
                            padding: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 85, 56, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 8,
                        cornerRadius: 6,
                        callbacks: {
                            title: function(context) {
                                const dayNum = context[0].label;
                                const date = new Date(year, month, dayNum);
                                return date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            },
                            afterBody: function(context) {
                                const dayNum = parseInt(context[0].label);
                                const date = new Date(year, month, dayNum);
                                
                                // Get tasks for this day
                                const dayTasks = allTasks.filter(task => {
                                    const taskDate = new Date(task.timestamp);
                                    return taskDate.getDate() === dayNum && 
                                           taskDate.getMonth() === month && 
                                           taskDate.getFullYear() === year;
                                });
                                
                                const lines = [];
                                
                                if (dayTasks.length > 0) {
                                    const totalTasks = dayTasks.length;
                                    const completedTasks = dayTasks.filter(task => task.completed).length;
                                    
                                    lines.push(`Total tasks: ${totalTasks}`);
                                    lines.push(`Completed: ${completedTasks}`);
                                    if (totalTasks > 0) {
                                        lines.push(`Completion rate: ${Math.round((completedTasks / totalTasks) * 100)}%`);
                                    }
                                } else {
                                    lines.push('No tasks recorded');
                                }
                                
                                // Add journal entry info if available
                                if (allJournalEntries.length > 0) {
                                    const dayEntries = allJournalEntries.filter(entry => {
                                        if (!entry || !entry.timestamp) return false;
                                        const entryDate = new Date(entry.timestamp);
                                        return entryDate.getDate() === dayNum && 
                                               entryDate.getMonth() === month && 
                                               entryDate.getFullYear() === year;
                                    });
                                    
                                    if (dayEntries.length > 0) {
                                        lines.push(`Journal entries: ${dayEntries.length}`);
                                    }
                                }
                                
                                return lines;
                            }
                        }
                    }
                }
            }
        });
        
        return monthlyTrendsChart;
    } catch (error) {
        console.error('Error initializing monthly trends chart:', error);
        if (container) {
            container.parentElement.innerHTML = `
                <div class="flex items-center justify-center h-64">
                    <p class="text-green-700">Unable to display monthly trends. Try adding more tasks with mood data.</p>
                </div>
            `;
        }
        return null;
    }
};
