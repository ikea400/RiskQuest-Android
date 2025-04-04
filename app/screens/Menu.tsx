import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import Game from "./Game";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../config/color";
import React from "react"; 
import axios  from "axios";

const MenuPage = () => {
  const [games, setGames] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string>("");

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
            <TouchableOpacity key={index} style={styles.itemContainer}>
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
            setGames([gameId, ...games]);
            setGameId("game id, date, player count ");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const Menu = () => {
  const [openGameId, setOpenGameId] = useState<string | undefined>();

  return openGameId ? <Game /> : <MenuPage />;
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
