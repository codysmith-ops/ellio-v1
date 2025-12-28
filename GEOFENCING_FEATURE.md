# Geospatial Task Completion Feature

## Overview
The app now includes intelligent geospatial awareness that automatically detects when users are at or leaving stores and prompts them to confirm task completion with optional receipt upload.

## Features Implemented

### 1. **Geofence Monitoring** (`GeofenceMonitor.tsx`)
- Background location tracking when user enables geofencing
- Monitors user position every 30 seconds with 50-meter distance filter
- Detects when user is within configurable radius of task locations (default: 100 meters)
- Smart debouncing prevents duplicate notifications
- Works on both iOS and Android with proper permission handling

### 2. **Task Completion Dialog** (`TaskCompletionDialog.tsx`)
- Appears when user is detected near store locations
- Shows task details with store name and location badge
- Optional receipt upload with camera/photo library
- **Reimbursement Support:**
  - Special banner for tasks marked as needing reimbursement
  - Prompts for receipt upload if reimbursement is required
  - Can skip receipt upload for non-reimbursement tasks
- Multi-task flow with progress indicator
- "Complete" or "Not Yet" options

### 3. **Enhanced Data Model**

#### Task Properties Added:
```typescript
{
  needsReimbursement?: boolean;     // Flag for expense reimbursement
  receiptUri?: string;               // Uploaded receipt image
  storeName?: string;                // Store name (e.g., "Home Depot")
  storeLatitude?: number;            // Store coordinates
  storeLongitude?: number;
  completedAt?: number;              // Timestamp of completion
}
```

#### User Preferences Added:
```typescript
{
  autoReceiptUploadEnabled: boolean;  // Auto-prompt for receipts
  geofencingEnabled: boolean;         // Enable location tracking
  autoCompleteRadius: number;         // Detection radius in meters
}
```

### 4. **Store Methods**

#### `attachReceipt(taskId, receiptUri)`
Attaches receipt image to completed task

#### `getTasksNearLocation(lat, lon)`
Returns incomplete tasks within configured radius of coordinates

#### `updateTask(taskId, updates)`
Updates task properties including completion status

## User Workflow

### Scenario 1: Regular Task
1. User adds task: "Buy screws at Home Depot"
2. App stores task with Home Depot's coordinates
3. User drives to Home Depot
4. **Geofence triggered** when within 100m of store
5. Notification appears: "Did you complete this task?"
6. User can:
   - Mark complete with optional receipt
   - Skip for now
   - Dismiss notification

### Scenario 2: Reimbursement Task
1. User adds task: "Pick up office supplies" (marked for reimbursement)
2. User visits store and buys items
3. **Geofence triggered** when leaving store
4. Dialog shows with **reimbursement banner** 💰
5. System prompts for receipt upload
6. User options:
   - Upload receipt → Complete task
   - Skip → Task remains incomplete, can upload later
   - Not yet → Keep task open

### Scenario 3: Multiple Tasks at Same Location
1. User has 3 tasks at Home Depot
2. **Geofence triggered** once
3. Dialog shows all 3 tasks with progress indicator
4. User completes each task sequentially
5. Can upload individual receipts per task

## Configuration

### In Setup Wizard
- Geofencing automatically enabled during onboarding
- Receipt upload enabled for users with "budget" goal
- Default radius: 100 meters

### Permissions Required
- **iOS:** Location "Always" permission for background monitoring
- **Android:** ACCESS_FINE_LOCATION permission
- **Both:** Camera/Photo Library for receipt uploads

### Customization Options
```typescript
userPreferences: {
  geofencingEnabled: true,           // Toggle on/off
  autoCompleteRadius: 100,           // 50-500 meters
  autoReceiptUploadEnabled: true,    // Auto-prompt
}
```

## Technical Implementation

### Distance Calculation
Uses Haversine formula for accurate Earth-surface distance:
```typescript
function calculateDistance(lat1, lon1, lat2, lon2): meters
```

### Battery Optimization
- Distance filter: 50m (only updates when moved)
- Time interval: 30 seconds (not constant polling)
- Clears watch when app backgrounded
- Smart debouncing prevents spam

### Receipt Storage
- Images stored as URIs in task data
- Supports camera capture or gallery selection
- Compressed to 0.8 quality for efficiency
- Preview available in completion dialog

## AI Logic Integration

The system uses intelligent logic to determine when to prompt:

1. **Location Detection:** Haversine formula calculates precise distance
2. **Task Filtering:** Only shows incomplete tasks at current location
3. **Reimbursement Detection:** Auto-identifies tasks needing receipts
4. **User Preferences:** Respects user's geofencing and receipt settings
5. **Smart Timing:** Triggers when leaving store (within radius)

## Future Enhancements

- Push notifications when app is backgrounded
- Receipt OCR for automatic expense categorization
- Integration with expense management systems
- Route optimization for multiple errands
- Historical location patterns for smart suggestions
- Geo-triggered reminders before arriving at store

## Files Modified

- **src/store.ts** - Added geofencing preferences and methods
- **App.tsx** - Integrated geofencing monitor and completion dialog
- **src/components/SetupWizard.tsx** - Added geofencing to onboarding

## Files Created

- **src/components/GeofenceMonitor.tsx** - Background location monitoring
- **src/components/TaskCompletionDialog.tsx** - Smart completion UI with receipt upload

## Dependencies Required

```json
{
  "@react-native-community/geolocation": "^3.0.0",
  "react-native-image-picker": "^5.0.0"
}
```

Install with:
```bash
npm install @react-native-community/geolocation react-native-image-picker
cd ios && pod install
```

## Privacy & Permissions

App properly requests permissions with clear explanations:
- **Location:** "This app needs access to your location for smart task completion"
- **Camera:** Native iOS/Android prompts for photo capture
- **Photo Library:** Native access for receipt uploads

All location data stays on device - no server tracking.
