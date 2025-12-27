#!/bin/bash
#
# Xcode Workspace Rebuild Script
# Creates a clean Xcode workspace from scratch for MobileTodoList-iOS
#
# This script will:
# 1. Clean all build artifacts and caches
# 2. Reinstall dependencies (npm + CocoaPods)
# 3. Regenerate Xcode workspace
# 4. Verify project structure
# 5. Open in Xcode ready to build
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="/Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS"
IOS_DIR="$PROJECT_ROOT/ios"
WORKSPACE="$IOS_DIR/MobileTodoList.xcworkspace"
PROJECT="$IOS_DIR/MobileTodoList.xcodeproj"

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}║         XCODE WORKSPACE REBUILD FROM SCRATCH               ║${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Project:${NC} MobileTodoList-iOS"
echo -e "${BLUE}Location:${NC} $PROJECT_ROOT"
echo ""

# Confirmation
read -p "This will DELETE and rebuild your Xcode workspace. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled by user${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting clean rebuild...${NC}"
echo ""

# ============================================================================
# STEP 1: Clean All Build Artifacts
# ============================================================================
echo -e "${BLUE}[1/8]${NC} Cleaning build artifacts..."

cd "$PROJECT_ROOT"

# Remove node_modules and package-lock
if [ -d "node_modules" ]; then
    echo "  - Removing node_modules/"
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "  - Removing package-lock.json"
    rm -f package-lock.json
fi

# Remove iOS Pods and workspace
cd "$IOS_DIR"

if [ -d "Pods" ]; then
    echo "  - Removing Pods/"
    rm -rf Pods
fi

if [ -f "Podfile.lock" ]; then
    echo "  - Removing Podfile.lock"
    rm -f Podfile.lock
fi

if [ -d "MobileTodoList.xcworkspace" ]; then
    echo "  - Removing old workspace"
    rm -rf MobileTodoList.xcworkspace
fi

# Remove build directories
if [ -d "build" ]; then
    echo "  - Removing build/"
    rm -rf build
fi

# Remove DerivedData
DERIVED_DATA="$HOME/Library/Developer/Xcode/DerivedData"
if [ -d "$DERIVED_DATA" ]; then
    echo "  - Cleaning DerivedData"
    rm -rf "$DERIVED_DATA/MobileTodoList-"*
fi

# Clear Metro cache
cd "$PROJECT_ROOT"
if [ -d "$HOME/.metro" ]; then
    echo "  - Clearing Metro cache"
    rm -rf "$HOME/.metro"
fi

if [ -d ".metro-health-check" ]; then
    rm -rf .metro-health-check*
fi

echo -e "${GREEN}✓ Build artifacts cleaned${NC}"
echo ""

# ============================================================================
# STEP 2: Clean npm Cache
# ============================================================================
echo -e "${BLUE}[2/8]${NC} Cleaning npm cache..."
npm cache clean --force
echo -e "${GREEN}✓ npm cache cleaned${NC}"
echo ""

# ============================================================================
# STEP 3: Install npm Dependencies
# ============================================================================
echo -e "${BLUE}[3/8]${NC} Installing npm dependencies..."
echo "  This may take 2-3 minutes..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm dependencies installed${NC}"
echo ""

# ============================================================================
# STEP 4: Verify Critical Files
# ============================================================================
echo -e "${BLUE}[4/8]${NC} Verifying project files..."

cd "$PROJECT_ROOT"

# Check package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ package.json not found${NC}"
    exit 1
fi

# Check Podfile
if [ ! -f "$IOS_DIR/Podfile" ]; then
    echo -e "${RED}✗ Podfile not found${NC}"
    exit 1
fi

# Check .xcode.env
if [ ! -f "$IOS_DIR/.xcode.env" ]; then
    echo -e "${YELLOW}⚠ .xcode.env not found, creating...${NC}"
    cat > "$IOS_DIR/.xcode.env" << 'EOF'
# Node.js binary location for Xcode build scripts
export NODE_BINARY=$(command -v node)
EOF
fi

# Check Xcode project
if [ ! -d "$PROJECT" ]; then
    echo -e "${RED}✗ Xcode project not found at $PROJECT${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All critical files present${NC}"
echo ""

# ============================================================================
# STEP 5: Update CocoaPods
# ============================================================================
echo -e "${BLUE}[5/8]${NC} Updating CocoaPods..."
gem install cocoapods --user-install 2>/dev/null || true
pod repo update
echo -e "${GREEN}✓ CocoaPods updated${NC}"
echo ""

# ============================================================================
# STEP 6: Install Pods and Generate Workspace
# ============================================================================
echo -e "${BLUE}[6/8]${NC} Installing CocoaPods dependencies..."
echo "  This may take 3-5 minutes..."

cd "$IOS_DIR"
pod install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ pod install failed${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting steps:${NC}"
    echo "1. Check Podfile for syntax errors"
    echo "2. Run: pod repo update"
    echo "3. Try: pod install --repo-update"
    exit 1
fi

echo -e "${GREEN}✓ Pods installed successfully${NC}"
echo ""

# ============================================================================
# STEP 7: Verify Workspace Creation
# ============================================================================
echo -e "${BLUE}[7/8]${NC} Verifying workspace..."

if [ ! -d "$WORKSPACE" ]; then
    echo -e "${RED}✗ Workspace was not created${NC}"
    exit 1
fi

if [ ! -f "$WORKSPACE/contents.xcworkspacedata" ]; then
    echo -e "${RED}✗ Workspace data file missing${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Workspace created successfully${NC}"
echo ""

# ============================================================================
# STEP 8: Final Verification
# ============================================================================
echo -e "${BLUE}[8/8]${NC} Running final checks..."

cd "$PROJECT_ROOT"

# Check for node_modules
if [ ! -d "node_modules/react-native" ]; then
    echo -e "${YELLOW}⚠ react-native not found in node_modules${NC}"
fi

# Check for Pods
if [ ! -d "$IOS_DIR/Pods/Target Support Files" ]; then
    echo -e "${YELLOW}⚠ Pods may not be properly configured${NC}"
fi

# Count installed pods
POD_COUNT=$(find "$IOS_DIR/Pods" -maxdepth 1 -type d | wc -l | xargs)
echo "  - Pods installed: $((POD_COUNT - 1))"

# Check workspace scheme
if [ -d "$WORKSPACE/xcshareddata/xcschemes" ]; then
    SCHEME_COUNT=$(find "$WORKSPACE/xcshareddata/xcschemes" -name "*.xcscheme" | wc -l | xargs)
    echo "  - Schemes found: $SCHEME_COUNT"
fi

echo -e "${GREEN}✓ Final checks passed${NC}"
echo ""

# ============================================================================
# SUCCESS SUMMARY
# ============================================================================
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║              ✓ WORKSPACE REBUILD COMPLETE!                 ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Open Xcode workspace:"
echo -e "   ${PURPLE}open $WORKSPACE${NC}"
echo ""
echo "2. In Xcode, select:"
echo "   - Scheme: MobileTodoList"
echo "   - Destination: iPhone 15 (or any iOS 16+ simulator)"
echo ""
echo "3. Build the project:"
echo "   - Press ⌘B to build"
echo "   - Press ⌘R to build and run"
echo ""
echo "4. Or build from terminal:"
echo -e "   ${PURPLE}npx react-native run-ios --simulator=\"iPhone 15\"${NC}"
echo ""

# Offer to open Xcode
read -p "Open Xcode workspace now? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${BLUE}Opening Xcode...${NC}"
    open "$WORKSPACE"
    
    # Wait a moment then try to open the scheme
    sleep 2
    
    echo ""
    echo -e "${GREEN}✓ Xcode opened${NC}"
    echo ""
    echo -e "${YELLOW}In Xcode:${NC}"
    echo "  1. Wait for indexing to complete (top bar)"
    echo "  2. Select 'MobileTodoList' scheme (top left)"
    echo "  3. Select 'iPhone 15' simulator (next to scheme)"
    echo "  4. Press ⌘R to run"
else
    echo ""
    echo -e "${BLUE}Workspace is ready at:${NC}"
    echo "$WORKSPACE"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Rebuild completed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
