/**
 * Prompt management for GratefulMind
 * Handles generating and personalizing prompts
 */

const promptManager = {
    // Prompt categories
    CATEGORIES: ['gratitude', 'feelings', 'actions'],
    
    // Prompt templates by category and time period
    PROMPTS: {
        gratitude: {
            morning: [
                "What are you grateful for as you start your day?",
                "What small joy are you looking forward to today?",
                "Who has recently made a positive impact on your life?",
                "What aspect of your home are you thankful for this morning?",
                "What ability or skill do you appreciate having today?"
            ],
            afternoon: [
                "What has gone well so far today?",
                "Who or what supported you this morning?",
                "What opportunity are you grateful for today?",
                "What simple pleasure have you enjoyed today?",
                "What challenge are you thankful for facing today?"
            ],
            evening: [
                "What three things went well today?",
                "Who made a positive difference in your day?",
                "What challenge did you overcome today?",
                "What moment of beauty or joy did you notice today?",
                "What did you learn today that you're grateful for?"
            ]
        },
        feelings: {
            morning: [
                "How are you feeling as you begin your day?",
                "What emotion is most present for you this morning?",
                "What would make today feel successful to you?",
                "What's one thing you can do today to support your emotional wellbeing?",
                "How might you bring more calm to your morning routine?"
            ],
            afternoon: [
                "How has your mood shifted since the morning?",
                "What has energized you most today?",
                "What has challenged you emotionally today?",
                "What are you learning about yourself today?",
                "What would help you feel more balanced right now?"
            ],
            evening: [
                "How would you describe your overall mood today?",
                "What was the strongest emotion you felt today?",
                "What helped you feel calm or centered today?",
                "What situation challenged your emotional balance today?",
                "How did you care for your emotional needs today?"
            ]
        },
        actions: {
            morning: [
                "What is one small action you can take today toward an important goal?",
                "How might you show kindness to someone today?",
                "What healthy habit would you like to practice today?",
                "What's one task you can complete today that will give you satisfaction?",
                "How will you make time for yourself today?"
            ],
            afternoon: [
                "What's one thing you've accomplished today that you're proud of?",
                "What's one more important task you want to complete today?",
                "How have you taken care of your wellbeing so far today?",
                "What boundary might you need to set this afternoon?",
                "How might you make the rest of your day more meaningful?"
            ],
            evening: [
                "What did you accomplish today that moved you forward?",
                "How did you show up for others today?",
                "What self-care practice did you engage in today?",
                "What did you learn from a challenge you faced today?",
                "What would you like to do differently tomorrow?"
            ]
        }
    },
    
    // Identity-specific prompt modifiers
    IDENTITY_MODIFIERS: {
        // Professional identities
        'student': {
            gratitude: [
                "What learning opportunity are you grateful for?",
                "Which teacher or mentor has positively influenced you?",
                "What academic achievement are you proud of today?"
            ],
            feelings: [
                "How are you feeling about your studies today?",
                "What academic challenge is testing your emotional resilience?"
            ],
            actions: [
                "What study habit can you improve today?",
                "How will you balance academics with self-care today?"
            ]
        },
        'teacher': {
            gratitude: [
                "Which student interaction brought you joy today?",
                "What teaching moment are you grateful for?",
                "How has your ability to educate others enriched your life?"
            ],
            feelings: [
                "How are you feeling about your impact as an educator?",
                "What classroom situation tested your emotional balance today?"
            ],
            actions: [
                "How might you inspire a student who's struggling?",
                "What teaching approach could you experiment with today?"
            ]
        },
        'entrepreneur': {
            gratitude: [
                "What business opportunity are you thankful for?",
                "Which aspect of being your own boss do you appreciate most?",
                "What business relationship has been valuable lately?"
            ],
            feelings: [
                "How are you handling the uncertainty of entrepreneurship today?",
                "What business challenge is testing your emotional resilience?"
            ],
            actions: [
                "What small step can you take toward your business goals today?",
                "How will you balance business growth with personal wellbeing?"
            ]
        },
        'remote worker': {
            gratitude: [
                "What aspect of working remotely are you grateful for today?",
                "How has flexibility in your work environment benefited you?",
                "What digital tool or resource has made your work easier?"
            ],
            feelings: [
                "How are you maintaining connection while working remotely?",
                "What work-from-home boundary is important for your wellbeing?"
            ],
            actions: [
                "How will you create separation between work and personal life today?",
                "What can you do to make your home workspace more inspiring?"
            ]
        },
        
        // Family identities
        'parent': {
            gratitude: [
                "What moment with your child brought you joy recently?",
                "What parenting strength are you thankful to possess?",
                "How has being a parent enriched your perspective on life?"
            ],
            feelings: [
                "How are you balancing your needs with your family's needs today?",
                "What parenting challenge is testing your emotional resilience?"
            ],
            actions: [
                "What small tradition or memory can you create with your child today?",
                "How will you model self-care for your family today?"
            ]
        },
        'caregiver': {
            gratitude: [
                "What moment of connection in your caregiving brought you joy?",
                "What strength has your caregiving role revealed in you?",
                "How has caring for others enriched your perspective?"
            ],
            feelings: [
                "How are you honoring your own needs while caring for others?",
                "What caregiving challenge is testing your emotional balance?"
            ],
            actions: [
                "What small act of self-care can you practice amid your responsibilities?",
                "How might you ask for support in your caregiving role today?"
            ]
        },
        'partner': {
            gratitude: [
                "What quality in your partner are you especially thankful for today?",
                "What recent moment of connection brought you joy?",
                "How has your relationship supported your growth?"
            ],
            feelings: [
                "How are you showing up emotionally in your relationship today?",
                "What relationship dynamic are you navigating with care?"
            ],
            actions: [
                "What small gesture might strengthen your connection today?",
                "How will you communicate your needs clearly to your partner?"
            ]
        },
        
        // Life situation identities
        'in transition': {
            gratitude: [
                "What opportunity has this transition opened up for you?",
                "What strength have you discovered during this period of change?",
                "Who has supported you through this transition?"
            ],
            feelings: [
                "How are you honoring your feelings during this time of change?",
                "What uncertainty are you learning to make peace with?"
            ],
            actions: [
                "What small step can you take to move forward amid uncertainty?",
                "How might you create a sense of stability during this transition?"
            ]
        },
        'healing': {
            gratitude: [
                "What part of your healing journey can you appreciate today?",
                "What strength has your healing process revealed in you?",
                "Who or what has supported your healing recently?"
            ],
            feelings: [
                "How are you honoring your emotional needs during healing?",
                "What aspect of healing feels most challenging right now?"
            ],
            actions: [
                "What small act of self-compassion can you practice today?",
                "How might you celebrate the progress you've made, however small?"
            ]
        },
        'starting over': {
            gratitude: [
                "What fresh perspective has starting over given you?",
                "What opportunity does this new beginning present?",
                "What wisdom from past experience are you bringing forward?"
            ],
            feelings: [
                "How are you processing the emotions of leaving something behind?",
                "What excitement or apprehension comes with this new chapter?"
            ],
            actions: [
                "What small foundation can you lay today for your new beginning?",
                "How might you honor both what was and what will be?"
            ]
        }
    },
    
    /**
     * Get a personalized prompt
     * @param {string} category - Prompt category
     * @param {Array} identities - User identities
     * @param {string} timePeriod - Time period (morning, afternoon, evening)
     * @returns {string} - Personalized prompt
     */
    getPersonalizedPrompt: function(category, identities, timePeriod) {
        // Validate category
        if (!this.CATEGORIES.includes(category)) {
            category = this.CATEGORIES[0];
        }
        
        // Validate time period
        if (!['morning', 'afternoon', 'evening'].includes(timePeriod)) {
            timePeriod = 'morning';
        }
        
        // Get base prompts for category and time period
        const basePrompts = this.PROMPTS[category][timePeriod];
        
        // Get identity-specific prompts
        let identityPrompts = [];
        
        identities.forEach(identity => {
            const modifier = this.IDENTITY_MODIFIERS[identity.toLowerCase()];
            if (modifier && modifier[category]) {
                identityPrompts = identityPrompts.concat(modifier[category]);
            }
        });
        
        // Combine prompts and select one randomly
        const allPrompts = basePrompts.concat(identityPrompts);
        const randomIndex = Math.floor(Math.random() * allPrompts.length);
        
        return allPrompts[randomIndex];
    }
};
