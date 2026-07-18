import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors, Spacing, Radii } from '../constants/theme';
import { STUDENT_DETAILS } from '../constants/config';
import { useSurveys } from '../context/SurveyContext';

export const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { surveys } = useSurveys();

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
      ? {
          backgroundColor: themeColors.primary + '10',
          borderLeftColor: themeColors.primary,
          borderLeftWidth: 4,
        }
      : {
          borderLeftColor: 'transparent',
          borderLeftWidth: 4,
        };
  };

  const getLabelStyleActive = (route: string) => {
    return isActive(route)
      ? { color: themeColors.primary, fontWeight: '800' as const }
      : { color: themeColors.text, fontWeight: '600' as const };
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
      {/* Header Profile Section with Designer Backdrop */}
      <View
        style={[
          styles.profileSection,
          {
            paddingTop: insets.top + Spacing.lg,
            backgroundColor: themeColors.primary,
            borderBottomColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.headerMesh1} />
        <View style={styles.headerMesh2} />
        
        <View style={styles.profileContent}>
          <View style={styles.avatarRing}>
            <View style={[styles.avatar, { backgroundColor: '#FFF' }]}>
              <Text style={[styles.avatarText, { color: themeColors.primary }]}>
                {STUDENT_DETAILS.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
          </View>
          <View style={styles.profileTextWrapper}>
            <Text style={styles.name} numberOfLines={1}>
              {STUDENT_DETAILS.name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {STUDENT_DETAILS.email}
            </Text>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={10} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>{STUDENT_DETAILS.batch}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Navigation Items ScrollView */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>
          CORE PAGES
        </Text>

        <DrawerItem
          label="Dashboard"
          icon={({ size }) => (
            <Ionicons name="grid" size={18} color={getIconColor('/(tabs)')} />
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
            <Ionicons name="create" size={18} color={getIconColor('/(tabs)/new-survey')} />
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
            <Ionicons name="time" size={18} color={getIconColor('/(tabs)/history')} />
          )}
          focused={isActive('/(tabs)/history')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/(tabs)/history')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/(tabs)/history')]}
          onPress={() => router.push('/(tabs)/history')}
        />

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
        <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>
          HARDWARE INTEGRATION
        </Text>

        <DrawerItem
          label="Camera Tool"
          icon={({ size }) => (
            <Ionicons name="camera" size={18} color={getIconColor('/camera')} />
          )}
          focused={isActive('/camera')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/camera')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/camera')]}
          onPress={() => router.push('/camera')}
        />

        <DrawerItem
          label="Contacts Utility"
          icon={({ size }) => (
            <Ionicons name="people" size={18} color={getIconColor('/contacts')} />
          )}
          focused={isActive('/contacts')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/contacts')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/contacts')]}
          onPress={() => router.push('/contacts')}
        />

        <DrawerItem
          label="GPS Location"
          icon={({ size }) => (
            <Ionicons name="location" size={18} color={getIconColor('/location')} />
          )}
          focused={isActive('/location')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/location')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/location')]}
          onPress={() => router.push('/location')}
        />

        <DrawerItem
          label="Clipboard Actions"
          icon={({ size }) => (
            <Ionicons name="clipboard" size={18} color={getIconColor('/clipboard')} />
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
            <Ionicons name="settings" size={18} color={getIconColor('/settings')} />
          )}
          focused={isActive('/settings')}
          activeTintColor={themeColors.primary}
          style={[styles.drawerItem, getStyleActive('/settings')]}
          labelStyle={[styles.drawerItemLabel, getLabelStyleActive('/settings')]}
          onPress={() => router.push('/settings')}
        />
      </DrawerContentScrollView>

      {/* Cloud Sync Status Info Footer */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: themeColors.border,
          },
        ]}
      >
        <View style={[styles.syncStatusCard, { backgroundColor: themeColors.background }]}>
          <View style={[styles.pulseDot, { backgroundColor: themeColors.success }]} />
          <View>
            <Text style={[styles.syncTitle, { color: themeColors.text }]}>Database Active</Text>
            <Text style={[styles.syncDesc, { color: themeColors.textSecondary }]}>
              {surveys.length} survey records saved
            </Text>
          </View>
        </View>
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          Field App © 2026
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
    borderBottomWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  headerMesh1: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    position: 'absolute',
    top: -40,
    right: -30,
  },
  headerMesh2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'absolute',
    bottom: -30,
    left: -20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 18,
  },
  profileTextWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  drawerItem: {
    marginHorizontal: Spacing.sm,
    marginVertical: 1,
    borderRadius: Radii.md,
    paddingLeft: Spacing.xs,
  },
  drawerItemLabel: {
    fontSize: 13,
    marginLeft: -Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: '800',
    marginLeft: Spacing.lg,
    marginBottom: Spacing.xs,
    letterSpacing: 1.2,
    marginTop: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  syncStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radii.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  syncTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  syncDesc: {
    fontSize: 10,
    marginTop: 1,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
