# GratefulMind

A personalized gratitude journal web application that adapts to your unique identity and provides tailored prompts for reflection throughout your day.

## Project Overview

GratefulMind is designed to help users cultivate gratitude and mindfulness through a customizable journaling experience. The application adapts to each user's unique identities and life circumstances, providing relevant prompts for reflection at different times of the day.

## Key Features

- **Identity-Based Customization**: Tailor your experience based on your roles (parent, professional, student, caregiver, etc.)
- **Time-Specific Prompts**: Different prompts for morning, afternoon, and evening
- **Mood Tracking**: Visual representations of your emotional journey
- **Reflection Summaries**: Weekly and monthly insights into your gratitude practice
- **Achievement System**: Streaks and milestones to encourage consistent practice
- **Quote Generator**: Inspirational quotes relevant to your identities and goals
- **Theme Options**: Dark/light mode that can change automatically with time of day
- **Export Functionality**: Save your entries as PDF or text files

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
│   ├── mood.js             # Mood tracking functionality
│   ├── achievements.js     # Streaks and achievements
│   ├── quotes.js           # Quote generation system
│   ├── export.js           # Export functionality
│   ├── reflection.js       # Summary and reflection features
│   └── ui.js               # UI manipulation functions
└── assets/
    ├── icons/              # UI icons
    ├── images/             # Images for the app
    └── data/               # JSON data files
```

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Complete the initial identity setup
4. Start your gratitude practice!

## Development Approach

See the detailed project plan in `PROJECT_PLAN.md` for a breakdown of all tasks and development phases.

## Tech Stack

- HTML5, CSS3, JavaScript (with Tailwind CSS)
- LocalStorage API
- Groq AI API for enhanced prompt generation
- Chart.js for visualizations
- jsPDF for PDF exports
