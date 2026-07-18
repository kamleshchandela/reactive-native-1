// Module 7: Survey Preview — Detailed Summary, Edit Survey, Submit Survey with History Persistence
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../constants/theme';
import { useSurveys, Survey } from '../context/SurveyContext';
import { CustomHeader } from '../components/CustomHeader';

export default function PreviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { draft, surveys, submitDraft, loadSurveyIntoDraft } = useSurveys();
  const params = useLocalSearchParams<{ id?: string }>();

  // If an ID param is provided, we're in read-only view of a past survey.
  const readOnlySurvey: Survey | undefined = params.id
    ? surveys.find((s) => s.id === params.id)
    : undefined;

  const isReadOnly = !!readOnlySurvey;

  // The data to render: either read-only survey or active draft
  const data = isReadOnly ? readOnlySurvey! : {
    id: 'DRAFT',
    siteName: draft.siteName,
    clientName: draft.clientName,
    description: draft.description,
    priority: draft.priority,
    date: draft.date.toISOString(),
    photoUri: draft.photoUri,
    photoTimestamp: draft.photoTimestamp,
    location: draft.location,
    contact: draft.contact,
    notes: draft.notes,
    createdAt: new Date().toISOString(),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return themeColors.error;
      case 'Medium': return themeColors.warning;
      default: return themeColors.success;
    }
  };

  const handleSubmit = () => {
    const result = submitDraft();
    if (!result.success) {
      Alert.alert('Cannot Submit', result.error ?? 'Please complete the form before submitting.');
      return;
    }
    Alert.alert(
      'Survey Submitted!',
      `Survey ID: ${result.id}\n\nYour inspection report has been saved successfully.`,
      [
        {
          text: 'Go to History',
          onPress: () => router.push('/(tabs)/history'),
        },
        {
          text: 'Back to Dashboard',
          onPress: () => router.push('/(tabs)'),
        },
      ]
    );
  };

  const handleEdit = () => {
    if (isReadOnly) {
      loadSurveyIntoDraft(readOnlySurvey!);
    }
    router.push('/(tabs)/new-survey');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title={isReadOnly ? 'Survey Details' : 'Preview Survey'} showBackButton />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ID + Priority Banner */}
        <View style={[styles.banner, { backgroundColor: getPriorityColor(data.priority) + '15', borderColor: getPriorityColor(data.priority) }]}>
          <View>
            <Text style={[styles.surveyId, { color: themeColors.textSecondary }]}>
              {isReadOnly ? data.id : 'Draft Preview'}
            </Text>
            <Text style={[styles.surveyDate, { color: themeColors.text }]}>
              {new Date(data.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <View style={[styles.priorityChip, { backgroundColor: getPriorityColor(data.priority) }]}>
            <Text style={styles.priorityChipText}>{data.priority}</Text>
          </View>
        </View>

        {/* Site Details */}
        <DetailCard title="Site Details" icon="business-outline" themeColors={themeColors}>
          <DetailRow label="Site Name" value={data.siteName} themeColors={themeColors} />
          <DetailRow label="Client Name" value={data.clientName} themeColors={themeColors} />
          <DetailRow label="Description" value={data.description} themeColors={themeColors} multiline />
        </DetailCard>

        {/* Photo */}
        <DetailCard title="Site Photo" icon="camera-outline" themeColors={themeColors}>
          {data.photoUri ? (
            <View>
              <Image source={{ uri: data.photoUri }} style={styles.photoThumbnail} resizeMode="cover" />
              {data.photoTimestamp && (
                <View style={styles.photoTimestamp}>
                  <Ionicons name="time-outline" size={13} color={themeColors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={[styles.photoTimestampText, { color: themeColors.textSecondary }]}>
                    {data.photoTimestamp}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <EmptyField label="No photo attached" themeColors={themeColors} />
          )}
        </DetailCard>

        {/* Location */}
        <DetailCard title="Location" icon="location-outline" themeColors={themeColors}>
          {data.location ? (
            <>
              <DetailRow label="Latitude" value={data.location.latitude.toFixed(6)} themeColors={themeColors} />
              <DetailRow label="Longitude" value={data.location.longitude.toFixed(6)} themeColors={themeColors} />
              <DetailRow label="Accuracy" value={`±${data.location.accuracy} meters`} themeColors={themeColors} />
            </>
          ) : (
            <EmptyField label="No location attached" themeColors={themeColors} />
          )}
        </DetailCard>

        {/* Contact */}
        <DetailCard title="Contact" icon="people-outline" themeColors={themeColors}>
          {data.contact ? (
            <>
              <DetailRow label="Name" value={data.contact.name} themeColors={themeColors} />
              <DetailRow label="Phone" value={data.contact.phoneNumber} themeColors={themeColors} />
            </>
          ) : (
            <EmptyField label="No contact attached" themeColors={themeColors} />
          )}
        </DetailCard>

        {/* Notes */}
        {data.notes ? (
          <DetailCard title="Notes" icon="document-text-outline" themeColors={themeColors}>
            <Text style={[styles.notesText, { color: themeColors.text }]}>{data.notes}</Text>
          </DetailCard>
        ) : null}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
              pressed && styles.pressed,
            ]}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={20} color={themeColors.primary} style={{ marginRight: Spacing.sm }} />
            <Text style={[styles.actionButtonText, { color: themeColors.primary }]}>
              {isReadOnly ? 'Edit' : 'Edit Survey'}
            </Text>
          </Pressable>

          {!isReadOnly && (
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.submitButton,
                { backgroundColor: themeColors.primary },
                pressed && styles.pressed,
              ]}
              onPress={handleSubmit}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#FFF" style={{ marginRight: Spacing.sm }} />
              <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Submit Survey</Text>
            </Pressable>
          )}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

/* -- Sub-components -- */

function DetailCard({
  title, icon, themeColors, children,
}: {
  title: string;
  icon: string;
  themeColors: typeof Colors.light;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.detailCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, Shadows.light]}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon as any} size={18} color={themeColors.primary} style={{ marginRight: Spacing.sm }} />
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DetailRow({ label, value, themeColors, multiline }: {
  label: string;
  value: string;
  themeColors: typeof Colors.light;
  multiline?: boolean;
}) {
  return (
    <View style={[styles.detailRow, multiline && { flexDirection: 'column' }]}>
      <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: themeColors.text }, multiline && { marginTop: 4 }]}>
        {value || '—'}
      </Text>
    </View>
  );
}

function EmptyField({ label, themeColors }: { label: string; themeColors: typeof Colors.light }) {
  return (
    <View style={styles.emptyField}>
      <Ionicons name="ellipse-outline" size={16} color={themeColors.textSecondary} style={{ marginRight: 6 }} />
      <Text style={[styles.emptyFieldText, { color: themeColors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.lg,
  },
  surveyId: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  surveyDate: { fontSize: 15, fontWeight: '700' },
  priorityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.round,
  },
  priorityChipText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },

  detailCard: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: { fontSize: 15, fontWeight: '700' },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  detailLabel: { fontSize: 13, fontWeight: '600', flex: 0.4 },
  detailValue: { fontSize: 13, flex: 0.6, textAlign: 'right' },

  emptyField: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  emptyFieldText: { fontSize: 13, fontStyle: 'italic' },

  photoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: Radii.md,
    marginBottom: Spacing.sm,
  },
  photoTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoTimestampText: { fontSize: 12 },

  notesText: { fontSize: 14, lineHeight: 22 },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
  },
  submitButton: {
    borderWidth: 0,
    ...Shadows.medium,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },

  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
