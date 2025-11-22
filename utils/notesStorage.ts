import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "./authStorage";

export type Note = {
  id: string;
  title: string;
  body: string;
  image?: string;
  color?: string;
  updatedAt: number;
};

const NOTES_PREFIX = "NOTES_";

export const getUserNotes = async (): Promise<Note[]> => {
  const user = await getCurrentUser();
  if (!user) return [];

  const key = NOTES_PREFIX + user.username;
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

export const saveUserNotes = async (notes: Note[]) => {
  const user = await getCurrentUser();
  if (!user) return;

  const key = NOTES_PREFIX + user.username;
  await AsyncStorage.setItem(key, JSON.stringify(notes));
};

export const addNote = async (note: Note) => {
  const notes = await getUserNotes();
  notes.push(note);
  await saveUserNotes(notes);
};

export const updateNote = async (updatedNote: Note) => {
  let notes = await getUserNotes();
  notes = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
  await saveUserNotes(notes);
};

export const deleteNote = async (id: string) => {
  let notes = await getUserNotes();
  notes = notes.filter((n) => n.id !== id);
  await saveUserNotes(notes);
};
