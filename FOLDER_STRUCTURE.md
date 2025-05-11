# GratefulMind Folder Structure

```
GratefulMind/
├── index.html                      # Main entry point
├── css/                            # Styling
│   ├── style.css                   # Main styles
│   ├── themes.css                  # Light/dark themes
│   └── components.css              # Reusable component styles
│
├── js/                             # JavaScript functionality
│   ├── app.js                      # Main application logic
│   ├── storage.js                  # LocalStorage utilities
│   ├── prompts.js                  # Prompt generation system
│   ├── user.js                     # User profile management
│   ├── journal.js                  # Journal entry management
│   ├── mood.js                     # Mood tracking functionality
│   ├── achievements.js             # Streaks and achievements
│   ├── quotes.js                   # Quote generation system
│   ├── export.js                   # Export functionality
│   ├── reflection.js               # Summary and reflection features
│   └── ui.js                       # UI manipulation functions
│
├── assets/                         # Static resources
│   ├── icons/                      # UI icons
│   │   ├── mood/                   # Mood icons
│   │   ├── achievements/           # Achievement badges
│   │   └── ui/                     # Interface icons
│   │
│   ├── images/                     # Images for the app
│   │   ├── backgrounds/            # Background images
│   │   └── illustrations/          # Decorative illustrations
│   │
│   └── data/                       # Static data files
│       ├── quotes.json             # Inspirational quotes
│       ├── prompts.json            # Reflection prompts
│       └── achievements.json       # Achievement definitions
│
├── pages/                          # Additional HTML pages
│   ├── settings.html               # User settings
│   ├── history.html                # Journal history view
│   ├── reflections.html            # Weekly/monthly reflections
│   └── achievements.html           # Achievements showcase
│
├── components/                     # Reusable HTML components
│   ├── header.html                 # App header
│   ├── footer.html                 # App footer
│   ├── prompt-card.html            # Prompt display component
│   ├── entry-form.html             # Journal entry form
│   └── mood-selector.html          # Mood selection component
│
└── docs/                           # Documentation
    ├── PROJECT_PLAN.md             # Detailed project plan
    ├── FOLDER_STRUCTURE.md         # This file
    ├── API.md                      # Internal API documentation
    └── USER_GUIDE.md               # User documentation
```

This structure organizes the project into logical sections:

- **Core HTML**: The main interface and additional pages
- **CSS**: Separated by function (main styles, themes, components)
- **JavaScript**: Modular files for different functionality
- **Assets**: All static resources organized by type
- **Components**: Reusable HTML snippets
- **Documentation**: Project documentation and guides
