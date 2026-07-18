import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { CustomHeader } from '../../components/CustomHeader';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { STUDENT_DETAILS } from '../../constants/config';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="Inspector Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.avatar, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.avatarText}>
            {STUDENT_DETAILS.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>

        <Text style={[styles.name, { color: themeColors.text }]}>{STUDENT_DETAILS.name}</Text>
        <Text style={[styles.email, { color: themeColors.textSecondary }]}>{STUDENT_DETAILS.email}</Text>

        <View style={[styles.infoCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Course</Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>{STUDENT_DETAILS.course}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Batch</Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>{STUDENT_DETAILS.batch}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: 110,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: 14,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  infoRow: {
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
});
