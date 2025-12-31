# Find and update the gRPC C++ standard from gnu++17 to c++20
File.write('Podfile', File.read('Podfile').gsub(
  "'gnu++17'",
  "'c++20'"
).gsub(
  "'c++17'",
  "'c++20'"
))
puts "✅ Updated Podfile: gRPC and abseil now use C++20 for Xcode 16.2 compatibility"
