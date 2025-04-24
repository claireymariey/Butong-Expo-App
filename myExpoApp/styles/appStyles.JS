import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
   //for dark mode
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dark: {
    backgroundColor: "#121212",
  },
  light: {
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#222",
  },
  //for dark mode

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffbfe",
  },
  appContainer: {
    backgroundColor: "#6a11cb",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    width: "100%",
    maxWidth: 600,
  },
  appWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginVertical: 10,
    width: "100%",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingLeft: 10,
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
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionText: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: "#FF00FF",
    padding: 10,
    borderRadius: 6,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: "#28a745",
  },
});

const darkTheme = StyleSheet.create({
  header: {
    color: "#fff",
  },
  taskItem: {
    backgroundColor: "#333",
  },
  taskText: {
    color: "#fff",
  },
});


export default {
  styles,
  darkTheme,
};