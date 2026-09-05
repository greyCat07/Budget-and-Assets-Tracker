# Packaging Vault Finance into Mobile & Desktop Applications

This project is fully prepared for single-command builds for **Mobile (iOS & Android)**, **Desktop (Windows, macOS, Linux)**, and **Progressive Web App (PWA)**.

---

## 📱 Option 1: Mobile App (Android APK/AAB & iOS App)

The app is preconfigured with `capacitor.config.json` targeting `dist`.

### Step 1: Install Capacitor Mobile Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

### Step 2: Build the Web App & Initialize Mobile Platforms
```bash
# Build the production frontend
npm run build

# Add Android and iOS native folders (one time)
npx cap add android
npx cap add ios
```

### Step 3: Synchronize Code & Open in Native IDEs
```bash
# Copy web build into Android/iOS projects
npm run cap:sync

# To generate Android APK / release bundle:
npm run cap:android
# (Android Studio will open -> Select "Build" -> "Build Bundle(s) / APK(s)" -> "Build APK")

# To build iOS app (requires macOS & Xcode):
npm run cap:ios
# (Xcode will open -> Select your team/device -> Click "Run" or "Archive")
```

---

## 💻 Option 2: Desktop App (Windows .exe, macOS .dmg, Linux .AppImage)

The desktop configuration is ready under `electron/main.cjs` and `electron/preload.cjs`.

### Step 1: Install Electron & Builder
```bash
npm install -D electron electron-builder
```

### Step 2: Run in Desktop Mode Locally
```bash
# Build web assets first
npm run build

# Run native desktop window
npm run electron:start
```

### Step 3: Package into Executables / Installers
```bash
# Build standalone desktop installer for your current OS:
npx electron-builder --publish never

# Outputs will be generated in /dist_electron or /dist-electron:
# - Windows: .exe installer or portable .exe
# - macOS: .dmg / .app bundle
# - Linux: .AppImage / .deb package
```

---

## 🌐 Option 3: Instant PWA (No Build Tools Required)

The project includes `public/manifest.webmanifest`, app icons, and offline storage support:
- **Mobile**: Open the web link in Chrome/Safari -> Tap **"Add to Home Screen"** or **"Install App"**.
- **Desktop**: Click the install icon in Google Chrome / Edge address bar to run as a standalone desktop window.
