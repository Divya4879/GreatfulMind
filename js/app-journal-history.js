/**
 * Journal history functionality for GratefulMind
 * Handles loading and displaying journal entry history
 */

/**
 * Load journal history
 */
async function loadJournalHistory() {
    const container = document.getElementById('journal-history-container');
    if (!container) return;
    
    try {
        // Get entries
        const entries = await journalManager.getAllEntries();
        
        // If no entries, show empty state
        if (!entries || entries.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-green-700">No journal entries yet. Start journaling to see your entries here.</p>
                    <button id="start-journaling-btn" class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm">
                        Start Journaling
                    </button>
                </div>
            `;
            
            // Add event listener to start journaling button
            setTimeout(() => {
                const startJournalingBtn = document.getElementById('start-journaling-btn');
                if (startJournalingBtn) {
                    startJournalingBtn.addEventListener('click', function() {
                        // Show main section with prompts
                        showMainSection();
                    });
                }
            }, 0);
            
            return;
        }
        
        // Group entries by month and year
        const groupedEntries = {};
        
        entries.forEach(entry => {
            const date = new Date(entry.timestamp);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!groupedEntries[monthYear]) {
                groupedEntries[monthYear] = {
                    label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                    entries: []
                };
            }
            
            groupedEntries[monthYear].entries.push(entry);
        });
        
        // Sort months in reverse chronological order
        const sortedMonths = Object.keys(groupedEntries).sort().reverse();
        
        // Create HTML for entries
        let historyHTML = `
            <div class="mb-6 flex justify-between items-center">
                <h3 class="text-xl font-medium text-green-900">Journal History</h3>
                <button id="new-journal-entry-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm flex items-center">
                    <svg class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                    New Entry
                </button>
            </div>
            
            <div class="space-y-8">
        `;
        
        sortedMonths.forEach(month => {
            const monthData = groupedEntries[month];
            
            historyHTML += `
                <div class="month-section">
                    <h4 class="text-lg font-medium text-green-900 mb-4">${monthData.label}</h4>
                    <div class="space-y-4">
            `;
            
            // Group entries by date within the month
            const entriesByDate = {};
            
            monthData.entries.forEach(entry => {
                const date = new Date(entry.timestamp).toDateString();
                
                if (!entriesByDate[date]) {
                    entriesByDate[date] = [];
                }
                
                entriesByDate[date].push(entry);
            });
            
            // Sort dates in reverse chronological order
            const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
                new Date(b) - new Date(a)
            );
            
            sortedDates.forEach(date => {
                const dayEntries = entriesByDate[date];
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                });
                
                historyHTML += `
                    <div class="date-section bg-green-50 rounded-xl p-4 mb-4">
                        <h5 class="text-md font-medium text-green-900 mb-3">${formattedDate}</h5>
                        <div class="space-y-3">
                            ${dayEntries.map(entry => createJournalEntryCard(entry)).join('')}
                        </div>
                    </div>
                `;
            });
            
            historyHTML += `
                    </div>
                </div>
            `;
        });
        
        historyHTML += `
            </div>
        `;
        
        // Render entries
        container.innerHTML = historyHTML;
        
        // Add event listeners
        setTimeout(() => {
            // New journal entry button
            const newJournalEntryBtn = document.getElementById('new-journal-entry-btn');
            if (newJournalEntryBtn) {
                newJournalEntryBtn.addEventListener('click', function() {
                    // Show main section with prompts
                    showMainSection();
                });
            }
            
            // Edit buttons
            container.querySelectorAll('.journal-edit-btn').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const entryId = this.dataset.entryId;
                    editJournalEntry(entryId);
                });
            });
            
            // Delete buttons
            container.querySelectorAll('.journal-delete-btn').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const entryId = this.dataset.entryId;
                    deleteJournalEntry(entryId);
                });
            });
            
            // Expandable entries
            container.querySelectorAll('.journal-entry-card').forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('expanded');
                    const content = this.querySelector('.journal-entry-content');
                    const expandBtn = this.querySelector('.journal-expand-btn');
                    
                    if (this.classList.contains('expanded')) {
                        content.classList.remove('line-clamp-3');
                        expandBtn.innerHTML = `
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                            </svg>
                            Show Less
                        `;
                    } else {
                        content.classList.add('line-clamp-3');
                        expandBtn.innerHTML = `
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                            Show More
                        `;
                    }
                });
            });
        }, 0);
    } catch (error) {
        console.error('Error loading journal history:', error);
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-600">Error loading journal entries. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * Create HTML for a journal entry card
 * @param {Object} entry - Journal entry object
 * @returns {string} - HTML string
 */
function createJournalEntryCard(entry) {
    const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    
    return `
        <div class="journal-entry-card bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-start">
                <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    <div class="flex justify-between items-start">
                        <div class="text-sm text-green-700 mb-1">${time}</div>
                        <div class="flex space-x-1">
                            <button class="journal-edit-btn p-1 rounded-full hover:bg-green-100 text-green-600" data-entry-id="${entry.id}" aria-label="Edit entry">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                            </button>
                            <button class="journal-delete-btn p-1 rounded-full hover:bg-red-100 text-red-500" data-entry-id="${entry.id}" aria-label="Delete entry">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="mb-2 text-green-900 font-bold italic">${entry.prompt}</div>
                    <p class="journal-entry-content text-green-900 line-clamp-3">${entry.content}</p>
                    
                    <div class="mt-3 flex justify-between items-center">
                        ${entry.mood ? `
                            <div class="text-sm">
                                <span class="text-green-700">Mood: </span>
                                <span class="font-medium">${entry.mood}/10</span>
                            </div>
                        ` : '<div></div>'}
                        
                        <button class="journal-expand-btn text-sm text-green-600 hover:text-green-800 flex items-center">
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                            Show More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Edit a journal entry
 * @param {string} entryId - Entry ID
 */
async function editJournalEntry(entryId) {
    try {
        // Get entry
        const entry = await journalManager.getEntryById(entryId);
        if (!entry) {
            console.error('Entry not found');
            return;
        }
        
        // Create modal
        let modal = document.getElementById('edit-journal-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'edit-journal-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div class="px-6 py-4 bg-green-50 border-b border-green-100">
                    <h3 class="text-lg font-medium text-green-900">Edit Journal Entry</h3>
                </div>
                <div class="p-6">
                    <div class="mb-4 bg-green-50 p-3 rounded-lg">
                        <p class="text-green-900 font-bold italic">${entry.prompt}</p>
                    </div>
                    
                    <form id="edit-journal-form">
                        <div class="mb-4">
                            <label for="edit-journal-content" class="block text-sm font-medium text-gray-800 mb-1">
                                Your thoughts
                            </label>
                            <textarea id="edit-journal-content" name="content" rows="6" 
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                      placeholder="Write your thoughts here...">${entry.content}</textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-800 mb-2">
                                How do you feel? (1-10)
                            </label>
                            
                            <div class="edit-mood-selector flex space-x-2 justify-center">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => `
                                    <button type="button" class="edit-mood-btn w-8 h-8 rounded-full ${entry.mood === value ? 'bg-green-500 text-white' : 'bg-gray-200'} flex items-center justify-center text-sm font-medium" 
                                            data-value="${value}">
                                        ${value}
                                    </button>
                                `).join('')}
                            </div>
                            <input type="hidden" id="edit-journal-mood" name="mood" value="${entry.mood || ''}">
                        </div>
                        
                        <div class="flex justify-end space-x-3">
                            <button type="button" id="edit-cancel-btn" class="px-4 py-2 text-gray-800 hover:text-gray-600 font-medium">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add event listeners
        setTimeout(() => {
            // Mood buttons
            modal.querySelectorAll('.edit-mood-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Remove selected class from all buttons
                    modal.querySelectorAll('.edit-mood-btn').forEach(btn => {
                        btn.classList.remove('bg-green-500', 'text-white');
                        btn.classList.add('bg-gray-200');
                    });
                    
                    // Add selected class to clicked button
                    this.classList.remove('bg-gray-200');
                    this.classList.add('bg-green-500', 'text-white');
                    
                    // Set mood value
                    document.getElementById('edit-journal-mood').value = this.dataset.value;
                });
            });
            
            // Cancel button
            modal.querySelector('#edit-cancel-btn').addEventListener('click', function() {
                modal.remove();
            });
            
            // Form submit
            modal.querySelector('#edit-journal-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const content = document.getElementById('edit-journal-content').value.trim();
                const mood = parseInt(document.getElementById('edit-journal-mood').value) || null;
                
                if (!content) {
                    alert('Please enter your thoughts');
                    return;
                }
                
                // Update journal entry
                await journalManager.updateEntry(entryId, {
                    content: content,
                    mood: mood
                });
                
                // Close modal
                modal.remove();
                
                // Reload journal history
                loadJournalHistory();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg';
                successMessage.textContent = 'Journal entry updated!';
                document.body.appendChild(successMessage);
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            });
        }, 0);
    } catch (error) {
        console.error('Error editing journal entry:', error);
    }
}

/**
 * Delete a journal entry
 * @param {string} entryId - Entry ID
 */
async function deleteJournalEntry(entryId) {
    try {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
            return;
        }
        
        // Delete entry
        const success = await journalManager.deleteEntry(entryId);
        
        if (success) {
            // Reload journal history
            loadJournalHistory();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg';
            successMessage.textContent = 'Journal entry deleted!';
            document.body.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        } else {
            alert('Error deleting journal entry. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        alert('Error deleting journal entry. Please try again.');
    }
}

// Initialize journal history when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add navigation button to main section
    const mainSection = document.getElementById('main-section');
    if (mainSection) {
        const navContainer = document.createElement('div');
        navContainer.className = 'mb-6 flex justify-end';
        navContainer.innerHTML = `
            <button id="view-journal-history-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm flex items-center">
                <svg class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
                View Journal History
            </button>
        `;
        
        // Insert after the greeting
        const greeting = mainSection.querySelector('#greeting');
        if (greeting) {
            greeting.parentNode.insertBefore(navContainer, greeting.nextSibling);
        } else {
            mainSection.insertBefore(navContainer, mainSection.firstChild);
        }
        
        // Add event listener
        document.getElementById('view-journal-history-btn').addEventListener('click', function() {
            showJournalHistorySection();
        });
    }
});

/**
 * Show journal history section
 */
function showJournalHistorySection() {
    // Hide other sections
    const welcomeSection = document.getElementById('welcome-section');
    const setupSection = document.getElementById('setup-section');
    const mainSection = document.getElementById('main-section');
    const journalSection = document.getElementById('journal-section');
    
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.add('hidden');
    if (mainSection) mainSection.classList.add('hidden');
    if (journalSection) journalSection.classList.remove('hidden');
    
    // Load journal history
    loadJournalHistory();
}

/**
 * Show main section
 */
function showMainSection() {
    // Hide other sections
    const welcomeSection = document.getElementById('welcome-section');
    const setupSection = document.getElementById('setup-section');
    const mainSection = document.getElementById('main-section');
    const journalSection = document.getElementById('journal-section');
    
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.add('hidden');
    if (mainSection) mainSection.classList.remove('hidden');
    if (journalSection) journalSection.classList.add('hidden');
}
