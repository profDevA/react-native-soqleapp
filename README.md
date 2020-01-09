**Pre-requisite:**
Use yarn to install
Node 10
Xcode 10.x
branch: stg <<-- important

*We are on react native 61.2, so auto linking is happening.*

We need to update our autolinking on our ios podfile. currently its not done properly yet.

**Android**
- If changes are not picked up, its good practice to gradlew clean before doing react-native run-android
- You can do npm run bundle-android to create bundles.
- Make sure you create assets if you are creating new images otherwise they dont get picked up on release model
- If you are switching from master to stg or vice versa, do gradlew clean, and wipe out your simulator

**IOS**
- Obviously you need to Pod install
- If you get error on iphoneos missing when pod installing glog, run this command
sudo xcode-select --switch /Applications/Xcode.app

**Misc**
- We are using REALM as a local DB.
