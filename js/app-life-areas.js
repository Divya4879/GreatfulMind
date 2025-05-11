/**
 * Life areas functionality for GratefulMind
 * Handles loading and displaying life areas
 */

/**
 * Load life areas
 * @param {string} timePeriod - Time period (morning, afternoon, evening)
 */
function loadLifeAreas(timePeriod) {
    const container = document.getElementById('life-areas-container');
    if (!container) {
        console.error("Life areas container not found");
        return;
    }
    
    // Define life areas
    const lifeAreas = [
        {
            id: 'work',
            title: 'Work',
            icon: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path></svg>',
            morningPrompt: "What one work achievement would make today feel successful?",
            eveningPrompt: "How did your work contribute to your larger purpose today?"
        },
        {
            id: 'personal',
            title: 'Personal Growth',
            icon: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>',
            morningPrompt: "What small step can you take today toward your most meaningful goal?",
            eveningPrompt: "What did you learn about yourself today?"
        },
        {
            id: 'health',
            title: 'Health & Fitness',
            icon: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>',
            morningPrompt: "What one action will you take today to honor your physical wellbeing?",
            eveningPrompt: "How did you nourish your body and mind today?"
        },
        {
            id: 'social',
            title: 'Social',
            icon: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>',
            morningPrompt: "How will you meaningfully connect with someone today?",
            eveningPrompt: "What relationship brought you joy or growth today?"
        }
    ];
    
    // Create HTML for life areas
    const lifeAreasHTML = lifeAreas.map(area => createLifeAreaCard(area, timePeriod)).join('');
    
    // Render life areas
    container.innerHTML = lifeAreasHTML;
    
    // Add event listeners
    addLifeAreaEventListeners();
    
    console.log("Life areas loaded successfully");
}

/**
 * Create HTML for a life area card
 * @param {Object} area - Life area object
 * @param {string} timePeriod - Time period (morning, afternoon, evening)
 * @returns {string} - HTML string
 */
function createLifeAreaCard(area, timePeriod) {
    // Get existing data for this area
    const areaData = goalManager.getTodaysLifeAreaData(area.id);
    
    // Determine if we're showing morning or evening content
    const isEvening = timePeriod === 'evening';
    const prompt = isEvening ? area.eveningPrompt : area.morningPrompt;
    
    // Create card content
    let cardContent = `
        <div class="flex items-center gap-3 mb-4">
            <div class="text-green-600">
                ${area.icon}
            </div>
            <h4 class="text-lg font-medium text-green-900">${area.title}</h4>
        </div>
        <p class="text-green-900 font-bold mb-3">${prompt}</p>
    `;
    
    // If we have existing data
    if (areaData) {
        if (isEvening) {
            // Evening view - show goal and add reflection input if not already added
            cardContent += `
                <div class="mb-3 p-3 bg-green-50/70 rounded-lg">
                    <p class="text-sm text-green-700">Your goal:</p>
                    <p class="font-medium text-green-900 font-bold">${areaData.goal}</p>
                </div>
            `;
            
            if (areaData.reflection) {
                // Show existing reflection
                cardContent += `
                    <div class="p-3 bg-green-50/90 rounded-lg">
                        <p class="text-sm text-green-700">Your reflection:</p>
                        <p class="text-green-900 font-bold">${areaData.reflection}</p>
                    </div>
                `;
            } else {
                // Add reflection input
                cardContent += `
                    <div class="mt-3">
                        <label for="reflection-${area.id}" class="block text-sm font-medium text-green-700 mb-1">Reflect on your progress:</label>
                        <textarea id="reflection-${area.id}" class="w-full px-3 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" rows="2" placeholder="How did you do with your goal today?"></textarea>
                        <button class="save-reflection-btn mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm" data-area-id="${area.id}">Save Reflection</button>
                    </div>
                `;
            }
        } else {
            // Morning view - show existing goal
            cardContent += `
                <div class="p-3 bg-green-50/90 rounded-lg">
                    <p class="text-sm text-green-700">Your goal:</p>
                    <p class="text-green-900 font-bold">${areaData.goal}</p>
                </div>
            `;
        }
    } else {
        // No existing data - add goal input
        cardContent += `
            <div>
                <label for="goal-${area.id}" class="block text-sm font-medium text-green-700 mb-1">Set your goal:</label>
                <textarea id="goal-${area.id}" class="w-full px-3 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" rows="2" placeholder="What's your intention for this area today?"></textarea>
                <button class="save-goal-btn mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm" data-area-id="${area.id}">Save Goal</button>
            </div>
        `;
    }
    
    // Return card HTML
    return `
        <div class="life-area-card ${area.id} bg-white rounded-xl p-5 shadow-sm">
            ${cardContent}
        </div>
    `;
}

/**
 * Add event listeners to life area cards
 */
function addLifeAreaEventListeners() {
    // Save goal buttons
    document.querySelectorAll('.save-goal-btn').forEach(button => {
        button.addEventListener('click', function() {
            const areaId = this.dataset.areaId;
            const goalInput = document.getElementById(`goal-${areaId}`);
            
            if (!goalInput) return;
            
            const goal = goalInput.value.trim();
            
            if (!goal) {
                alert('Please enter a goal');
                return;
            }
            
            // Save goal
            goalManager.saveLifeAreaData(areaId, { goal });
            
            // Reload life areas
            loadLifeAreas(getCurrentTimePeriod());
        });
    });
    
    // Save reflection buttons
    document.querySelectorAll('.save-reflection-btn').forEach(button => {
        button.addEventListener('click', function() {
            const areaId = this.dataset.areaId;
            const reflectionInput = document.getElementById(`reflection-${areaId}`);
            
            if (!reflectionInput) return;
            
            const reflection = reflectionInput.value.trim();
            
            if (!reflection) {
                alert('Please enter a reflection');
                return;
            }
            
            // Get existing data
            const areaData = goalManager.getTodaysLifeAreaData(areaId);
            
            if (!areaData) return;
            
            // Update with reflection
            goalManager.saveLifeAreaData(areaId, {
                ...areaData,
                reflection
            });
            
            // Reload life areas
            loadLifeAreas(getCurrentTimePeriod());
        });
    });
}

/**
 * Get current time period
 * @returns {string} - Time period (morning, afternoon, evening)
 */
function getCurrentTimePeriod() {
    const hour = new Date().getHours();
    
    if (hour < 12) {
        return 'morning';
    } else if (hour < 18) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}
