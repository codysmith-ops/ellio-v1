/**
 * Location Permission Manager
 * Enables "Always Allow" background location for geofencing and store proximity alerts
 */

import Geolocation from '@react-native-community/geolocation';
import { Platform, Alert, Linking } from 'react-native';

export const LocationPermissionManager = {
  /**
   * Request "Always Allow" location permission
   * This enables background location tracking for store proximity notifications
   */
  async requestAlwaysPermission(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    return new Promise(resolve => {
      // First request "When In Use" permission
      Geolocation.requestAuthorization();

      // Then upgrade to "Always Allow"
      setTimeout(() => {
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'always',
        });

        // Request again for "Always" permission
        Geolocation.requestAuthorization();

        resolve(true);
      }, 1000);
    });
  },

  /**
   * Check current location permission status
   */
  async checkPermission(): Promise<'denied' | 'whenInUse' | 'always'> {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        () => {
          // Permission granted (at least "When In Use")
          // Note: Can't distinguish between "When In Use" and "Always" programmatically
          // User must check Settings app
          resolve('whenInUse');
        },
        error => {
          if (error.code === 1) {
            resolve('denied');
          } else {
            resolve('whenInUse');
          }
        }
      );
    });
  },

  /**
   * Prompt user to enable "Always Allow" in Settings
   */
  async promptForAlwaysPermission(): Promise<void> {
    const status = await this.checkPermission();

    if (status === 'denied') {
      Alert.alert(
        'Location Permission Required',
        'Please enable location access in Settings to get notified about nearby stores and deals.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    } else {
      Alert.alert(
        'Enable Background Location',
        "To get notified about deals when you're near stores, please:\n\n" +
          '1. Go to Settings > Privacy > Location Services\n' +
          '2. Find "Mobile Todo List"\n' +
          '3. Select "Always"\n\n' +
          'This lets us notify you about stores on your list even when the app is closed.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  },

  /**
   * Start monitoring significant location changes (battery efficient)
   * Only works with "Always" permission
   */
  startBackgroundLocationTracking(): void {
    // This will only work if user has granted "Always" permission
    Geolocation.watchPosition(
      position => {
        console.log('📍 Background location update:', position.coords);
        // Trigger store proximity checks here
      },
      error => {
        console.error('Background location error:', error);
      },
      {
        enableHighAccuracy: false, // Battery efficient
        distanceFilter: 100, // Only update every 100 meters
        interval: 300000, // Check every 5 minutes
        fastestInterval: 60000, // But no faster than 1 minute
      }
    );
  },
};

// Usage in your app:
/*
// On first launch or in settings
import { LocationPermissionManager } from './services/locationPermissionManager';

// Request "Always" permission
await LocationPermissionManager.requestAlwaysPermission();

// Later, prompt user to upgrade to "Always" if needed
await LocationPermissionManager.promptForAlwaysPermission();

// Start background tracking (geofencing)
LocationPermissionManager.startBackgroundLocationTracking();
*/
