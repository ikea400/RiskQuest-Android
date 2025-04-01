import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Game from "./Game";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../config/color";

const MenuPage = () => {
  const [games, setGames] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <Text>RiskQuest: List of games</Text>
      {games.length === 0 ? (
        <View style={styles.listPlaceHolder}>
          <Text>No game were gound</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {games.map((game, index) => (
            <Text key={index}>{game}</Text>
          ))}
        </View>
      )}
      <Text>Don't find your game? Enter the game id here</Text>
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
            setGameId("");
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
  list: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    width: "80%",
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
});
