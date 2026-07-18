import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../constants/theme';
import { useSurveys } from '../context/SurveyContext';
import { CustomHeader } from '../components/CustomHeader';

export default function LocationScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { updateDraft, draft } = useSurveys();

  const [coords, setCoords] = useState(draft.location);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const requestAndFetch = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        setLoading(false);
        return;
      }
      setPermissionStatus('granted');

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const newCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy ?? 0),
      };
      setCoords(newCoords);
    } catch {
      Alert.alert('Error', 'Unable to fetch location. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopyToClipboard = async () => {
    if (!coords) return;
    const text = `Lat: ${coords.latitude.toFixed(6)}, Lon: ${coords.longitude.toFixed(6)} (±${coords.accuracy}m)`;
    await Clipboard.setStringAsync(text);
    Alert.alert('✅ Copied!', 'Location coordinates have been copied to clipboard.');
  };

  const handleAttachToSurvey = () => {
    if (!coords) return;
    updateDraft({ location: coords });
    Alert.alert('✅ Attached', 'Location has been attached to your current survey draft.');
  };

  // ----- PERMISSION DENIED -----
  if (permissionStatus === 'denied') {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <CustomHeader title="Location" showBackButton />
        <View style={styles.centeredContent}>
          <View style={[styles.stateIcon, { backgroundColor: themeColors.error + '15' }]}>
            <Ionicons name="location-outline" size={56} color={themeColors.error} />
          </View>
          <Text style={[styles.stateTitle, { color: themeColors.text }]}>Location Access Denied</Text>
          <Text style={[styles.stateText, { color: themeColors.textSecondary }]}>
            Location permission is required to record GPS coordinates for site inspections. Please enable it in your device settings.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: themeColors.primary }, pressed && styles.pressed]}
            onPress={requestAndFetch}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFF" style={{ marginRight: Spacing.xs }} />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ----- INITIAL / NO COORDS YET -----
  if (permissionStatus === 'unknown' && !coords) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <CustomHeader title="Location" showBackButton />
        <View style={styles.centeredContent}>
          <View style={[styles.stateIcon, { backgroundColor: themeColors.primary + '15' }]}>
            <Ionicons name="navigate-circle-outline" size={56} color={themeColors.primary} />
          </View>
          <Text style={[styles.stateTitle, { color: themeColors.text }]}>Fetch Your Location</Text>
          <Text style={[styles.stateText, { color: themeColors.textSecondary }]}>
            Tap the button below to request location access and retrieve your current GPS coordinates.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: themeColors.primary }, pressed && styles.pressed]}
            onPress={requestAndFetch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="location-outline" size={18} color="#FFF" style={{ marginRight: Spacing.xs }} />
                <Text style={styles.primaryButtonText}>Get Current Location</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // ----- LOADING -----
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <CustomHeader title="Location" showBackButton />
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[styles.stateText, { color: themeColors.textSecondary, marginTop: Spacing.md }]}>
            Fetching location...
          </Text>
        </View>
      </View>
    );
  }

  // ----- COORDINATES DISPLAY -----
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="Location" showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Map pin banner */}
        <View style={[styles.banner, { backgroundColor: themeColors.success }]}>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.bannerText}>Location Retrieved Successfully</Text>
        </View>

        {/* Coordinate Cards */}
        <View style={styles.coordsGrid}>
          <CoordCard
            label="Latitude"
            value={coords!.latitude.toFixed(6)}
            icon="locate-outline"
            themeColors={themeColors}
          />
          <CoordCard
            label="Longitude"
            value={coords!.longitude.toFixed(6)}
            icon="globe-outline"
            themeColors={themeColors}
          />
        </View>

        {/* Accuracy Card */}
        <View style={[styles.accuracyCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, Shadows.light]}>
          <View style={[styles.accuracyIconBg, { backgroundColor: themeColors.secondary + '15' }]}>
            <Ionicons name="radio-outline" size={28} color={themeColors.secondary} />
          </View>
          <View style={styles.accuracyInfo}>
            <Text style={[styles.accuracyLabel, { color: themeColors.textSecondary }]}>Accuracy</Text>
            <Text style={[styles.accuracyValue, { color: themeColors.text }]}>±{coords!.accuracy} meters</Text>
          </View>
          <View style={[
            styles.accuracyBadge,
            { backgroundColor: coords!.accuracy < 20 ? themeColors.success + '15' : themeColors.warning + '15' },
          ]}>
            <Text style={[
              styles.accuracyBadgeText,
              { color: coords!.accuracy < 20 ? themeColors.success : themeColors.warning },
            ]}>
              {coords!.accuracy < 20 ? 'High' : 'Medium'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Pressable
            style={({ pressed }) => [styles.actionRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, pressed && styles.pressed]}
            onPress={requestAndFetch}
          >
            <View style={[styles.actionIconBg, { backgroundColor: themeColors.primary + '15' }]}>
              <Ionicons name="refresh-outline" size={22} color={themeColors.primary} />
            </View>
            <Text style={[styles.actionText, { color: themeColors.text }]}>Refresh Location</Text>
            <Ionicons name="chevron-forward" size={18} color={themeColors.textSecondary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, pressed && styles.pressed]}
            onPress={handleCopyToClipboard}
          >
            <View style={[styles.actionIconBg, { backgroundColor: themeColors.secondary + '15' }]}>
              <Ionicons name="copy-outline" size={22} color={themeColors.secondary} />
            </View>
            <Text style={[styles.actionText, { color: themeColors.text }]}>Copy to Clipboard</Text>
            <Ionicons name="chevron-forward" size={18} color={themeColors.textSecondary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, pressed && styles.pressed]}
            onPress={handleAttachToSurvey}
          >
            <View style={[styles.actionIconBg, { backgroundColor: themeColors.success + '15' }]}>
              <Ionicons name="attach-outline" size={22} color={themeColors.success} />
            </View>
            <Text style={[styles.actionText, { color: themeColors.text }]}>Attach to Survey Draft</Text>
            {draft.location && (
              <Ionicons name="checkmark-circle" size={20} color={themeColors.success} />
            )}
            {!draft.location && (
              <Ionicons name="chevron-forward" size={18} color={themeColors.textSecondary} />
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function CoordCard({
  label, value, icon, themeColors,
}: {
  label: string;
  value: string;
  icon: string;
  themeColors: typeof Colors.light;
}) {
  return (
    <View style={[styles.coordCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, Shadows.light]}>
      <Ionicons name={icon as any} size={22} color={themeColors.primary} style={{ marginBottom: Spacing.xs }} />
      <Text style={[styles.coordLabel, { color: themeColors.textSecondary }]}>{label}</Text>
      <Text style={[styles.coordValue, { color: themeColors.text }]}>{value}</Text>
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
  stateIcon: {
    width: 110,
    height: 110,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  stateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    ...Shadows.medium,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  scrollContent: { padding: Spacing.lg },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    marginBottom: Spacing.lg,
  },
  bannerText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },

  coordsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  coordCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  accuracyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  accuracyIconBg: {
    width: 50,
    height: 50,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accuracyInfo: { flex: 1 },
  accuracyLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accuracyValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  accuracyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  accuracyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  actionsSection: { gap: Spacing.sm },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  actionIconBg: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
