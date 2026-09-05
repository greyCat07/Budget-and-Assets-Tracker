# Budget & Asset Tracker

Cross-platform personal finance management application with semi-monthly budgeting, asset tracking, scheduled bill calendar, live stocks & crypto, biometric security, CSV export, and AI spending insights.

---

## 🚀 GitHub Pages Deployment

Your repository includes automated GitHub Actions workflows (`.github/workflows/deploy-pages.yml`) configured for Node 24 and Vite.

### Option 1: GitHub Actions Deployment (Recommended)

1. On GitHub, go to your repository: `https://github.com/greycat07/Budget-and-Assets-Tracker`
2. Click **Settings** (top navigation tab).
3. In the left sidebar, under **Code and automation**, click **Pages**.
4. Under **Build and deployment**:
   - Change **Source** to **GitHub Actions**.
5. Once selected, go to the **Actions** tab on GitHub, click **Deploy to GitHub Pages**, and run it (or push a commit to `main`).
6. Your live site will automatically be deployed to:
   `https://greycat07.github.io/Budget-and-Assets-Tracker/`

---

### Option 2: Branch Deployment (`gh-pages`)

If you prefer deploying from a branch:
1. Ensure the GitHub Actions workflow has run at least once (it automatically compiles and pushes the `dist` files to the `gh-pages` branch).
2. Go to **Settings** ➔ **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select **`gh-pages`** and folder **`/ (root)`**.
   - Click **Save**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```
