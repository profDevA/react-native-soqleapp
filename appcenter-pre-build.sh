npm install -g react-native-cli

if [ "$iosbuild" == "yes" ];
then
  rm -rf /Users/runner/runners/Developer/Xcode/DerivedData
  rm -rf $APPCENTER_SOURCE_DIRECTORY/ios/Pods
  cd $APPCENTER_SOURCE_DIRECTORY/ios
  pod install
  cd ..
  node node_modules/react-native/local-cli/cli.js bundle --platform ios --dev false --entry-file index.js --bundle-output ios-release.bundle --sourcemap-output ios-release.bundle.map
fi

if [ "$androidbuild" == "yes" ];
then
  react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --sourcemap-output android-release.bundle.map
fi
