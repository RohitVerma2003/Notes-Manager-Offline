import { addNote, Note } from "@/utils/notesStorage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
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
import uuid from "react-native-uuid";

export default function CreateNoteScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setImage(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const save = async () => {
    const note: Note = {
      id: uuid.v4().toString(),
      title,
      body,
      image,
      updatedAt: Date.now(),
    };

    await addNote(note);
    router.back();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={styles.container}>
        <TextInput
          placeholder="Note title..."
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
        />

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Add Image</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Write here..."
          style={styles.bodyInput}
          value={body}
          onChangeText={setBody}
          multiline
        />

        <TouchableOpacity onPress={save} style={styles.saveButton}>
          <Text style={styles.saveText}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  bodyInput: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
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
  },
  saveText: { color: "white", textAlign: "center", fontWeight: "700" },
});
