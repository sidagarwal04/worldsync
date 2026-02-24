# WorldSync 🌍

A modern Progressive Web App (PWA) for converting timezones with daylight savings time awareness. Built with Nuxt.js, Vue 3, and TypeScript.

## Features

- ⏰ **Timezone Conversion** with daylight savings time (DST) awareness for 81+ global timezones
- 🔄 **Swap Toggle** for quick timezone switching (like flight booking apps)
- 📱 **PWA Support** - Install as native app on mobile and desktop
- 🌐 **Offline Mode** - Works without internet connection
- 🎨 **Responsive Design** - Beautiful UI that works on all devices
- ♿ **Accessible** - Full keyboard navigation and screen reader support

## Tech Stack

- **Framework**: Nuxt 3 with Vue 3
- **Language**: TypeScript
- **Styling**: Scoped CSS with modern gradients and animations
- **State Management**: Vue Composition API with Composables
- **Date Handling**: Day.js with timezone plugin
- **PWA**: Service Worker, Web Manifest, Install prompts

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features Explained

### Timezone Converter
- **81+ Global Timezones**: US, Europe, Asia, Middle East, Africa, Oceania
- **DST Awareness**: Automatically detects daylight savings time
- **Abbreviations**: PST, EST, CET, IST, JST, etc. for easy recognition
- **Smart Search**: Find by name, abbreviation, country, or UTC offset
- **Swap Toggle**: Reverse timezones instantly like flight booking apps
- **Popular Pairs**: Quick shortcuts for common timezone conversions

### Offline Support
- ✅ All conversions work 100% offline
- ✅ Service Worker caches essential assets
- ✅ Network-First strategy with cache fallback
- ✅ Install to home screen for native app experience

## License

MIT License

---

**Built with ❤️ as a global solution for timezone conversion**
