if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then

    # Example: Upload master branch app binary to HockeyApp using the API
    if [ "$APPCENTER_BRANCH" == "main2" ];
     then
       if [ "$androidbuild" == "yes" ];
        then

          echo "IS ANDROID BUILD? $androidbuild "
          echo "Current APPCENTER_BUILD_ID is $APPCENTER_BUILD_ID "

          curl "https://upload.bugsnag.com/react-native-source-map" \
          -F "apiKey=$bugsnagkey" \
          -F "dev=false" \
          -F "appVersionCode=$APPCENTER_BUILD_ID" \
          -F "sourceMap=@android-release.bundle.map" \
          -F "bundle=@android/app/src/main/assets/index.android.bundle"  \
          -F "platform=android" \
          -F "projectRoot=`pwd`"

          echo "complete ANDROID sourcemap upload!"
        fi

        if [ "$iosbuild" == "yes" ];
         then

           echo "IS IOS BUILD? $iosbuild "
           echo "Current APPCENTER_BUILD_ID is $APPCENTER_BUILD_ID "


           curl "https://upload.bugsnag.com/react-native-source-map" \
           -F "apiKey=$bugsnagkey" \
           -F "dev=false" \
           -F "appVersion=$APPCENTER_BUILD_ID" \
           -F "sourceMap=@ios-release.bundle.map" \
           -F "bundle=@ios-release.bundle"  \
           -F "platform=ios" \
           -F "projectRoot=`pwd`"

           echo "complete IOS sourcemap upload!"
         fi

      #  curl \
      #  -F "status=2" \
      #  -F "ipa=@$APPCENTER_OUTPUT_DIRECTORY/MyApps.ipa" \
      #  -H "X-HockeyAppToken: $HOCKEYAPP_API_TOKEN" \
      #  https://rink.hockeyapp.net/api/2/apps/$HOCKEYAPP_APP_ID/app_versions/upload
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi
fi
