# 📱 Offline Notes App – React Native (Expo Router)

A fully offline-capable notes application built with React Native, Expo Router, and AsyncStorage.
Supports multiple users, login/signup, per-user notes, camera/gallery images, search & sort, and full CRUD.

---

## 🚀 Features

### 🔐 Authentication (Offline Only)
- Local user accounts stored in AsyncStorage
- Unique username + password
- Multiple users on the same device
- Auto-login & logout

### 📝 Notes (Per User)
- Create, edit, update, delete
- Saved locally (no internet needed)
- Supports:
   - Title
   - Body text
   - Optional image (Camera / Gallery)
   - Persistent Base64 storage
   - table placeholder color when image is missing

### 🔎 Search & Sort
- Search by title or body
- Sorting modes:
  - Last Updated (Newest → Oldest)
  - Last Updated (Oldest → Newest)
  - Title (A → Z)
  - Title (Z → A)
- Search + sort work together

### 📷 Image Support
- Pick from gallery
- Capture using camera
- Image stored permanently in base64
- Works offline

---

## 📂 Project Structure

```markdown
notes-offline/
│
├── app/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── home.tsx
│   └── notes/
│        ├── new.tsx
│        └── [id].tsx
│
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CreateNoteScreen.tsx
│   └── EditNoteScreen.tsx
│
└── utils/
    ├── authStorage.ts
    └── notesStorage.ts
```

## 🛠 Setup Instructions

1. Clone the Repository
```markdown
git clone https://github.com/RohitVerma2003/Notes-Manager-Offline
cd Notes-Manager-Offline
```

2. Install Dependencies
```markdown
npm install
```

3. Install Expo Dependencies
```markdown
npx expo install react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install expo-image-picker
npx expo install expo-router
npx expo install expo-status-bar
```

4. Install Additional Libraries
```markdown
npm install @react-native-picker/picker
npm install react-native-uuid
```

5. Start the Project
```markdown
npx expo start
```

---

### 📚 Libraries Used

| Library                                       | Purpose                       |
| --------------------------------------------- | ----------------------------- |
| **expo-router**                               | File-based navigation         |
| **@react-native-async-storage/async-storage** | Local storage (users & notes) |
| **expo-image-picker**                         | Select or capture images      |
| **react-native-safe-area-context**            | Handle notches / safe areas   |
| **@react-native-picker/picker**               | Sorting dropdown              |
| **react-native-uuid**                         | Generate note IDs             |
| **expo-status-bar**                           | Status bar handling           |
| **React Native Core API**                     | UI, styling, components       |


---

## 🎯 Possible Future Enhancements

- ✔ Grid view for notes
- ✔ Categories & tags
- ✔ Note reminders
- ✔ Export note as PDF
- ✔ Share note across apps
- ✔ Pin/fingerprint lock per user
- ✔ Dark mode
- ✔ Voice notes
