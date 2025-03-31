import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import Game from "./app/screens/Game";

const Stack = createNativeStackNavigator();

export default function App() {
  const [inGame, setInGame] = useState(false);

  const Menu = () => {
    useEffect(() => {
      // Lock to portrait orientation
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }, []);

    return (
      <SafeAreaView>
        <SafeAreaView>
          <StatusBar hidden={true} />
          <Text>Page content</Text>
          <Button onPress={() => setInGame(true)} title="Play game"></Button>
        </SafeAreaView>
      </SafeAreaView>
    );
  };

  const Layout = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {inGame ? (
            <Stack.Screen
              name="Game"
              component={Game}
              options={{
                headerShown: false,
              }}
            ></Stack.Screen>
          ) : (
            <Stack.Screen name="Menu" component={Menu}></Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  return <Layout></Layout>;
}
