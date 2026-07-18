# Smart Field Survey & Inspection App

A complete React Native mobile application built with **Expo Router**, **TypeScript**, and native Expo APIs for field site inspection and survey management.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Expo Go app on your device (or Android/iOS simulator)

### Installation

```bash
git clone https://github.com/kamleshchandela/reactive-native-1.git
cd reactive-native-1
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

---

## 📱 Features Implemented

### Navigation
- **Bottom Tabs**: Dashboard | New Survey | History | Profile
- **Drawer Navigation**: Dashboard | Survey | Camera | Contacts | Location | Clipboard | Settings
- Drawer wraps the bottom tabs — both navigation systems work together seamlessly

### Module 1 — Dashboard ✅
- Time-based greeting (Good Morning / Afternoon / Evening)
- Inspector Profile card with initials avatar
- Live survey stats: Today's count + Total completed
- Quick Action Cards (New Survey, Camera, Location, Contacts)
- Recent Surveys list (tappable, navigates to preview)

### Module 2 — Create Survey ✅
- Site Name, Client Name, Description (all with inline validation)
- Priority selector: Low / Medium / High (color-coded segmented buttons)
- Date picker via `@react-native-community/datetimepicker`
- Attachment status badges (Photo / Location / Contact) — tap to deep-link
- Notes field
- Draft persisted in global `SurveyContext` — navigating to Camera/Location/Contacts and back preserves all form data

### Module 3 — Camera ✅
- Permission request with graceful denied state + retry button
- Live `CameraView` with flip front/back control
- `ActivityIndicator` while camera initializes
- Capture photo with full-screen preview
- Timestamp overlay on preview (capture date/time)
- Retake or Delete (with confirmation `Alert`)
- "Use Photo" saves to survey draft

### Module 4 — Location ✅
- Permission request via `expo-location` with graceful denied state
- Displays Latitude, Longitude, and Accuracy
- Accuracy quality badge (High / Medium)
- Refresh button to re-fetch location
- Copy to Clipboard with success `Alert`
- Attach to survey draft button

### Module 5 — Contacts ✅
- Permission request via `expo-contacts` with graceful denied state
- Searchable `FlatList` with live name filtering
- Contact counter showing filtered/total results
- Pull-to-Refresh with `RefreshControl`
- Circle avatar showing contact initials (color-coded)
- Copy contact number to clipboard
- Attach contact to survey draft
- "No Number" displayed when contact has no phone
- Empty state screen for zero contacts or zero search results

### Module 6 — Clipboard ✅
- Copy latest Survey ID
- Copy attached Contact Number
- Copy attached Location coordinates
- Paste clipboard content into Notes field
- Save Notes to draft
- Clear Clipboard with confirmation `Alert`

### Module 7 — Survey Preview ✅
- Full scrollable summary: Site Details, Client, Priority, Date, Photo (with timestamp), Location, Contact, Notes
- Edit Survey — navigates back to form pre-filled with draft data
- Submit Survey — saves to history with success `Alert` offering navigation to History or Dashboard
- Read-only mode when opened from Survey History

### Module 8 — Survey History ✅
- `FlatList` of all submitted surveys (not `ScrollView`)
- Search by site name or client name
- Priority filter chips: All / Low / Medium / High
- Attachment indicator chips (Camera / Location / Contact / Notes)
- Tap a survey to view full details (read-only Preview)
- Delete survey with confirmation `Alert`, list updates immediately

---

## 🎨 Design System

All theme values are centralized in [`constants/theme.ts`](./constants/theme.ts):

| Token | Value |
|-------|-------|
| Primary | `#4F46E5` (Indigo) |
| Secondary | `#0EA5E9` (Sky Blue) |
| Accent | `#D946EF` (Fuchsia) |
| Success | `#10B981` (Emerald) |
| Warning | `#F59E0B` (Amber) |
| Error | `#EF4444` (Rose) |
| Background (Light) | `#F8FAFC` |
| Background (Dark) | `#0F172A` |

---

## 📁 Folder Structure

```
my-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom Tab navigator
│   │   ├── index.tsx         # Dashboard (Module 1)
│   │   ├── new-survey.tsx    # Create/Edit Survey (Module 2)
│   │   ├── history.tsx       # Survey History (Module 8)
│   │   └── profile.tsx       # Inspector Profile
│   ├── _layout.tsx           # Root Drawer navigator
│   ├── camera.tsx            # Camera (Module 3)
│   ├── location.tsx          # Location (Module 4)
│   ├── contacts.tsx          # Contacts (Module 5)
│   ├── clipboard.tsx         # Clipboard (Module 6)
│   ├── preview.tsx           # Survey Preview (Module 7)
│   ├── settings.tsx          # Settings
│   └── modal.tsx
├── components/
│   ├── CustomHeader.tsx      # Reusable header with drawer toggle
│   ├── CustomDrawerContent.tsx  # Drawer with profile and nav links
│   └── ...
├── constants/
│   ├── theme.ts              # Colors, Spacing, Radii, Shadows, Fonts
│   └── config.ts             # Student/Inspector details
├── context/
│   └── SurveyContext.tsx     # Global state: draft + surveys list
└── hooks/
```

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| React Native | Core framework |
| Expo SDK 54 | Native modules |
| Expo Router | File-based navigation |
| TypeScript | Type safety |
| expo-camera | Photo capture (Module 3) |
| expo-location | GPS coordinates (Module 4) |
| expo-contacts | Device contacts (Module 5) |
| expo-clipboard | Copy/paste (Modules 4, 5, 6) |
| @react-navigation/drawer | Drawer navigation |
| @react-native-community/datetimepicker | Date picker (Module 2) |
| @expo/vector-icons (Ionicons) | Icons throughout |

---

## 👤 Inspector

**Kamlesh Chandela**  
Course: React Native Mobile App Development  
Batch: 2026  

> Edit [`constants/config.ts`](./constants/config.ts) to update inspector details.
