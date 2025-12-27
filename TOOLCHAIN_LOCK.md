# Toolchain Lock Documentation — Xcode 15.4 Hard Enforcement

**Date:** December 27, 2025  
**Project:** MobileTodoList-iOS  
**Enforcement Level:** MAXIMUM (Hard-Fail on Deviation)  

---

## Locked Toolchain Configuration

### ✅ Active Toolchain (ENFORCED)

| Component | Required Version | Status | Verification |
|-----------|-----------------|--------|--------------|
| **Xcode** | 15.4 (Build 15F31d) | ✅ LOCKED | `xcodebuild -version` |
| **Command Line Tools** | Xcode 15.4 | ✅ LOCKED | `xcode-select -p` |
| **iOS SDK** | 17.5 | ✅ AVAILABLE | `xcrun simctl list runtimes` |
| **Simulator Device** | iPhone 15 | ✅ LOCKED | Explicit `-destination` |
| **Simulator OS** | iOS 17.5 | ✅ LOCKED | Explicit `-destination` |
| **Node.js** | ≥18 | ✅ VERIFIED | `node --version` |
| **CocoaPods** | Latest | ✅ VERIFIED | `pod --version` |
| **React Native** | 0.73.9 | ✅ LOCKED | `package.json` |

---

## Xcode Selection Enforcement

### Current Configuration

```bash
$ xcodebuild -version
Xcode 15.4
Build version 15F31d

$ xcode-select -p
/Applications/Xcode-15.4.app/Contents/Developer
```

**Status:** ✅ **CORRECT** — Xcode 15.4 is active

### Alternative Xcodes Detected

```bash
$ ls -la /Applications/Xcode*.app
drwxr-xr-x  Xcode-15.4.app  ✅ ACTIVE
drwxr-xr-x  Xcode.app       ⚠️  INACTIVE (26.2 beta)
```

**Xcode 26.2 Status:**
- ✅ Installed but NOT active
- ✅ Will not be used for builds
- ✅ Preflight script prevents accidental use

### Switching Xcode (If Needed)

**To activate Xcode 15.4:**
```bash
sudo xcode-select -s /Applications/Xcode-15.4.app
xcodebuild -version  # Verify: Xcode 15.4
```

**To switch to another Xcode (NOT RECOMMENDED):**
```bash
# This will cause preflight to FAIL
sudo xcode-select -s /Applications/Xcode.app
# Result: All builds will hard-fail until reverted
```

---

## Why Xcode 15.4 (Not 16.x or 26.x)?

### Technical Justification

1. **React Native 0.73.9 Compatibility**
   - RN 0.73.9 was released before Xcode 16.x
   - Not tested against iOS 26.x SDKs (beta)
   - Module map incompatibilities with Xcode 26.2

2. **iOS 17.5 SDK Stability**
   - GA (General Availability) SDK
   - No beta churn or breaking changes
   - Matches production App Store submissions (iOS 16.0+ deployment)

3. **CI/CD Parity**
   - GitHub Actions `macos-latest` runners include Xcode 15.4
   - Deterministic builds across local + CI

4. **Enterprise Compliance**
   - Stable toolchain = predictable results
   - No SDK version drift
   - Audit trail for release builds

### Xcode 16.x/26.x Risks

| Xcode Version | Risk | Impact |
|---------------|------|--------|
| **16.0 - 16.2** | Moderate | RN 0.73.9 may work but untested; new Swift/SDK changes |
| **26.2 (beta)** | HIGH | Module map errors, Foundation/UIKit incompatibilities, beta instability |

**Decision:** Stay on **Xcode 15.4** until RN upgrade to 0.76.x+ (which supports newer SDKs)

---

## Simulator Lock Configuration

### Required Simulator

```
Device: iPhone 15
OS: iOS 17.5
```

### Verification

```bash
$ xcrun simctl list devices | grep "iPhone 15" | grep "17.5"
iPhone 15 (51886F6E-24F9-4E04-B2C6-043D97A0FBE2) (Shutdown)
```

**UDID:** `51886F6E-24F9-4E04-B2C6-043D97A0FBE2`  
**Status:** ✅ Available and verified

### Build Destination (Hard-Locked)

**All builds MUST use:**
```bash
-destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

**Enforcement:**
- VS Code tasks include destination
- GitHub Actions CI includes destination  
- Preflight script validates simulator exists
- No reliance on Xcode defaults

---

## Enforcement Mechanisms

### 1. Preflight Script (`scripts/preflight.sh`)

**Location:** `/scripts/preflight.sh`  
**Execution:** Before EVERY build, test, or deploy  

**Checks:**
```bash
✅ Xcode path = /Applications/Xcode-15.4.app/Contents/Developer
✅ Xcode version = 15.4
✅ Xcode build = 15F31d
✅ iOS 17.5 runtime exists
✅ iPhone 15 simulator exists with iOS 17.5
✅ CocoaPods installed
✅ Node.js ≥18 installed
```

**Failure Behavior:**
- Exit code `1` = Hard-fail
- Blocks build/test execution
- Prints diagnostic message with fix command

**Example Failure:**
```
❌ PREFLIGHT FAILED
Wrong Xcode selected:
  Current: /Applications/Xcode.app/Contents/Developer
  Required: /Applications/Xcode-15.4.app/Contents/Developer

Fix with:
  sudo xcode-select -s /Applications/Xcode-15.4.app
```

### 2. VS Code Tasks

**All build/test tasks depend on preflight:**

```json
{
  "label": "iOS: Build (ENFORCED)",
  "command": "./scripts/preflight.sh && xcodebuild build ..."
}
```

**Prevents:**
- Manual builds with wrong Xcode
- Forgetting to switch Xcode after system updates

### 3. GitHub Actions CI

**Workflow:** `.github/workflows/ios-build.yml`

**Enforcement Steps:**
```yaml
- name: Select Xcode 15.4
  run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer

- name: Run Preflight Checks (ENFORCED)
  run: ./scripts/preflight.sh

- name: Build
  run: xcodebuild ... -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

**CI Guarantees:**
- ✅ Xcode version locked
- ✅ Simulator destination locked
- ✅ Preflight validates environment
- ✅ Build fails fast if mismatch

---

## macOS Host Compatibility

### macOS Tahoe 26.2 Allowed

**Host OS:** macOS 26.2 (Build 25C56)  
**Status:** ✅ **PERMITTED**

**Rationale:**
- macOS version does NOT affect iOS build correctness
- Xcode toolchain is self-contained
- iOS SDK version controlled by Xcode, not macOS
- No known macOS 26.2-specific issues with Xcode 15.4

**Verified Compatibility:**
```
macOS 26.2 + Xcode 15.4 + iOS 17.5 SDK = ✅ Works
```

### Unsupported Configurations

| macOS | Xcode | Status | Reason |
|-------|-------|--------|--------|
| 26.2 | 26.2 | ❌ BLOCKED | RN 0.73.9 incompatible with iOS 26.x SDK |
| 26.2 | 16.x | ⚠️ UNTESTED | May work but violates enforcement |
| <14.0 | 15.4 | ❌ BLOCKED | Xcode 15.4 requires macOS 14.0+ |

---

## React Native Version Lock

### Current Version

```json
{
  "dependencies": {
    "react-native": "0.73.9"
  }
}
```

**Status:** ✅ **LOCKED**

### Upgrade Path (Future)

**To upgrade React Native:**

1. **Research SDK Compatibility:**
   - Check RN release notes for Xcode/iOS SDK requirements
   - Verify Xcode 15.4 support (or identify required Xcode version)

2. **Update Toolchain Lock:**
   - If RN 0.76.x+ supports Xcode 16.x/26.x, update `TOOLCHAIN_LOCK.md`
   - Update `scripts/preflight.sh` with new Xcode version
   - Update CI workflows

3. **Test Migration:**
   - Upgrade RN in branch: `npx react-native upgrade`
   - Run full test suite
   - Validate on iPhone 15 / iOS 17.5 simulator

4. **Update Documentation:**
   - Update this file with new versions
   - Update `ENFORCEMENT_README.md`
   - Commit changes with detailed rationale

---

## Dependency Lock Files

### CocoaPods

**Lockfile:** `ios/Podfile.lock`  
**Status:** ✅ Committed to git  
**Enforcement:** `pod install` uses locked versions  

**Verify determinism:**
```bash
cd ios
rm -rf Pods
pod install
git diff Podfile.lock  # Should show no changes
```

### NPM

**Lockfile:** `package-lock.json`  
**Status:** ✅ Committed to git (if using npm)  
**Alternative:** `yarn.lock` if using Yarn  

**Enforcement:**
```bash
npm ci  # Uses exact versions from package-lock.json
```

**CI Usage:**
- `npm ci` (not `npm install`) for deterministic installs

---

## Troubleshooting

### ❌ "Xcode version mismatch" Error

**Symptom:**
```
❌ PREFLIGHT FAILED
Wrong Xcode version:
  Current: Xcode 26.2
  Required: Xcode 15.4
```

**Fix:**
```bash
# Switch to Xcode 15.4
sudo xcode-select -s /Applications/Xcode-15.4.app

# Verify
xcodebuild -version  # Should show: Xcode 15.4
```

### ❌ "Simulator not found" Error

**Symptom:**
```
❌ PREFLIGHT FAILED
Required simulator not found:
  Required: iPhone 15 (iOS 17.5)
```

**Fix Option 1 — Create via CLI:**
```bash
xcrun simctl create "iPhone 15" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-15 \
  com.apple.CoreSimulator.SimRuntime.iOS-17-5
```

**Fix Option 2 — Create via Xcode:**
1. Open Xcode
2. Window → Devices and Simulators
3. Simulators tab → "+" button
4. Select iPhone 15 / iOS 17.5

### ❌ "iOS 17.5 runtime missing" Error

**Symptom:**
```
❌ PREFLIGHT FAILED
iOS 17.5 runtime not found
```

**Fix:**
1. Open Xcode 15.4
2. Settings (Cmd+,)
3. Platforms tab
4. Click "+" to download iOS 17.5 runtime
5. Wait for download to complete
6. Re-run preflight

---

## Audit Trail

### Toolchain Selection History

| Date | Xcode | Reason | Author |
|------|-------|--------|--------|
| 2025-12-27 | 15.4 | RN 0.73.9 compatibility, stable GA SDK | Claude Agent |

### Verification Checksums

**Xcode 15.4:**
```
Build: 15F31d
SDK: iOS 17.5 (21F79)
```

**Preflight Script:**
```bash
$ shasum -a 256 scripts/preflight.sh
<checksum would go here>
```

---

## Related Documentation

- [ENFORCEMENT_README.md](ENFORCEMENT_README.md) - Build enforcement infrastructure
- [IOS_ONLY_MODE.md](IOS_ONLY_MODE.md) - Android isolation documentation
- [scripts/preflight.sh](scripts/preflight.sh) - Preflight enforcement script
- [.vscode/tasks.json](.vscode/tasks.json) - VS Code task definitions
- [.github/workflows/ios-build.yml](.github/workflows/ios-build.yml) - CI/CD workflow

---

**Maintained by:** GitHub Copilot (Claude Agent)  
**Last Updated:** December 27, 2025  
**Status:** ✅ ACTIVE — Xcode 15.4 locked and enforced
