# Pull Request Definition of Done — iOS Modernization

**Project:** MobileTodoList-iOS  
**Date:** December 27, 2025  
**Scope:** Enterprise iOS modernization with maximum enforcement  

---

## Overview

This document defines the **acceptance criteria** for merging iOS modernization changes. All items must be verified before PR approval.

---

## 1. Toolchain Compliance ✅

### Xcode Version Lock

- [ ] `xcodebuild -version` reports **exactly** `Xcode 15.4`
- [ ] `xcodebuild -version` build is **exactly** `15F31d`
- [ ] `xcode-select -p` points to `/Applications/Xcode-15.4.app/Contents/Developer`
- [ ] No use of Xcode 26.x or 16.x in builds/tests

**Verification Command:**
```bash
./scripts/preflight.sh  # Must exit 0
```

---

### Simulator Lock

- [ ] iPhone 15 simulator with iOS 17.5 exists
- [ ] All `xcodebuild` commands use `-destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'`
- [ ] No reliance on Xcode default destinations
- [ ] Simulator UDID documented in `TOOLCHAIN_LOCK.md`

**Verification Command:**
```bash
xcrun simctl list devices | grep "iPhone 15" | grep "17.5"
```

---

## 2. iOS-Only Mode ✅

### Android Isolation

- [ ] No `android/` directory in project root (confirmed: project is iOS-only)
- [ ] `package.json` has NO `android` script
- [ ] No Android references in `.github/workflows/*.yml`
- [ ] No Android references in `.vscode/tasks.json`
- [ ] `IOS_ONLY_MODE.md` documents isolation status

**Verification Command:**
```bash
grep -r "android" package.json .github/workflows .vscode/tasks.json || echo "Clean"
```

---

### React Native Scope

- [ ] React Native version locked at **0.73.9**
- [ ] `package-lock.json` or `yarn.lock` committed
- [ ] No attempts to build with RN 0.76.x or higher
- [ ] iOS deployment target = **16.0**

**Verification:**
```bash
grep '"react-native"' package.json  # Should show 0.73.9
grep IPHONEOS_DEPLOYMENT_TARGET ios/MobileTodoList.xcodeproj/project.pbxproj | head -1
```

---

## 3. Firebase Integration 🔥

### Firebase Status

- [ ] Firebase modules identified (Analytics, Auth, Crashlytics, etc.) OR documented as removed
- [ ] `GoogleService-Info.plist` present and correctly targeted (if Firebase used)
- [ ] NO `GoogleService-Info.plist` contents leaked in commits/logs
- [ ] Firebase initialization (`FirebaseApp.configure()`) documented
- [ ] Build scripts for Crashlytics intact (if used)

**Current Status:**
- ⚠️ Firebase **removed** in commit `59d127c` due to gRPC errors
- ⚠️ Re-integration planned for Phase F (if needed)

**Verification:**
```bash
find . -name "GoogleService-Info.plist" 2>/dev/null || echo "No Firebase config"
git log --all --grep="Firebase" --oneline | head -5
```

---

## 4. Build Success ✅

### Clean Build

- [ ] `xcodebuild clean build` succeeds with locked destination
- [ ] No warnings related to deployment target
- [ ] No warnings related to SDK version mismatch
- [ ] Build completes in <5 minutes (benchmark)

**Verification Command:**
```bash
cd ios && xcodebuild \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  clean build | grep "BUILD SUCCEEDED"
```

---

### Test Execution

- [ ] Unit tests pass (`MobileTodoListTests`)
- [ ] UI tests pass (if present)
- [ ] Code coverage ≥70% (if measured)
- [ ] No test failures

**Verification Command:**
```bash
cd ios && xcodebuild test \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

---

## 5. Code Quality ✅

### Linting

- [ ] ESLint passes (JavaScript/TypeScript)
- [ ] SwiftLint passes (if configured)
- [ ] No linting errors (warnings acceptable if documented)

**Verification:**
```bash
npm run lint  # Should exit 0
```

---

### Static Analysis

- [ ] Xcode Analyze passes (no errors)
- [ ] TypeScript strict mode enabled
- [ ] No `any` types in new code

**Verification:**
```bash
cd ios && xcodebuild analyze \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

---

## 6. Dependency Management ✅

### Lockfiles

- [ ] `package-lock.json` (npm) or `yarn.lock` committed
- [ ] `ios/Podfile.lock` committed
- [ ] No `package-lock.json` and `yarn.lock` conflict
- [ ] Dependencies reproducible across environments

**Verification:**
```bash
git ls-files | grep -E "(package-lock|Podfile.lock|yarn.lock)"
```

---

### Security

- [ ] No secrets in commits (API keys, tokens, passwords)
- [ ] `.env` files in `.gitignore`
- [ ] `GoogleService-Info.plist` not in commit diffs (if Firebase)
- [ ] No hardcoded URLs/credentials in source

**Verification:**
```bash
git log -p | grep -iE "(api_key|password|secret|token)" | head -10
```

---

## 7. CI/CD Pipeline ✅

### GitHub Actions

- [ ] `.github/workflows/ios-build.yml` exists
- [ ] Workflow selects Xcode 15.4 explicitly
- [ ] Workflow runs `./scripts/preflight.sh`
- [ ] Workflow uses locked simulator destination
- [ ] Workflow uploads artifacts on failure

**Verification:**
```bash
cat .github/workflows/ios-build.yml | grep "Xcode"
cat .github/workflows/ios-build.yml | grep "preflight"
```

---

### Preflight Script

- [ ] `scripts/preflight.sh` is executable
- [ ] Script checks Xcode version
- [ ] Script checks simulator availability
- [ ] Script checks for Android references (iOS-only mode)
- [ ] Script exits 1 on failure, 0 on success

**Verification:**
```bash
ls -l scripts/preflight.sh | grep "x"  # Executable
./scripts/preflight.sh && echo "PASS" || echo "FAIL"
```

---

## 8. Documentation ✅

### Required Files Present

- [ ] `BEFORE_AUDIT.md` — Baseline audit results
- [ ] `REFACTOR_PLAN.md` — Modernization strategy
- [ ] `AFTER_AUDIT.md` — Post-modernization verification
- [ ] `CHANGELOG.md` — Change documentation
- [ ] `PR_DOD.md` — This file
- [ ] `CI_CHECKLIST.md` — CI enforcement checklist
- [ ] `IOS_ONLY_MODE.md` — Android isolation docs
- [ ] `TOOLCHAIN_LOCK.md` — Xcode/simulator enforcement
- [ ] `TOOLING_NOTES.md` — Development tools inventory
- [ ] `ENFORCEMENT_README.md` — Build enforcement guide

**Verification:**
```bash
ls -1 *.md | grep -E "(BEFORE|REFACTOR|AFTER|CHANGELOG|PR_DOD|CI_CHECKLIST|IOS_ONLY|TOOLCHAIN|TOOLING|ENFORCEMENT)"
```

---

### Documentation Quality

- [ ] All `.md` files have clear headings
- [ ] All `.md` files have table of contents (if >100 lines)
- [ ] No broken internal links
- [ ] No exposed secrets in docs
- [ ] Code blocks have syntax highlighting

**Verification:**
```bash
for file in *.md; do
  echo "Checking $file..."
  grep -E "^#+ " "$file" >/dev/null && echo "  ✅ Headings" || echo "  ❌ No headings"
done
```

---

## 9. VS Code Integration ✅

### Tasks

- [ ] `.vscode/tasks.json` exists
- [ ] All iOS tasks depend on Preflight
- [ ] Build tasks use locked destination
- [ ] No Android tasks present

**Verification:**
```bash
cat .vscode/tasks.json | jq '.tasks[] | select(.label | contains("iOS"))'
```

---

### Settings

- [ ] `.vscode/settings.json` excludes `platforms/android/**` (if Android isolated)
- [ ] Extensions recommended (if using `extensions.json`)

---

## 10. Git Hygiene ✅

### Commits

- [ ] Commits are atomic and scoped
- [ ] Commit messages follow convention (`feat:`, `fix:`, `docs:`, etc.)
- [ ] No "WIP" or "test" commit messages in PR
- [ ] All commits signed (if required by org)

**Verification:**
```bash
git log --oneline -10
```

---

### Branch Status

- [ ] Branch is up-to-date with `main`
- [ ] No merge conflicts
- [ ] All changes committed (no dirty working tree)
- [ ] Changes pushed to remote

**Verification:**
```bash
git status  # Should show clean
git diff main...HEAD --stat
```

---

## 11. Performance ⚡

### Build Times

- [ ] Clean build completes in <5 minutes
- [ ] Incremental build completes in <30 seconds
- [ ] Pod install completes in <2 minutes

**Verification:**
```bash
time (cd ios && xcodebuild clean build ... )
```

---

### Runtime

- [ ] App launches in <3 seconds on simulator
- [ ] No main thread blocking >100ms
- [ ] No memory leaks detected (Instruments)

---

## 12. Firebase-Specific DoD 🔥

### If Firebase Re-Integrated

- [ ] `GoogleService-Info.plist` in correct target(s)
- [ ] No duplicate Firebase pods
- [ ] Crashlytics scripts in correct order
- [ ] Firebase modules build successfully
- [ ] No gRPC-Core errors (previous blocker)

---

## PR Checklist Summary

**Phase Completion:**

- ✅ Phase A: Checkpoint (commit & push)
- ✅ Phase B: Toolchain Lock (Xcode 15.4 active)
- ✅ Phase C: Android Isolation (iOS-only mode)
- ⏸️ Phase D: BEFORE Audit (existing, may need update)
- ⏸️ Phase E: Refactor Plan (to be created)
- ⏸️ Phase F: Implementation (iOS modernization)
- ⏸️ Phase G: AFTER Audit (post-implementation)
- ⏸️ Phase H: Changelog (comprehensive change log)

**Current Status:** Phases A-C complete and committed. Ready to proceed with Phase D onwards.

---

## Approval Criteria

**Minimum Requirements:**

1. ✅ All toolchain checks pass
2. ✅ iOS-only mode enforced
3. ✅ Builds succeed with locked destination
4. ✅ Preflight script passes
5. ✅ Required documentation present
6. ⏸️ Tests pass (when implemented)
7. ⏸️ No regressions from BEFORE_AUDIT baseline

**Optional (Nice-to-Have):**

- SwiftLint integration
- SwiftFormat integration
- Firebase re-integration
- Performance benchmarks

---

## Sign-Off

**Reviewers must verify:**

- [ ] All DoD items checked
- [ ] No security issues
- [ ] No breaking changes (or documented)
- [ ] CI pipeline passes
- [ ] Local build succeeds on their machine

**Approval Signature:**

- [ ] **iOS Architect:** _______________________
- [ ] **DevOps Engineer:** _______________________
- [ ] **Security Review:** _______________________

---

**Maintained by:** GitHub Copilot (Claude Agent)  
**Last Updated:** December 27, 2025  
**Version:** 1.0
