import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TodoList from "../../components/TodoList"; // Path looks good now

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the To-Do List App!</Text>
      {/* Ignore TypeScript error here */}
      {/* @ts-ignore */}
      <TodoList /> {/* This will render your TodoList component */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
