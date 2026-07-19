# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# android
- Set up local Android build toolchain (JDK, Android SDK, ANDROID_HOME, Gradle) for building APKs locally rather than relying on EAS downloads. Confidence: 0.60

# capacitor
- Never statically import native Capacitor plugins (e.g., `@codetrix-studio/capacitor-google-auth`); use dynamic `await import()` inside an `isNativePlatform()` guard, since the bundler can't resolve them at build time and they cause silent crashes. Confidence: 0.70

# cloud
- Prefer using gcloud CLI for Google Cloud project setup before directing to the console for manual steps. Confidence: 0.65

