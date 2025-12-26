# Mobile Todo List - iOS Build

## Overview
This is the dedicated iOS build repository for Mobile Todo List, a location-aware, voice-enabled shopping and task management app with retail store inventory search.

## Key Features

- **Voice-first capture**: In-app speech-to-text plus text entry
- **Smart navigation**: Choose between Apple Maps, Google Maps, or Waze for one-tap directions
- **Location-aware reminders**: Auto-alerts when you're ~5–10 minutes away from a task location
- **Camera + OCR**: Take photos of products to auto-extract brand and details via ML Kit
- **Store inventory search**: Compare prices and availability across Target, Walmart, grocery stores, and Amazon
- **Proximity-based sorting**: Results sorted by nearest store with item in stock
- **Route optimization**: Plan efficient multi-stop routes using nearest-neighbor algorithm
- **Deadstock Zero design**: Purple palette (#5159B0 / #818CF8 / #1E293B)

## Project Structure

```
MobileTodoList-iOS/
├── ios/                          # iOS native code
│   ├── MobileTodoList/           # Main app target
│   ├── MobileTodoList.xcodeproj/ # Xcode project
│   ├── MobileTodoList.xcworkspace/ # Xcode workspace
│   └── Podfile                   # CocoaPods dependencies
├── src/                          # Shared React Native code
│   ├── components/               # React components
│   ├── services/                 # API services
│   ├── config/                   # Configuration
│   └── hooks/                    # Custom hooks
├── __tests__/                    # Test files
├── scripts/                      # Build and deployment scripts
│   └── setup-gcp.sh             # GCP configuration for iOS
├── App.tsx                       # Main app component
├── package.json                  # iOS-specific dependencies and scripts
├── app.json                      # App configuration
└── README.md                     # This file
```

## Prerequisites

- **macOS** (required for iOS development)
- **Xcode 15.0** or later
- **Node.js 18** or later
- **CocoaPods**
- **Google Cloud SDK** (for deployment)
- **Ruby** (for CocoaPods via Bundler)

## Quick Start

### 1. Install Dependencies

```bash
# Install Node modules
npm install

# Install iOS dependencies via CocoaPods
npm run pod:install

# Or manually
cd ios
bundle install
bundle exec pod install
cd ..
```

### 2. Run on iOS

```bash
# Start Metro bundler
npm start

# In a new terminal, run on iOS simulator
npm run ios

# Or run release build
npm run ios:release
```

### 3. Open in Xcode

```bash
# Open workspace in Xcode
open ios/MobileTodoList.xcworkspace
```

## Available Scripts

- `npm run ios` - Run on iOS simulator (Debug)
- `npm run ios:release` - Run release build on simulator
- `npm start` - Start Metro bundler
- `npm test` - Run Jest tests
- `npm run lint` - Lint code with ESLint
- `npm run pod:install` - Install CocoaPods dependencies
- `npm run build:ios` - Build iOS app with Xcode from command line

## Configuration

### Firebase Setup (iOS)

1. Create iOS app in [Firebase Console](https://console.firebase.google.com)
2. Download `GoogleService-Info.plist`
3. Add to `ios/MobileTodoList/` directory
4. Rebuild the app: `npm run ios`

### API Configuration

Update [src/config/api.config.ts](src/config/api.config.ts) with your API endpoints:
- Store search APIs (Target, Walmart, Amazon)
- Location services
- Other third-party integrations

### Google Cloud Platform

Run the iOS-specific GCP setup script:

```bash
cd scripts
chmod +x setup-gcp.sh
./setup-gcp.sh
```

This will:
- Create GCP project: `mobile-todo-list-ios`
- Enable required APIs (Firestore, Storage, Secret Manager, etc.)
- Set up Cloud Storage buckets
- Configure Firebase for iOS
- Set up secrets

### Permissions (iOS)

Add to `ios/MobileTodoList/Info.plist`:

```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to provide proximity alerts and find nearby stores</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby stores and calculate distances</string>

<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice input</string>

<key>NSSpeechRecognitionUsageDescription</key>
<string>We need speech recognition for voice-to-text features</string>

<key>NSCameraUsageDescription</key>
<string>We need camera access to scan product labels</string>
```

## Building for Production

### 1. Update Version

```bash
# Update package version
npm version patch  # or minor, major

# Update iOS version in Xcode
cd ios
agvtool new-marketing-version 1.0.0
agvtool new-version -all 1
cd ..
```

### 2. Configure Signing

In Xcode:
1. Open `ios/MobileTodoList.xcworkspace`
2. Select project in Navigator
3. Go to "Signing & Capabilities"
4. Select your Team
5. Set Bundle Identifier: `com.yourdomain.mobiletodolist.ios`

### 3. Archive Build

In Xcode:
1. Select "Any iOS Device" as build target
2. Product → Archive
3. Once archived, click "Distribute App"
4. Choose distribution method:
   - **App Store Connect**: For TestFlight and App Store
   - **Ad Hoc**: For internal testing
   - **Enterprise**: For enterprise distribution

### 4. Upload to TestFlight

```bash
# Build from command line (optional)
npm run build:ios
```

Then upload the `.ipa` file through:
- Xcode Organizer
- Transporter app
- `xcrun altool` command line

## GitHub Repository Setup

This iOS build should be maintained in a separate GitHub repository for:
- Independent versioning and releases
- iOS-specific CI/CD pipelines (GitHub Actions, Xcode Cloud)
- Focused issue tracking for iOS platform
- Optimized code review process

**Complete setup guide**: [GITHUB_REPOSITORY_SETUP.md](GITHUB_REPOSITORY_SETUP.md)

### Quick GitHub Setup

```bash
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS

# Initialize repository
git init
git add .
git commit -m "Initial commit: iOS build"

# Create and link to GitHub (using GitHub CLI)
gh repo create mobile-todo-list-ios --private --source=. --remote=origin --push
```

## Google Cloud Integration

### Project Details
- **Project ID**: `mobile-todo-list-ios`
- **Region**: `us-central1`
- **Platform**: iOS only (Android disabled)

### Services Enabled
- Firebase Authentication
- Cloud Firestore
- Cloud Storage
- Secret Manager
- Cloud Build (for CI/CD)
- Container Registry

### Cloud Build Setup

Create `.github/workflows/ios-build.yml` for automated builds:

```yaml
name: iOS Build and Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Install CocoaPods
      run: cd ios && pod install
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build:ios
```

## Xcode Cloud Integration

For native iOS CI/CD through Apple:

1. Open Xcode → Cloud
2. Create Workflow
3. Configure:
   - **Environment**: Xcode (latest)
   - **Start Condition**: On branch push to `main`
   - **Actions**: 
     - Install CocoaPods
     - Run tests
     - Archive for TestFlight
4. Add post-actions for TestFlight distribution

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- App.test.tsx

# Watch mode
npm test -- --watch
```

## Deployment Workflow

### Beta (TestFlight)
1. Update version: `npm version patch`
2. Archive in Xcode
3. Upload to App Store Connect
4. Submit for beta review
5. Add external testers in App Store Connect

### Production (App Store)
1. Update version: `npm version minor` or `major`
2. Archive in Xcode
3. Upload to App Store Connect
4. Complete app metadata and screenshots
5. Submit for review
6. Monitor status in App Store Connect

## Troubleshooting

### CocoaPods Issues
```bash
cd ios
pod repo update
pod deintegrate
pod install --repo-update
cd ..
```

### Xcode Build Errors
```bash
# Clean build
cd ios
xcodebuild clean -workspace MobileTodoList.xcworkspace -scheme MobileTodoList
cd ..

# Or in Xcode: Product → Clean Build Folder (Shift+Cmd+K)
```

### Metro Bundler Issues
```bash
# Reset cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all

# Clean install
rm -rf node_modules
npm install
```

### iOS Simulator Issues
```bash
# Reset simulator
xcrun simctl erase all

# List available simulators
xcrun simctl list devices
```

## Store Search Integration

See [STORE_API_INTEGRATION.md](STORE_API_INTEGRATION.md) for:
- Target API integration
- Walmart API integration
- Amazon Product Advertising API
- Grocery store APIs
- Web scraping fallback options

## Documentation

- [API Setup Guide](API_SETUP_GUIDE.md) - Configure external APIs
- [Feature Summary](FEATURE_SUMMARY.md) - Complete feature list
- [Store API Integration](STORE_API_INTEGRATION.md) - Retail API setup
- [GitHub Repository Setup](GITHUB_REPOSITORY_SETUP.md) - Git and CI/CD setup

## Support

For issues and feature requests:
- Create an issue in the GitHub repository
- Check Xcode console logs
- Review Firebase console for backend errors
- Check Google Cloud logs for API issues

## License

MIT

## Additional Resources

- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [Firebase iOS SDK](https://firebase.google.com/docs/ios/setup)
- [CocoaPods](https://cocoapods.org/)
- [App Store Connect](https://developer.apple.com/app-store-connect/)
- [TestFlight](https://developer.apple.com/testflight/)
- [Xcode Cloud](https://developer.apple.com/xcode-cloud/)
