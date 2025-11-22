import { getUserNotes, Note } from "@/utils/notesStorage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = async () => {
    const data = await getUserNotes();
    setNotes(data.sort((a, b) => b.updatedAt - a.updatedAt));
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`./notes/${item.id}`)}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
      ) : (
        <View style={styles.noImage} />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/notes/new")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
  },
  thumbnail: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  noImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  title: { fontSize: 16, fontWeight: "700" },
  preview: { color: "#6b7280", marginTop: 4 },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#111827",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: { color: "white", fontSize: 32, marginTop: -4 },
});
