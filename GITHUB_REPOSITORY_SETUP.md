# GitHub Repository Setup - iOS Build

## Overview
This guide explains how to set up a dedicated GitHub repository for the iOS build of Mobile Todo List.

## Repository Structure

### Recommended Approach: Separate Repository
Create a dedicated repository for iOS to enable:
- Platform-specific CI/CD workflows
- Independent version control and releases
- Focused issue tracking and PRs
- Optimized Xcode Cloud integration

## Setup Instructions

### 1. Create New GitHub Repository

```bash
# Navigate to iOS project folder
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS

# Initialize git repository
git init

# Create .gitignore for iOS/React Native
cat > .gitignore << 'EOF'
# OSX
.DS_Store

# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
ios/.xcode.env.local

# Node
node_modules/
npm-debug.log
yarn-error.log

# React Native
.expo/
.expo-shared/

# Bundle artifacts
*.jsbundle

# CocoaPods
ios/Pods/

# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# Testing
coverage/

# Misc
*.log
.DS_Store
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: iOS build structure"
```

### 2. Create GitHub Repository

**Option A: Using GitHub CLI**
```bash
# Install GitHub CLI if needed
brew install gh

# Authenticate
gh auth login

# Create repository
gh repo create mobile-todo-list-ios --private --description "Mobile Todo List - iOS Native Build"

# Set remote and push
git remote add origin https://github.com/YOUR_USERNAME/mobile-todo-list-ios.git
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Web Interface**
1. Go to https://github.com/new
2. Repository name: `mobile-todo-list-ios`
3. Description: "Mobile Todo List - iOS Native Build"
4. Choose Private
5. Do NOT initialize with README (already exists)
6. Click "Create repository"

```bash
# Then push local repository
git remote add origin https://github.com/YOUR_USERNAME/mobile-todo-list-ios.git
git branch -M main
git push -u origin main
```

### 3. Configure Repository Settings

#### Branch Protection
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

#### Secrets for CI/CD
Go to Settings → Secrets and variables → Actions

Add the following secrets:
- `APPLE_CERTIFICATE_BASE64`: iOS distribution certificate
- `APPLE_CERTIFICATE_PASSWORD`: Certificate password
- `PROVISIONING_PROFILE_BASE64`: Provisioning profile
- `GCP_PROJECT_ID`: `mobile-todo-list-ios`
- `GCP_SERVICE_ACCOUNT_KEY`: Service account JSON
- `FIREBASE_IOS_CONFIG`: Firebase GoogleService-Info.plist content

### 4. Set Up Xcode Cloud (Optional)

For automated iOS builds and TestFlight distribution:

1. In Xcode, open the project
2. Go to Project → Cloud → Create Workflow
3. Configure workflow for:
   - Run tests on pull requests
   - Build and archive on main branch
   - Distribute to TestFlight

### 5. GitHub Actions Workflow

Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install CocoaPods
      run: cd ios && pod install
    
    - name: Run tests
      run: npm test
    
    - name: Build iOS app
      run: |
        xcodebuild -workspace ios/MobileTodoList.xcworkspace \
          -scheme MobileTodoList \
          -configuration Release \
          -sdk iphoneos \
          CODE_SIGNING_ALLOWED=NO \
          build
```

### 6. Repository Badges

Add to README.md:
```markdown
[![iOS Build](https://github.com/YOUR_USERNAME/mobile-todo-list-ios/workflows/iOS%20Build%20and%20Test/badge.svg)](https://github.com/YOUR_USERNAME/mobile-todo-list-ios/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
```

## Google Cloud Integration

### Link Repository to GCP

```bash
# Authenticate with GCP
gcloud auth login

# Set project
gcloud config set project mobile-todo-list-ios

# Connect GitHub repository to Cloud Build
gcloud beta builds triggers create github \
  --repo-name=mobile-todo-list-ios \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Create cloudbuild.yaml

```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']
  
  # Run tests
  - name: 'node:18'
    entrypoint: npm
    args: ['test']
  
  # Build notification
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'pubsub'
      - 'topics'
      - 'publish'
      - 'ios-build-complete'
      - '--message'
      - 'iOS build completed successfully'

options:
  machineType: 'N1_HIGHCPU_8'
  
timeout: '1800s'
```

## Xcode Project Configuration

### Update Bundle Identifier
1. Open `ios/MobileTodoList.xcworkspace` in Xcode
2. Select project in Navigator
3. Under "Signing & Capabilities":
   - Bundle Identifier: `com.yourdomain.mobiletodolist.ios`
   - Team: Select your development team
   - Signing Certificate: iOS Distribution

### Configure Build Settings
- Product Name: Mobile Todo List
- Display Name: Mobile Todo List
- Version: 1.0.0
- Build: 1

## Release Process

### 1. Version Bump
```bash
# Update version in package.json
npm version patch  # or minor, or major

# Update iOS version
cd ios
agvtool new-marketing-version 1.0.1
agvtool new-version -all 2
```

### 2. Create Release
```bash
# Create tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes "Initial iOS release"
```

### 3. TestFlight Distribution
```bash
# Build archive
xcodebuild -workspace ios/MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Release \
  -archivePath build/MobileTodoList.xcarchive \
  archive

# Export for App Store
xcodebuild -exportArchive \
  -archivePath build/MobileTodoList.xcarchive \
  -exportPath build \
  -exportOptionsPlist ios/ExportOptions.plist
```

## Collaboration

### Team Access
1. Go to Settings → Collaborators
2. Add team members with appropriate permissions:
   - **Admin**: Full access, can manage settings
   - **Write**: Can push to repository
   - **Read**: Can view and clone repository

### Code Review Process
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit
3. Push to GitHub: `git push origin feature/new-feature`
4. Create Pull Request
5. Request review from team members
6. Merge after approval

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update
cd ios && pod update && cd ..

# Commit updates
git add .
git commit -m "chore: update dependencies"
git push
```

### Security
- Enable Dependabot alerts
- Regular security audits: `npm audit`
- Keep CocoaPods updated

## Additional Resources

- [GitHub Actions for iOS](https://docs.github.com/en/actions/guides/building-and-testing-ios)
- [Xcode Cloud Documentation](https://developer.apple.com/xcode-cloud/)
- [Fastlane for iOS](https://docs.fastlane.tools/)
- [App Store Connect API](https://developer.apple.com/app-store-connect/api/)

## Support

For issues with:
- **GitHub**: Check Actions logs and repository settings
- **Xcode Cloud**: Review workflow configurations
- **GCP**: Check Cloud Build logs and service accounts
- **CocoaPods**: Run `pod repo update` and `pod install --clean`
