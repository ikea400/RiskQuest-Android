import { StatusBar } from "expo-status-bar";
import { AppState, AppStateStatus, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

// Credits: https://stackoverflow.com/a/77030465
const FullScreenComponent = ({ children, style}: any) => {
  // Hide bottom bar
  const hideNavBar = async () => {
    // Prevent content from moving up when bar is shown
    await NavigationBar.setPositionAsync("absolute");

    // Hide bottom bar
    await NavigationBar.setVisibilityAsync("hidden");

    // Show the bar when user swipes
    await NavigationBar.setBehaviorAsync("overlay-swipe");
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // If app is being used, hide nav bar
      if (nextAppState === "active") {
        hideNavBar();
      }
    };

    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Clean up the event listener when the component unmounts
    return () => {
      appStateSubscription.remove();
    };
  }, []);
  return (
    <View style={style}>
      <StatusBar hidden={true} />
      {children}
    </View>
  );
};

export default FullScreenComponent;
