// Module 3: Camera — Permission, Capture, Preview, Timestamp, Retake, Delete with Confirmation, Loading Indicator
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../constants/theme';
import { useSurveys } from '../context/SurveyContext';
import { CustomHeader } from '../components/CustomHeader';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { updateDraft, draft } = useSurveys();

  const [permission, requestPermission] = useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedUri, setCapturedUri] = useState<string | null>(draft.photoUri);
  const [captureTime, setCaptureTime] = useState<string | null>(draft.photoTimestamp);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // Once the camera is mounted, mark loading as done
  const onCameraReady = () => setIsLoading(false);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setIsSaving(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      if (photo) {
        const timestamp = new Date().toLocaleString();
        setCapturedUri(photo.uri);
        setCaptureTime(timestamp);

        // Save to gallery immediately while the URI is fresh
        try {
          let hasPermission = libraryPermission?.granted;
          if (!hasPermission) {
            const req = await requestLibraryPermission();
            hasPermission = req.granted;
          }
          if (hasPermission) {
            await MediaLibrary.createAssetAsync(photo.uri);
            // Show a brief non-blocking toast-style confirmation
            Alert.alert('📸 Photo Saved', 'Photo saved to your gallery automatically.');
          }
        } catch (galleryErr) {
          // Gallery save failed silently — photo still available in draft
          console.log('Gallery save error:', galleryErr);
        }
      }
    } catch {
      Alert.alert('Capture Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
    setCaptureTime(null);
    setIsLoading(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCapturedUri(null);
            setCaptureTime(null);
            // Clear from draft too
            updateDraft({ photoUri: null, photoTimestamp: null });
          },
        },
      ]
    );
  };

  const handleSaveAndGoBack = () => {
    // Just attach the URI to the draft and go back
    // Gallery save already happened at capture time
    updateDraft({ photoUri: capturedUri, photoTimestamp: captureTime });
    router.back();
  };

  // --- Permission not yet determined ---
  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <CustomHeader title="Camera" showBackButton />
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
            Checking permissions...
          </Text>
        </View>
      </View>
    );
  }

  // --- Permission denied ---
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <CustomHeader title="Camera" showBackButton />
        <View style={styles.centeredContent}>
          <View style={[styles.permissionIcon, { backgroundColor: themeColors.error + '15' }]}>
            <Ionicons name="camera-outline" size={56} color={themeColors.error} />
          </View>
          <Text style={[styles.permissionTitle, { color: themeColors.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: themeColors.textSecondary }]}>
            This app needs camera access to capture site inspection photos. Please grant permission to continue.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.permissionButton,
              { backgroundColor: themeColors.primary },
              pressed && styles.pressed,
            ]}
            onPress={requestPermission}
          >
            <Ionicons name="camera-outline" size={20} color="#FFF" style={{ marginRight: Spacing.sm }} />
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Photo preview mode ---
  if (capturedUri) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <CustomHeader title="Photo Preview" showBackButton />
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="contain" />

          {captureTime && (
            <View style={styles.timestampBadge}>
              <Ionicons name="time-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.timestampText}>Captured: {captureTime}</Text>
            </View>
          )}
        </View>

        <View style={[styles.previewActions, { backgroundColor: themeColors.surface }]}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: themeColors.error + '15', borderColor: themeColors.error },
              pressed && styles.pressed,
            ]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={22} color={themeColors.error} />
            <Text style={[styles.actionButtonText, { color: themeColors.error }]}>Delete</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: themeColors.secondary + '15', borderColor: themeColors.secondary },
              pressed && styles.pressed,
            ]}
            onPress={handleRetake}
          >
            <Ionicons name="refresh-outline" size={22} color={themeColors.secondary} />
            <Text style={[styles.actionButtonText, { color: themeColors.secondary }]}>Retake</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionButtonPrimary,
              { backgroundColor: themeColors.primary },
              pressed && styles.pressed,
            ]}
            onPress={handleSaveAndGoBack}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
            <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Use Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Live Camera View ---
  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <CustomHeader title="Camera" showBackButton />

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={onCameraReady}
        >
          {/* Loading overlay while camera initializes */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingOverlayText}>Initializing camera...</Text>
            </View>
          )}

          {/* Top controls */}
          <View style={styles.topControls}>
            <Pressable
              style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="#FFF" />
            </Pressable>
          </View>
        </CameraView>

        {/* Capture Button */}
        <View style={[styles.captureBar, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.captureHint, { color: themeColors.textSecondary }]}>
            {isSaving ? 'Saving to gallery…' : 'Tap to capture site photo'}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.captureButton,
              { borderColor: isSaving ? themeColors.textSecondary : themeColors.primary },
              pressed && styles.pressed,
            ]}
            onPress={handleCapture}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={themeColors.primary} />
            ) : (
              <View style={[styles.captureInner, { backgroundColor: themeColors.primary }]} />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
  },
  permissionIcon: {
    width: 110,
    height: 110,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  permissionText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    ...Shadows.medium,
  },
  permissionButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    color: '#FFF',
    marginTop: Spacing.md,
    fontSize: 14,
  },
  topControls: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: Radii.round,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBar: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  captureHint: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: Radii.round,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: Radii.round,
  },

  // Preview
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
  },
  timestampBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
  },
  timestampText: {
    color: '#FFF',
    fontSize: 13,
  },
  previewActions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  actionButtonPrimary: {
    borderWidth: 0,
    ...Shadows.medium,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
});
