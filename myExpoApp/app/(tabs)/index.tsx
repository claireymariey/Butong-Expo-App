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

const API_URL = "https://full-stack-to-do-app-j6ds.onrender.com/api/todos/";

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

      <View style={styles.filterContainer}>
        {["All", "Completed", "Pending"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{type}</Text>
          </TouchableOpacity>
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
                  style={[
                    styles.input,
                    theme.input,
                    { backgroundColor: "#ffffcc", flex: 1 }, // Highlight edit
                  ]}
                  placeholderTextColor={darkMode ? "#ccc" : "#333"}
                />
                <Button title="💾" onPress={saveEdit} />
                <Button title="❌" onPress={() => setEditingId(null)} />
              </View>
            ) : (
              <View style={styles.taskRow}>
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
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fffbfe",
    width: "100%",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    width: "100%",
  },
  taskItem: {
    flexDirection: "column",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: "100%",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  completed: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "gray",
    opacity: 0.7,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionText: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: "#28a745",
  },
});

const baseTheme = StyleSheet.create({
  container: {
    backgroundColor: "#fffbfe",
  },
  header: {
    color: "#333",
  },
  taskItem: {
    backgroundColor: "#fff",
  },
  taskText: {
    color: "#333",
  },
  completed: {
    color: "gray",
  },
  actionText: {
    color: "#333",
  },
  input: {
    color: "#000",
    backgroundColor: "#fff",
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  header: {
    color: "#fff",
  },
  taskItem: {
    backgroundColor: "#1e1e1e",
  },
  taskText: {
    color: "#fff",
  },
  completed: {
    color: "#aaa",
  },
  actionText: {
    color: "#fff",
  },
  input: {
    color: "#fff",
    backgroundColor: "#333",
  },
});
