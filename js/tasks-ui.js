/**
 * Task UI functionality for GratefulMind
 * Handles rendering and interacting with task UI elements
 */

/**
 * Render tasks in the specified container
 * @param {string} containerId - Container element ID
 */
function renderTasks(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Get today's tasks
    const tasks = taskManager.getTodaysTasks();
    
    // If no tasks, show empty state
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <p class="text-green-700">No tasks for today. Add a task to get started.</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for tasks
    const tasksHTML = tasks.map(task => createTaskItem(task)).join('');
    
    // Render tasks
    container.innerHTML = `
        <div class="space-y-3">
            ${tasksHTML}
        </div>
    `;
    
    // Add event listeners
    addTaskEventListeners();
}

/**
 * Create HTML for a task item
 * @param {Object} task - Task object
 * @returns {string} - HTML string
 */
function createTaskItem(task) {
    return `
        <div class="task-item bg-white rounded-lg p-3 shadow-sm border-l-4 ${task.completed ? 'border-green-500' : 'border-gray-300'}">
            <div class="flex items-start">
                <div class="flex-shrink-0 pt-0.5">
                    <input type="checkbox" id="task-${task.id}" class="task-checkbox h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                           data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="ml-3 flex-1">
                    <label for="task-${task.id}" class="block text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">
                        ${task.title}
                    </label>
                    
                    ${task.description ? `
                        <p class="mt-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}">
                            ${task.description}
                        </p>
                    ` : ''}
                    
                    ${task.completed && task.moodBefore !== null && task.moodAfter !== null ? `
                        <div class="mt-2 flex items-center">
                            <div class="text-sm">
                                <span class="text-green-700">Before: </span>
                                <span class="font-medium">${task.moodBefore}/10</span>
                                <span class="mx-2">→</span>
                                <span class="text-green-700">After: </span>
                                <span class="font-medium">${task.moodAfter}/10</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="ml-2">
                    <button class="task-delete-btn p-1 rounded-full hover:bg-red-100 text-red-500" data-task-id="${task.id}" aria-label="Delete task">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Add event listeners to task items
 */
function addTaskEventListeners() {
    // Task checkbox change
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.dataset.taskId;
            const completed = this.checked;
            
            if (completed) {
                showMoodAfterTaskModal(taskId);
            } else {
                taskManager.updateTaskStatus(taskId, false);
                renderTasks('task-list-container');
            }
        });
    });
    
    // Task delete button
    document.querySelectorAll('.task-delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            if (confirm('Are you sure you want to delete this task?')) {
                taskManager.deleteTask(taskId);
                renderTasks('task-list-container');
            }
        });
    });
}

/**
 * Show modal to capture mood after completing a task
 * @param {string} taskId - Task ID
 */
function showMoodAfterTaskModal(taskId) {
    const task = taskManager.getTaskById(taskId);
    if (!task) return;
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('mood-after-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mood-after-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        document.body.appendChild(modal);
    }
    
    // Set modal content
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 class="text-lg font-medium text-green-900 mb-4">Great job completing "${task.title}"!</h3>
            
            <p class="text-gray-800 mb-4">How do you feel now after completing this task? (1-10)</p>
            
            <div class="mood-selector flex flex-wrap justify-center gap-2 mb-6">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => `
                    <button type="button" class="mood-btn w-10 h-10 rounded-full bg-gray-200 hover:bg-green-500 hover:text-white flex items-center justify-center text-sm font-medium" 
                            data-value="${value}">
                        ${value}
                    </button>
                `).join('')}
            </div>
            
            <div class="flex justify-end">
                <button id="skip-mood-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium mr-2">
                    Skip
                </button>
                <button id="save-mood-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm" disabled>
                    Save
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        // Mood buttons
        let selectedMood = null;
        const moodButtons = document.querySelectorAll('.mood-btn');
        const saveButton = document.getElementById('save-mood-btn');
        
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons
                moodButtons.forEach(btn => btn.classList.remove('bg-green-500', 'text-white'));
                
                // Add selected class to clicked button
                this.classList.add('bg-green-500', 'text-white');
                
                // Store selected mood
                selectedMood = parseInt(this.dataset.value);
                
                // Enable save button
                saveButton.removeAttribute('disabled');
            });
        });
        
        // Skip button
        document.getElementById('skip-mood-btn').addEventListener('click', function() {
            // Complete task without mood
            taskManager.updateTaskStatus(taskId, true);
            modal.remove();
            renderTasks('task-list-container');
            
            // Check if all tasks are completed
            checkAllTasksCompleted();
        });
        
        // Save button
        saveButton.addEventListener('click', function() {
            if (selectedMood !== null) {
                // Complete task with mood
                taskManager.completeTaskWithMood(taskId, selectedMood);
                modal.remove();
                renderTasks('task-list-container');
                
                // Check if all tasks are completed
                checkAllTasksCompleted();
            }
        });
    }, 0);
}

/**
 * Check if all tasks are completed and show celebration
 */
function checkAllTasksCompleted() {
    const tasks = taskManager.getTodaysTasks();
    
    // If no tasks, don't show celebration
    if (tasks.length === 0) return;
    
    // Check if all tasks are completed
    const allCompleted = tasks.every(task => task.completed);
    
    if (allCompleted) {
        showEmojiShower();
        showCompletionCelebration();
    }
}

/**
 * Show emoji shower animation
 */
function showEmojiShower() {
    // Create emoji container if it doesn't exist
    let emojiContainer = document.getElementById('emoji-container');
    
    if (!emojiContainer) {
        emojiContainer = document.createElement('div');
        emojiContainer.id = 'emoji-container';
        emojiContainer.className = 'emoji-container';
        document.body.appendChild(emojiContainer);
    } else {
        // Clear existing emojis
        emojiContainer.innerHTML = '';
    }
    
    // Celebration emojis
    const emojis = ['🎉', '✨', '🎊', '👏', '🙌', '💪', '🏆', '⭐', '🌟', '💯', '🥳', '🌈', '🍀', '💚'];
    
    // Create 100 random emojis
    for (let i = 0; i < 100; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random position and delay
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const size = Math.random() * 20 + 20;
        
        emoji.style.left = `${left}%`;
        emoji.style.animationDelay = `${delay}s`;
        emoji.style.fontSize = `${size}px`;
        
        emojiContainer.appendChild(emoji);
    }
    
    // Remove emoji container after animation
    setTimeout(() => {
        emojiContainer.remove();
    }, 6000); // 4s animation + 2s buffer
}

/**
 * Show completion celebration modal
 */
function showCompletionCelebration() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('completion-celebration-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'completion-celebration-modal';
        modal.className = 'celebration-modal';
        document.body.appendChild(modal);
    }
    
    // Set modal content
    modal.innerHTML = `
        <span class="celebration-emoji">🏆</span>
        <h2>Amazing Job!</h2>
        <p>You've completed all your tasks for today!</p>
        <p>Keep up the great work and momentum.</p>
    `;
    
    // Remove modal after 4 seconds
    setTimeout(() => {
        modal.remove();
    }, 4000);
}

/**
 * Show modal to add a new task
 */
function showAddTaskModal() {
    console.log("Opening add task modal");
    // Create modal if it doesn't exist
    let modal = document.getElementById('add-task-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-task-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        document.body.appendChild(modal);
    }
    
    // Set modal content
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 class="text-lg font-medium text-green-900 mb-4">Add New Task</h3>
            
            <form id="add-task-form">
                <div class="mb-4">
                    <label for="task-title" class="block text-sm font-medium text-gray-800 mb-1">
                        Task Title
                    </label>
                    <input type="text" id="task-title" name="title" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                           placeholder="Enter task title" required>
                </div>
                
                <div class="mb-4">
                    <label for="task-description" class="block text-sm font-medium text-gray-800 mb-1">
                        Description (optional)
                    </label>
                    <textarea id="task-description" name="description" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Add details about this task"></textarea>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-800 mb-2">
                        How do you feel right now? (1-10)
                    </label>
                    
                    <div class="mood-selector flex flex-wrap justify-center gap-2">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => `
                            <button type="button" class="mood-btn w-10 h-10 rounded-full bg-gray-200 hover:bg-green-500 hover:text-white flex items-center justify-center text-sm font-medium" 
                                    data-value="${value}">
                                ${value}
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="task-mood" name="mood" value="">
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button type="button" id="task-cancel-btn" class="px-4 py-2 text-gray-800 hover:text-gray-600 font-medium">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm">
                        Add Task
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        // Mood buttons
        let selectedMood = null;
        const moodButtons = modal.querySelectorAll('.mood-btn');
        
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons
                moodButtons.forEach(btn => {
                    btn.classList.remove('bg-green-500', 'text-white');
                    btn.classList.add('bg-gray-200');
                });
                
                // Add selected class to clicked button
                this.classList.remove('bg-gray-200');
                this.classList.add('bg-green-500', 'text-white');
                
                // Store selected mood
                selectedMood = parseInt(this.dataset.value);
                document.getElementById('task-mood').value = this.dataset.value;
            });
        });
        
        // Cancel button
        modal.querySelector('#task-cancel-btn').addEventListener('click', function() {
            modal.remove();
        });
        
        // Form submit
        modal.querySelector('#add-task-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('task-title').value.trim();
            const description = document.getElementById('task-description').value.trim();
            const mood = parseInt(document.getElementById('task-mood').value) || null;
            
            if (!title) {
                alert('Please enter a task title');
                return;
            }
            
            // Check if we already have 5 tasks
            const currentTasks = taskManager.getTodaysTasks();
            if (currentTasks.length >= 5) {
                alert('You can only add up to 5 tasks per day');
                return;
            }
            
            // Add task
            taskManager.addTask({
                title,
                description: description || null,
                moodBefore: mood
            });
            
            // Close modal and refresh tasks
            modal.remove();
            renderTasks('task-list-container');
        });
    }, 0);
}

// Initialize tasks when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Tasks UI initialized");
    
    // Render tasks
    renderTasks('task-list-container');
});
