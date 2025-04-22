import { useState, useEffect} from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Game from "./Game";
import { NavigationProps } from "../../App";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../config/color";
import React from "react"; 
import axios  from "axios";
import { useAuth } from "../context/AuthContext";
import { arrayEquals } from "../utililty/utils";
import * as ScreenOrientation from "expo-screen-orientation";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MenuScreenNavigationProp = NativeStackNavigationProp<NavigationProps>;

const MenuPage = ({
  setOpenGameId,
}: {
  setOpenGameId: (value: string) => void;
}) => {
  const navigation = useNavigation<MenuScreenNavigationProp>();

  const handleGoBack = () => {
    if(navigation.canGoBack()) {
      navigation.goBack();
    }else{
    navigation.navigate('Menu');
    }
  };

  const [games, setGames] = useState<gameInfo[]>([]);
  const [gameId, setGameId] = useState<string>("");
  const { authState } = useAuth();
  
  interface gameInfo {
    finished: string;
    id: string;
    played_time: string;
    player_count: string;
    start_date: string;
  }

  useEffect(() => {
    const fetchGames = async () => {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const API_ENDPOINT = `${API_URL}/games/${authState?.userId}`;
        const result = await axios.get(API_ENDPOINT, {
          withCredentials: true,  
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          }
        });
        const response = result.data;
        console.log(response.error);
        if (response?.success === true && Array.isArray(response?.games)) {
          if (!arrayEquals(response.games, games)) {
            setGames(response.games);
          }
          console.log(`Fetched [${response.games}] from server`);
        }
        console.log("Failed to fetch games fo server for unknown reason");
        console.log(response);
      
    };
    if (authState?.bot !== true) {
      fetchGames();
    }

    // Lock to portrait orientation
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={handleGoBack}
        style={styles.backButton}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 8}}>Go Back</Text>
      </TouchableOpacity>
      
      <Text>RiskQuest: List of games</Text>
      {games.length === 0 ? (
        <View style={styles.listPlaceHolder}>
          <Text>No game were found</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {games.map((game, index) => (
            
            <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => setOpenGameId(game.id)}>
              <View style={styles.itemContentRow}>
                
                <Text style={styles.gameIdText}>Game #{game.id}</Text>

                <View style={styles.statusDateContainer}>
                  <Text style={[
                      styles.statusText,
                      game.finished ? styles.statusFinished : styles.statusOngoing
                    ]}>
                    {game.finished ? 'Finished' : 'Ongoing'}
                  </Text>
                  <Text style={styles.dateText}>{game.start_date}</Text>
                </View>
              </View>
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
        <TouchableOpacity style={styles.submitButton}
          onPress={() => {
            if (gameId.length > 0) {
              setOpenGameId(gameId);
            }
            setGameId("");
          }}
          >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Menu = () => {
  const [openGameId, setOpenGameId] = useState<string | undefined>();
  console.log("Menu: openGameId", openGameId);
  return openGameId ? (
    <Game gameId={openGameId} returnMenu={() => {setOpenGameId(undefined);}}/>
  ) : (
    <MenuPage setOpenGameId={setOpenGameId} />
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
    marginBottom: 12, 
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E0E6F0',
  },

  itemContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  gameIdText: {
    fontSize: 12,
    fontWeight: '600', 
    color: '#2c3e50', 
    flexShrink: 1, 
    marginRight: 10, 
  },
  statusDateContainer: {
    alignItems: 'flex-end', 
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3, 
  },
  statusFinished: {
    color: '#27ae60', 
  },
  statusOngoing: {
    color: '#2980b9', 
  },
  dateText: {
    fontSize: 13,
    color: '#7f8c8d', 
  },

  itemText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: Colors.mainButton,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#6f9149',
    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  backButton: {
    position: 'absolute',
    width: 60,
    height: 20,
    top: 15,
    left: 20,
    backgroundColor: 'black',
    opacity: 0.7,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    borderWidth: 0.5,
    borderColor: '#0000ff',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 999,
  },

});
