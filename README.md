# 🐍 T-Snack

A modern snake game built with React, TypeScript, and HTML5 Canvas. Features a clean white minimalist UI with bilingual support, level progression system, and mobile-friendly controls.

> **Live Demo**: [Play Now](https://hzy-xy.github.io/t-snack/)

## ✨ Features

- 🎮 **Classic Snake Gameplay** — Control the snake with arrow keys, WASD, or touch controls
- 📈 **Level & XP System** — Earn XP by eating food, level up to unlock speed bonuses and visual upgrades
- 🎨 **Dynamic Visuals** — Snake color changes with each level (Green → Blue → Gold → Purple → Pink → Rainbow at Lv.6)
- ❤️ **HP System** — Start with 1 HP, gain +1 HP per level (max 3), ghost state on collision
- 🪨 **Obstacle Terrain** — Randomized rock obstacles add challenge variety
- 🔊 **Sound Effects** — Web Audio API powered eat sounds, level-up chimes, and voice praise
- 🌐 **Bilingual UI** — Chinese/English toggle with full i18n coverage
- 📱 **Responsive Design** — Optimized for both desktop and mobile devices with touch controls
- 👑 **Developer Mode** — Password-protected dev mode with god mode and max level
- ✨ **Blessing System** — Reach Lv.6 in normal mode to trigger special star particle effects + invincibility

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Rendering | HTML5 Canvas API |
| Audio | Web Audio API + SpeechSynthesis |
| Icons | Lucide React |
| i18n | Custom React Context |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/t-snack.git
cd t-snack

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

### Controls

| Key | Action |
|---|---|
| Arrow Keys / WASD | Move snake |
| Space | Start / Pause |

### Difficulty Levels

| Level | Speed | Description |
|---|---|---|
| Easy | 480ms | Relaxed pace |
| Normal | 320ms | Balanced challenge |
| Hard | 200ms | Fast-paced action |

### Game Mechanics

- Eat food to gain **10 points** and **10 XP**
- Level up by accumulating XP — each level increases speed
- HP starts at **1**, caps at **3** (+1 per level in normal mode)
- Colliding with walls, yourself, or obstacles triggers **ghost state** (temporary invincibility)
- At **Lv.6** in normal mode, unlock the special blessing effect

### Developer Mode

Click the **Dev** button in the mode switcher → enter password `123456` to activate developer mode with:
- **God Mode** — Permanent invincibility
- **Max Level** — Instant Lv.6 with rainbow snake

## 📁 Project Structure

```
src/
├── components/       # React UI components
│   ├── GameCanvas.tsx      # Canvas game rendering engine
│   ├── ControlButtons.tsx  # Start/Pause/Restart buttons
│   ├── TouchControls.tsx   # Mobile directional controls
│   ├── SidePanel.tsx       # Right sidebar layout
│   ├── ScorePanel.tsx      # Score & high score display
│   ├── DifficultySelector.tsx
│   ├── ModeSwitch.tsx      # Normal/Dev mode toggle
│   ├── PasswordModal.tsx   # Dev mode password prompt
│   ├── DevPanel.tsx        # Developer tools panel
│   ├── GameOverModal.tsx   # Game over overlay
│   ├── RulesInfo.tsx       # Controls reference
│   └── Toast.tsx           # Notification toast
├── store/
│   └── gameStore.ts        # Zustand game state & logic
├── hooks/
│   └── useSnakeGame.ts     # Game lifecycle hook
├── utils/
│   └── sound.ts            # Web Audio API sound engine
├── pages/
│   └── Home.tsx            # Main game page layout
├── i18n.tsx                # Internationalization provider
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## 📄 License

MIT