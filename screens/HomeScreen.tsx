import { logoutUser } from "@/utils/authStorage";
import { getUserNotes, Note } from "@/utils/notesStorage";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const placeholderColors = [
  "#fde68a",
  "#fecaca",
  "#bfdbfe",
  "#bbf7d0",
  "#f5f5f5",
];

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("updated-desc");

  const loadNotes = async () => {
    const data = await getUserNotes();
    setNotes(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    switch (sortMode) {
      case "updated-asc":
        return a.updatedAt - b.updatedAt;
      case "updated-desc":
        return b.updatedAt - a.updatedAt;
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const renderItem = ({ item }: { item: Note }) => {
    const cardColor = item.color ?? "#f3f4f6";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/notes/[id]",
            params: { id: item.id },
          })
        }
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: cardColor }]} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.preview} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <TextInput
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Picker
        selectedValue={sortMode}
        onValueChange={setSortMode}
        style={styles.picker}
      >
        <Picker.Item
          label="Last Updated (Newest → Oldest)"
          value="updated-desc"
        />
        <Picker.Item
          label="Last Updated (Oldest → Newest)"
          value="updated-asc"
        />
        <Picker.Item label="Title (A → Z)" value="title-asc" />
        <Picker.Item label="Title (Z → A)" value="title-desc" />
      </Picker>

      <FlatList
        data={sorted}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/notes/new")}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F1F3E0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 10,
  },
  logoutBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontWeight: "700",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  picker: {
    margin: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  thumbnail: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  title: { fontSize: 16, fontWeight: "700" },
  preview: { color: "#6b7280", marginTop: 4 },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 65,
    width: 60,
    height: 60,
    backgroundColor: "#111827",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: { color: "white", fontSize: 34, marginTop: -3 },
});
