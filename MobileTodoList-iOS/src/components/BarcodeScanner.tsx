import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ visible, onClose, onScan }) => {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeRead = ({ data }: { data: string }) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    console.log('📊 Barcode scanned:', data);
    onScan(data);
    setTimeout(() => {
      setScanned(false);
      onClose();
    }, 500);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <RNCamera
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={handleBarCodeRead}
          barCodeTypes={[
            RNCamera.Constants.BarCodeType.ean13,
            RNCamera.Constants.BarCodeType.ean8,
            RNCamera.Constants.BarCodeType.upc_e,
            RNCamera.Constants.BarCodeType.code128,
            RNCamera.Constants.BarCodeType.code39,
            RNCamera.Constants.BarCodeType.qr,
          ]}
          captureAudio={false}
        >
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            <View style={styles.middleRow}>
              <View style={styles.sideOverlay} />
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay}>
              <Text style={styles.instructionText}>Position barcode within frame</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RNCamera>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: EllioColors.primary.main,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: EllioSpacing.xl,
  },
  instructionText: {
    ...EllioTypography.body,
    color: '#fff',
    marginBottom: EllioSpacing.xl,
  },
  closeButton: {
    backgroundColor: EllioColors.primary.main,
    paddingHorizontal: EllioSpacing.xl,
    paddingVertical: EllioSpacing.md,
    borderRadius: EllioRadius.large,
  },
  closeButtonText: {
    ...EllioTypography.bodyBold,
    color: '#fff',
  },
});
