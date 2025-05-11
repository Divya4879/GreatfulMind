/**
 * Goals UI management for GratefulMind
 * Handles UI interactions for daily goals
 */

/**
 * Load daily goals
 */
function loadDailyGoals() {
    const container = document.getElementById('goals-container');
    if (!container) return;
    
    // Create goals UI
    container.innerHTML = `
        <div class="mb-4">
            <form id="add-goal-form" class="flex items-center">
                <input type="text" id="new-goal-input" placeholder="Add a goal for today..." 
                       class="flex-grow px-3 py-2 border border-green-300 dark:border-green-600 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-green-800/30 dark:text-white" 
                       aria-label="New goal text">
                <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-r-lg transition-colors"
                        aria-label="Add goal">
                    Add
                </button>
            </form>
        </div>
        
        <div id="goals-list" class="space-y-2">
            <!-- Goals will be loaded here -->
            <div class="flex justify-center py-2">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
            </div>
        </div>
    `;
    
    // Add event listener for form submission
    const form = document.getElementById('add-goal-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = document.getElementById('new-goal-input');
        const goalText = input.value.trim();
        
        if (goalText) {
            // Save goal
            goalManager.saveGoal({
                text: goalText,
                completed: false
            });
            
            // Clear input
            input.value = '';
            
            // Reload goals
            displayGoals();
            
            // Focus input for next entry
            input.focus();
        }
    });
    
    // Display existing goals
    displayGoals();
}

/**
 * Display goals in the container
 */
function displayGoals() {
    const container = document.getElementById('goals-list');
    if (!container) return;
    
    // Get today's goals
    const goals = goalManager.getTodaysGoals();
    
    if (goals.length === 0) {
        container.innerHTML = `
            <p class="text-center text-green-700 py-2">No goals set for today. Add some goals above!</p>
        `;
        return;
    }
    
    // Sort goals: incomplete first, then by creation date
    const sortedGoals = [...goals].sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        // Then by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Create goals HTML
    const goalsHTML = sortedGoals.map(goal => {
        const completedClass = goal.completed ? 'bg-green-50 dark:bg-green-800/30 line-through text-gray-500 dark:text-gray-400' : '';
        
        return `
            <div class="goal-item p-3 border-l-3 ${completedClass} bg-white dark:bg-green-900/50 rounded-lg shadow-sm flex items-center justify-between" data-goal-id="${goal.id}">
                <div class="flex items-center flex-grow">
                    <input type="checkbox" id="goal-${goal.id}" class="goal-checkbox w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 dark:border-gray-600 dark:focus:ring-green-600" 
                           ${goal.completed ? 'checked' : ''} 
                           aria-label="Mark goal as ${goal.completed ? 'incomplete' : 'complete'}">
                    <label for="goal-${goal.id}" class="ml-2 text-sm font-medium cursor-pointer flex-grow">
                        ${goal.text}
                    </label>
                </div>
                <button class="delete-goal-btn text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors" 
                        aria-label="Delete goal">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = goalsHTML;
    
    // Add event listeners to checkboxes
    container.querySelectorAll('.goal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const goalId = this.closest('.goal-item').dataset.goalId;
            goalManager.toggleGoalCompletion(goalId);
            
            // Update UI
            displayGoals();
            
            // Check if all goals are completed
            const stats = goalManager.getTodayGoalStats();
            if (stats.allCompleted && stats.total > 0) {
                showGoalCompletionCelebration();
            }
        });
    });
    
    // Add event listeners to delete buttons
    container.querySelectorAll('.delete-goal-btn').forEach(button => {
        button.addEventListener('click', function() {
            const goalId = this.closest('.goal-item').dataset.goalId;
            
            if (confirm('Are you sure you want to delete this goal?')) {
                goalManager.deleteGoal(goalId);
                
                // Update UI
                displayGoals();
            }
        });
    });
}

/**
 * Show celebration when all goals are completed
 */
function showGoalCompletionCelebration() {
    // Create celebration modal if it doesn't exist
    let celebrationModal = document.getElementById('goal-celebration-modal');
    
    if (!celebrationModal) {
        celebrationModal = document.createElement('div');
        celebrationModal.id = 'goal-celebration-modal';
        celebrationModal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity';
        celebrationModal.setAttribute('role', 'dialog');
        celebrationModal.setAttribute('aria-modal', 'true');
        
        document.body.appendChild(celebrationModal);
    }
    
    // Create confetti effect with emojis
    const emojis = ['🎊', '🥳', '🎉', '✨', '🎈', '🎇', '🎆', '👏', '🙌'];
    let confettiHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const size = Math.floor(Math.random() * 30) + 20; // 20-50px
        const left = Math.floor(Math.random() * 100); // 0-100%
        const animationDuration = (Math.random() * 3) + 2; // 2-5s
        const animationDelay = Math.random() * 2; // 0-2s
        
        confettiHTML += `
            <div class="absolute text-${size} animate-fall" 
                 style="left: ${left}%; animation-duration: ${animationDuration}s; animation-delay: ${animationDelay}s;">
                ${emoji}
            </div>
        `;
    }
    
    // Create modal content
    celebrationModal.innerHTML = `
        <div class="relative w-full h-full overflow-hidden">
            ${confettiHTML}
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-white dark:bg-green-900 rounded-xl shadow-xl p-8 max-w-md text-center transform scale-up">
                    <h3 class="text-3xl font-bold text-green-600 dark:text-green-300 mb-4">
                        Congratulations! 🎉
                    </h3>
                    <p class="text-xl text-gray-700 dark:text-gray-200 mb-6">
                        You've completed all your goals for today!
                    </p>
                    <div class="text-5xl mb-6">
                        🥳 🎊 👏
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal with animation
    celebrationModal.classList.add('animate-fade-in');
    
    // Hide modal after 4 seconds
    setTimeout(() => {
        celebrationModal.classList.add('animate-fade-out');
        setTimeout(() => {
            celebrationModal.remove();
        }, 500);
    }, 4000);
}
