import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../../constants/theme';
import { STUDENT_DETAILS } from '../../constants/config';
import { useSurveys, Survey } from '../../context/SurveyContext';
import { CustomHeader } from '../../components/CustomHeader';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { surveys } = useSurveys();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const todayString = new Date().toDateString();
  const todaySurveys = surveys.filter(
    (s) => new Date(s.date).toDateString() === todayString
  );
  const todayCount = todaySurveys.length;
  const recentSurveys = surveys.slice(0, 5);

  const quickActions = [
    {
      title: 'New Survey',
      icon: 'create',
      color: themeColors.primary,
      bgColor: themeColors.primary + '10',
      route: '/(tabs)/new-survey',
      description: 'Start survey draft',
    },
    {
      title: 'Camera Capture',
      icon: 'camera',
      color: themeColors.secondary,
      bgColor: themeColors.secondary + '10',
      route: '/camera',
      description: 'Capture site photos',
    },
    {
      title: 'GPS Location',
      icon: 'location',
      color: themeColors.success,
      bgColor: themeColors.success + '10',
      route: '/location',
      description: 'Pin coordinates',
    },
    {
      title: 'Contacts List',
      icon: 'people',
      color: themeColors.accent,
      bgColor: themeColors.accent + '10',
      route: '/contacts',
      description: 'Associate contact',
    },
  ];

  const renderSurveyItem = ({ item }: { item: Survey }) => {
    const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'High':
          return themeColors.error;
        case 'Medium':
          return themeColors.warning;
        default:
          return themeColors.success;
      }
    };

    const prColor = getPriorityColor(item.priority);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.recentItem,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            borderLeftColor: prColor,
          },
          pressed && styles.pressed,
          Shadows.light,
        ]}
        onPress={() => router.push({ pathname: '/preview', params: { id: item.id } })}
      >
        <View style={styles.recentItemMain}>
          <View style={styles.recentItemHeader}>
            <Text style={[styles.recentItemTitle, { color: themeColors.text }]} numberOfLines={1}>
              {item.siteName}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: prColor + '15' }]}>
              <Text style={[styles.priorityBadgeText, { color: prColor }]}>
                {item.priority}
              </Text>
            </View>
          </View>

          <Text style={[styles.recentItemSubtitle, { color: themeColors.textSecondary }]} numberOfLines={1}>
            Client: {item.clientName}
          </Text>

          <View style={styles.recentItemFooter}>
            <View style={styles.footerInfoItem}>
              <Ionicons name="calendar-outline" size={13} color={themeColors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.recentItemDate, { color: themeColors.textSecondary }]}>
                {formattedDate}
              </Text>
            </View>
            <View style={styles.attachmentIcons}>
              {item.photoUri && <Ionicons name="camera-outline" size={12} color={themeColors.textSecondary} style={styles.miniIcon} />}
              {item.location && <Ionicons name="location-outline" size={12} color={themeColors.textSecondary} style={styles.miniIcon} />}
              {item.contact && <Ionicons name="person-outline" size={12} color={themeColors.textSecondary} style={styles.miniIcon} />}
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={themeColors.border} style={styles.chevron} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="Dashboard" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Section with geometric art */}
        <View style={[styles.welcomeBanner, { backgroundColor: themeColors.primary }]}>
          <View style={styles.bannerCircle1} />
          <View style={styles.bannerCircle2} />
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.welcomeTitle}>Smart Field Inspector</Text>
          <Text style={styles.welcomeSubtitle}>Optimize site surveys & logs with offline sync</Text>
        </View>

        {/* Inspector Profile Badge Card */}
        <View style={[styles.card, { backgroundColor: themeColors.surface, borderLeftColor: themeColors.primary }, Shadows.medium]}>
          <View style={styles.badgeHeader}>
            <Text style={[styles.badgeLabel, { color: themeColors.primary }]}>FIELD REPRESENTATIVE</Text>
            <View style={[styles.statusIndicator, { backgroundColor: themeColors.success }]}>
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <View style={[styles.avatar, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.avatarText}>
                {STUDENT_DETAILS.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.inspectorName, { color: themeColors.text }]}>
                {STUDENT_DETAILS.name}
              </Text>
              <Text style={[styles.inspectorSub, { color: themeColors.textSecondary }]}>
                {STUDENT_DETAILS.course}
              </Text>
              <View style={[styles.batchBadge, { backgroundColor: themeColors.background }]}>
                <Ionicons name="ribbon-outline" size={12} color={themeColors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.batchText, { color: themeColors.text }]}>{STUDENT_DETAILS.batch}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section - Side-by-Side Widgets */}
        <View style={styles.statsRow}>
          <View style={[styles.statHalfCard, { backgroundColor: themeColors.surface }, Shadows.light]}>
            <View style={[styles.statIconWrapper, { backgroundColor: themeColors.primary + '15' }]}>
              <Ionicons name="today" size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{todayCount}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>{"Today's Surveys"}</Text>
          </View>

          <View style={[styles.statHalfCard, { backgroundColor: themeColors.surface }, Shadows.light]}>
            <View style={[styles.statIconWrapper, { backgroundColor: themeColors.secondary + '15' }]}>
              <Ionicons name="checkmark-done-circle" size={20} color={themeColors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>{"Total Completed"}</Text>
          </View>
        </View>

        {/* Quick Actions Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Inspection Tools</Text>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.grid}>
          {quickActions.map((action, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.gridItem,
                { backgroundColor: themeColors.surface, borderColor: themeColors.border },
                pressed && styles.pressed,
                Shadows.light,
              ]}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={[styles.gridText, { color: themeColors.text }]}>{action.title}</Text>
              <Text style={[styles.gridSubText, { color: themeColors.textSecondary }]}>{action.description}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Survey List Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recent Inspections</Text>
          {surveys.length > 0 && (
            <Pressable onPress={() => router.push('/(tabs)/history')}>
              <Text style={[styles.seeAllText, { color: themeColors.primary }]}>View History</Text>
            </Pressable>
          )}
        </View>

        {surveys.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: themeColors.surface }, Shadows.light]}>
            <Ionicons name="reader-outline" size={42} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>No site surveys logged</Text>
            <Text style={[styles.emptySubText, { color: themeColors.textSecondary }]}>
              {"Your completed reports will appear here. Press 'New Survey' below to start logging."}
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: Spacing.xl }}>
            {recentSurveys.map((survey) => (
              <View key={survey.id} style={{ marginBottom: Spacing.sm }}>
                {renderSurveyItem({ item: survey })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: Spacing.lg,
  },
  welcomeBanner: {
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerCircle1: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    top: -50,
    right: -40,
  },
  bannerCircle2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    position: 'absolute',
    bottom: -30,
    left: -20,
  },
  greetingText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  welcomeTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: Spacing.xs,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  statusText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  inspectorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  inspectorSub: {
    fontSize: 12,
    marginTop: 2,
  },
  batchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.sm,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  batchText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statHalfCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    alignItems: 'flex-start',
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  gridItem: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '700',
  },
  gridSubText: {
    fontSize: 10,
    marginTop: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  recentItemMain: {
    flex: 1,
  },
  recentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: Spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  recentItemSubtitle: {
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  recentItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemDate: {
    fontSize: 11,
  },
  attachmentIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniIcon: {
    marginLeft: 2,
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
