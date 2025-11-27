# ⚽ 31-Day Football Keepy-Upps Challenge

A beautiful, fullscreen countdown timer app for tracking your daily football juggling (keepy-upps) goals. Built with Vue 3, Vite, and Tailwind CSS.

![Keepy-Upps Challenge](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)

## 🎯 Features

- **Giant Countdown Display**: Massive, high-visibility counter perfect for glancing at during practice
- **Real-time Tick-down**: Counter decrements 1 unit every ~360ms (1,000 per 6 minutes)
- **31-Day Challenge Tracking**: Automatic day progression with daily goal resets
- **Pause/Resume**: Large button for easy tap control
- **Persistence**: All progress saved to localStorage - survives browser restarts
- **Confetti Celebration**: Fun animation when you complete a day's goal!
- **Customizable Settings**: Adjust daily target, tick rate, and manual overrides
- **Keyboard Support**: Press `Space` to pause/resume
- **Responsive Design**: Optimized for landscape mode on laptops and iPads

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/football-keepy-upps.git
cd football-keepy-upps

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📱 How to Use

1. **Start the Challenge**: Open the app - it automatically starts on Day 1 with 40,000 keepy-upps
2. **Practice**: When you're ready to practice, hit the big green **Resume** button
3. **Count Down**: The counter ticks down automatically as you practice
4. **Take Breaks**: Hit **Pause** anytime - your progress is saved instantly
5. **Complete the Day**: When you hit 0, celebrate with confetti! 🎉
6. **Next Day**: Click "Start Day X" to begin the next day's challenge
7. **Customize**: Use the ⚙️ settings button to adjust targets or tick rate

## ⚙️ Settings

Access settings via the gear icon in the top-right corner:

| Setting           | Default | Description                                      |
| ----------------- | ------- | ------------------------------------------------ |
| Daily Start Value | 40,000  | Target keepy-upps per day                        |
| Tick Rate         | 360ms   | How fast the counter decrements (1 per interval) |
| Current Day       | 1       | Day of the challenge (1-31)                      |
| Current Counter   | -       | Manual override for the counter value            |

## 🎮 Controls

| Action         | Control                                |
| -------------- | -------------------------------------- |
| Pause/Resume   | Click button or press `Space`          |
| Open Settings  | Click ⚙️ gear icon                     |
| Close Settings | Click outside panel or press `Escape`  |
| Reset Day      | Click "Reset Day" button (when paused) |

## 📂 Project Structure

```
football-keepy-upps/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── public/
│   └── football.svg        # Favicon
└── src/
    ├── main.js             # Vue app entry point
    ├── App.vue             # Root component
    ├── style.css           # Global styles + Tailwind
    ├── components/
    │   ├── CountdownDisplay.vue   # Main counter display
    │   ├── PauseButton.vue        # Play/Pause controls
    │   ├── SettingsPanel.vue      # Settings modal
    │   └── ConfettiEffect.vue     # Celebration animation
    ├── stores/
    │   └── counter.js      # Pinia store (state management)
    └── utils/
        ├── persistence.js  # localStorage helpers
        └── timer.js        # Precise interval timer
```

## 🌐 Deployment

### GitHub Pages

1. Update `vite.config.js` base path if needed:

   ```js
   base: "/your-repo-name/";
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Push dist/ folder to gh-pages branch
   ```

### Netlify

1. Connect your GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

1. Import your GitHub repo to Vercel
2. It auto-detects Vite and deploys!

## 🔧 Technical Details

### Timer Precision

The app uses `requestAnimationFrame` for smooth, drift-resistant timing:

- Base rate: 360ms per tick (1,000 keepy-upps / 6 minutes)
- Accumulates time precisely to prevent drift over long sessions
- Catches up if the tab was backgrounded

### Data Persistence

All state is stored in `localStorage`:

- `counter` - Current countdown value
- `currentDay` - Day of the challenge (1-31)
- `isPaused` - Timer pause state
- `dailyStartValue` - Customized daily target
- `tickRateMs` - Custom tick interval
- `lastTickTimestamp` - For calculating missed ticks
- `lastDateString` - For detecting day changes

### Day Transitions

- Uses local timezone for day boundaries
- Automatically advances to next day when a new calendar day starts
- Resets counter to daily start value on new day

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own keepy-upps challenge!

---

Made with ❤️ and ⚽ for football lovers everywhere.
