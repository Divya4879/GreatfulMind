/**
 * Quotes management for GratefulMind
 * Handles retrieving and displaying inspirational quotes
 */

const quoteManager = {
    // Quotes array
    QUOTES: [
        {
            text: "Gratitude turns what we have into enough.",
            author: "Aesop"
        },
        {
            text: "Gratitude is the fairest blossom which springs from the soul.",
            author: "Henry Ward Beecher"
        },
        {
            text: "Gratitude is not only the greatest of virtues, but the parent of all others.",
            author: "Cicero"
        },
        {
            text: "Gratitude is the healthiest of all human emotions.",
            author: "Zig Ziglar"
        },
        {
            text: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
            author: "Melody Beattie"
        },
        {
            text: "When I started counting my blessings, my whole life turned around.",
            author: "Willie Nelson"
        },
        {
            text: "Gratitude is the sign of noble souls.",
            author: "Aesop"
        },
        {
            text: "Gratitude is riches. Complaint is poverty.",
            author: "Doris Day"
        },
        {
            text: "Gratitude is the memory of the heart.",
            author: "Jean Baptiste Massieu"
        },
        {
            text: "Gratitude is the most exquisite form of courtesy.",
            author: "Jacques Maritain"
        },
        {
            text: "Gratitude is a powerful catalyst for happiness.",
            author: "Amy Collette"
        },
        {
            text: "Gratitude and attitude are not challenges; they are choices.",
            author: "Robert Braathe"
        },
        {
            text: "Gratitude unlocks the fullness of life.",
            author: "Melody Beattie"
        },
        {
            text: "Gratitude is a currency that we can mint for ourselves, and spend without fear of bankruptcy.",
            author: "Fred De Witt Van Amburgh"
        },
        {
            text: "Gratitude is the wine for the soul. Go on. Get drunk.",
            author: "Rumi"
        },
        {
            text: "Gratitude is a quality similar to electricity: it must be produced and discharged and used up in order to exist at all.",
            author: "William Faulkner"
        },
        {
            text: "Gratitude is the ability to experience life as a gift.",
            author: "John Ortberg"
        },
        {
            text: "Gratitude is a powerful process for shifting your energy and bringing more of what you want into your life.",
            author: "Rhonda Byrne"
        },
        {
            text: "Gratitude is the sweetest thing in a seeker's life - in all human life.",
            author: "Sri Chinmoy"
        },
        {
            text: "Gratitude is an antidote to negative emotions, a neutralizer of envy, hostility, worry, and irritation.",
            author: "Sonja Lyubomirsky"
        }
    ],
    
    /**
     * Get a random quote
     * @returns {Object} - Quote object with text and author
     */
    getRandomQuote: function() {
        const randomIndex = Math.floor(Math.random() * this.QUOTES.length);
        return this.QUOTES[randomIndex];
    },
    
    /**
     * Get a quote for a specific category
     * @param {string} category - Quote category
     * @returns {Object} - Quote object with text and author
     */
    getQuoteByCategory: function(category) {
        // For now, just return a random quote
        // In the future, we could categorize quotes
        return this.getRandomQuote();
    }
};
