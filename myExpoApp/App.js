import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "./components/TodoList";
import styles from "../styles/appStyles";



export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      setDarkMode(storedTheme === "dark");
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const themeStyles = darkMode ? styles.dark : styles.light;

  return (
    <View style={[styles.container, themeStyles]}>
      <Button
        title={darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        onPress={toggleTheme}
      />
      <Text style={[styles.title, darkMode && { color: "#fff" }]}>
        React Native TODO App
      </Text>
      <TodoList darkMode={darkMode} />
    </View>
  );
}

