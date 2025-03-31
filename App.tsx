import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import Game from "./app/screens/Game";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import Login from "./app/screens/Login";
import { Kanit_900Black, useFonts } from "@expo-google-fonts/kanit";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Kanit_900Black });

  const Layout = () => {
    const { authState } = useAuth();

    return (
      <NavigationContainer>
        <Stack.Navigator>
          {authState?.authenticated ? (
            <Stack.Screen
              name="Game"
              component={Game}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  return (
    <AuthProvider>
      <Layout/>
    </AuthProvider>
  );
}
