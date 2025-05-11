/**
 * Progress visualization for GratefulMind
 * Handles loading and displaying progress charts
 */

/**
 * Load progress visualization
 */
function loadProgressVisualization() {
    const container = document.getElementById('progress-container');
    if (!container) return;
    
    // Create container for charts
    container.innerHTML = `
       
        <!-- Step 2: Daily Mood Chart -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h4 class="text-lg font-medium text-green-900 mb-3">Today's Mood Tracking</h4>
            <div class="h-64 relative">
                <canvas id="daily-mood-chart" aria-label="Daily mood before and after tasks" role="img"></canvas>
            </div>
        </div>
        
        
        
        <!-- Weekly & Monthly Trends -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Weekly Trends Chart -->
            <div class="bg-white rounded-xl p-5 shadow-sm">
                <h4 class="text-lg font-medium text-green-900 mb-3">Weekly Trends</h4>
                <div class="h-64 relative">
                    <canvas id="weekly-trends-chart" aria-label="Weekly trends chart" role="img"></canvas>
                </div>
            </div>
            
            <!-- Monthly Trends Chart -->
            <div class="bg-white rounded-xl p-5 shadow-sm">
                <h4 class="text-lg font-medium text-green-900 mb-3">Monthly Trends</h4>
                <div class="h-64 relative">
                    <canvas id="monthly-trends-chart" aria-label="Monthly trends chart" role="img"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Step 5: Weekly Insights -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h4 class="text-lg font-medium text-green-900 mb-3">Weekly Insights</h4>
            <div id="weekly-insights-container">
                <div class="flex justify-center py-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            </div>
        </div>
        
        <!-- Step 6: Monthly Insights -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
            <h4 class="text-lg font-medium text-green-900 mb-3">Monthly Insights</h4>
            <div id="monthly-insights-container">
                <div class="flex justify-center py-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize charts after container is created
    setTimeout(() => {
        if (typeof chartManager !== 'undefined') {
            try {
                chartManager.initCharts();
            } catch (error) {
                console.error('Error initializing charts:', error);
            }
        }
        
        // Load insights
        if (typeof insightManager !== 'undefined') {
            try {
                insightManager.renderWeeklyInsights('weekly-insights-container');
                insightManager.renderMonthlyInsights('monthly-insights-container');
            } catch (error) {
                console.error('Error rendering insights:', error);
            }
        }
    }, 100);
}
