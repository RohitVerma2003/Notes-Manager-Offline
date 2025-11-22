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
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setNote((prev) =>
        prev
          ? { ...prev, image: `data:image/jpeg;base64,${res.assets[0].base64}` }
          : prev
      );
    }
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setNote((prev) =>
        prev
          ? { ...prev, image: `data:image/jpeg;base64,${res.assets[0].base64}` }
          : prev
      );
    }
  };

  const save = async () => {
    if (!note) return;

    if (note.title.trim() === "" && note.body.trim() === "" && !note.image) {
      Alert.alert("Error", "Please keep at least one field filled.");
      return;
    }

    await updateNote({ ...note, updatedAt: Date.now() });
    router.back();
  };

  const remove = async () => {
    await deleteNote(id as string);
    router.back();
  };

  if (!note) return null;

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={note.title}
        onChangeText={(t) => setNote({ ...note, title: t })}
        style={styles.titleInput}
      />

      {note.image && <Image source={{ uri: note.image }} style={styles.img} />}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text>Select From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
        <Text>Capture From Camera</Text>
      </TouchableOpacity>

      <TextInput
        value={note.body}
        onChangeText={(t) => setNote({ ...note, body: t })}
        style={styles.body}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={remove}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  body: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  deleteBtn: {
    backgroundColor: "#b91c1c",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
});
