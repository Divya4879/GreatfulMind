/**
 * Feelings tracking functionality for GratefulMind
 * Handles loading and displaying feelings tracking
 */

/**
 * Load feelings tracking
 */
function loadFeelingsTracking() {
    const container = document.getElementById('feelings-container');
    if (!container) return;
    
    // Get feelings data
    const feelingsData = feelingsManager.getFeelingsData();
    
    // If no data, show empty state
    if (!feelingsData || Object.keys(feelingsData).length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-green-700">No feelings data yet. Track your feelings to see insights here.</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for feelings data
    let feelingsHTML = '';
    
    // Add feelings chart
    feelingsHTML += `
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h4 class="text-lg font-medium text-green-200 mb-3">Feelings Over Time</h4>
            <div class="h-64 relative">
                <canvas id="feelings-chart" aria-label="Feelings over time" role="img"></canvas>
            </div>
        </div>
    `;
    
    // Add feelings insights
    const insights = feelingsManager.generateInsights();
    
    if (insights.length > 0) {
        feelingsHTML += `
            <div class="bg-white rounded-xl p-4 shadow-sm">
                <h4 class="text-lg font-medium text-green-200 mb-3">Feelings Insights</h4>
                <div class="space-y-4">
                    ${insights.map(insight => `
                        <div class="p-3 bg-green-50 rounded-lg">
                            <p class="text-green-900 font-bold">${insight}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Render feelings data
    container.innerHTML = feelingsHTML;
    
    // Initialize feelings chart
    initFeelingsChart();
}

/**
 * Initialize feelings chart
 */
function initFeelingsChart() {
    const container = document.getElementById('feelings-chart');
    if (!container) return;
    
    // Get feelings data
    const feelingsData = feelingsManager.getFeelingsData();
    
    // Prepare data for chart
    const dates = Object.keys(feelingsData).sort();
    const values = dates.map(date => feelingsData[date].value);
    
    // Create chart
    new Chart(container, {
        type: 'line',
        data: {
            labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Feeling',
                data: values,
                backgroundColor: 'rgba(59, 161, 100, 0.2)',
                borderColor: 'rgb(44, 133, 80)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
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
                        text: 'Feeling Level (1-10)',
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
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 85, 56, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    titleFont: {
                        size: 16,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            const date = new Date(dates[context[0].dataIndex]);
                            return date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        },
                        label: function(context) {
                            const value = context.raw || 0;
                            return `Feeling: ${value}/10`;
                        },
                        afterBody: function(context) {
                            const dataIndex = context.dataIndex;
                            const date = dates[dataIndex];
                            const note = feelingsData[date].note;
                            
                            return note ? `Note: ${note}` : '';
                        }
                    }
                }
            }
        }
    });
}

// Initialize feelings tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load feelings tracking
    loadFeelingsTracking();
});
