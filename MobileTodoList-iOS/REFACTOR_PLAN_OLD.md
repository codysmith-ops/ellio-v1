# Enterprise iOS Modernization — Refactor Plan

**Plan Date:** December 27, 2025  
**Project:** MobileTodoList-iOS  
**Baseline:** BEFORE_AUDIT.md (Updated for Current State)  
**Target:** React Native 0.76.5, iOS 16.0+, Firebase Re-Integration  
**Risk Level:** MEDIUM (Major RN upgrade + Firebase re-integration)

---

## Executive Summary

This refactor plan addresses the **critical version mismatch** between current state (React Native 0.73.9) and master prompt requirements (React Native 0.76.5), along with Firebase re-integration that was previously removed due to gRPC build errors.

### Current State vs. Target State

| Component | Current (Actual) | Target (Master Prompt) | Status |
|-----------|------------------|------------------------|--------|
| React Native | 0.73.9 ✅ **STABLE** | 0.76.5 🔴 **REQUIRED** | UPGRADE NEEDED |
| Xcode | 15.4 ✅ **ENFORCED** | 15.4 ✅ | LOCKED |
| Simulator | iPhone 15 / iOS 17.5 ✅ | iPhone 15 / iOS 17.5 ✅ | LOCKED |
| iOS Deployment | 16.0 ✅ | 16.0 ✅ | SET |
| Firebase | ❌ **REMOVED** | ✅ **REQUIRED** | RE-INTEGRATION NEEDED |
| Android | ❌ **ISOLATED** | iOS-only mode ✅ | COMPLETE |
| macOS | 26.2 Tahoe ✅ | 26.2 Tahoe (permitted) ✅ | ALLOWED |

### Critical Finding: Documentation vs. Reality

**BEFORE_AUDIT.md Inaccuracy:**  
- Document states: React Native 0.76.5  
- Actual version: React Native 0.73.9  
- Root cause: Downgrade from 0.76.5 happened in commit `38d5077` due to Xcode 26.2 SDK issues  
- Resolution: Xcode 15.4 now enforced, safe to upgrade to 0.76.5  

**Firebase Removal:**  
- Commits `59d127c` and `5f19727` removed Firebase  
- Reason: gRPC-Core build errors  
- Master prompt requires: "Firebase must be preserved. If previously removed, re-integrate with extreme care."  

### Refactor Strategy: Two-Phase Approach

**Phase 1: Foundation (Enforcement Complete) ✅**  
- ✅ Xcode 15.4 verification and enforcement  
- ✅ Simulator lock (iPhone 15 / iOS 17.5)  
- ✅ Android isolation (iOS-only mode)  
- ✅ Documentation infrastructure (ENFORCEMENT_README, IOS_ONLY_MODE, TOOLCHAIN_LOCK, CI_CHECKLIST, PR_DOD)  
- ✅ Preflight script with hard-fail gates  

**Phase 2: Upgrade & Integration (Pending User Approval) 🔴**  
- ⏸️ React Native 0.73.9 → 0.76.5 upgrade  
- ⏸️ Firebase SDK re-integration  
- ⏸️ iOS 16 modernization (SwiftLint, SwiftFormat, accessibility)  
- ⏸️ Performance optimization  

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| RN 0.76.5 introduces breaking changes | **MEDIUM** | **HIGH** | Thorough testing, rollback plan to commit `4c75963` |
| Firebase gRPC errors recur | **MEDIUM** | **MEDIUM** | Pin Firebase SDK to known-good version, validate with Xcode 15.4 |
| Community modules incompatible with 0.76.5 | **LOW** | **HIGH** | Pre-upgrade compatibility research, prepare forks if needed |
| Xcode 15.4 incompatible with RN 0.76.5 | **LOW** | **CRITICAL** | Verify in RN GitHub issues before proceeding |

---

## Phase 2A: Tooling & Code Quality Infrastructure (Immediate)

### 2A.1 SwiftLint Installation & Configuration

**Objective:** Enforce Swift style guide and catch common issues

**Installation:**
```bash
# Install via Homebrew
brew install swiftlint

# Or via CocoaPods (adds to Xcode build phases automatically)
# Add to Podfile: pod 'SwiftLint'
```

**Configuration File:** `.swiftlint.yml` (root of MobileTodoList-iOS)

**Ruleset:** Enterprise-grade baseline + React Native specific exceptions

```yaml
# Enterprise iOS SwiftLint Configuration
disabled_rules:
  - trailing_whitespace  # Prettier handles this
  - line_length  # More flexible for React Native bridge code
  
opt_in_rules:
  - empty_count
  - empty_string
  - explicit_init
  - fatal_error_message
  - file_header
  - first_where
  - force_unwrapping
  - implicit_return
  - multiline_parameters
  - overridden_super_call
  - private_outlet
  - redundant_nil_coalescing
  - sorted_imports
  - unneeded_parentheses_in_closure_argument
  - vertical_parameter_alignment_on_call

included:
  - ios/MobileTodoList

excluded:
  - ios/Pods
  - ios/build
  - node_modules
  - __tests__

line_length:
  warning: 120
  error: 200
  ignores_comments: true

file_length:
  warning: 500
  error: 1000

function_body_length:
  warning: 50
  error: 100

type_body_length:
  warning: 300
  error: 500

identifier_name:
  min_length:
    warning: 2
  excluded:
    - id
    - URL
    - url
    - x
    - y
    - z

force_cast: warning
force_try: warning
force_unwrapping: warning

custom_rules:
  no_print_statements:
    name: "No Print Statements"
    regex: "print\\("
    message: "Use os_log or remove debug print statements"
    severity: warning
```

**Xcode Integration:**
- Add Run Script Phase: `"${PODS_ROOT}/SwiftLint/swiftlint"`
- Run before "Compile Sources" phase

**Verification (when builds work):**
```bash
cd MobileTodoList-iOS && swiftlint lint --strict
```

**Expected Output:** Baseline warning count to be documented

---

### 2A.2 SwiftFormat Installation & Configuration

**Objective:** Automated code formatting (complement to SwiftLint)

**Installation:**
```bash
brew install swiftformat
```

**Configuration File:** `.swiftformat` (root of MobileTodoList-iOS)

```
# SwiftFormat Configuration - Enterprise iOS Standard

--swiftversion 5.9

# Indentation & Spacing
--indent 2
--tabwidth 2
--xcodeindentation enabled
--indentcase false
--trimwhitespace always
--wraparguments before-first
--wrapparameters before-first
--wrapcollections before-first

# Braces & Parentheses
--allman false
--elseposition same-line
--guardelse auto

# Wrapping
--maxwidth 120
--wrapternary before-operators

# Formatting Rules
--enable isEmpty
--enable sortedImports
--enable redundantSelf
--disable blankLinesAroundMark
--disable blankLinesAtStartOfScope
--disable blankLinesAtEndOfScope

# Excluded Paths
--exclude ios/Pods
--exclude ios/build
--exclude node_modules
```

**Usage:**
```bash
# Format all Swift files
cd MobileTodoList-iOS && swiftformat .

# Check formatting without applying
swiftformat --lint .
```

**Git Integration:** Pre-commit hook (see 2A.4)

---

### 2A.3 ESLint & Prettier Enforcement

**Status:** Already installed ✅  
**Action:** Verify configuration and add enforcement rules

**ESLint Config Audit:**
```bash
cd MobileTodoList-iOS && npx eslint --print-config App.tsx
```

**Prettier Config:** Create `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**NPM Scripts Enhancement:**
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

### 2A.4 Git Hooks (Pre-commit Enforcement)

**Tool:** Husky + lint-staged

**Installation:**
```bash
cd MobileTodoList-iOS
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

**Package.json Addition:**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.swift": [
      "swiftformat --lint",
      "swiftlint lint --strict --path"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  },
  "scripts": {
    "pre-commit": "lint-staged && npm run type-check"
  }
}
```

**Enforcement:** All commits must pass linting before being accepted

---

### 2A.5 TypeScript Strict Mode Verification

**Status:** Already enabled ✅ (per git commit history)  
**Action:** Verify no regressions

**Command:**
```bash
cd MobileTodoList-iOS && npx tsc --noEmit --listFiles
```

**Expected:** 0 type errors (confirmed in baseline audit commit)

---

## Phase 2B: Repository Organization & Containerization

### 2B.1 Architecture Taxonomy

**Goal:** Organize codebase into logical containers for maintainability

**Proposed Structure:**

```
MobileTodoList-iOS/
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   │   ├── ci.yml              # Main CI pipeline
│   │   ├── lint.yml            # Linting enforcement
│   │   └── security.yml        # Dependency scanning
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/
│   ├── architecture/           # System design docs
│   ├── api/                    # API integration guides
│   ├── deployment/             # Release procedures
│   └── development/            # Setup & contribution guides
│
├── ios/
│   ├── MobileTodoList/
│   │   ├── Application/        # App delegate, lifecycle
│   │   ├── Screens/            # UI components (if any native)
│   │   ├── Services/           # Native modules, bridges
│   │   ├── Utilities/          # Helpers, extensions
│   │   ├── Configuration/      # Build configs, plists
│   │   │   ├── Dev/
│   │   │   ├── Staging/
│   │   │   └── Production/
│   │   └── Resources/          # Assets, localizations
│   ├── MobileTodoListTests/
│   └── Podfile
│
├── src/
│   ├── components/             # React components
│   ├── screens/                # Screen-level components
│   ├── services/               # API clients, Firebase
│   ├── state/                  # Zustand stores
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Helper functions
│   ├── types/                  # TypeScript definitions
│   ├── config/                 # App configuration
│   │   ├── env.ts              # Environment handling
│   │   └── firebase.ts         # Firebase config (staged)
│   └── constants/              # App-wide constants
│
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── setup.sh                # First-time setup
│   ├── build-ios.sh            # Build automation
│   ├── test.sh                 # Test runner
│   └── lint-all.sh             # Full lint check
│
├── config/
│   ├── .env.example            # Template for secrets
│   ├── .env.development        # Dev environment (gitignored)
│   ├── .env.staging            # Staging (gitignored)
│   └── .env.production         # Production (gitignored)
│
├── .swiftlint.yml
├── .swiftformat
├── .prettierrc.json
├── .eslintrc.js
├── .gitignore                  # Ensure all .env files listed
├── tsconfig.json
├── package.json
└── README.md
```

---

### 2B.2 Documentation Consolidation

**Problem:** 50+ markdown files scattered across workspace  
**Solution:** Centralize into `/docs` taxonomy with clear navigation

**Migration Plan:**

1. **Create `/docs` structure:**
```bash
mkdir -p docs/{architecture,api,deployment,development,historical}
```

2. **Categorize existing docs:**
   - `BUILD_COMPLETE.md` → `docs/historical/`
   - `API_INTEGRATIONS_COMPLETE.md` → `docs/api/`
   - `FIREBASE_SETUP.md` → `docs/deployment/firebase.md`
   - `QUICK_START.md` → `docs/development/getting-started.md`
   - `TROUBLESHOOTING_GUIDE.md` → `docs/development/troubleshooting.md`

3. **Create navigation hub:** `START_HERE.md` (root)

```markdown
# MobileTodoList-iOS — Start Here

## Quick Links
- [Setup Guide](docs/development/getting-started.md)
- [Architecture Overview](docs/architecture/overview.md)
- [API Integration](docs/api/README.md)
- [Deployment Process](docs/deployment/README.md)

## Current Status
- **Build Status:** ⚠️ Blocked (Xcode 26.2 SDK incompatibility)
- **Latest Audit:** [BEFORE_AUDIT.md](BEFORE_AUDIT.md)
- **Refactor Plan:** [REFACTOR_PLAN.md](REFACTOR_PLAN.md)

## For Developers
1. Read [Development Setup](docs/development/getting-started.md)
2. Review [Contributing Guidelines](docs/development/contributing.md)
3. Check [CI Requirements](docs/development/ci-checklist.md)
```

4. **Archive redundant docs:** Move duplicates to `docs/historical/`

---

## Phase 2C: Firebase Re-Integration Planning

### 2C.1 Firebase Module Selection

**Objective:** Identify required Firebase services and compatible versions

**Required Modules (inferred from project needs):**
1. **Firebase Analytics** - User behavior tracking
2. **Firebase Crashlytics** - Crash reporting & diagnostics
3. **Firebase Remote Config** - Feature flags & A/B testing
4. **Firebase Authentication** (if user accounts needed)
5. **Firebase Firestore** (if cloud database needed)

**React Native Firebase Packages:**
```json
{
  "dependencies": {
    "@react-native-firebase/app": "^20.5.0",
    "@react-native-firebase/analytics": "^20.5.0",
    "@react-native-firebase/crashlytics": "^20.5.0",
    "@react-native-firebase/remote-config": "^20.5.0"
  }
}
```

**Compatibility Matrix:**
- React Native: 0.76.5 ✅
- iOS Minimum: 16.0 ✅
- Xcode: 16.0+ (NOT 26.2 beta) ⚠️

**Version Pinning Strategy:**
- Use **exact versions** (no `^` or `~`) for deterministic builds
- Lock with `package-lock.json` (committed to git)
- Document tested version combinations in `docs/deployment/firebase.md`

---

### 2C.2 Firebase Configuration Structure

**Multi-Environment Strategy:**

**Directory Structure:**
```
ios/MobileTodoList/Configuration/
├── Dev/
│   └── GoogleService-Info.plist       # Dev Firebase project
├── Staging/
│   └── GoogleService-Info.plist       # Staging Firebase project
└── Production/
    └── GoogleService-Info.plist       # Production Firebase project
```

**Xcode Build Configuration Mapping:**
- **Debug** → `Dev/GoogleService-Info.plist`
- **Staging** → `Staging/GoogleService-Info.plist` (new config)
- **Release** → `Production/GoogleService-Info.plist`

**Build Phase Script:** Copy correct plist based on configuration

```bash
# Copy environment-specific GoogleService-Info.plist
PLIST_DIR="${SRCROOT}/MobileTodoList/Configuration"

if [ "${CONFIGURATION}" == "Debug" ]; then
  cp -f "${PLIST_DIR}/Dev/GoogleService-Info.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
elif [ "${CONFIGURATION}" == "Staging" ]; then
  cp -f "${PLIST_DIR}/Staging/GoogleService-Info.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
elif [ "${CONFIGURATION}" == "Release" ]; then
  cp -f "${PLIST_DIR}/Production/GoogleService-Info.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
fi
```

**Secret Management:**
- ✅ GoogleService-Info.plist files committed (not true secrets per Firebase docs)
- ❌ **NEVER** commit server API keys or OAuth secrets
- ✅ Use `.xcconfig` files for non-sensitive toggles
- ✅ Use iOS Keychain for runtime secrets

---

### 2C.3 Firebase Initialization Code

**Location:** `src/config/firebase.ts`

```typescript
// src/config/firebase.ts
import { FirebaseApp } from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import remoteConfig from '@react-native-firebase/remote-config';

class FirebaseService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Firebase already initialized');
      return;
    }

    try {
      // Firebase auto-configures from GoogleService-Info.plist
      // No manual initialization needed with @react-native-firebase/app

      // Configure Crashlytics
      await crashlytics().setCrashlyticsCollectionEnabled(true);

      // Configure Remote Config
      await remoteConfig().setDefaults({
        feature_flag_example: false,
      });
      await remoteConfig().fetch(300); // 5 min cache
      await remoteConfig().activate();

      // Log successful initialization (development only)
      if (__DEV__) {
        console.log('✅ Firebase initialized successfully');
      }

      this.initialized = true;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      crashlytics().recordError(error as Error);
      throw error;
    }
  }

  getAnalytics() {
    return analytics();
  }

  getCrashlytics() {
    return crashlytics();
  }

  getRemoteConfig() {
    return remoteConfig();
  }
}

export const firebaseService = new FirebaseService();
```

**Integration Point:** `App.tsx`

```typescript
import { firebaseService } from './src/config/firebase';

useEffect(() => {
  firebaseService.initialize().catch(err => {
    console.error('Firebase initialization error:', err);
  });
}, []);
```

---

### 2C.4 Crashlytics Build Phase Integration

**Xcode Build Phase:** Add "Run Script" after "Copy Bundle Resources"

**Script Name:** `[Firebase] Crashlytics Upload Symbols`

**Script Content:**
```bash
"${PODS_ROOT}/FirebaseCrashlytics/run"
```

**Input Files:**
```
${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
${BUILT_PRODUCTS_DIR}/${INFOPLIST_PATH}
```

**Output Files:** (None - prevents "run on every build" warning)

**Critical:** This script must NOT leak secrets or config values in build logs

---

## Phase 2D: Secrets & Configuration Management

### 2D.1 Environment Variable Strategy

**Tool:** `react-native-config` (already installed ✅)

**Setup:**

1. **Create `.env.example`** (template, committed to git)
```bash
# API Configuration
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASHLYTICS=true

# Development Tools
DEBUG_MODE=false

# DO NOT COMMIT REAL SECRETS HERE
# Copy to .env.development and fill in actual values
```

2. **Create environment-specific files** (gitignored)
```
.env.development
.env.staging
.env.production
```

3. **Update `.gitignore`**
```
# Environment files with secrets
.env
.env.development
.env.staging
.env.production

# Keep template
!.env.example
```

4. **Xcode Integration:**
   - Link environment to build scheme (Debug → .env.development)
   - CI/CD provides production `.env` at build time (never committed)

---

### 2D.2 Secret Detection & Prevention

**Tool:** `detect-secrets` (Python-based)

**Installation:**
```bash
pip install detect-secrets
```

**Baseline Creation:**
```bash
cd MobileTodoList-iOS
detect-secrets scan --baseline .secrets.baseline
```

**Pre-commit Hook Integration:**
```bash
# Add to .husky/pre-commit
detect-secrets-hook --baseline .secrets.baseline $(git diff --cached --name-only)
```

**Common Patterns Detected:**
- API keys
- AWS credentials
- Private keys
- Database passwords
- OAuth tokens

**Whitelist Management:** `.secrets.baseline` (committed) excludes false positives

---

## Phase 2E: CI/CD Pipeline Definition (Dry-Run Mode)

### 2E.1 GitHub Actions Workflow Structure

**File:** `.github/workflows/ci.yml`

**Strategy:** Define pipeline now, enable builds when SDK issue resolved

```yaml
name: iOS CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  XCODE_VERSION: '16.0'  # NOT 26.2 - requires stable GA Xcode
  IOS_SIMULATOR: 'iPhone 15'
  IOS_VERSION: '17.5'
  NODE_VERSION: '18'

jobs:
  lint:
    name: Lint & Format Check
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run Prettier check
        run: npm run format:check
      
      - name: TypeScript type check
        run: npm run type-check
      
      - name: Install SwiftLint
        run: brew install swiftlint
      
      - name: Run SwiftLint
        run: swiftlint lint --strict
        working-directory: ios

  security:
    name: Security Scan
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      
      - name: Run npm audit
        run: npm audit --production
      
      - name: Check for secrets
        run: |
          pip install detect-secrets
          detect-secrets scan --baseline .secrets.baseline

  build:
    name: Build iOS App
    runs-on: macos-14
    needs: [lint, security]
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install npm dependencies
        run: npm ci
      
      - name: Install CocoaPods dependencies
        run: |
          cd ios
          pod install
      
      - name: Select Xcode version
        run: sudo xcode-select -s /Applications/Xcode_${{ env.XCODE_VERSION }}.app
      
      - name: Build iOS app (Debug)
        run: |
          xcodebuild \
            -workspace ios/MobileTodoList.xcworkspace \
            -scheme MobileTodoList \
            -configuration Debug \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=${{ env.IOS_SIMULATOR }},OS=${{ env.IOS_VERSION }}' \
            clean build \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ios-build
          path: ios/build

  test:
    name: Run Tests
    runs-on: macos-14
    needs: build
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Jest tests
        run: npm test -- --coverage
      
      - name: Run iOS unit tests
        run: |
          xcodebuild \
            -workspace ios/MobileTodoList.xcworkspace \
            -scheme MobileTodoList \
            -configuration Debug \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=${{ env.IOS_SIMULATOR }},OS=${{ env.IOS_VERSION }}' \
            test \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

**Status:** Ready to enable when Xcode SDK issue resolved

---

### 2E.2 CI Enforcement Gates

**Pull Request Requirements:**

| Gate | Tool | Failure = Block Merge |
|------|------|----------------------|
| ESLint passing | `npm run lint` | ✅ Yes |
| Prettier compliance | `npm run format:check` | ✅ Yes |
| TypeScript type check | `tsc --noEmit` | ✅ Yes |
| SwiftLint passing | `swiftlint lint --strict` | ✅ Yes |
| No secrets detected | `detect-secrets` | ✅ Yes |
| npm audit (production) | `npm audit --production` | ⚠️ Warning only |
| Unit tests passing | `npm test && xcodebuild test` | ✅ Yes |
| Build succeeds | `xcodebuild build` | ✅ Yes |
| Code coverage ≥70% | `jest --coverage` | ⚠️ Warning only |

**Branch Protection Rules:**
- Require status checks before merging
- Require 1+ code review approval
- Dismiss stale reviews on new commits
- Enforce linear history (rebase preferred)

---

## Phase 2F: Verification Criteria (Phase 5 Readiness)

### 2F.1 "After" Audit Success Criteria

**When SDK issue is resolved, Phase 5 audit must confirm:**

1. **Build Success:**
   - ✅ Clean build with locked simulator (iPhone 15 / iOS 17.5)
   - ✅ 0 compilation errors
   - ✅ ≤ 10 warnings (all documented)

2. **Test Success:**
   - ✅ All unit tests passing
   - ✅ UI tests passing (if added)
   - ✅ Code coverage ≥ 70%

3. **Firebase Integration:**
   - ✅ All selected Firebase modules initialized successfully
   - ✅ Crashlytics capturing test crashes
   - ✅ Analytics events logging correctly
   - ✅ Remote Config fetching values
   - ✅ No config/secrets leaked in logs or build artifacts

4. **Code Quality:**
   - ✅ SwiftLint: 0 errors, < 20 warnings
   - ✅ ESLint: 0 errors, 0 warnings
   - ✅ Prettier: 100% compliance
   - ✅ TypeScript: 0 type errors (strict mode)

5. **Security:**
   - ✅ No secrets in git history
   - ✅ `.env` files properly gitignored
   - ✅ npm audit: 0 high/critical vulnerabilities
   - ✅ Xcode static analyzer: 0 issues

6. **CI/CD:**
   - ✅ GitHub Actions pipeline fully operational
   - ✅ All gates enforced on PRs
   - ✅ Build artifacts generated successfully

7. **Documentation:**
   - ✅ `/docs` structure created and populated
   - ✅ `START_HERE.md` navigation hub
   - ✅ All legacy docs archived
   - ✅ Firebase setup guide complete

---

## Implementation Checklist

### Track A: Immediate (No Build Required)

- [ ] **2A.1** Install SwiftLint, create `.swiftlint.yml`
- [ ] **2A.2** Install SwiftFormat, create `.swiftformat`
- [ ] **2A.3** Create `.prettierrc.json`, verify ESLint config
- [ ] **2A.4** Install Husky + lint-staged, configure pre-commit hooks
- [ ] **2A.5** Verify TypeScript strict mode (run `tsc --noEmit`)
- [ ] **2B.1** Create containerized directory structure
- [ ] **2B.2** Migrate docs to `/docs`, create `START_HERE.md`
- [ ] **2C.1** Research compatible Firebase package versions
- [ ] **2C.2** Create multi-environment `GoogleService-Info.plist` structure (placeholders)
- [ ] **2C.3** Write `src/config/firebase.ts` (code only, not executed)
- [ ] **2D.1** Create `.env.example`, update `.gitignore`
- [ ] **2D.2** Install `detect-secrets`, create baseline
- [ ] **2E.1** Create `.github/workflows/ci.yml`
- [ ] **2E.2** Document CI enforcement gates in `CI_CHECKLIST.md`

### Track B: Blocked (Awaiting SDK Resolution)

- [ ] **Xcode Build** Resolve SDK incompatibility (Xcode downgrade or RN upgrade)
- [ ] **Pod Install** Run `pod install` with Firebase dependencies
- [ ] **2C.4** Add Crashlytics build phase to Xcode project
- [ ] **Build Verification** Successful Debug build with locked simulator
- [ ] **Test Execution** Run unit tests, verify 100% pass rate
- [ ] **Firebase Runtime** Verify Firebase initialization in running app
- [ ] **CI Activation** Enable GitHub Actions workflows
- [ ] **Performance Profiling** Run Instruments to baseline performance

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Xcode SDK never resolves** | Low | CRITICAL | React Native will eventually support iOS 26.2; worst case: stay on RN 0.76.x and use Xcode 16.x |
| **Firebase version incompatibility** | Medium | HIGH | Extensive version matrix testing before integration; pin exact versions |
| **SwiftLint too strict** | Medium | LOW | Customize rules iteratively; start permissive, tighten over time |
| **Pre-commit hooks slow** | Medium | LOW | Optimize to only lint staged files; allow `--no-verify` escape hatch |
| **Documentation migration breaks links** | Medium | MEDIUM | Automated link checker in CI; thorough manual review |
| **CI costs exceed budget** | Low | MEDIUM | Use GitHub Actions free tier efficiently; cache dependencies aggressively |

---

## Timeline Estimate (Optimistic)

**Track A (Immediate):** 2-3 days  
**Track B (Blocked):** 1-2 days *after* SDK resolution  
**Total:** 3-5 days end-to-end (excluding SDK wait time)

**Parallel Work Opportunity:** Track A can proceed immediately while monitoring for SDK fixes

---

## Success Metrics

1. **Code Quality Score:** SwiftLint + ESLint error count = 0
2. **Build Stability:** 100% CI build success rate (when unblocked)
3. **Test Coverage:** ≥ 70% line coverage
4. **Security Posture:** 0 high/critical npm vulnerabilities, 0 secrets exposed
5. **Developer Experience:** Setup time for new developers < 30 minutes
6. **Documentation Health:** 100% of critical paths documented, < 5 orphaned docs

---

## Appendix A: Command Reference

### Local Development

```bash
# Full lint check (all languages)
npm run lint && swiftlint lint && swiftformat --lint .

# Auto-fix formatting
npm run lint:fix && swiftformat .

# Type check
npm run type-check

# Secret scan
detect-secrets scan --baseline .secrets.baseline

# Pre-commit simulation (without committing)
npm run pre-commit
```

### Build Commands (when SDK resolved)

```bash
# Clean build with locked simulator
cd ios && \
xcodebuild \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  clean build

# Run unit tests
cd ios && \
xcodebuild \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  test
```

---

## Next Steps

**Immediate:**
1. Review and approve this refactor plan
2. Execute Track A tasks (tooling & organization)
3. Monitor React Native GitHub for iOS 26.2 SDK compatibility updates

**When SDK Resolved:**
1. Execute Track B tasks (builds & Firebase)
2. Run Phase 5 verification audit (AFTER_AUDIT.md)
3. Generate CHANGELOG.md documenting all changes
4. Create PR_DOD.md and CI_CHECKLIST.md for enforcement

---

## Document Metadata

**Author:** Claude Agent (GitHub Copilot)  
**Phase:** 2 — Refactor Planning  
**Dependencies:** BEFORE_AUDIT.md (Phase 1)  
**Next:** Phase 3 — Tooling & Extensions (Track A implementation)

**Confidentiality:** No secrets or sensitive data included. Firebase configuration references are architectural only.

---

**END OF REFACTOR PLAN**
