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

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  // Calculate today's survey count
  const todayString = new Date().toDateString();
  const todaySurveys = surveys.filter(
    (s) => new Date(s.date).toDateString() === todayString
  );
  const todayCount = todaySurveys.length;

  const recentSurveys = surveys.slice(0, 5);

  const quickActions = [
    {
      title: 'New Survey',
      icon: 'create-sharp',
      color: themeColors.primary,
      route: '/(tabs)/new-survey',
    },
    {
      title: 'Camera',
      icon: 'camera-sharp',
      color: themeColors.secondary,
      route: '/camera',
    },
    {
      title: 'Location',
      icon: 'location-sharp',
      color: themeColors.success,
      route: '/location',
    },
    {
      title: 'Contacts',
      icon: 'people-sharp',
      color: themeColors.accent,
      route: '/contacts',
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

    return (
      <Pressable
        style={({ pressed }) => [
          styles.recentItem,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
          pressed && styles.pressed,
        ]}
        onPress={() => router.push({ pathname: '/preview', params: { id: item.id } })}
      >
        <View style={styles.recentItemHeader}>
          <Text style={[styles.recentItemTitle, { color: themeColors.text }]} numberOfLines={1}>
            {item.siteName}
          </Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) + '15' },
            ]}
          >
            <Text style={[styles.priorityBadgeText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <Text style={[styles.recentItemSubtitle, { color: themeColors.textSecondary }]} numberOfLines={1}>
          Client: {item.clientName}
        </Text>

        <View style={styles.recentItemFooter}>
          <Ionicons name="calendar-outline" size={14} color={themeColors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[styles.recentItemDate, { color: themeColors.textSecondary }]}>
            {formattedDate}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="Dashboard" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={[styles.welcomeBanner, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.welcomeTitle}>Smart Field Inspector</Text>
          <Text style={styles.welcomeSubtitle}>Simplify your site survey workflow</Text>
        </View>

        {/* Student Profile Card */}
        <View style={[styles.card, { backgroundColor: themeColors.surface }, Shadows.light]}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={24} color={themeColors.primary} />
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>Inspector Profile</Text>
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
              <Text style={[styles.inspectorSub, { color: themeColors.textSecondary }]}>
                {STUDENT_DETAILS.batch}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsCard, { backgroundColor: themeColors.surface }, Shadows.light]}>
          <View style={styles.statLeft}>
            <Text style={[styles.statValue, { color: themeColors.primary }]}>{todayCount}</Text>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>{"Today's Surveys"}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.statRight}>
            <Text style={[styles.statValue, { color: themeColors.secondary }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>Total Completed</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Actions</Text>
        </View>
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
              <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={[styles.gridText, { color: themeColors.text }]}>{action.title}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Survey List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recent Surveys</Text>
          {surveys.length > 0 && (
            <Pressable onPress={() => router.push('/(tabs)/history')}>
              <Text style={[styles.seeAllText, { color: themeColors.primary }]}>See All</Text>
            </Pressable>
          )}
        </View>

        {surveys.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: themeColors.surface }, Shadows.light]}>
            <Ionicons name="document-text-outline" size={48} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>No surveys completed yet</Text>
            <Text style={[styles.emptySubText, { color: themeColors.textSecondary }]}>
              Start a new survey inspection from the quick actions above or the tabs below!
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
  },
  greetingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  welcomeTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: Spacing.xs,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
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
  statsCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statLeft: {
    flex: 1,
    alignItems: 'center',
  },
  statRight: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
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
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentItem: {
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  recentItemSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  recentItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemDate: {
    fontSize: 11,
  },
  emptyContainer: {
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
