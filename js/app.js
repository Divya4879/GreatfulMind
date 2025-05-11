/**
 * Main application logic for GratefulMind
 */

// DOM elements
const welcomeSection = document.getElementById('welcome-section');
const setupSection = document.getElementById('setup-section');
const mainSection = document.getElementById('main-section');
const journalSection = document.getElementById('journal-section');

// Show welcome section
function showWelcomeSection() {
    if (welcomeSection) welcomeSection.classList.remove('hidden');
    if (setupSection) setupSection.classList.add('hidden');
    if (mainSection) mainSection.classList.add('hidden');
    if (journalSection) journalSection.classList.add('hidden');
}

// Show setup section
function showSetupSection() {
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.remove('hidden');
    if (mainSection) mainSection.classList.add('hidden');
    if (journalSection) journalSection.classList.add('hidden');
}

// Show main section
function showMainSection() {
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.add('hidden');
    if (mainSection) mainSection.classList.remove('hidden');
    if (journalSection) journalSection.classList.add('hidden');
    console.log("Main section should be visible now");
}

// Show journal section
function showJournalSection() {
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.add('hidden');
    if (mainSection) mainSection.classList.add('hidden');
    if (journalSection) journalSection.classList.remove('hidden');
}

// Initialize application
function initApp() {
    // Initialize user
    userManager.initUser();
    
    // Skip setup and go directly to main section
    showMainSection();
    loadDashboard();
}

// Initialize setup
function initSetup() {
    // Add event listeners to identity buttons
    document.querySelectorAll('.identity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            const value = this.dataset.value;
            
            // Toggle selected class
            this.classList.toggle('selected');
            
            // Add or remove identity
            if (this.classList.contains('selected')) {
                userManager.addIdentity(category, value);
            } else {
                userManager.removeIdentity(category, value);
            }
        });
    });
    
    // Add event listener to custom identity form
    const customForm = document.getElementById('custom-identity-form');
    if (customForm) {
        customForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = document.getElementById('custom-identity-input');
            const value = input.value.trim();
            
            if (value) {
                // Add custom identity
                userManager.addIdentity(userManager.IDENTITY_CATEGORIES.CUSTOM, value);
                
                // Add to UI
                const container = document.getElementById('custom-identities-container');
                if (container) {
                    const pill = document.createElement('div');
                    pill.className = 'identity-pill mb-2 mr-2';
                    pill.innerHTML = `
                        ${value}
                        <button type="button" class="identity-pill-remove" data-value="${value}">&times;</button>
                    `;
                    container.appendChild(pill);
                    
                    // Add event listener to remove button
                    pill.querySelector('.identity-pill-remove').addEventListener('click', function() {
                        const value = this.dataset.value;
                        userManager.removeIdentity(userManager.IDENTITY_CATEGORIES.CUSTOM, value);
                        pill.remove();
                    });
                }
                
                // Clear input
                input.value = '';
            }
        });
    }
    
    // Add event listener to complete setup button
    const completeSetupBtn = document.getElementById('complete-setup-btn');
    if (completeSetupBtn) {
        completeSetupBtn.addEventListener('click', function() {
            if (userManager.isSetupComplete()) {
                showMainSection();
                loadDashboard();
            } else {
                alert('Please select at least one identity to continue.');
            }
        });
    }
}

// Load dashboard
function loadDashboard() {
    try {
        console.log("Loading dashboard...");
        // Get current time
        const now = new Date();
        const hour = now.getHours();
        
        // Determine time period
        let timePeriod;
        if (hour < 12) {
            timePeriod = 'morning';
        } else if (hour < 18) {
            timePeriod = 'afternoon';
        } else {
            timePeriod = 'evening';
        }
        
        // Update greeting
        updateGreeting(timePeriod);
        
        // Load random quotes
        loadRandomQuotes();
        
        // Load prompts
        if (typeof loadPrompts === 'function') {
            loadPrompts();
        }
        
        // Load life areas
        if (typeof loadLifeAreas === 'function') {
            loadLifeAreas(timePeriod);
        }
        
        // Render tasks
        if (typeof renderTasks === 'function') {
            renderTasks('task-list-container');
        }
        
        // Load progress visualization
        if (typeof loadProgressVisualization === 'function') {
            loadProgressVisualization();
        }
        
        // Add reset button functionality
        const resetBtn = document.getElementById('reset-app');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset the app? This will clear all your data.')) {
                    userManager.resetUser();
                    storage.clearAll();
                    showWelcomeSection();
                }
            });
        }
        
        console.log("Dashboard loaded successfully");
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load random quotes
function loadRandomQuotes() {
    const quotesContainer = document.getElementById('quotes-container');
    if (!quotesContainer) {
        console.error("Quotes container not found");
        return;
    }
    
    // Get two random quotes
    const quote1 = quoteManager.getRandomQuote();
    const quote2 = quoteManager.getRandomQuote();
    
    // Create HTML for quotes
    quotesContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start">
                    <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-green-900 font-bold italic">"${quote1.text}"</p>
                        <p class="mt-2 text-sm text-green-700">— ${quote1.author}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start">
                    <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-green-900 font-bold italic">"${quote2.text}"</p>
                        <p class="mt-2 text-sm text-green-700">— ${quote2.author}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    console.log("Quotes loaded successfully");
}

// Update greeting based on time of day
function updateGreeting(timePeriod) {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) {
        console.error("Greeting element not found");
        return;
    }
    
    // Get user name
    const user = userManager.getUser();
    const name = user && user.name ? user.name : '';
    
    // Set greeting text
    let greeting;
    switch (timePeriod) {
        case 'morning':
            greeting = 'Good morning';
            break;
        case 'afternoon':
            greeting = 'Good afternoon';
            break;
        case 'evening':
            greeting = 'Good evening';
            break;
        default:
            greeting = 'Hello';
    }
    
    greetingElement.textContent = name ? `${greeting}, ${name}!` : `${greeting}!`;
    console.log("Greeting updated:", greetingElement.textContent);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing app");
    
    // Get started button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        console.log("Get Started button found, adding click handler");
        getStartedBtn.addEventListener('click', function() {
            console.log("Get Started button clicked");
            if (welcomeSection) welcomeSection.classList.add('hidden');
            if (mainSection) mainSection.classList.remove('hidden');
            loadDashboard();
        });
    } else {
        console.error("Get Started button not found");
    }
    
    // Add task button
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        console.log("Add Task button found, adding click handler");
        addTaskBtn.addEventListener('click', function() {
            console.log("Add Task button clicked");
            if (typeof showAddTaskModal === 'function') {
                showAddTaskModal();
            } else {
                console.error("showAddTaskModal function not found");
            }
        });
    } else {
        console.error("Add Task button not found");
    }
    
    // Initialize app if user already exists
    if (userManager.getUser()) {
        console.log("User exists, initializing app");
        initApp();
    } else {
        console.log("No user found, showing welcome section");
        showWelcomeSection();
    }
});
