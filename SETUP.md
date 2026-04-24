# Project Setup & Execution Guide 🚀

Follow these steps to get **CineSearch** up and running on your local machine.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18 or higher is recommended. [Download it here](https://nodejs.org/).
- **npm**: Usually comes with Node.js. Used for package management.
- **Git** (optional): For cloning the repository from a version control system.

## 📦 Installation

1. **Clone the Repository**:
   If you have the code locally, skip to the next step. Otherwise, clone the repository:
   ```bash
   git clone <your-repository-url>
   cd movie-search-app
   ```

2. **Install Dependencies**:
   Enter the project directory and run the following command to download all required packages:
   ```bash
   npm install
   ```

   This will install all necessary libraries, including **React**, **Vite**, and their respective types.

## 🎬 Running the App

Once the installation is complete, you can start the development server:

```bash
npm run dev
```

The terminal will provide a local URL, typically:
`http://localhost:5173/`

Open this link in your browser to view the application. The dev server includes **Hot Module Replacement (HMR)**, meaning any changes you make to the code will be reflected in the browser instantly!

## 🔧 Environment Configuration (Optional)

The application currently uses a built-in API key for the OMDb API in `src/api.js`. For a more secure and production-ready setup, you may want to use your own API key:

1. Create a `.env` file in the root directory.
2. Add your OMDb API key:
   ```text
   VITE_OMDB_API_KEY=your_api_key_here
   ```
3. Update `src/api.js` to use `import.meta.env.VITE_OMDB_API_KEY`.

## 🏗️ Building for Production

To create an optimized production build of the project, run:

```bash
npm run build
```

The output will be generated in the `dist/` directory, which can be deployed to any static host (like Vercel, Netlify, or GitHub Pages).

To preview the production build locally:
```bash
npm run preview
```

## 📚 Key Technologies Used

- **React 19**: The core UI library.
- **Vite 8**: The extremely fast build tool and development server.
- **TypeScript**: Used for type checking and better developer experience (even with `.jsx` files, the configuration supports it).
- **Modern CSS**: Using CSS variables for theme switching and CSS Flexbox/Grid for layouts.

---
If you encounter any issues, please feel free to reach out or open an issue in the project's repository.
