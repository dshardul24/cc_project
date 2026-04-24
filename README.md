# CineSearch 🎬

CineSearch is a modern, high-performance movie discovery application built with **React 19** and **Vite**. It provides a premium user experience for searching movies, exploring detailed information, and discovering trending titles, all with a sleek, responsive design that supports both dark and light modes.

![CineSearch Mockup](https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **Real-time Search Suggestions**: Intelligent "search-as-you-type" recommendations that help you find movies faster.
- **Rich Movie Details**: View comprehensive information including plot summaries, ratings, cast, director, genre, and more in a beautiful modal interface.
- **Dynamic Homepage**: Explore a curated selection of iconic featured movies upon arrival.
- **Theme Support**: Seamlessly toggle between a sleek Dark Mode and a crisp Light Mode. Your preference is saved locally for your next visit.
- **Premium UI/UX**:
  - Smooth micro-animations and transitions.
  - Skeleton loading states for a perceived faster performance.
  - Fully responsive layout that looks great on mobile, tablet, and desktop.
  - Glassmorphic design elements for a modern aesthetic.
- **Robust Error Handling**: Graceful handling of network issues, empty results, and API errors.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback)
- **Styling**: Vanilla CSS with modern CSS variables for theming.
- **API**: [OMDb API](https://www.omdbapi.com/)
- **Icons**: Emoji & Custom SVG-like CSS elements.

## 🛠️ Project Structure

```text
├── .env.example        # Template for environment variables (commit this)
├── .env                # Your local secrets (never committed)
├── public/             # Static public assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── assets/         # Static assets (images, icons)
│   ├── api.js          # API integration logic
│   ├── App.jsx         # Main application logic and layout
│   ├── index.css       # Core design system and global styles
│   └── main.jsx        # App entry point
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## ⚡ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cinesearch.git
   cd cinesearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and replace `your_omdb_api_key_here` with your actual OMDb API key.  
   Get a free key at [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).

4. **Start the development server**
   ```bash
   npm run dev
   ```

> **⚠️ Important:** Never commit the `.env` file. It is already listed in `.gitignore`.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---
Developed with ❤️ by Antigravity
"# cc_project" 
