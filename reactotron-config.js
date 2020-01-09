import Reactotron, {
  asyncStorage,
  overlay,
  openInEditor,
  trackGlobalErrors,
  networking,
} from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

const reactotron = Reactotron.configure({ // controls connection & communication settings
  name: 'SOQQLE',
})
  .useReactNative()         // allow to add all built-in react native plugins
  .use(reactotronRedux())   //
  .use(asyncStorage())      // allow to track AsyncStorage on React Native
  .use(overlay())           // allow to have an image uploaded to your simulator to stay on top of your app
  .use(openInEditor())      // allow to click on the error line of code to have the file open in your editor
  .use(
    trackGlobalErrors({     // ensure all errors will get thrown over to Reactotron for display
      veto: frame => frame.fileName.indexOf('/node_modules/react-native/') >= 0,    // leave off any frames sourced from React Native itself out of the stack trace passed along.
    }),
  )
  .use(
    networking({            // allow to track all XMLHttpRequests in React Native
      ignoreContentTypes: /^(image)\/.*$/i,
      ignoreUrls: /\/(logs|symbolicate)$/,
    }),
  )

if (__DEV__) {
  reactotron.connect();
  reactotron.clear();
}

export default reactotron
