import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";

const API_URL = "https://butong-expo-app.onrender.com/api/todos/";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : baseTheme;

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`${API_URL}fetch/`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = () => {
    if (!task.trim()) return;

    fetch(`${API_URL}create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task, completed: false }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prev) => [...prev, newTask]);
        setTask("");
      })
      .catch((err) => Alert.alert("Add Task Error", err.message));
  };

  const deleteTask = (id) => {
    fetch(`${API_URL}${id}/delete/`, { method: "DELETE" })
      .then(() => setTasks((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => Alert.alert("Delete Error", err.message));
  };

  const toggleComplete = (task) => {
    fetch(`${API_URL}${task.id}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      })
      .catch((err) => Alert.alert("Toggle Error", err.message));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = () => {
    const taskToEdit = tasks.find((t) => t.id === editingId);
    if (!editingText.trim() || !taskToEdit) return;

    fetch(`${API_URL}${editingId}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...taskToEdit, title: editingText }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        setEditingId(null);
        setEditingText("");
      })
      .catch((err) => Alert.alert("Update Error", err.message));
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "Completed" ? t.completed : filter === "Pending" ? !t.completed : true
  );

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.header, theme.header]}>To-Do List</Text>

      <View style={styles.switchRow}>
        <Text style={theme.header}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <TextInput
        placeholder="Add a new task..."
        placeholderTextColor={darkMode ? "#ccc" : "#333"}
        value={task}
        onChangeText={setTask}
        style={[styles.input, theme.input]}
      />
      <Button title="➕ Add Task" onPress={addTask} />

      <View style={styles.filterRow}>
        {["All", "Completed", "Pending"].map((type) => (
          <Button key={type} title={type} onPress={() => setFilter(type)} />
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, theme.taskItem]}>
            <Switch
              value={item.completed}
              onValueChange={() => toggleComplete(item)}
            />
            {editingId === item.id ? (
              <View style={styles.editRow}>
                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  style={[styles.input, theme.input]}
                  placeholderTextColor={darkMode ? "#ccc" : "#333"}
                />
                <Button title="💾" onPress={saveEdit} />
                <Button title="❌" onPress={() => setEditingId(null)} />
              </View>
            ) : (
              <>
                <Text
                  style={
                    item.completed
                      ? [styles.completed, theme.completed]
                      : [styles.taskText, theme.taskText]
                  }
                >
                  {item.title}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => startEditing(item)}>
                    <Text style={[styles.actionText, theme.actionText]}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Text style={[styles.actionText, theme.actionText]}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    flex: 1,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskText: { flex: 1, marginLeft: 10 },
  completed: {
    flex: 1,
    marginLeft: 10,
    textDecorationLine: "line-through",
  },
  editRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  actions: { flexDirection: "row", marginLeft: 10 },
  actionText: { fontSize: 18, marginHorizontal: 5 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

const baseTheme = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  header: { color: "#000" },
  input: { backgroundColor: "#eee", color: "#000" },
  taskItem: { backgroundColor: "#f2f2f2" },
  taskText: { color: "#000" },
  completed: { color: "#666" },
  actionText: { color: "#000" },
});

const darkTheme = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  header: { color: "#fff" },
  input: { backgroundColor: "#333", color: "#fff" },
  taskItem: { backgroundColor: "#1e1e1e" },
  taskText: { color: "#fff" },
  completed: { color: "#888" },
  actionText: { color: "#fff" },
});
