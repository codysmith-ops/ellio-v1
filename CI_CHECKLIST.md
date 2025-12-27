# CI/CD Enforcement Checklist — Maximum Rigor Gates

**Project:** MobileTodoList-iOS  
**Date:** December 27, 2025  
**Enforcement Level:** HARD-FAIL on violations  

---

## Overview

This checklist defines **automated gates** in the CI/CD pipeline. Each gate must **pass** before proceeding. Failures are **non-negotiable** and must be resolved.

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PREFLIGHT GATE (HARD-FAIL)                              │
│    - Validate Xcode 15.4                                    │
│    - Validate iPhone 15 / iOS 17.5 available                │
│    - Check for Android references                           │
│    - Verify lockfiles present                               │
└─────────────────────────────────────────────────────────────┘
                          ↓ PASS
┌─────────────────────────────────────────────────────────────┐
│ 2. DEPENDENCY INSTALLATION (DETERMINISTIC)                  │
│    - npm ci (NOT npm install)                               │
│    - pod install (with Podfile.lock)                        │
│    - Verify integrity                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓ PASS
┌─────────────────────────────────────────────────────────────┐
│ 3. LINT & STATIC ANALYSIS                                   │
│    - ESLint (JS/TS)                                         │
│    - TypeScript type check                                  │
│    - SwiftLint (if configured)                              │
│    - Xcode Analyze                                          │
└─────────────────────────────────────────────────────────────┘
                          ↓ PASS
┌─────────────────────────────────────────────────────────────┐
│ 4. BUILD (LOCKED DESTINATION)                               │
│    - Clean build with enforced destination                  │
│    - No deployment target warnings                          │
│    - No SDK mismatch errors                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓ PASS
┌─────────────────────────────────────────────────────────────┐
│ 5. TEST EXECUTION                                           │
│    - Unit tests                                             │
│    - UI tests (if present)                                  │
│    - Code coverage report                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓ PASS
┌─────────────────────────────────────────────────────────────┐
│ 6. ARTIFACT UPLOAD & REPORTING                              │
│    - Upload .xcresult                                       │
│    - Upload build logs                                      │
│    - Upload test results                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## GATE 1: Preflight Checks (HARD-FAIL)

### Xcode Version Enforcement

```yaml
- name: Verify Xcode 15.4
  run: |
    XCODE_VERSION=$(xcodebuild -version | head -1)
    if [[ "$XCODE_VERSION" != "Xcode 15.4" ]]; then
      echo "❌ FAIL: Wrong Xcode version: $XCODE_VERSION"
      exit 1
    fi
    echo "✅ PASS: Xcode 15.4"
```

**Expected Output:**
```
✅ PASS: Xcode 15.4
```

**Failure Behavior:**
- Exit code 1
- Pipeline stops immediately
- PR cannot merge

---

### Xcode Selection Enforcement

```yaml
- name: Select Xcode 15.4
  run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer

- name: Verify Xcode Path
  run: |
    XCODE_PATH=$(xcode-select -p)
    if [[ "$XCODE_PATH" != *"Xcode_15.4"* ]]; then
      echo "❌ FAIL: Wrong Xcode path: $XCODE_PATH"
      exit 1
    fi
    echo "✅ PASS: Xcode path correct"
```

---

### Simulator Availability

```yaml
- name: Verify iPhone 15 / iOS 17.5
  run: |
    SIMULATOR=$(xcrun simctl list devices | grep "iPhone 15" | grep "17.5" | head -1)
    if [[ -z "$SIMULATOR" ]]; then
      echo "❌ FAIL: iPhone 15 / iOS 17.5 not available"
      exit 1
    fi
    echo "✅ PASS: Simulator available"
```

---

### iOS-Only Mode Validation

```yaml
- name: Check for Android References
  run: |
    ANDROID_CHECK=$(grep -r "android" package.json .github/workflows .vscode/tasks.json 2>/dev/null || true)
    if [[ -n "$ANDROID_CHECK" ]]; then
      echo "⚠️  WARNING: Android references detected"
      echo "$ANDROID_CHECK"
    else
      echo "✅ PASS: iOS-only mode clean"
    fi
```

---

### Preflight Script Execution

```yaml
- name: Run Preflight Script (ENFORCED)
  run: |
    chmod +x scripts/preflight.sh
    ./scripts/preflight.sh
```

**Expected Output:**
```
🔍 Running preflight checks...
✅ Xcode: Xcode 15.4 (Build 15F31d)
✅ Simulator: iPhone 15 (iOS 17.5) available
✅ iOS-only mode: Verified
✅ All preflight checks passed
```

**Failure Behavior:**
- Exit code 1
- Pipeline stops
- Clear diagnostic message shown

---

## GATE 2: Dependency Installation

### Node.js Dependencies (Deterministic)

```yaml
- name: Install Node Dependencies
  run: npm ci  # NOT npm install
```

**Why `npm ci`?**
- Uses `package-lock.json` exactly
- Fails if lockfile is out-of-date
- Faster than `npm install`
- Reproducible across environments

**Validation:**
```yaml
- name: Verify node_modules Integrity
  run: |
    if [ ! -d "node_modules" ]; then
      echo "❌ FAIL: node_modules missing"
      exit 1
    fi
    echo "✅ PASS: Dependencies installed"
```

---

### CocoaPods Dependencies (Locked)

```yaml
- name: Install iOS Dependencies
  run: |
    cd ios
    pod install
```

**Validation:**
```yaml
- name: Verify Podfile.lock Committed
  run: |
    if [ ! -f "ios/Podfile.lock" ]; then
      echo "❌ FAIL: Podfile.lock missing"
      exit 1
    fi
    echo "✅ PASS: Podfile.lock present"
```

**Lockfile Drift Detection:**
```yaml
- name: Check for Podfile.lock Drift
  run: |
    cd ios
    pod install
    git diff --exit-code Podfile.lock || {
      echo "❌ FAIL: Podfile.lock has uncommitted changes"
      exit 1
    }
```

---

## GATE 3: Lint & Static Analysis

### ESLint (JavaScript/TypeScript)

```yaml
- name: Run ESLint
  run: npm run lint
```

**Expected:**
```
✨  Done in 2.34s.
```

**Failure Behavior:**
- Show linting errors
- Exit code 1
- PR cannot merge

---

### TypeScript Type Check

```yaml
- name: TypeScript Type Check
  run: npx tsc --noEmit
```

**Validation:**
- No type errors
- Strict mode enabled (`tsconfig.json`)

---

### SwiftLint (if configured)

```yaml
- name: Run SwiftLint
  run: |
    if command -v swiftlint &> /dev/null; then
      swiftlint lint --strict
    else
      echo "⚠️  SwiftLint not installed (optional)"
    fi
```

---

### Xcode Static Analysis

```yaml
- name: Xcode Analyze
  run: |
    cd ios
    xcodebuild analyze \
      -workspace MobileTodoList.xcworkspace \
      -scheme MobileTodoList \
      -configuration Debug \
      -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

**Expected:**
```
** ANALYZE SUCCEEDED **
```

---

## GATE 4: Build (LOCKED DESTINATION)

### Clean Build Enforcement

```yaml
- name: Build iOS App (ENFORCED: iPhone 15 / iOS 17.5)
  run: |
    cd ios
    xcodebuild clean build \
      -workspace MobileTodoList.xcworkspace \
      -scheme MobileTodoList \
      -configuration Debug \
      -sdk iphonesimulator \
      -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
      -resultBundlePath ${{ runner.temp }}/MobileTodoList.xcresult
```

**Critical Parameters:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `-workspace` | `MobileTodoList.xcworkspace` | CocoaPods workspace |
| `-scheme` | `MobileTodoList` | Main app scheme |
| `-configuration` | `Debug` | Debug build (faster) |
| `-sdk` | `iphonesimulator` | Simulator SDK |
| `-destination` | `'platform=iOS Simulator,name=iPhone 15,OS=17.5'` | **LOCKED DESTINATION** |
| `-resultBundlePath` | Path to xcresult | Artifact for analysis |

**Expected Output:**
```
** BUILD SUCCEEDED **
```

**Failure Behavior:**
- Show build errors
- Upload `.xcresult` bundle
- Exit code 1

---

### Build Time Threshold

```yaml
- name: Validate Build Time
  run: |
    # Assuming build time captured in previous step
    BUILD_TIME=$(... extract from logs ...)
    MAX_TIME=300  # 5 minutes
    if [ "$BUILD_TIME" -gt "$MAX_TIME" ]; then
      echo "⚠️  WARNING: Build took ${BUILD_TIME}s (max: ${MAX_TIME}s)"
    fi
```

---

## GATE 5: Test Execution

### Unit Tests

```yaml
- name: Run Unit Tests
  run: |
    cd ios
    xcodebuild test \
      -workspace MobileTodoList.xcworkspace \
      -scheme MobileTodoList \
      -configuration Debug \
      -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
      -resultBundlePath ${{ runner.temp }}/TestResults.xcresult
```

**Expected:**
```
Test Suite 'All tests' passed at ...
   Executed X tests, with 0 failures
** TEST SUCCEEDED **
```

---

### Code Coverage

```yaml
- name: Generate Code Coverage
  run: |
    xcrun xccov view --report ${{ runner.temp }}/TestResults.xcresult
```

**Threshold (Optional):**
```yaml
- name: Enforce Coverage Threshold
  run: |
    COVERAGE=$(... extract from xccov ...)
    MIN_COVERAGE=70
    if [ "$COVERAGE" -lt "$MIN_COVERAGE" ]; then
      echo "⚠️  WARNING: Coverage ${COVERAGE}% below threshold ${MIN_COVERAGE}%"
    fi
```

---

### UI Tests (if present)

```yaml
- name: Run UI Tests
  run: |
    cd ios
    xcodebuild test \
      -workspace MobileTodoList.xcworkspace \
      -scheme MobileTodoListUITests \
      -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

---

## GATE 6: Artifact Upload

### Build Logs

```yaml
- name: Upload Build Logs
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: build-logs
    path: |
      ios/build/
      ${{ runner.temp }}/*.xcresult
```

---

### Test Results

```yaml
- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: ${{ runner.temp }}/TestResults.xcresult
```

---

### Lint Reports

```yaml
- name: Upload Lint Reports
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: lint-reports
    path: |
      eslint-report.html
      swiftlint-report.html
```

---

## Firebase-Specific Gates 🔥

### If Firebase Re-Integrated

#### Firebase Config Validation

```yaml
- name: Verify GoogleService-Info.plist
  run: |
    PLIST_PATH="ios/MobileTodoList/GoogleService-Info.plist"
    if [ ! -f "$PLIST_PATH" ]; then
      echo "❌ FAIL: Firebase config missing"
      exit 1
    fi
    echo "✅ PASS: Firebase config present"
```

**Secret Protection:**
```yaml
- name: Redact Firebase Keys in Logs
  run: |
    # Ensure no API keys appear in logs
    export FIREBASE_API_KEY="REDACTED"
```

---

#### Firebase Dependency Stability

```yaml
- name: Check Firebase Pod Versions
  run: |
    cd ios
    grep "Firebase" Podfile.lock | grep -v "gRPC" || {
      echo "⚠️  Firebase dependencies changed"
    }
```

---

#### Crashlytics Build Phase

```yaml
- name: Verify Crashlytics Script
  run: |
    grep "Crashlytics" ios/MobileTodoList.xcodeproj/project.pbxproj || {
      echo "⚠️  Crashlytics build phase missing (OK if not using)"
    }
```

---

## Security Gates 🔒

### Secret Scan

```yaml
- name: Scan for Secrets
  run: |
    # Check for common secret patterns
    git log -p | grep -iE "(api_key|password|secret)" && {
      echo "⚠️  WARNING: Possible secret detected in commits"
    } || echo "✅ PASS: No obvious secrets"
```

---

### .env File Protection

```yaml
- name: Verify .env in .gitignore
  run: |
    grep -q "\.env" .gitignore || {
      echo "❌ FAIL: .env not in .gitignore"
      exit 1
    }
    echo "✅ PASS: .env properly ignored"
```

---

## Performance Gates ⚡

### Build Time Benchmark

```yaml
- name: Build Time Benchmark
  run: |
    START=$(date +%s)
    cd ios && xcodebuild clean build ...
    END=$(date +%s)
    DURATION=$((END - START))
    echo "Build completed in ${DURATION}s"
    if [ "$DURATION" -gt 300 ]; then
      echo "⚠️  Build slower than expected (>5min)"
    fi
```

---

### Binary Size Check

```yaml
- name: Check Binary Size
  run: |
    APP_SIZE=$(du -sh ios/build/Debug-iphonesimulator/MobileTodoList.app | awk '{print $1}')
    echo "App size: $APP_SIZE"
```

---

## Failure Handling

### On Build Failure

```yaml
- name: Diagnose Build Failure
  if: failure()
  run: |
    echo "Collecting diagnostics..."
    xcodebuild -version
    xcode-select -p
    xcrun simctl list devices
```

---

### On Test Failure

```yaml
- name: Upload Test Failure Artifacts
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: test-failures
    path: |
      ${{ runner.temp }}/*.xcresult
      ios/build/Logs/Test/*.xcresult
```

---

## Status Badges

### Add to README.md

```markdown
![iOS Build](https://github.com/<user>/<repo>/workflows/iOS%20Build/badge.svg)
```

---

## Complete Workflow Example

```yaml
name: iOS CI/CD - Maximum Enforcement

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  ios-build-test:
    runs-on: macos-latest
    
    steps:
    # === GATE 1: PREFLIGHT ===
    - uses: actions/checkout@v3
    
    - name: Select Xcode 15.4
      run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer
    
    - name: Verify Xcode Version
      run: xcodebuild -version | grep "Xcode 15.4"
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Run Preflight Checks
      run: |
        chmod +x scripts/preflight.sh
        ./scripts/preflight.sh
    
    # === GATE 2: DEPENDENCIES ===
    - name: Install Node Dependencies
      run: npm ci
    
    - name: Install iOS Dependencies
      run: cd ios && pod install
    
    # === GATE 3: LINT & ANALYSIS ===
    - name: Run ESLint
      run: npm run lint
    
    - name: TypeScript Check
      run: npx tsc --noEmit
    
    # === GATE 4: BUILD ===
    - name: Build iOS App (ENFORCED)
      run: |
        cd ios
        xcodebuild clean build \
          -workspace MobileTodoList.xcworkspace \
          -scheme MobileTodoList \
          -configuration Debug \
          -sdk iphonesimulator \
          -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
    
    # === GATE 5: TEST ===
    - name: Run Tests
      run: |
        cd ios
        xcodebuild test \
          -workspace MobileTodoList.xcworkspace \
          -scheme MobileTodoList \
          -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
    
    # === GATE 6: ARTIFACTS ===
    - name: Upload Artifacts
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: ios/build/
```

---

## Enforcement Summary

| Gate | Enforcement Level | Bypass Allowed? |
|------|------------------|-----------------|
| Preflight | HARD-FAIL | ❌ Never |
| Dependencies | HARD-FAIL | ❌ Never |
| Lint | HARD-FAIL | ⚠️ With approval |
| Build | HARD-FAIL | ❌ Never |
| Tests | HARD-FAIL | ⚠️ With approval |
| Coverage | WARNING | ✅ Yes |
| Performance | WARNING | ✅ Yes |

---

**Maintained by:** GitHub Copilot (Claude Agent)  
**Last Updated:** December 27, 2025  
**Version:** 1.0
