import { AppState } from 'react-native';


const handleFirstConnectivityChange = connectionInfo => {
  console.log(
  "First change, type: " +
  connectionInfo.type +
  ", effectiveType: " +
  connectionInfo.effectiveType
  );
};

handleAppStateChange (nextAppState)  {
  console.log("appstate handleAppStateChange,", nextAppState);
  console.log("2nd line appstate")
  if (nextAppState === "active") {
    console.log("Appstate is now active, calling handle active refresh ")
    this.handleActiveRefresh();
  }
}

export const addListeners = () => {
  console.log("adding listener")
    AppState.addEventListener("change", handleAppStateChange);
};

export const removeListeners = () => {
    AppState.removeEventListener("change", handleFirstConnectivityChange);
};
