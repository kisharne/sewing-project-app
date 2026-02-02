import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Platform, useColorScheme } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from './styles';

const STORAGE_KEY = 'fabric_photos';

export default function FabricLibraryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [photos, setPhotos] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPhotos(parsed);
        }
      }
    } catch (e) {
      console.warn('Error loading photos', e);
    }
  };

  const savePhotos = async (list) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving photos', e);
    }
  };

  const ensurePermissions = async () => {
    try {
      if (!cameraPermission?.granted) {
        const camRes = await requestCameraPermission();
        if (!camRes.granted) return false;
      }
      if (!mediaPermission?.granted) {
        const medRes = await requestMediaPermission();
        if (!medRes.granted) return false;
      }
      return true;
    } catch (e) {
      console.warn('Error requesting permissions', e);
      return false;
    }
  };

  const openCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera not available', 'Camera functionality is only available on iOS and Android devices.');
      return;
    }
    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert('Permissions needed', 'Please enable camera and photos access in settings.');
      return;
    }
    setIsCameraOpen(true);
  };

  const takePicture = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) return;

      // Save to media library so it persists on device (not available on web)
      if (Platform.OS !== 'web') {
        try {
          await MediaLibrary.createAssetAsync(photo.uri);
        } catch (e) {
          console.warn('Could not save to media library', e);
        }
      }

      const updated = [{ uri: photo.uri, createdAt: Date.now() }, ...photos];
      setPhotos(updated);
      savePhotos(updated);
      setIsCameraOpen(false);
    } catch (e) {
      console.warn('Error taking picture', e);
      Alert.alert('Error', 'Could not take picture. Please try again.');
    }
  };

  const renderPhoto = ({ item }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: item.uri }} style={styles.photo} />
    </View>
  );

  const styles = createStyles(isDark);

  if (isCameraOpen && Platform.OS !== 'web') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraOpen(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Fabric Library</Text>
        <TouchableOpacity style={styles.cameraIconButton} onPress={openCamera}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Capture swatches & fabrics from your stash</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
        <Text style={styles.primaryButtonText}>Open Camera</Text>
      </TouchableOpacity>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => item.uri + index}
        renderItem={renderPhoto}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No fabrics yet. Tap "Open Camera" to add one.</Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight,
    paddingTop: 60,
    paddingHorizontal: spacing.md + 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize['3xl'] - 4,
    fontWeight: fontWeight.bold,
    color: isDark ? colors.textDark : colors.textLight,
  },
  cameraIconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.peach,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  cameraIcon: {
    fontSize: fontSize.xl,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: spacing.md,
    color: isDark ? colors.textGray : '#6B7280',
    fontSize: fontSize.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  primaryButtonText: {
    color: isDark ? colors.textLight : colors.textDark,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.base,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.xl + 4,
    overflow: 'hidden',
    backgroundColor: isDark ? colors.cardDark : '#E5E7EB',
    marginBottom: spacing.sm + 4,
    ...shadows.sm,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    color: isDark ? colors.textGray : '#6B7280',
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: spacing.lg,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  closeText: {
    color: colors.textDark,
    fontSize: fontSize.xs,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF',
  },
});