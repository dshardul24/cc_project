# Moving Your Project Guide 🚚

Moving a web project is simple, but there are a few important rules to follow to ensure everything works correctly in its new location.

---

## 🛑 The Golden Rule: Skip `node_modules`
Before moving your project, **NEVER copy the `node_modules` folder**.
*   **Why?** It's massive (hundreds of MBs) and contains thousands of tiny files that make copying very slow.
*   **Can I get it back?** Yes! The `package.json` file remembers everything you need. You can simply run `npm install` in the new location to recreate it.

---

## 📁 How to Move (Step-by-Step)

### Option 1: To another folder on the SAME PC
1.  Open the project directory in your file explorer.
2.  Select everything **EXCEPT** the `node_modules` folder.
3.  **Right-click** > **Copy**.
4.  Go to the new location and **Right-click** > **Paste**.
5.  Open a terminal in the new folder and run:
    ```bash
    npm install
    ```

### Option 2: To another PC (using USB, Email, or Cloud)
1.  In your project folder, select everything **EXCEPT** `node_modules`.
2.  **Right-click** > **Compress to ZIP file** (or use your favorite compression tool).
3.  Transfer the `.zip` file to the new PC via a USB drive, Google Drive, or email.
4.  On the new PC, **Extract** the ZIP file into a new folder.
5.  Open a terminal in that folder and run:
    ```bash
    npm install
    ```

---

## 🌟 The Professional Way: Use GitHub 🐙
Instead of manually copying files, professionals use **Git**. This allows you to "move" your project to any PC by simply "cloning" it.

1.  **On the first PC**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    # Push to GitHub (requires a GitHub account and a new repo)
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

2.  **On the new PC**:
    ```bash
    git clone <your-repo-url>
    cd movie-search-app
    npm install
    ```

---

## 🛠️ After Moving Checklist
After copying your project and running `npm install`, always verify:
1.  **Environment Variables**: If you had a `.env` file, make sure you manually copied it (it's often hidden and skipped during normal copying).
2.  **Node.js Version**: Ensure the new PC has Node.js installed (v18 or higher recommended).
3.  **Test Run**: Run `npm run dev` to make sure the app starts correctly.

Happy coding in your new location! 🚀
