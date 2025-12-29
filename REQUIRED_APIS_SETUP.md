# 🔑 Required APIs for All Features to Work

**Status:** ⚠️ Some APIs need activation/setup

---

## ✅ ALREADY WORKING

### 1. **Google Cloud Platform APIs** ✅
- **API Key:** `AIzaSyBjUAX6pdmEFszdVa9F1lVM3qRDdODgNc0`
- **Project:** mobile-todo-20251226
- **Credit:** $300 available
- **Status:** All 10 APIs enabled ✅

**Enabled APIs:**
1. ✅ Places API (store discovery)
2. ✅ Cloud Vision API (image/barcode recognition) 
3. ✅ Maps JavaScript API
4. ✅ Geocoding API
5. ✅ Directions API
6. ✅ Distance Matrix API
7. ✅ Cloud Translation API
8. ✅ Speech-to-Text API
9. ✅ Text-to-Speech API
10. ✅ Natural Language API

### 2. **Open Food Facts** ✅
- **Status:** FREE, no key required
- **Purpose:** Barcode product lookup
- **Usage:** Automatic fallback for barcodes

### 3. **Spoonacular** ✅
- **API Key:** `4fcc3f1ef4524925b3ffec66bde00849`
- **Free tier:** 150 requests/day
- **Purpose:** Recipe suggestions

### 4. **OpenWeather** ✅
- **API Key:** `e1332536c1064ef398dbe21f3edb3fb5`
- **Free tier:** 1000 requests/day
- **Purpose:** Weather-based suggestions

---

## ⚠️ ISSUES TO FIX

### 🔴 CRITICAL: Barcode Scanner Not Working

**Problem:** Google Cloud Vision API isn't properly processing images

**Root Cause:** The image needs to be base64 encoded before sending to API

**Solution:** Update productRecognition.ts to properly encode images

**Required Actions:**
1. ✅ API key is configured in .env
2. ❌ Image encoding needs fix (see below)
3. ❌ Need to install `react-native-fs` for file reading

**Install Required Package:**
```bash
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
npm install react-native-fs
cd ios && pod install
```

---

## 🔧 FIXES NEEDED

### Fix #1: Enable Image Recognition

The barcode scanner needs these changes:

1. **Install react-native-fs:**
```bash
npm install react-native-fs
cd ios && pod install
```

2. **Update productRecognition.ts** (automatically fixed below)

3. **Test the camera:**
```typescript
// In your camera component
import { recognizeProductFromImage } from './services/productRecognition';

const result = await recognizeProductFromImage(photoUri);
if (result) {
  console.log('Product:', result.product.name);
  console.log('Brand:', result.product.brand);
  console.log('Stores:', result.stores);
}
```

### Fix #2: Location "Always Allow" Already Works! ✅

**Good news:** Your Info.plist already has:
- ✅ `NSLocationAlwaysAndWhenInUseUsageDescription`
- ✅ `NSLocationAlwaysUsageDescription`
- ✅ `NSLocationWhenInUseUsageDescription`

**To enable background location:**

1. **Open Xcode:**
```bash
open ios/MobileTodoList.xcworkspace
```

2. **Select MobileTodoList target → Signing & Capabilities**

3. **Add Background Modes capability:**
   - Click "+ Capability"
   - Search for "Background Modes"
   - Add it
   - Check boxes:
     - ✅ Location updates
     - ✅ Background fetch
     - ✅ Remote notifications (already enabled)

4. **Request permission in app:**
```typescript
import Geolocation from '@react-native-community/geolocation';

// Request "Always" permission
Geolocation.requestAuthorization('always');
```

---

## 📦 OPTIONAL BUT RECOMMENDED

### UPC Database API (Better Product Recognition)

**Current:** Using free tier (limited)

**Upgrade Options:**
1. **Free Tier:** 100 requests/day (current)
2. **Developer:** $9.99/month - 10,000 requests/month
3. **Professional:** $49.99/month - 100,000 requests/month

**Sign up:** https://www.upcitemdb.com/api

**Add to .env:**
```bash
UPC_DATABASE_API_KEY=your_key_here
```

### Stripe/PayPal (In-App Payments)

**Current:** Keys configured in .env ✅

**Status:** Ready to use, just need to activate:

1. **Stripe:** https://dashboard.stripe.com/apikeys
   - Get your publishable key
   - Update .env

2. **PayPal:** https://developer.paypal.com/dashboard/
   - Create app
   - Get client ID
   - Update .env

---

## 🚀 PRIORITY FIXES (Do These Now)

### High Priority

1. **Fix Barcode/Image Recognition** ⚠️
   - Install react-native-fs
   - Update productRecognition.ts (code provided below)
   - Test camera → should show brand names

2. **Enable Background Location** ⚠️
   - Add Background Modes in Xcode
   - Test "Always Allow" permission prompt

3. **Test All APIs** ⚠️
   - Run app and test each feature
   - Check console for API errors

### Medium Priority

4. **Get UPC Database API Key**
   - Better product recognition
   - More accurate brand names

5. **Activate Stripe/PayPal**
   - Enable in-app purchases
   - Premium features

---

## 🧪 TESTING CHECKLIST

After fixes, test these features:

- [ ] Camera scan → barcode detected
- [ ] Camera scan → brand name shown
- [ ] Camera scan → product category shown
- [ ] Location "Always Allow" option appears
- [ ] Background location works (notifications near stores)
- [ ] Store discovery finds nearby stores
- [ ] Recipe suggestions work
- [ ] Weather suggestions work
- [ ] Voice input works
- [ ] Siri shortcuts work

---

## 📝 SUMMARY

**What's Working:** ✅
- Google Cloud APIs (all 10 enabled)
- Location permissions (configured)
- Recipe API (Spoonacular)
- Weather API (OpenWeather)
- Open Food Facts (barcode lookup)

**What Needs Fixing:** ⚠️
1. Install react-native-fs for image processing
2. Fix productRecognition.ts image encoding
3. Add Background Modes in Xcode
4. Request "always" location permission in code

**What's Optional:** 💡
- UPC Database paid tier (better accuracy)
- Stripe/PayPal activation (payments)

**Next Steps:**
1. Run the fix commands below
2. Test camera scanning
3. Enable background modes in Xcode
4. Test all features

