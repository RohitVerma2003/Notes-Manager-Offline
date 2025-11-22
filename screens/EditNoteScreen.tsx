import {
  deleteNote,
  getUserNotes,
  Note,
  updateNote,
} from "@/utils/notesStorage";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
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

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    (async () => {
      const notes = await getUserNotes();
      const found = notes.find((n) => n.id === id);
      setNote(found || null);
    })();
  }, []);

  const updateField = (field: keyof Note, value: any) => {
    setNote((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      updateField("image", `data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const saveChanges = async () => {
    if (!note) return;
    await updateNote({ ...note, updatedAt: Date.now() });
    router.back();
  };

  const removeNote = async () => {
    await deleteNote(id as string);
    router.back();
  };

  if (!note) return null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.titleInput}
          value={note.title}
          onChangeText={(t) => updateField("title", t)}
        />

        {note.image && (
          <Image source={{ uri: note.image }} style={styles.image} />
        )}

        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Change Image</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.bodyInput}
          value={note.body}
          onChangeText={(t) => updateField("body", t)}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={removeNote}>
          <Text style={styles.deleteText}>Delete Note</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titleInput: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
  },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
  imageButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  imageButtonText: { fontWeight: "600" },
  saveButton: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveText: { color: "white", fontWeight: "700", textAlign: "center" },
  deleteButton: {
    backgroundColor: "#b91c1c",
    padding: 14,
    borderRadius: 10,
  },
  deleteText: { color: "white", fontWeight: "700", textAlign: "center" },
});
