# Tooling & Extensions Documentation

**Date:** December 27, 2025  
**Project:** MobileTodoList-iOS  
**Scope:** iOS development tooling and VS Code extensions  

---

## Development Environment

### macOS & Xcode

| Tool | Version | Required | Purpose |
|------|---------|----------|---------|
| **macOS** | 26.2 Tahoe | ✅ | Host operating system |
| **Xcode** | 15.4 (15F31d) | ✅ LOCKED | iOS SDK, build tools, simulator |
| **Command Line Tools** | Xcode 15.4 | ✅ | Terminal build support |
| **iOS Simulator** | iPhone 15 (iOS 17.5) | ✅ LOCKED | Testing target |

### Node.js Ecosystem

| Tool | Version | Required | Purpose |
|------|---------|----------|---------|
| **Node.js** | ≥18 | ✅ | JavaScript runtime |
| **npm** | Latest | ✅ | Package management |
| **React Native CLI** | 0.73.9 | ✅ | RN tooling |
| **Metro Bundler** | 0.73.5 | ✅ | JS bundler |

### iOS Native Tools

| Tool | Version | Required | Purpose |
|------|---------|----------|---------|
| **CocoaPods** | Latest | ✅ | iOS dependency management |
| **Bundler** | Optional | ⚪ | Ruby dependency isolation |
| **xcpretty** | Optional | ⚪ | Pretty Xcode output |

---

## VS Code Extensions

### Currently Installed

**Status:** Extensions to be installed as needed during development

### Recommended iOS Development Extensions

#### 1. Swift Language Support

**Extension ID:** `sswg.swift-lang`  
**Purpose:** Swift syntax highlighting, code completion  
**Required:** ⚪ Optional (if editing Swift bridge code)  
**Installation:**
```bash
code --install-extension sswg.swift-lang
```

**Use Cases:**
- Editing native iOS modules
- Writing Swift bridge components
- Reviewing CocoaPods source

---

#### 2. ESLint

**Extension ID:** `dbaeumer.vscode-eslint`  
**Purpose:** JavaScript/TypeScript linting  
**Required:** ✅ Recommended  
**Installation:**
```bash
code --install-extension dbaeumer.vscode-eslint
```

**Configuration:** `.eslintrc.js` (React Native default)

**Use Cases:**
- Linting React Native components
- Enforcing code style
- Pre-commit validation

---

#### 3. Prettier

**Extension ID:** `esbenp.prettier-vscode`  
**Purpose:** Code formatting  
**Required:** ✅ Recommended  
**Installation:**
```bash
code --install-extension esbenp.prettier-vscode
```

**Configuration:** `.prettierrc` (project-specific)

**Settings:**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

---

#### 4. Markdown All in One

**Extension ID:** `yzhang.markdown-all-in-one`  
**Purpose:** Markdown editing, preview, TOC generation  
**Required:** ⚪ Optional  
**Installation:**
```bash
code --install-extension yzhang.markdown-all-in-one
```

**Use Cases:**
- Editing documentation files
- Generating table of contents
- Preview `.md` files

---

#### 5. YAML

**Extension ID:** `redhat.vscode-yaml`  
**Purpose:** YAML syntax support, validation  
**Required:** ✅ Recommended (for GitHub Actions)  
**Installation:**
```bash
code --install-extension redhat.vscode-yaml
```

**Use Cases:**
- Editing `.github/workflows/*.yml`
- Validating CI/CD configurations

---

#### 6. GitLens

**Extension ID:** `eamodio.gitlens`  
**Purpose:** Git blame, history, navigation  
**Required:** ⚪ Optional  
**Installation:**
```bash
code --install-extension eamodio.gitlens
```

**Use Cases:**
- Code ownership visibility
- Commit history exploration
- Blame annotations

---

#### 7. Path Intellisense

**Extension ID:** `christian-kohler.path-intellisense`  
**Purpose:** Autocomplete file paths  
**Required:** ⚪ Optional  
**Installation:**
```bash
code --install-extension christian-kohler.path-intellisense
```

**Use Cases:**
- Import statement completion
- Asset path references

---

### Extensions NOT Needed (Explicitly Excluded)

| Extension | Reason for Exclusion |
|-----------|---------------------|
| **Android Studio** | Android out of scope |
| **Java Extension Pack** | No Java/Android development |
| **Gradle** | No Gradle (iOS-only project) |
| **Kotlin** | No Kotlin (iOS-only project) |

---

## Code Quality Tools

### 1. SwiftLint

**Status:** ⚠️ NOT YET INSTALLED  
**Purpose:** Swift code linting  
**Required:** ✅ Recommended for Phase F  

**Installation:**
```bash
brew install swiftlint
```

**Configuration:** Create `.swiftlint.yml` in project root

**Integration:**
- Xcode build phase (Run Script)
- Pre-commit hook
- CI/CD validation

**Planned Rules:**
- Line length: 120 characters
- Force unwrapping: warning
- Unused variables: error
- Cyclomatic complexity: max 10

---

### 2. SwiftFormat

**Status:** ⚠️ NOT YET INSTALLED  
**Purpose:** Automatic Swift code formatting  
**Required:** ⚪ Optional (nice-to-have)  

**Installation:**
```bash
brew install swiftformat
```

**Configuration:** `.swiftformat` in project root

**Usage:**
```bash
# Format all Swift files
swiftformat .

# Check without modifying
swiftformat --lint .
```

---

### 3. TypeScript

**Status:** ✅ INSTALLED  
**Purpose:** Type checking for React Native code  
**Configuration:** `tsconfig.json`

**Strict Mode:** Enabled (as of recent commits)

**Scripts:**
```bash
npm run lint        # Run ESLint + TypeScript checks
npm run test        # Jest with type checking
```

---

## Build Automation Tools

### 1. Preflight Script

**Location:** `scripts/preflight.sh`  
**Purpose:** Environment validation before builds  
**Status:** ✅ ACTIVE  

**Checks:**
- Xcode 15.4 active
- iPhone 15 / iOS 17.5 available
- No Android references in workflows

**Usage:**
```bash
./scripts/preflight.sh
```

---

### 2. VS Code Tasks

**Location:** `.vscode/tasks.json`  
**Purpose:** Build, test, and run commands  
**Status:** ✅ CONFIGURED  

**Available Tasks:**
- iOS: Preflight Check
- iOS: Clean Build (ENFORCED)
- iOS: Build (ENFORCED)
- iOS: Test (ENFORCED)
- iOS: Run on Simulator (ENFORCED)
- iOS: Install Pods

**Access:** `Cmd+Shift+P` → "Tasks: Run Task"

---

### 3. GitHub Actions

**Location:** `.github/workflows/ios-build.yml`  
**Purpose:** CI/CD automation  
**Status:** ✅ CONFIGURED  

**Stages:**
1. Checkout code
2. Select Xcode 15.4
3. Install Node.js dependencies
4. Run preflight checks
5. Install CocoaPods
6. Build with locked destination
7. Upload artifacts on failure

---

## Debugging Tools

### 1. Xcode Instruments

**Access:** Xcode → Open Developer Tool → Instruments  
**Purpose:** Performance profiling, memory leaks, CPU usage  

**Common Instruments:**
- Time Profiler (CPU hotspots)
- Allocations (memory usage)
- Leaks (memory leaks)
- System Trace (thread activity)

**Workflow:**
```bash
# Build with profiling enabled
xcodebuild -workspace ios/MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Release \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  -enableCodeCoverage YES

# Then: Xcode → Product → Profile
```

---

### 2. React Native Debugger

**Status:** ⚪ NOT INSTALLED (can be added if needed)  
**Purpose:** Standalone React Native debugging  

**Installation:**
```bash
brew install --cask react-native-debugger
```

**Usage:**
- Launch app in debug mode
- Open RN Debugger
- Connect to Metro bundler (port 8081)

---

### 3. Flipper

**Status:** ⚠️ DISABLED  
**Reason:** Not needed for current development; adds complexity  

**To Re-enable (if needed):**
- Update `Podfile` to include Flipper
- Run `pod install`
- Launch Flipper desktop app

---

## Secret Management Tools

### 1. react-native-config

**Status:** ✅ INSTALLED  
**Purpose:** Environment variable management  
**Package:** `react-native-dotenv`

**Usage:**
```bash
# Create .env file (gitignored)
echo "API_KEY=your_key_here" > .env

# Access in code
import Config from "react-native-config";
console.log(Config.API_KEY);
```

---

### 2. Keychain (iOS Native)

**Status:** ⚪ NOT IMPLEMENTED  
**Purpose:** Secure storage of tokens/credentials  

**Recommended Library:** `react-native-keychain`

**Installation (if needed):**
```bash
npm install react-native-keychain
cd ios && pod install
```

---

## Testing Tools

### 1. Jest

**Status:** ✅ INSTALLED  
**Purpose:** Unit testing framework  
**Configuration:** `jest.config.js`

**Scripts:**
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

---

### 2. React Native Testing Library

**Status:** ⚠️ NOT INSTALLED (can be added)  
**Purpose:** Component testing  

**Installation:**
```bash
npm install --save-dev @testing-library/react-native
```

---

## Dependency Management

### NPM Scripts

```json
{
  "ios": "react-native run-ios",
  "start": "react-native start",
  "test": "jest",
  "lint": "eslint .",
  "pods": "cd ios && pod install",
  "pods:clean": "cd ios && rm -rf Pods Podfile.lock && pod install"
}
```

### CocoaPods Workflow

```bash
# Install dependencies
cd ios && pod install

# Clean reinstall
cd ios && rm -rf Pods Podfile.lock && pod install

# Update specific pod
cd ios && pod update <PodName>
```

---

## CI/CD Integration

### Required Tools on CI Runners

| Tool | Version | Installed Via |
|------|---------|---------------|
| Xcode | 15.4 | Pre-installed on `macos-latest` |
| Node.js | 18 | `actions/setup-node@v3` |
| CocoaPods | Latest | Pre-installed |

---

## Future Tooling Enhancements

### Phase F (Implementation) Additions

1. **SwiftLint** - Swift code linting
2. **SwiftFormat** - Swift code formatting  
3. **Xcode Analyze** - Static analysis integration
4. **Firebase CLI** - If re-integrating Firebase
5. **Fastlane** - If implementing CD pipeline

---

## Excluded Tools (Not Needed)

| Tool | Reason |
|------|--------|
| Android Studio | iOS-only project |
| Gradle | No Android builds |
| Java/Kotlin tooling | No Android code |
| Expo CLI | Using bare React Native |
| Yarn | Using npm (can switch if needed) |

---

## Troubleshooting

### "Command not found: pod"

**Fix:**
```bash
sudo gem install cocoapods
```

### "Command not found: npx"

**Fix:**
```bash
# Reinstall Node.js
brew install node@18
```

### VS Code Extension Not Working

**Fix:**
```bash
# Reload VS Code
Cmd+Shift+P → "Reload Window"
```

---

## Related Documentation

- [TOOLCHAIN_LOCK.md](TOOLCHAIN_LOCK.md) - Xcode version enforcement
- [ENFORCEMENT_README.md](ENFORCEMENT_README.md) - Build enforcement
- [IOS_ONLY_MODE.md](IOS_ONLY_MODE.md) - Android isolation

---

**Maintained by:** GitHub Copilot (Claude Agent)  
**Last Updated:** December 27, 2025  
**Status:** ✅ Active - Tooling documented
