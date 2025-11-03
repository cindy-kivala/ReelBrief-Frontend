import os
import re

print("🔍 FRONTEND API CALLS ANALYSIS")
print("=" * 50)

api_patterns = [
    r'fetch\([^)]+\)',
    r'axios\.(get|post|put|delete|patch)\([^)]+\)',
    r'\.get\([^)]+\)',
    r'\.post\([^)]+\)',
    r'api/'
]

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for pattern in api_patterns:
                        matches = re.findall(pattern, content)
                        if matches:
                            print(f"📄 {filepath}")
                            for match in matches[:3]:  # Show first 3 matches
                                print(f"   → {match}")
                            break
            except:
                pass

print(f"\n✅ Frontend API scan complete")
