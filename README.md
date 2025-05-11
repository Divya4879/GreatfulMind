# GratefulMind

A personalized gratitude journal web application that adapts to your unique identity and provides tailored prompts for reflection throughout your day.

You can check it out [here](https://echojournals.netlify.app).

![project ss](https://github.com/user-attachments/assets/e019770b-86e1-4a59-bf2f-bf8769730f37)


## Project Overview

GratefulMind is designed to help users cultivate gratitude and mindfulness through a customizable journaling experience. The application adapts to each user's unique identities and life circumstances, providing relevant prompts for reflection at different times of the day.

## Key Features

- **Time-Specific Prompts**: Different prompts for morning, afternoon, and evening to match your daily rhythm
- **Journal Entry System**: Record and review your gratitude entries with rich text formatting
- **Mood Tracking**: Visual representations of your emotional journey with charts and insights
- **Task Management**: Set and track daily goals aligned with your values
- **Life Areas Focus**: Reflect on different areas of your life (work, relationships, health, etc.)
- **Reflection Summaries**: Weekly and monthly insights into your gratitude practice
- **Quote Generator**: Inspirational quotes relevant to your identities and goals
- **Data Visualization**: Charts and graphs to visualize your mood trends and progress
- **Local Storage**: All your data is stored securely in your browser

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript with Tailwind CSS
- **Storage**: LocalStorage API for data persistence
- **Visualization**: Chart.js for mood and progress tracking
- **Deployment**: Netlify for hosting

## Project Structure

```
GratefulMind/
├── index.html              # Main entry point
├── css/
│   ├── style.css           # Main styles
│   ├── themes.css          # Light/dark themes
│   └── components.css      # Reusable component styles
├── js/
│   ├── app.js              # Main application logic
│   ├── storage.js          # LocalStorage utilities
│   ├── prompts.js          # Prompt generation system
│   ├── user.js             # User profile management
│   ├── journal.js          # Journal entry management
│   ├── feelings.js         # Mood tracking functionality
│   ├── tasks.js            # Task management
│   ├── goals.js            # Goal setting and tracking
│   ├── quotes.js           # Quote generation system
│   ├── insights.js         # Insights and reflection features
│   ├── charts.js           # Data visualization
│   ├── app-prompts.js      # Prompt UI handling
│   ├── app-feelings.js     # Feelings UI handling
│   ├── app-goals.js        # Goals UI handling
│   ├── app-journal-history.js # Journal history UI
│   └── app-life-areas.js   # Life areas UI handling
└── assets/
   ├── icons/              # UI icons
   ├── images/             # Images for the app
   └── data/               # JSON data files for prompts and quotes
```

## Features in Detail


### Journaling
- Daily journal entries with rich text formatting
- Prompt-based reflection to guide your writing
- Historical view of past entries
- Search and filter functionality

### Mood Tracking
- Track your mood throughout the day
- Visualize mood trends over time
- Identify patterns and correlations
- Get insights based on mood data

### Task & Goal Management
- Set daily goals aligned with your values
- Track completion of tasks
- Visualize progress over time
- Reflect on accomplishments

### Insights & Reflection
- Weekly summaries of your gratitude practice
- Monthly reflection reports
- Personalized insights based on your entries
- Progress tracking toward consistent practice

## Getting Started

1. Visit the [GratefulMind App](https://echojournals.netlify.app)
2. Start your gratitude practice with daily reflections
3. Review your progress in the insights section
4. Check out all your journal entries in the Journal Entries section.

## Local Development

1. Clone this repository
```
git clone https://github.com/Divya4879/GreatfulMind.git
```

2. Open `index.html` in your browser

3. For the best experience, use a modern browser with LocalStorage support

## Future Enhancements

- Cloud synchronization for multi-device access
- Reminder system for consistent practice
- Social sharing options for gratitude moments
- Advanced data analysis and insights
- Mobile application version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Acknowledgments

- Inspiration from gratitude research and positive psychology
- Icons from [Heroicons](https://heroicons.com/)
- Quotes from various sources on gratitude and mindfulness
