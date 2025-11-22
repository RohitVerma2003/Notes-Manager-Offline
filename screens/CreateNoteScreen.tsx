import { addNote, Note } from "@/utils/notesStorage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
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
import uuid from "react-native-uuid";

const placeholderColors = ["#fde68a", "#fecaca", "#bfdbfe", "#bbf7d0", "#ddd"];
const randomColor =
  placeholderColors[Math.floor(Math.random() * placeholderColors.length)];

export default function CreateNoteScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | undefined>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const saveNote = async () => {
    if (title.trim() === "" && body.trim() === "" && !image) {
      Alert.alert("Error", "Please add at least a title, body, or an image.");
      return;
    }

    const id = uuid.v4().toString();
    const finalTitle = title.trim() === "" ? `Untitled-${id}` : title;

    const note: Note = {
      id,
      title: finalTitle,
      body,
      image,
      color: randomColor,
      updatedAt: Date.now(),
    };

    await addNote(note);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />

      {image && <Image source={{ uri: image }} style={styles.img} />}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text>Select From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
        <Text>Capture From Camera</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Write your note..."
        value={body}
        onChangeText={setBody}
        style={styles.body}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
        <Text style={styles.saveText}>Save Note</Text>
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
  },
  saveText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
