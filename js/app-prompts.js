/**
 * Prompt loading and display for GratefulMind
 * Handles loading and displaying prompts for all time periods
 */

/**
 * Load prompts for the journal
 */
async function loadPrompts() {
    const container = document.getElementById('prompts-container');
    if (!container) {
        console.error("Prompts container not found");
        return;
    }
    
    try {
        // Get user identities - use empty array if no identities are set
        const userIdentities = userManager.getAllIdentitiesFlat() || [];
        
        // Get prompts for all time periods
        const morningPrompts = await getPromptsForTimePeriod('morning', userIdentities);
        const afternoonPrompts = await getPromptsForTimePeriod('afternoon', userIdentities);
        const eveningPrompts = await getPromptsForTimePeriod('evening', userIdentities);
        
        // Create HTML for prompts
        container.innerHTML = `
            <div class="space-y-6">
                <!-- Morning prompts -->
                <div>
                    <h4 class="text-lg font-medium text-green-200 mb-3">
                        <svg class="inline-block h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                        </svg>
                        Morning Reflections
                    </h4>
                    <div class="space-y-4">
                        ${morningPrompts.map(createPromptCard).join('')}
                    </div>
                </div>
                
                <!-- Afternoon prompts -->
                <div>
                    <h4 class="text-lg font-medium text-green-200 mb-3">
                        <svg class="inline-block h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4zm0 1a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                        </svg>
                        Afternoon Reflections
                    </h4>
                    <div class="space-y-4">
                        ${afternoonPrompts.map(createPromptCard).join('')}
                    </div>
                </div>
                
                <!-- Evening prompts -->
                <div>
                    <h4 class="text-lg font-medium text-green-200 mb-3">
                        <svg class="inline-block h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                        </svg>
                        Evening Reflections
                    </h4>
                    <div class="space-y-4">
                        ${eveningPrompts.map(createPromptCard).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to prompt cards
        container.querySelectorAll('.prompt-card').forEach(card => {
            card.addEventListener('click', function() {
                const prompt = this.querySelector('.prompt-text').textContent;
                showJournalEntryForm(prompt);
            });
        });
        
        console.log("Prompts loaded successfully");
    } catch (error) {
        console.error('Error loading prompts:', error);
        container.innerHTML = `
            <div class="bg-white rounded-xl p-5 shadow-sm">
                <p class="text-green-700">Error loading prompts. Please try refreshing the page.</p>
            </div>
        `;
    }
}

/**
 * Get prompts for a specific time period
 * @param {string} timePeriod - Time period (morning, afternoon, evening)
 * @param {Array} userIdentities - User identities
 * @returns {Promise<Array>} - Array of prompt objects
 */
async function getPromptsForTimePeriod(timePeriod, userIdentities) {
    const categories = promptManager.CATEGORIES;
    const prompts = [];
    
    for (const category of categories) {
        const prompt = await promptManager.getPersonalizedPrompt(category, userIdentities, timePeriod);
        prompts.push({
            category: category,
            prompt: prompt,
            timePeriod: timePeriod
        });
    }
    
    return prompts;
}

/**
 * Create HTML for a prompt card
 * @param {Object} promptData - Prompt data object
 * @returns {string} - HTML string
 */
function createPromptCard(promptData) {
    const categoryIcons = {
        gratitude: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>',
        feelings: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg>',
        actions: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>',
        productivity: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path></svg>',
        satisfaction: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
    };
    
    const icon = categoryIcons[promptData.category] || categoryIcons.gratitude;
    
    return `
        <div class="prompt-card bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-start">
                <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                    ${icon}
                </div>
                <div class="ml-3">
                    <p class="prompt-text text-green-900 font-bold">${promptData.prompt}</p>
                    <div class="mt-2 flex items-center text-xs text-green-700">
                        <span class="capitalize">${promptData.category}</span>
                        <span class="mx-1">•</span>
                        <span class="capitalize">${promptData.timePeriod}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show journal entry form for a prompt
 * @param {string} prompt - The prompt text
 */
function showJournalEntryForm(prompt) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('journal-entry-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'journal-entry-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'journal-modal-title');
        
        document.body.appendChild(modal);
    }
    
    // Create modal content
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden transform transition-all" 
             role="document">
            <div class="px-6 py-4 bg-green-50 border-b border-green-100">
                <h3 id="journal-modal-title" class="text-lg font-serif font-semibold text-green-200">
                    Journal Entry
                </h3>
            </div>
            <div class="p-6">
                <div class="mb-4 bg-green-50 p-3 rounded-lg">
                    <p class="text-green-900 font-bold italic">${prompt}</p>
                </div>
                
                <form id="journal-entry-form">
                    <div class="mb-4">
                        <label for="journal-content" class="block text-sm font-medium text-gray-800 mb-1">
                            Your thoughts
                        </label>
                        <textarea id="journal-content" name="content" rows="6" 
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder="Write your thoughts here..."></textarea>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-800 mb-2">
                            How do you feel right now? (1-10)
                        </label>
                        
                        <div class="journal-mood-selector flex space-x-2 justify-center">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => `
                                <button type="button" class="journal-mood-btn w-8 h-8 rounded-full bg-gray-200 hover:bg-green-500 flex items-center justify-center text-sm font-medium" 
                                        data-value="${value}" 
                                        aria-label="Set mood to ${value}">
                                    ${value}
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="journal-mood" name="mood" value="">
                    </div>
                    
                    <div class="flex justify-end space-x-3">
                        <button type="button" id="journal-cancel-btn" class="px-4 py-2 text-gray-800 hover:text-gray-600 font-medium">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm">
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        // Mood buttons
        modal.querySelectorAll('.journal-mood-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons
                modal.querySelectorAll('.journal-mood-btn').forEach(btn => {
                    btn.classList.remove('bg-green-500', 'text-white');
                    btn.classList.add('bg-gray-200');
                });
                
                // Add selected class to clicked button
                this.classList.remove('bg-gray-200');
                this.classList.add('bg-green-500', 'text-white');
                
                // Set mood value
                document.getElementById('journal-mood').value = this.dataset.value;
            });
        });
        
        // Cancel button
        modal.querySelector('#journal-cancel-btn').addEventListener('click', function() {
            modal.remove();
        });
        
        // Form submit
        modal.querySelector('#journal-entry-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const content = document.getElementById('journal-content').value.trim();
            const mood = parseInt(document.getElementById('journal-mood').value) || null;
            
            if (!content) {
                alert('Please enter your thoughts');
                return;
            }
            
            // Save journal entry
            journalManager.saveEntry({
                prompt: prompt,
                content: content,
                mood: mood,
                timestamp: new Date().toISOString()
            });
            
            // Close modal
            modal.remove();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg';
            successMessage.textContent = 'Journal entry saved!';
            document.body.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }, 0);
}
