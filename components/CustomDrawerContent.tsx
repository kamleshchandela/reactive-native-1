import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../constants/theme';
import { STUDENT_DETAILS } from '../constants/config';
import { useSurveys } from '../context/SurveyContext';

export const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { surveys } = useSurveys();

  // Helper to determine if a route is active
  const isActive = (route: string) => {
    if (route === '/(tabs)' || route === '/') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/index';
    }
    return pathname.startsWith(route);
  };

  const getIconColor = (route: string) => {
    return isActive(route) ? themeColors.primary : themeColors.textSecondary;
  };

  const getStyleActive = (route: string) => {
    return isActive(route)
      ? { backgroundColor: themeColors.primary + '15' } // 15 is hex opacity (approx 8%)
      : undefined;
  };

  const getLabelStyleActive = (route: string) => {
    return isActive(route)
      ? { color: themeColors.primary, fontWeight: '700' as const }
      : { color: themeColors.text, fontWeight: '500' as const };
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
      {/* Header Profile Section */}
      <View
        style={[
          styles.profileSection,
          {
            paddingTop: insets.top + Spacing.md,
            backgroundColor: themeColors.primary + '10',
            borderBottomColor: themeColors.border,
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.avatarText}>
            {STUDENT_DETAILS.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
        <Text style={[styles.name, { color: themeColors.text }]}>
          {STUDENT_DETAILS.name}
        </Text>
        <Text style={[styles.email, { color: themeColors.textSecondary }]}>
          {STUDENT_DETAILS.email}
        </Text>
        <View style={[styles.badge, { backgroundColor: themeColors.secondary }]}>
          <Text style={styles.badgeText}>{STUDENT_DETAILS.batch}</Text>
        </View>
      </View>

      {/* Navigation Items ScrollView */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: Spacing.sm }}
      >
        <DrawerItem
          label="Dashboard"
          icon={({ size }) => (
            <Ionicons name="grid-outline" size={size} color={getIconColor('/(tabs)')} />
          )}
          focused={isActive('/(tabs)') && (pathname === '/' || pathname === '/(tabs)')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/(tabs)')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/(tabs)')]}
          onPress={() => router.push('/(tabs)')}
        />

        <DrawerItem
          label="New Survey"
          icon={({ size }) => (
            <Ionicons name="create-outline" size={size} color={getIconColor('/(tabs)/new-survey')} />
          )}
          focused={isActive('/(tabs)/new-survey')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/(tabs)/new-survey')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/(tabs)/new-survey')]}
          onPress={() => router.push('/(tabs)/new-survey')}
        />

        <DrawerItem
          label="Survey History"
          icon={({ size }) => (
            <Ionicons name="time-outline" size={size} color={getIconColor('/(tabs)/history')} />
          )}
          focused={isActive('/(tabs)/history')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/(tabs)/history')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/(tabs)/history')]}
          onPress={() => router.push('/(tabs)/history')}
        />

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
        <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>
          EXPO UTILITIES
        </Text>

        <DrawerItem
          label="Camera"
          icon={({ size }) => (
            <Ionicons name="camera-outline" size={size} color={getIconColor('/camera')} />
          )}
          focused={isActive('/camera')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/camera')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/camera')]}
          onPress={() => router.push('/camera')}
        />

        <DrawerItem
          label="Contacts"
          icon={({ size }) => (
            <Ionicons name="people-outline" size={size} color={getIconColor('/contacts')} />
          )}
          focused={isActive('/contacts')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/contacts')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/contacts')]}
          onPress={() => router.push('/contacts')}
        />

        <DrawerItem
          label="Location"
          icon={({ size }) => (
            <Ionicons name="location-outline" size={size} color={getIconColor('/location')} />
          )}
          focused={isActive('/location')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/location')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/location')]}
          onPress={() => router.push('/location')}
        />

        <DrawerItem
          label="Clipboard"
          icon={({ size }) => (
            <Ionicons name="clipboard-outline" size={size} color={getIconColor('/clipboard')} />
          )}
          focused={isActive('/clipboard')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/clipboard')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/clipboard')]}
          onPress={() => router.push('/clipboard')}
        />

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        <DrawerItem
          label="Settings"
          icon={({ size }) => (
            <Ionicons name="settings-outline" size={size} color={getIconColor('/settings')} />
          )}
          focused={isActive('/settings')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/settings')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/settings')]}
          onPress={() => router.push('/settings')}
        />
      </DrawerContentScrollView>

      {/* Footer Info */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: themeColors.border,
          },
        ]}
      >
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          Survey Inspection App v1.0.0
        </Text>
        <Text style={[styles.footerSubText, { color: themeColors.textSecondary }]}>
          Total Surveys: {surveys.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.light,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  drawerItem: {
    marginHorizontal: Spacing.md,
    marginVertical: 2,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.xs,
  },
  drawerItemLabel: {
    fontSize: 14,
    marginLeft: -Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: Spacing.lg,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
