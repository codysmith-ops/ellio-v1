# Ellio Feature Map
**Version:** 1.0  
**Last Updated:** December 30, 2024  
**Purpose:** Complete inventory of all features, screens, and user flows

---

## Feature Hierarchy

```
Ellio App
├── 🏠 Home
│   ├── Task Input
│   │   ├── Text Entry
│   │   ├── Voice Input
│   │   └── Product Scanning
│   ├── Task List
│   │   ├── Completion Toggle
│   │   ├── Task Details
│   │   └── Delete Action
│   ├── Store Search
│   │   ├── Auto-search
│   │   ├── Result Filtering
│   │   └── Store Navigation
│   └── Quick Actions
│       ├── Plan Route
│       └── Open Chat
├── 💬 Chat Assistant
│   ├── Voice Commands
│   ├── Natural Language Processing
│   └── Smart Suggestions
├── 🗺️ Route Planner
│   ├── Multi-stop Optimization
│   ├── Map Preview
│   └── Navigation App Choice
├── ⚙️ Settings
│   ├── Account
│   ├── Preferences
│   ├── Integrations
│   └── About
└── 📊 Analytics (Future)
    ├── Shopping Trends
    ├── Savings Tracking
    └── Waste Reduction
```

---

## Screen Inventory

### 1. Home Screen (App.tsx)
**Path:** `/`  
**Purpose:** Main interface for task management and shopping

**Elements:**
- App header with logo
- Task input field with placeholder "What do you need?"
- Action buttons row:
  - 🎤 Voice input
  - 📸 Camera/scan
  - 🔍 Store search
- Task list (FlatList)
- Store search results (conditional)
- Navigation preferences selector
- Quick action buttons

**User Flows:**
```
Add Task (Text):
User types item → Taps "Add" → Item appears in list

Add Task (Voice):
User taps 🎤 → Speaks item → Transcript shown → Taps "Add" → Item in list

Add Task (Scan):
User taps 📸 → Camera opens → Scans product → Brand/details extracted → Taps "Add"

Complete Task:
User taps checkbox → Task marked done → Visual feedback

Delete Task:
User taps "Delete" → Confirmation → Task removed

Search Stores:
User types item → Taps 🔍 → API call → Results show with prices/distances

Navigate to Store:
User taps store card → Opens chosen map app → Directions start
```

**State Management:**
- Local state: title, note, location, images
- Global state (Zustand): tasks array, navigation preference
- Async state: geolocation, store search results, voice transcript

---

### 2. Chat Assistant (Future Integration)
**Path:** `/chat`  
**Purpose:** Natural language interface for task management

**Planned Features:**
- Voice command parsing
- Intent recognition ("Add milk", "Find cheapest bread", "Plan my route")
- Response generation
- Conversation history
- Quick replies

**Example Intents:**
```
"Add eggs to my list" → Creates task
"Where's the cheapest milk?" → Searches stores, shows results
"Plan my shopping route" → Calculates optimal path
"What's on my list?" → Reads all tasks
"Mark bread as done" → Completes matching task
```

---

### 3. Route Planner (Partial Implementation)
**Path:** Currently alert-based, needs dedicated screen  
**Purpose:** Optimize shopping trip with multiple stops

**Current Implementation:**
- Calculates total distance
- Estimates drive time (assumes 9 m/s)
- Shows in alert popup

**Needed Features:**
- Visual map with pins for each task location
- Drag-to-reorder stops
- Real-time traffic data
- Save/load route templates
- Share route with others

---

### 4. Settings Screen (Future)
**Path:** `/settings`  
**Purpose:** App configuration and preferences

**Planned Sections:**

#### Account
- Profile info
- Linked accounts (Google, Apple)
- Data export/import

#### Preferences
- Default navigation app
- Voice input language
- Notification settings
- Location permissions

#### Integrations
- Grocery store loyalty cards
- Payment methods
- Calendar sync
- Family sharing

#### About
- App version
- Privacy policy
- Terms of service
- Contact support

---

## Feature Deep Dive

### Voice Input System

**Components:**
- `useVoiceInput` hook (src/hooks/useVoiceInput.ts)
- `VoiceInput` component (src/components/VoiceInput.tsx)
- React Native Voice library

**Capabilities:**
- Real-time speech-to-text
- Automatic punctuation
- Multi-language support (configured in setup)
- Error handling for permissions

**User Journey:**
```
1. User taps microphone button
2. Permission check (if first time)
3. Listening indicator appears (pulsing animation)
4. User speaks: "Organic milk"
5. Transcript updates in real-time
6. User stops speaking
7. Final transcript shown in input field
8. User can edit or add immediately
```

**Error Scenarios:**
- Permission denied → Show alert with settings link
- Network unavailable → Fallback to on-device recognition
- No speech detected → "Didn't catch that, try again"
- Background noise → "Too noisy, please try somewhere quieter"

---

### Store Search Integration

**Service:** `src/services/storeSearch.ts`

**Supported Retailers:**
1. Walmart
2. Target
3. Kroger
4. Whole Foods
5. Costco
6. Safeway
7. Trader Joe's
8. Instacart (aggregator)

**Data Returned:**
```typescript
interface StoreResult {
  store: string;           // "Walmart"
  storeLogo: string;       // "🛒"
  productName: string;     // "Great Value Whole Milk, 1 Gallon"
  price: number;           // 3.97
  availability: string;    // "In Stock" | "Low Stock" | "Out of Stock"
  inStock: boolean;
  url?: string;            // Direct product page link
  storeLocation?: {
    name: string;          // "Walmart Supercenter"
    address: string;       // "123 Main St, City, ST 12345"
    distance: number;      // 2.3 (km)
    latitude: number;
    longitude: number;
    rating?: number;       // 4.2
  };
}
```

**Search Flow:**
```
1. User enters/scans product name
2. Tap search icon OR auto-search (debounced)
3. API calls to all retailers in parallel
4. Results aggregated and sorted by:
   - Distance (if location available)
   - OR price (if location denied)
5. Display in cards with:
   - Store logo and name
   - Product name and image
   - Price in large text
   - Availability badge (color-coded)
   - Distance (if location available)
   - Rating (if available)
6. User taps card → Opens product page in browser
```

**Performance:**
- Timeout: 5 seconds per API
- Caching: 30 minute TTL for same query
- Retry: 1 automatic retry on failure

---

### Product Recognition

**Methods:**
1. **Camera OCR** (current)
   - Library: react-native-mlkit-ocr
   - Extracts text from product labels
   - Works offline
   - Accuracy: ~85% on clear labels

2. **Barcode Scanning** (component exists, not integrated)
   - Library: react-native-camera
   - Supports UPC, EAN, QR codes
   - Instant recognition
   - Accuracy: ~99%

3. **Product API Lookup** (future)
   - UPC Database API
   - Returns: name, brand, category, typical price
   - Online only

**Image Recognition Flow:**
```
1. User taps camera icon
2. Camera permission check
3. Camera view opens
4. User frames product
5. Tap capture button
6. Image sent to OCR
7. Text extracted: "Horizon Organic Milk"
8. Brand parsed: "Horizon"
9. Auto-fill fields:
   - Title: "Organic Milk"
   - Brand: "Horizon"
   - Details: [full OCR text]
10. User reviews and adds
```

---

### Geolocation & Navigation

**Libraries:**
- `@react-native-community/geolocation`
- `geolib` (distance calculations)

**Permissions:**
- iOS: NSLocationWhenInUseUsageDescription
- Android: ACCESS_FINE_LOCATION

**Features:**

#### Current Location
- Accuracy: High (GPS + WiFi + Cell)
- Update frequency: On-demand only (battery-friendly)
- Fallback: Last known location if GPS unavailable

#### Location Tagging
- Manual lat/long entry
- "Use Current Location" button
- Saved with each task
- Optional label (e.g., "Whole Foods Downtown")

#### Distance Calculation
```typescript
import { getDistance } from 'geolib';

const distance = getDistance(
  { latitude: currentLat, longitude: currentLon },
  { latitude: storeLat, longitude: storeLon }
);
// Returns meters, converted to km for display
```

#### Route Planning
- Algorithm: Nearest neighbor (greedy)
- Optimization: Minimize total distance
- Assumes: Start from current location
- Output: Ordered list of stops + total distance/time

#### Navigation Launch
```typescript
const openAppleMaps = (lat, lon, label) => {
  const url = `maps://app?daddr=${lat},${lon}`;
  Linking.openURL(url);
};

const openGoogleMaps = (lat, lon, label) => {
  const url = `google.maps://maps?daddr=${lat},${lon}`;
  Linking.openURL(url);
};

const openWaze = (lat, lon, label) => {
  const url = `waze://?ll=${lat},${lon}&navigate=yes`;
  Linking.openURL(url);
};
```

---

### Firebase Integration

**Services:**
- Analytics: Event tracking
- Crashlytics: Error reporting (future)
- Cloud Firestore: Data sync (future)
- Authentication: User accounts (future)

**Current Events:**
```typescript
analytics().logEvent('app_start', {
  platform: Platform.OS,
  version: Platform.Version,
});

// Future events:
analytics().logEvent('task_added', { method: 'voice' });
analytics().logEvent('store_searched', { product: 'milk', results: 5 });
analytics().logEvent('navigation_started', { app: 'waze', distance: 2.3 });
```

---

## Navigation Structure

### Current (No Navigator)
- Single screen (App.tsx)
- All features on one page
- Modals for popups (alerts)

### Planned (React Navigation)
```
Bottom Tab Navigator
├── Home Tab
│   └── HomeScreen (current App.tsx refactored)
├── Chat Tab
│   └── ChatScreen (new)
├── Routes Tab
│   └── RouteListScreen
│       └── RouteDetailScreen (on tap)
└── Settings Tab
    └── SettingsScreen
        ├── AccountScreen
        ├── PreferencesScreen
        └── IntegrationsScreen

Modal Stack (overlays)
├── StoreResultsModal
├── ProductScannerModal
├── LocationPickerModal
└── OnboardingWizard (first launch)
```

---

## API Integrations

### Current
1. **Store APIs** (via searchStores service)
   - Provider-specific endpoints
   - REST APIs, mostly public/scraping
   - No authentication required

2. **Firebase Analytics**
   - Google Analytics for Firebase
   - Automatic screen tracking
   - Custom event logging

### Planned
1. **UPC Database API**
   - Product lookup by barcode
   - GET /product/{upc}
   - Returns: name, brand, image, category

2. **Google Places API**
   - Store location details
   - Reviews and ratings
   - Opening hours

3. **Mapbox/Google Maps SDK**
   - Visual map rendering
   - Route optimization
   - Traffic data

4. **OpenAI/Anthropic API**
   - Natural language processing
   - Intent classification
   - Smart suggestions

---

## Data Models

### Task
```typescript
interface Task {
  id: string;                    // UUID
  title: string;                 // "Organic Milk"
  note?: string;                 // "Prefer Horizon brand"
  completed: boolean;            // false
  locationLabel?: string;        // "Whole Foods"
  latitude?: number;             // 37.7749
  longitude?: number;            // -122.4194
  createdAt: number;             // timestamp
  productBrand?: string;         // "Horizon"
  productDetails?: string;       // OCR text
  imageUri?: string;             // local file path
  storeResults?: StoreResult[];  // cached search results
}
```

### Store Result
```typescript
interface StoreResult {
  store: string;
  storeLogo: string;
  productName: string;
  price: number;
  availability: string;
  inStock: boolean;
  url?: string;
  storeLocation?: {
    name: string;
    address: string;
    distance: number;
    latitude: number;
    longitude: number;
    rating?: number;
  };
}
```

### User Preferences
```typescript
interface UserPreferences {
  navPreference: 'apple' | 'google' | 'waze';
  voiceLanguage: string;         // 'en-US'
  notificationsEnabled: boolean;
  locationPermission: boolean;
  onboardingCompleted: boolean;
  favoriteStores: string[];      // Store names
  theme: 'light' | 'dark';       // Future
}
```

---

## User Flows - Complete Scenarios

### Scenario 1: New User First Task
```
1. App opens → Onboarding wizard appears
2. User swipes through 3 intro screens
3. Asks for location permission → User grants
4. Asks for microphone permission → User grants
5. Wizard closes → Home screen with tooltip
6. Tooltip points to input field: "Type what you need!"
7. User types "bread"
8. Tooltip appears on search icon: "We can find stores for you!"
9. User taps search → Results appear
10. Tooltip on result card: "Tap to open in maps"
11. User taps card → Google Maps opens with directions
12. User completes onboarding
```

### Scenario 2: Voice Add Grocery Item
```
1. User at grocery store, hands full
2. Taps microphone button
3. Speaks: "Add artisan sourdough bread"
4. Transcript appears: "add artisan sourdough bread"
5. Title cleaned: "Artisan Sourdough Bread"
6. "Add" button highlighted (pulsing animation)
7. User taps Add
8. Task appears in list with ☐ checkbox
9. Toast notification: "Added artisan sourdough bread"
```

### Scenario 3: Multi-Stop Shopping Route
```
1. User has 5 tasks with different store locations:
   - Milk (Whole Foods, 2.1km)
   - Bread (Trader Joe's, 3.5km)
   - Eggs (Walmart, 1.8km)
   - Chicken (Costco, 5.2km)
   - Lettuce (Safeway, 2.9km)
2. User taps "Plan Route" button
3. Route calculation:
   → Start: Current location
   → Stop 1: Walmart (1.8km) - closest
   → Stop 2: Whole Foods (2.1km)
   → Stop 3: Safeway (2.9km)
   → Stop 4: Trader Joe's (3.5km)
   → Stop 5: Costco (5.2km)
   Total: 15.5km, ~17 minutes
4. Modal shows route with map
5. User can drag stops to reorder
6. Taps "Start Navigation"
7. Chooses Waze (from preference)
8. Waze opens with first stop
9. As user completes each store, app suggests next stop
```

### Scenario 4: Product Barcode Scan
```
1. User in store, sees unfamiliar product
2. Taps camera icon → Choose "Barcode Scanner"
3. Camera opens with barcode frame overlay
4. User aims at barcode: 012345678901
5. Barcode detected → API lookup
6. Product info returned:
   - Name: "365 Organic Quinoa"
   - Brand: "Whole Foods"
   - Category: "Grains"
   - Typical price: $5.99
7. All fields auto-filled
8. User adds note: "Try this!"
9. Taps Add → Task created
10. Store search auto-runs → Shows other stores with same product
```

---

## Dependencies

### Core Libraries
- React Native 0.73.9
- React 18.3.1
- TypeScript 5.3.3

### State Management
- Zustand 5.0.2 (global state)
- AsyncStorage 2.1.0 (persistence)

### Navigation (Planned)
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/native-stack

### UI Components
- react-native-image-picker 7.1.2 (camera)
- react-native-mlkit-ocr (text recognition)
- @react-native-community/geolocation (GPS)
- react-native-voice (speech-to-text)

### Firebase
- @react-native-firebase/app 23.7.0
- @react-native-firebase/analytics 23.7.0
- @react-native-firebase/auth 23.7.0 (planned)
- @react-native-firebase/firestore 23.7.0 (planned)

### Utilities
- geolib 3.3.4 (distance calculations)
- date-fns (date formatting, planned)
- uuid (ID generation, if needed)

---

## Future Features

### Short-term (Next Sprint)
- [ ] React Navigation integration
- [ ] Dedicated ChatAssistant screen
- [ ] Settings screen with preferences
- [ ] Barcode scanner integration
- [ ] Enhanced onboarding wizard

### Medium-term (Next Month)
- [ ] User authentication (Firebase Auth)
- [ ] Cloud sync (Firestore)
- [ ] Shared shopping lists
- [ ] Price history tracking
- [ ] Shopping analytics dashboard

### Long-term (Next Quarter)
- [ ] Family accounts with roles
- [ ] Budget management
- [ ] Waste tracking and reduction tips
- [ ] Recipe integration
- [ ] Cashback/rewards tracking
- [ ] Social features (share lists, see friends shopping)
- [ ] Gamification (achievements, streaks)

---

## Performance Targets

- **App Launch:** < 2 seconds to interactive
- **Task Add:** < 100ms from tap to list update
- **Store Search:** < 3 seconds for results
- **Voice Recognition:** < 1 second latency
- **Navigation Open:** < 500ms to launch external app
- **Memory Usage:** < 150MB average
- **Battery Impact:** < 5% per hour active use

---

**Document Maintainer:** Product Team  
**Last Updated:** December 30, 2024  
**Next Review:** After each major feature release
