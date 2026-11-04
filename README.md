# ASCENSION OS

Personal Development Operating System built with React, Vite, TypeScript, and Capacitor.

## Run locally

```bash
npm install
npm run dev
```

Build the web app with `npm run build`. The app stores progress locally through Capacitor Preferences with a browser localStorage fallback.

## Android APK

The `Android Release APK` GitHub Actions workflow builds the web app, generates the native Android project, runs `assembleRelease`, and uploads the offline-capable `app-release.apk` as the `ascension-os-offline-release-apk` artifact. From a workflow run, open the **Artifacts** section at the bottom and download that artifact. The app displays developer `Jhondurd3n`.

For a local native build, install the Android SDK and run `npm run android:release`.