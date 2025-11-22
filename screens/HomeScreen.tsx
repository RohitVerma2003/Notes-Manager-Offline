import { getCurrentUser, logoutUser } from "@/utils/authStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) setUsername(user.username);
    })();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username} 👋</Text>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  logout: {
    backgroundColor: "#b91c1c",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: { color: "white", fontWeight: "600" },
});
