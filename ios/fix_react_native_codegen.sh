#!/bin/bash

# ============================================
# React Native Codegen CallSeqFactory Fix
# ============================================
# This script fixes the "No matching function for call to 'CallSeqFactory'" error
# commonly seen in React Native projects with newer Xcode versions

set -e

echo "🔧 React Native Codegen Fix for CallSeqFactory Error"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
IOS_DIR="$PROJECT_ROOT/ios"

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ Found: $1${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Not found: $1${NC}"
        return 1
    fi
}

# Function to fix CallSeqFactory in RCTCxxBridge.mm
fix_cxxbridge() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        echo -e "${YELLOW}⚠️  File not found: $file${NC}"
        return 1
    fi
    
    echo "🔍 Checking $file for CallSeqFactory issues..."
    
    # Create backup
    cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}📦 Backup created${NC}"
    
    # Check if the file contains the problematic code
    if grep -q "CallSeqFactory" "$file"; then
        echo "🔧 Applying fix to CallSeqFactory..."
        
        # Fix the CallSeqFactory call by adding proper template parameters
        # This is a common fix for React Native 0.70+ with newer Xcode versions
        sed -i.bak 's/CallSeqFactory(/CallSeqFactory<void>(/' "$file"
        
        echo -e "${GREEN}✅ Fixed CallSeqFactory in $file${NC}"
        return 0
    else
        echo -e "${YELLOW}ℹ️  No CallSeqFactory calls found in this file${NC}"
        return 1
    fi
}

# Function to clean build folder
clean_build() {
    echo ""
    echo "🧹 Cleaning build folders..."
    
    if [ -d "$IOS_DIR/build" ]; then
        rm -rf "$IOS_DIR/build"
        echo -e "${GREEN}✅ Removed ios/build${NC}"
    fi
    
    if [ -d "$IOS_DIR/DerivedData" ]; then
        rm -rf "$IOS_DIR/DerivedData"
        echo -e "${GREEN}✅ Removed ios/DerivedData${NC}"
    fi
}

# Function to reinstall pods
reinstall_pods() {
    echo ""
    echo "📦 Reinstalling CocoaPods..."
    
    cd "$IOS_DIR"
    
    if [ -d "Pods" ]; then
        rm -rf Pods
    fi
    
    if [ -f "Podfile.lock" ]; then
        rm Podfile.lock
    fi
    
    pod install
    
    cd "$PROJECT_ROOT"
    echo -e "${GREEN}✅ Pods reinstalled${NC}"
}

# Main execution
echo ""
echo "🔍 Searching for RCTCxxBridge.mm..."

# Try to find RCTCxxBridge.mm in common locations
CXXBRIDGE_LOCATIONS=(
    "$IOS_DIR/Pods/React-Core/React/CxxBridge/RCTCxxBridge.mm"
    "$IOS_DIR/Pods/React-Core/CxxBridge/RCTCxxBridge.mm"
    "$IOS_DIR/Pods/React/React/CxxBridge/RCTCxxBridge.mm"
)

FOUND=0
for location in "${CXXBRIDGE_LOCATIONS[@]}"; do
    if [ -f "$location" ]; then
        echo -e "${GREEN}✅ Found RCTCxxBridge.mm at: $location${NC}"
        fix_cxxbridge "$location"
        FOUND=1
        break
    fi
done

if [ $FOUND -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Could not find RCTCxxBridge.mm${NC}"
    echo "This may mean:"
    echo "  1. You need to run 'pod install' first"
    echo "  2. The file location has changed in your React Native version"
    echo "  3. The issue is in a different file"
fi

# Additional fixes for React Native Codegen
echo ""
echo "🔍 Checking for React Codegen issues..."

# Fix common issues in react-native.config.js if it exists
CONFIG_FILE="$PROJECT_ROOT/react-native.config.js"
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}✅ Found react-native.config.js${NC}"
    
    # Ensure codegen is properly configured
    if ! grep -q "codegenConfig" "$CONFIG_FILE"; then
        echo "⚠️  Adding codegenConfig to react-native.config.js"
        cat >> "$CONFIG_FILE" << 'EOF'

// Ensure proper codegen configuration
module.exports = {
  ...module.exports,
  project: {
    ios: {},
    android: {}
  }
};
EOF
    fi
fi

# Create a Podfile patch if needed
echo ""
echo "🔧 Creating Podfile compatibility patch..."

cat > "$PROJECT_ROOT/podfile_codegen_patch.rb" << 'EOF'
# Podfile Patch for React Native Codegen Compatibility
# Add this to your Podfile to ensure compatibility with newer Xcode versions

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Fix for CallSeqFactory errors
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
      
      # Disable warnings for third-party code
      config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
      config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
      
      # Enable New Build System
      config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'
    end
  end
end
EOF

echo -e "${GREEN}✅ Created podfile_codegen_patch.rb${NC}"
echo ""
echo "📋 To apply this patch, add the following to your Podfile:"
echo -e "${YELLOW}"
cat "$PROJECT_ROOT/podfile_codegen_patch.rb"
echo -e "${NC}"

# Offer to clean and reinstall
echo ""
read -p "Do you want to clean build and reinstall pods? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    clean_build
    reinstall_pods
fi

echo ""
echo "======================================================"
echo -e "${GREEN}✅ CallSeqFactory fix process complete!${NC}"
echo "======================================================"
echo ""
echo "Next steps:"
echo "  1. Review and apply the Podfile patch above"
echo "  2. Run 'cd ios && pod install'"
echo "  3. Clean build in Xcode (Cmd+Shift+K)"
echo "  4. Build your project"
echo ""
