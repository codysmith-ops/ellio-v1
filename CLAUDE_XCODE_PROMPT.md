# Claude Sonnet 4.5 Prompt for Xcode

**Purpose:** Comprehensive audit, error fixing, and simulator deployment for MobileTodoList iOS app

---

## 📋 Copy This Prompt to Claude in Xcode

```
I need your help auditing and fixing a React Native iOS project to successfully build and deploy to the iOS Simulator.

PROJECT CONTEXT:
- Project: MobileTodoList-iOS
- Framework: React Native 0.76.5
- Target: iOS 16.0+
- Workspace: /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
- Xcode Workspace: ios/MobileTodoList.xcworkspace
- Bundle ID: org.reactjs.native.example.MobileTodoList

CURRENT STATE:
✅ Dependencies installed (node_modules, Pods)
✅ 22 APIs configured (.env file)
✅ Podfile updated with C++17 configuration
✅ Build fix package created
⚠️ Multiple build failures with exit codes: 65, 127, 1, 254
⚠️ Build errors preventing simulator deployment

KNOWN ISSUES FROM BUILD HISTORY:
1. xcodebuild exits with code 65 (build failure)
2. npm/npx commands exit with code 127 (command not found)
3. React Native metro bundler exits with code 1
4. CocoaPods installation issues (exit code 1)
5. npm install issues (exit code 254)

RECENT TERMINAL HISTORY:
- npm install completed successfully
- pod install completed successfully
- xcodebuild clean build attempted (failed with errors)
- Multiple dependency reinstallation attempts
- Xcode workspace opened successfully

YOUR TASK:

PHASE 1: COMPREHENSIVE AUDIT
1. Review the Xcode project settings:
   - Build Settings for MobileTodoList target
   - Scheme configuration
   - Signing & Capabilities
   - Build Phases order and scripts
   - Framework search paths
   - Header search paths
   - Library search paths

2. Check for common React Native 0.76.5 issues:
   - New Architecture compatibility
   - TurboModules configuration
   - Fabric renderer settings
   - C++ language standard (should be C++17)
   - Deployment target (iOS 16.0+)

3. Identify specific build errors:
   - Read the latest build logs in Xcode
   - List all errors (not just warnings)
   - Categorize by: Swift errors, Objective-C errors, linking errors, dependency errors
   - Identify the root cause of exit code 65

4. Verify critical configurations:
   - Info.plist settings
   - AppDelegate.mm setup
   - Bundle identifier matches
   - Code signing identity
   - Provisioning profile (should be automatic for simulator)

PHASE 2: FIX IMPLEMENTATION
For each identified error:

1. LINKING ERRORS:
   - Check if all required frameworks are linked
   - Verify pod dependencies are properly installed
   - Run `pod deintegrate && pod install` if needed
   - Check Framework Search Paths in Build Settings

2. SWIFT/OBJECTIVE-C COMPILATION ERRORS:
   - Fix any syntax errors in native code
   - Update deprecated APIs to current iOS 16+ standards
   - Ensure proper bridging header setup
   - Fix any null safety issues

3. BUILD SCRIPT ERRORS:
   - Check "Bundle React Native code and images" script
   - Verify NODE_BINARY path in .xcode.env
   - Ensure Metro bundler can start
   - Fix any permission issues

4. DEPENDENCY CONFLICTS:
   - Resolve any version conflicts in Podfile
   - Check for duplicate symbols
   - Ensure C++17 is enforced (not C++20)
   - Verify all pods compile successfully

5. CONFIGURATION ERRORS:
   - Fix any Info.plist issues
   - Update scheme settings if needed
   - Ensure Debug configuration is properly set
   - Verify deployment target matches (iOS 16.0)

PHASE 3: BUILD OPTIMIZATION
1. Remove unnecessary warnings:
   - Only focus on errors, suppress third-party warnings
   - Clean build folder (Product > Clean Build Folder)
   - Delete DerivedData if needed

2. Verify build phases order:
   - [CP] Check Pods Manifest.lock (should be first)
   - Start Packager
   - Bundle React Native code and images
   - Compile Sources
   - Link Binary With Libraries
   - Copy Bundle Resources
   - Embed Frameworks

3. Check build settings:
   - CLANG_CXX_LANGUAGE_STANDARD = "c++17"
   - IPHONEOS_DEPLOYMENT_TARGET = 16.0
   - ENABLE_BITCODE = NO
   - DEAD_CODE_STRIPPING = NO (for debug)
   - GCC_OPTIMIZATION_LEVEL = 0 (for debug)

PHASE 4: SIMULATOR DEPLOYMENT
1. Select proper destination:
   - Platform: iOS Simulator
   - Device: iPhone 15 (or any available iOS 16+ simulator)
   - Scheme: MobileTodoList (Debug)

2. Build and run:
   - Build the project (⌘B)
   - Run on simulator (⌘R)
   - Monitor build output for any errors
   - Verify app launches successfully

3. If build fails:
   - Provide exact error messages
   - Suggest specific fixes
   - Explain what each fix does
   - Prioritize by severity

PHASE 5: VERIFICATION
1. Confirm successful build:
   - "BUILD SUCCEEDED" message appears
   - App installs on simulator
   - App launches without crashes
   - Metro bundler connects successfully

2. Basic functionality check:
   - App UI renders correctly
   - No red error screens
   - Navigation works
   - Console shows no critical errors

OUTPUT FORMAT:

Please provide your response in this structure:

## 🔍 AUDIT RESULTS

### Critical Errors Found:
[List all blocking errors with file/line numbers]

### Warnings to Address:
[List important warnings that may cause issues]

### Configuration Issues:
[List any misconfigurations]

## 🔧 REQUIRED FIXES

### Fix #1: [Error Name]
**File:** [path/to/file]
**Line:** [line number]
**Error:** [exact error message]
**Solution:** [specific fix]
**Implementation:**
```objectivec or swift
[exact code to add/change]
```

[Repeat for each fix]

## ⚙️ BUILD SETTINGS TO UPDATE

[List any Xcode build settings that need changes]

## 📝 STEP-BY-STEP FIX PROCEDURE

1. [First action to take]
2. [Second action]
3. [Continue until deployment]

## 🚀 DEPLOYMENT COMMAND

[Final command to run for simulator deployment]

## ✅ VERIFICATION CHECKLIST

- [ ] Build succeeds without errors
- [ ] App installs on simulator
- [ ] App launches successfully
- [ ] Metro bundler connected
- [ ] No runtime crashes

---

IMPORTANT NOTES:
- I need specific, actionable fixes with exact file paths and line numbers
- Please prioritize errors that block the build (exit code 65)
- Focus on React Native 0.76.5 compatibility
- Ensure all fixes work with the New Architecture
- Provide code snippets I can copy directly into Xcode
- Explain WHY each fix is needed, not just WHAT to change

START THE AUDIT NOW. Begin by reviewing the Xcode project settings and build logs, then provide the complete audit and fix plan.
```

---

## 🎯 How to Use This Prompt

### Step 1: Open Xcode
```bash
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
open ios/MobileTodoList.xcworkspace
```

### Step 2: Copy the Prompt
- Copy the entire prompt section above (between the code blocks)
- Make sure to include all sections

### Step 3: Paste to Claude in Xcode
- Open GitHub Copilot Chat in Xcode
- Paste the prompt
- Wait for comprehensive audit results

### Step 4: Follow Claude's Instructions
- Implement fixes in the exact order provided
- Run verification steps after each major fix
- Keep Claude updated on results

### Step 5: Deploy to Simulator
Once all fixes are implemented:
```bash
# Method 1: Via Xcode
# Press ⌘B to build, then ⌘R to run

# Method 2: Via Terminal
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
npx react-native run-ios --simulator="iPhone 15"
```

---

## 📊 Expected Workflow

```
┌─────────────────────────┐
│ Paste Prompt to Claude  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Claude Audits Project │
│   - Reviews build logs  │
│   - Checks settings     │
│   - Identifies errors   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Claude Provides Fixes   │
│   - Specific solutions  │
│   - Code snippets       │
│   - Step-by-step guide  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  You Implement Fixes    │
│   - Update files        │
│   - Change settings     │
│   - Run commands        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Build & Deploy        │
│   - Clean build         │
│   - Run on simulator    │
│   - Verify success      │
└─────────────────────────┘
```

---

## 🔍 What Claude Will Find

Based on the build history, Claude should identify and fix:

### 1. Build Configuration Issues
- Incorrect C++ standard settings
- Missing or incorrect build phases
- Framework search path problems
- Header search path issues

### 2. Dependency Problems
- CocoaPods integration errors
- React Native library linking issues
- Third-party pod compilation failures
- Version conflicts

### 3. Code Compilation Errors
- Swift/Objective-C syntax errors
- Deprecated API usage
- Type mismatches
- Missing imports

### 4. Metro Bundler Issues
- Node.js path configuration
- Bundler startup failures
- Cache problems
- Port conflicts

### 5. Signing & Provisioning
- Code signing identity issues
- Provisioning profile problems
- Capability mismatches
- Bundle ID conflicts

---

## 💡 Tips for Best Results

### 1. Provide Context
If Claude asks for more information, provide:
- Exact error messages from Xcode
- Build log excerpts
- File contents if requested
- Terminal output

### 2. Implement Systematically
- Don't skip steps
- Test after each major change
- Keep track of what works
- Document successful fixes

### 3. Iterate if Needed
If first attempt fails:
- Share new error messages with Claude
- Ask for alternative solutions
- Try manual fixes if automated ones fail
- Consider clean rebuild

### 4. Verify Each Fix
After implementing fixes:
```bash
# Clean build
cd ios
xcodebuild clean -workspace MobileTodoList.xcworkspace -scheme MobileTodoList

# Rebuild
xcodebuild build -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## 🚨 Common Issues & Quick Fixes

### If "BUILD FAILED" persists:
```bash
# Nuclear option - complete reset
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
rm -rf node_modules ios/Pods ios/Podfile.lock package-lock.json
npm install
cd ios && pod install
```

### If Metro bundler fails:
```bash
# Reset cache
npx react-native start --reset-cache
```

### If simulator doesn't launch:
```bash
# Reset simulator
xcrun simctl erase all
xcrun simctl shutdown all
```

### If Xcode acting strange:
```bash
# Clear DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

---

## ✅ Success Criteria

You'll know it worked when:

1. **Build Output Shows:**
   ```
   ** BUILD SUCCEEDED **
   ```

2. **Simulator Launches with:**
   - App icon appears
   - App opens without crashes
   - No red error screen
   - Metro bundler connected

3. **Terminal Shows:**
   ```
   info Successfully launched app on simulator
   ```

4. **Xcode Shows:**
   - Green checkmark in scheme selector
   - No error badges
   - Console has normal logs (no crashes)

---

## 📞 If You Need More Help

If Claude's fixes don't work:

1. **Share with Claude:**
   - Complete build log from Xcode
   - Specific error messages
   - What fixes you tried
   - Current project state

2. **Try Alternative Approach:**
   - Ask Claude for manual step-by-step fixes
   - Request explanation of why errors occur
   - Get debugging strategies

3. **Last Resort:**
   - Consider starting from React Native template
   - Migrate features one by one
   - Keep successful parts separate

---

**Created:** December 26, 2025  
**Purpose:** Audit and fix iOS build errors for simulator deployment  
**Target:** Claude Sonnet 4.5 in Xcode  
**Expected Outcome:** Successful build and deployment to iOS Simulator
