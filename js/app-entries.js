/**
 * Journal entries functionality for GratefulMind
 * Handles loading and displaying journal entries
 */

/**
 * Load journal entries
 */
function loadJournalEntries() {
    const container = document.getElementById('journal-entries-container');
    if (!container) return;
    
    // Get entries
    const entries = journalManager.getAllEntries();
    
    // If no entries, show empty state
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-green-700">No journal entries yet. Start journaling to see your entries here.</p>
            </div>
        `;
        return;
    }
    
    // Group entries by date
    const groupedEntries = {};
    
    entries.forEach(entry => {
        const date = new Date(entry.timestamp).toDateString();
        
        if (!groupedEntries[date]) {
            groupedEntries[date] = [];
        }
        
        groupedEntries[date].push(entry);
    });
    
    // Create HTML for entries
    let entriesHTML = '';
    
    Object.entries(groupedEntries).forEach(([date, dayEntries]) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        entriesHTML += `
            <div class="mb-8">
                <h3 class="text-lg font-medium text-green-200 mb-4">${formattedDate}</h3>
                <div class="space-y-4">
                    ${dayEntries.map(entry => createEntryCard(entry)).join('')}
                </div>
            </div>
        `;
    });
    
    // Render entries
    container.innerHTML = entriesHTML;
}

/**
 * Create HTML for a journal entry card
 * @param {Object} entry - Journal entry object
 * @returns {string} - HTML string
 */
function createEntryCard(entry) {
    const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    
    return `
        <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start">
                <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    <div class="text-sm text-green-700 mb-1">${time}</div>
                    <div class="mb-2 text-green-900 font-bold italic">${entry.prompt}</div>
                    <p class="text-green-900">${entry.content}</p>
                    
                    ${entry.mood ? `
                        <div class="mt-2 flex items-center">
                            <div class="text-sm">
                                <span class="text-green-700">Mood: </span>
                                <span class="font-medium">${entry.mood}/10</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Initialize entries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load entries
    loadJournalEntries();
});
