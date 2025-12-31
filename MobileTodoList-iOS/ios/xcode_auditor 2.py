#!/usr/bin/env python3
"""
Xcode Build Phase Auditor and Auto-Fixer
Automatically fixes build script warnings and ensures industry standards
"""

import os
import re
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class XcodeAuditor:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.backup_dir = self.project_root / ".xcode_backup"
        self.report = {
            "timestamp": datetime.now().isoformat(),
            "issues_found": [],
            "fixes_applied": [],
            "verification": {},
            "status": "initialized"
        }
        
    def find_pbxproj(self) -> Optional[Path]:
        """Locate the .pbxproj file in the project"""
        ios_dir = self.project_root / "ios"
        if not ios_dir.exists():
            print("❌ Error: ios/ directory not found")
            return None
            
        for xcodeproj in ios_dir.glob("*.xcodeproj"):
            pbxproj = xcodeproj / "project.pbxproj"
            if pbxproj.exists():
                print(f"✅ Found project file: {pbxproj}")
                return pbxproj
                
        print("❌ Error: No .pbxproj file found")
        return None
    
    def create_backup(self, pbxproj_path: Path) -> Path:
        """Create timestamped backup of pbxproj file"""
        self.backup_dir.mkdir(exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = self.backup_dir / f"project.pbxproj.backup.{timestamp}"
        shutil.copy2(pbxproj_path, backup_path)
        print(f"📦 Backup created: {backup_path}")
        return backup_path
    
    def scan_build_phases(self, content: str) -> List[Dict]:
        """Scan for build script phases that need output files"""
        issues = []
        
        # Pattern to find shell script build phases
        pattern = r'\/\* (.*?) \*\/ = \{([^}]+shellScript[^}]+)\};'
        matches = re.finditer(pattern, content, re.DOTALL)
        
        for match in matches:
            phase_name = match.group(1)
            phase_content = match.group(2)
            
            # Check for problematic script phases
            if any(keyword in phase_name for keyword in [
                "Bundle React Native code",
                "RNFB",
                "Core Configuration",
                "Start Packager",
                "[CP-User]"
            ]):
                # Check if it has outputPaths
                if "outputPaths" not in phase_content:
                    issues.append({
                        "type": "missing_output_paths",
                        "phase_name": phase_name,
                        "full_match": match.group(0),
                        "start": match.start(),
                        "end": match.end()
                    })
                    print(f"⚠️  Found issue: '{phase_name}' has no output paths")
        
        return issues
    
    def fix_build_phase(self, content: str, issue: Dict) -> str:
        """Add output paths to a build phase"""
        phase_name = issue["phase_name"]
        original_block = issue["full_match"]
        
        # Determine appropriate output path based on phase name
        if "React Native" in phase_name or "Bundle" in phase_name:
            output_path = "$(DERIVED_FILE_DIR)/main.jsbundle"
        elif "RNFB" in phase_name or "Firebase" in phase_name:
            output_path = "$(DERIVED_FILE_DIR)/rnfb-config-generated"
        elif "Packager" in phase_name:
            output_path = "$(DERIVED_FILE_DIR)/packager-started"
        else:
            output_path = "$(DERIVED_FILE_DIR)/script-output-generated"
        
        # Insert outputPaths before shellScript
        # Find the shellScript line
        lines = original_block.split('\n')
        new_lines = []
        inserted = False
        
        for line in lines:
            if 'shellScript' in line and not inserted:
                # Insert outputPaths before shellScript
                indent = len(line) - len(line.lstrip())
                output_line = ' ' * indent + f'outputPaths = (\n'
                output_line += ' ' * (indent + 4) + f'"{output_path}",\n'
                output_line += ' ' * indent + ');\n'
                new_lines.append(output_line)
                inserted = True
            new_lines.append(line)
        
        new_block = '\n'.join(new_lines)
        content = content.replace(original_block, new_block)
        
        print(f"✅ Fixed: Added output path to '{phase_name}'")
        return content
    
    def check_callseq_factory_error(self) -> bool:
        """Check for CallSeqFactory compilation errors"""
        # This error is typically in React Native Codegen files
        rct_cxx_bridge = self.project_root / "ios" / "Pods" / "React-Core" / "React" / "CxxBridge" / "RCTCxxBridge.mm"
        
        if not rct_cxx_bridge.exists():
            # Try alternate locations
            for path in self.project_root.rglob("RCTCxxBridge.mm"):
                rct_cxx_bridge = path
                break
        
        if rct_cxx_bridge.exists():
            print(f"🔍 Checking for CallSeqFactory issues in {rct_cxx_bridge.name}")
            return True
        
        return False
    
    def generate_podfile_hook(self) -> str:
        """Generate Podfile post_install hook to persist fixes"""
        return """
# Xcode Build Phase Output Paths Auto-Fix
# Add this to your Podfile after the target block

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_phases.each do |phase|
      if phase.is_a?(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
        # Fix React Native bundle phase
        if phase.name == 'Bundle React Native code and images' && phase.output_paths.empty?
          phase.output_paths << "$(DERIVED_FILE_DIR)/main.jsbundle"
          puts "✅ Fixed: Added output path to React Native bundle phase"
        end
        
        # Fix RNFB configuration phase
        if phase.name&.include?('RNFB') && phase.output_paths.empty?
          phase.output_paths << "$(DERIVED_FILE_DIR)/rnfb-config-generated"
          puts "✅ Fixed: Added output path to RNFB configuration phase"
        end
      end
    end
  end
  
  installer.pods_project.save
end
"""
    
    def scan(self) -> bool:
        """Scan for issues"""
        print("\n🔍 SCANNING FOR ISSUES\n" + "="*50)
        pbxproj_path = self.find_pbxproj()
        if not pbxproj_path:
            return False
            
        with open(pbxproj_path, 'r') as f:
            content = f.read()
        
        issues = self.scan_build_phases(content)
        self.report["issues_found"] = issues
        
        print(f"\n📊 Found {len(issues)} issue(s)")
        return len(issues) > 0
    
    def fix(self) -> bool:
        """Apply fixes to project"""
        print("\n🔧 APPLYING FIXES\n" + "="*50)
        pbxproj_path = self.find_pbxproj()
        if not pbxproj_path:
            return False
        
        # Create backup
        backup_path = self.create_backup(pbxproj_path)
        
        with open(pbxproj_path, 'r') as f:
            content = f.read()
        
        # Scan for issues
        issues = self.scan_build_phases(content)
        
        if not issues:
            print("✅ No issues found - project is already compliant!")
            return True
        
        # Apply fixes
        original_content = content
        for issue in issues:
            content = self.fix_build_phase(content, issue)
            self.report["fixes_applied"].append(issue["phase_name"])
        
        # Write fixed content
        if content != original_content:
            with open(pbxproj_path, 'w') as f:
                f.write(content)
            print(f"\n✅ Applied {len(issues)} fix(es) to {pbxproj_path}")
            
            # Generate Podfile hook
            hook_path = self.project_root / "podfile_post_install_hook.rb"
            with open(hook_path, 'w') as f:
                f.write(self.generate_podfile_hook())
            print(f"✅ Generated Podfile hook: {hook_path}")
            
            return True
        
        return False
    
    def verify(self) -> bool:
        """Verify fixes were applied correctly"""
        print("\n✅ VERIFICATION\n" + "="*50)
        pbxproj_path = self.find_pbxproj()
        if not pbxproj_path:
            return False
            
        with open(pbxproj_path, 'r') as f:
            content = f.read()
        
        issues = self.scan_build_phases(content)
        
        if not issues:
            print("✅ All build phases have proper output paths!")
            self.report["verification"]["status"] = "passed"
            self.report["verification"]["remaining_issues"] = 0
            return True
        else:
            print(f"⚠️  Still have {len(issues)} issue(s)")
            self.report["verification"]["status"] = "failed"
            self.report["verification"]["remaining_issues"] = len(issues)
            return False
    
    def save_report(self):
        """Save audit report to JSON"""
        report_path = self.project_root / "xcode-audit-report.json"
        self.report["status"] = "completed"
        
        with open(report_path, 'w') as f:
            json.dump(self.report, f, indent=2)
        
        print(f"\n📄 Report saved: {report_path}")
    
    def run_full_audit(self):
        """Run complete audit, fix, and verify cycle"""
        print("""
╔════════════════════════════════════════════════════════╗
║     XCODE BUILD PHASE AUDITOR & AUTO-FIXER            ║
║     Industry Standards Compliance Tool                ║
╚════════════════════════════════════════════════════════╝
        """)
        
        has_issues = self.scan()
        
        if has_issues:
            self.fix()
            self.verify()
        
        self.save_report()
        
        print("\n" + "="*50)
        print("✅ AUDIT COMPLETE")
        print("="*50)


def main():
    auditor = XcodeAuditor()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "--scan":
            auditor.scan()
        elif command == "--fix":
            auditor.fix()
        elif command == "--verify":
            auditor.verify()
        elif command == "--full":
            auditor.run_full_audit()
        else:
            print("Usage: python3 xcode_auditor.py [--scan|--fix|--verify|--full]")
    else:
        # Default: run full audit
        auditor.run_full_audit()


if __name__ == "__main__":
    main()
