# ASCENSION OS

Personal Development Operating System built with React, Vite, TypeScript, and Capacitor.

## Run locally

```bash
npm install
npm run dev
```

Build the web app with `npm run build`. The app stores progress locally through Capacitor Preferences with a browser localStorage fallback.

## Android APK

The `Android Debug APK` GitHub Actions workflow builds the web app, generates the native Android project, runs `assembleDebug`, and uploads `app-debug.apk` as the `ascension-os-debug-apk` artifact. From a workflow run, open the **Artifacts** section at the bottom and download that artifact.

For a local native build, install the Android SDK and run `npm run android:debug`.