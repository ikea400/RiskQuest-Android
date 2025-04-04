import { useState, useEffect} from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import Game from "./Game";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../config/color";
import React from "react"; 
import axios  from "axios";
import { useAuth } from "../context/AuthContext";
import { arrayEquals } from "../utililty/utils";
import * as ScreenOrientation from "expo-screen-orientation";

const MenuPage = ({
  setOpenGameId,
}: {
  setOpenGameId: (value: string) => void;
}) => {
  const [games, setGames] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string>("");
  const { authState } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const API_ENDPOINT = `${API_URL}/games/${authState?.userId}`;
      try {
        const result = await axios.get(API_ENDPOINT);
        const response = result.data;
        if (response?.success === true && Array.isArray(response?.games)) {
          if (!arrayEquals(response.games, games)) {
            setGames(response.games);
          }
          console.log(`Fetched [${response.games}] from server`);
        }
        console.log("Failed to fetch games fo server for unknown reason");
        console.log(response);
      } catch (error: any) {
        console.log("Failed to fetch games fo server", error);
      }
    };
    if (authState?.bot !== true) {
      fetchGames();
    }

    // Lock to portrait orientation
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>RiskQuest: List of games</Text>
      {games.length === 0 ? (
        <View style={styles.listPlaceHolder}>
          <Text>No game were found</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {games.map((game, index) => (
            <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => setOpenGameId(game)}>
              <Text key={index} style={styles.itemText}>{game}</Text>
            </TouchableOpacity>
            
          ))}
        </ScrollView>
      )}
      <Text>Can't find your game? Enter the game id here</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="game id"
          value={gameId}
          onChangeText={setGameId}
        />
        <Button
          color={Colors.mainButton}
          title={"Submit"}
          onPress={() => {
            if (gameId.length > 0) {
              setOpenGameId(gameId);
            }
            setGameId("");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const Menu = () => {
  const [openGameId, setOpenGameId] = useState<string | undefined>();

  return openGameId ? <Game /> : <MenuPage setOpenGameId={setOpenGameId} />;
};

export default Menu;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  listPlaceHolder: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  form: {
    gap: 10,
    width: "80%",
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#E0E6F0',
  },

  itemText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  }
});
