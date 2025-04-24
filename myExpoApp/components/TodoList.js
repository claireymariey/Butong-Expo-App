import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import axios from "axios";
import { styles, darkTheme } from "./styles/appStyles";

const API_URL = "https://to-do-list-api-integration.onrender.com/api/todos/";

export default function TodoList({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`${API_URL}fetch/`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const addTask = () => {
    if (!task.trim()) return;
    axios
      .post(`${API_URL}create/`, { title: task, completed: false })
      .then((res) => {
        setTasks((prev) => [...prev, res.data]);
        setTask("");
      })
      .catch((err) => console.error("Add error:", err));
  };

  const removeTask = (index) => {
    const taskToRemove = tasks[index];
    axios
      .delete(`${API_URL}${taskToRemove.id}/delete/`)
      .then(() => setTasks((prev) => prev.filter((_, i) => i !== index)))
      .catch((err) => console.error("Delete error:", err));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].title);
  };

  const saveEdit = () => {
    if (!editingText.trim()) return;
    const updatedTask = { ...tasks[editingIndex], title: editingText };
    axios
      .put(`${API_URL}${updatedTask.id}/update/`, updatedTask)
      .then((res) => {
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = res.data;
        setTasks(updatedTasks);
        setEditingIndex(null);
        setEditingText("");
      })
      .catch((err) => console.error("Update error:", err));
  };

  const toggleComplete = (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    axios
      .put(`${API_URL}${updatedTask.id}/update/`, updatedTask)
      .then((res) => {
        const updated = tasks.map((t, i) => (i === index ? res.data : t));
        setTasks(updated);
      })
      .catch((err) => console.error("Toggle error:", err));
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "Completed" ? t.completed : filter === "Pending" ? !t.completed : true
  );

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.header}>To-Do List</Text>

      <TextInput
        placeholder="Add a new task..."
        value={task}
        onChangeText={setTask}
        style={localStyles.input}
      />
      <Button title="➕ Add Task" onPress={addTask} />

      <View style={localStyles.filterRow}>
        {["All", "Completed", "Pending"].map((type) => (
          <Button key={type} title={type} onPress={() => setFilter(type)} />
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={localStyles.taskItem}>
            <Switch
              value={item.completed}
              onValueChange={() => toggleComplete(index)}
            />
            {editingIndex === index ? (
              <View style={localStyles.editRow}>
                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  style={localStyles.input}
                />
                <Button title="💾" onPress={saveEdit} />
                <Button title="❌" onPress={() => setEditingIndex(null)} />
              </View>
            ) : (
              <>
                <Text style={item.completed ? localStyles.completed : localStyles.taskText}>
                  {item.title}
                </Text>
                <View style={localStyles.actions}>
                  <TouchableOpacity onPress={() => startEditing(index)}>
                    <Text style={localStyles.actionText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeTask(index)}>
                    <Text style={localStyles.actionText}>🗑️</Text>
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

const localStyles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  taskItem: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskText: { flex: 1, marginLeft: 10 },
  completed: { flex: 1, marginLeft: 10, textDecorationLine: "line-through" },
  editRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  actions: { flexDirection: "row", marginLeft: 10 },
  actionText: { fontSize: 18, marginHorizontal: 5 },
});
