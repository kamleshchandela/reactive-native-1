// Module 8: Survey History — FlatList List, View Details Redirect, Live Search, Priority Filter chips, Delete Survey with Alert confirmation
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../../constants/theme';
import { useSurveys, Survey } from '../../context/SurveyContext';
import { CustomHeader } from '../../components/CustomHeader';

type PriorityFilter = 'All' | 'Low' | 'Medium' | 'High';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { surveys, deleteSurvey } = useSurveys();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');

  const filters: PriorityFilter[] = ['All', 'Low', 'Medium', 'High'];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return themeColors.error;
      case 'Medium': return themeColors.warning;
      default: return themeColors.success;
    }
  };

  // Filter surveys by search and priority
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || s.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleDelete = (survey: Survey) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete the survey for "${survey.siteName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSurvey(survey.id),
        },
      ]
    );
  };

  const renderSurveyItem = ({ item }: { item: Survey }) => {
    const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const prColor = getPriorityColor(item.priority);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            borderLeftColor: prColor,
          },
          pressed && styles.pressed,
        ]}
        onPress={() => router.push({ pathname: '/preview', params: { id: item.id } })}
      >
        {/* Top row */}
        <View style={styles.cardTop}>
          <Text style={[styles.siteName, { color: themeColors.text }]} numberOfLines={1}>
            {item.siteName}
          </Text>
          <View style={[styles.priorityPill, { backgroundColor: prColor + '15' }]}>
            <Text style={[styles.priorityText, { color: prColor }]}>{item.priority}</Text>
          </View>
        </View>

        {/* Client */}
        <Text style={[styles.clientName, { color: themeColors.textSecondary }]} numberOfLines={1}>
          Client: {item.clientName}
        </Text>

        {/* Attachments row */}
        <View style={styles.attachments}>
          {item.photoUri && <AttachChip icon="camera" color={themeColors.secondary} />}
          {item.location && <AttachChip icon="location" color={themeColors.success} />}
          {item.contact && <AttachChip icon="people" color={themeColors.accent} />}
          {item.notes && <AttachChip icon="document-text" color={themeColors.primary} />}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={13} color={themeColors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={[styles.dateText, { color: themeColors.textSecondary }]}>{formattedDate}</Text>
          </View>
          <View style={styles.cardActions}>
            <Pressable
              style={({ pressed }) => [
                styles.cardActionButton,
                { backgroundColor: themeColors.primary + '15' },
                pressed && styles.pressed,
              ]}
              onPress={() => router.push({ pathname: '/preview', params: { id: item.id } })}
            >
              <Ionicons name="eye-outline" size={16} color={themeColors.primary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.cardActionButton,
                { backgroundColor: themeColors.error + '15' },
                pressed && styles.pressed,
              ]}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={16} color={themeColors.error} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="Survey History" />

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Ionicons name="search-outline" size={20} color={themeColors.textSecondary} style={{ marginRight: Spacing.sm }} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search by site or client..."
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={themeColors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Priority Filter Chips */}
      <View style={styles.filterRow}>
        {filters.map((f) => {
          const isActive = priorityFilter === f;
          const chipColor = f === 'All' ? themeColors.primary : getPriorityColor(f);
          return (
            <Pressable
              key={f}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: isActive ? chipColor : themeColors.surface,
                  borderColor: chipColor,
                },
                pressed && styles.pressed,
              ]}
              onPress={() => setPriorityFilter(f)}
            >
              <Text style={[styles.filterText, { color: isActive ? '#FFF' : chipColor }]}>{f}</Text>
            </Pressable>
          );
        })}
        <View style={{ flex: 1 }} />
        <Text style={[styles.countText, { color: themeColors.textSecondary }]}>
          {filteredSurveys.length} survey{filteredSurveys.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* FlatList */}
      {filteredSurveys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: themeColors.textSecondary + '15' }]}>
            <Ionicons name="document-outline" size={56} color={themeColors.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            {surveys.length === 0 ? 'No Surveys Yet' : 'No Matching Surveys'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
            {surveys.length === 0
              ? 'Complete your first inspection survey to see it here.'
              : 'Try adjusting your search or priority filter.'}
          </Text>
          {surveys.length === 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: themeColors.primary },
                pressed && styles.pressed,
              ]}
              onPress={() => router.push('/(tabs)/new-survey')}
            >
              <Ionicons name="create-outline" size={18} color="#FFF" style={{ marginRight: Spacing.sm }} />
              <Text style={styles.startButtonText}>Create First Survey</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item.id}
          renderItem={renderSurveyItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function AttachChip({ icon, color }: { icon: string; color: string }) {
  return (
    <View style={[styles.attachChip, { backgroundColor: color + '15' }]}>
      <Ionicons name={`${icon}-outline` as any} size={12} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 46,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.round,
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },

  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 110,
  },
  card: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    ...Shadows.light,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: Spacing.sm,
  },
  priorityPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  clientName: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  attachments: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  attachChip: {
    width: 24,
    height: 24,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: { fontSize: 12 },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cardActionButton: {
    width: 32,
    height: 32,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    ...Shadows.medium,
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
