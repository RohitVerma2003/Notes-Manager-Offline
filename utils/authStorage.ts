import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUser = {
  username: string;
  password: string;
};

const USERS_KEY = "USERS";
const CURRENT_USER_KEY = "CURRENT_USER";

export const getAllUsers = async (): Promise<StoredUser[]> => {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
};

const saveAllUsers = async (users: StoredUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signUpUser = async (username: string, password: string) => {
  const users = await getAllUsers();

  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, message: "Username already exists" };
  }

  const newUser: StoredUser = { username, password };
  users.push(newUser);

  await saveAllUsers(users);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return { success: true, user: newUser };
};

export const loginUser = async (username: string, password: string) => {
  const users = await getAllUsers();

  const found = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  if (!found) return { success: false, message: "Invalid username or password" };

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));

  return { success: true, user: found };
};

export const getCurrentUser = async (): Promise<StoredUser | null> => {
  const json = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return json ? JSON.parse(json) : null;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};
