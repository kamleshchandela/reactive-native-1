// Module 2: Create Survey — Site Name, Client Name, Description, Priority, Date, Validation, Draft Persistence
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors, Spacing, Radii, Shadows } from '../../constants/theme';
import { useSurveys } from '../../context/SurveyContext';
import { CustomHeader } from '../../components/CustomHeader';

type Priority = 'Low' | 'Medium' | 'High';

interface FormErrors {
  siteName?: string;
  clientName?: string;
  description?: string;
}

export default function NewSurveyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { draft, updateDraft, editingId } = useSurveys();

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const priorities: Priority[] = ['Low', 'Medium', 'High'];

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'High': return themeColors.error;
      case 'Medium': return themeColors.warning;
      case 'Low': return themeColors.success;
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!draft.siteName.trim()) newErrors.siteName = 'Site Name is required';
    if (!draft.clientName.trim()) newErrors.clientName = 'Client Name is required';
    if (!draft.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      // Navigate to preview screen
      router.push('/preview');
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // keep open on iOS
    if (selectedDate) {
      updateDraft({ date: selectedDate });
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const formattedDate = draft.date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title={editingId ? 'Edit Survey' : 'New Survey'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Form Header */}
        <View style={styles.formHeader}>
          <Text style={[styles.formTitle, { color: themeColors.text }]}>
            {editingId ? 'Update Survey Details' : 'Create New Inspection'}
          </Text>
          <Text style={[styles.formSubtitle, { color: themeColors.textSecondary }]}>
            Fill in all required fields to proceed
          </Text>
        </View>

        {/* Site Name */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>
            Site Name <Text style={{ color: themeColors.error }}>*</Text>
          </Text>
          <View style={[
            styles.inputWrapper,
            { backgroundColor: themeColors.surface, borderColor: errors.siteName ? themeColors.error : themeColors.border },
          ]}>
            <Ionicons name="business-outline" size={20} color={themeColors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="e.g. North Tower Site"
              placeholderTextColor={themeColors.textSecondary}
              value={draft.siteName}
              onChangeText={(v) => { updateDraft({ siteName: v }); setErrors((e) => ({ ...e, siteName: undefined })); }}
              returnKeyType="next"
            />
          </View>
          {errors.siteName && (
            <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.siteName}</Text>
          )}
        </View>

        {/* Client Name */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>
            Client Name <Text style={{ color: themeColors.error }}>*</Text>
          </Text>
          <View style={[
            styles.inputWrapper,
            { backgroundColor: themeColors.surface, borderColor: errors.clientName ? themeColors.error : themeColors.border },
          ]}>
            <Ionicons name="person-outline" size={20} color={themeColors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="e.g. ACME Corporation"
              placeholderTextColor={themeColors.textSecondary}
              value={draft.clientName}
              onChangeText={(v) => { updateDraft({ clientName: v }); setErrors((e) => ({ ...e, clientName: undefined })); }}
              returnKeyType="next"
            />
          </View>
          {errors.clientName && (
            <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.clientName}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>
            Description <Text style={{ color: themeColors.error }}>*</Text>
          </Text>
          <View style={[
            styles.textAreaWrapper,
            { backgroundColor: themeColors.surface, borderColor: errors.description ? themeColors.error : themeColors.border },
          ]}>
            <TextInput
              style={[styles.textArea, { color: themeColors.text }]}
              placeholder="Describe the inspection scope, issues found, observations..."
              placeholderTextColor={themeColors.textSecondary}
              value={draft.description}
              onChangeText={(v) => { updateDraft({ description: v }); setErrors((e) => ({ ...e, description: undefined })); }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          {errors.description && (
            <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.description}</Text>
          )}
        </View>

        {/* Priority Selector */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {priorities.map((p) => {
              const isSelected = draft.priority === p;
              const color = getPriorityColor(p);
              return (
                <Pressable
                  key={p}
                  style={({ pressed }) => [
                    styles.priorityButton,
                    {
                      backgroundColor: isSelected ? color : themeColors.surface,
                      borderColor: color,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => updateDraft({ priority: p })}
                >
                  <Ionicons
                    name={p === 'High' ? 'alert-circle' : p === 'Medium' ? 'remove-circle' : 'checkmark-circle'}
                    size={16}
                    color={isSelected ? '#FFF' : color}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.priorityText, { color: isSelected ? '#FFF' : color }]}>
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Date Picker */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Inspection Date</Text>
          <Pressable
            style={({ pressed }) => [
              styles.inputWrapper,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
              pressed && styles.pressed,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={themeColors.textSecondary} style={styles.inputIcon} />
            <Text style={[styles.dateText, { color: themeColors.text }]}>{formattedDate}</Text>
            <Ionicons name="chevron-down" size={18} color={themeColors.textSecondary} />
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={draft.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
            />
          )}
        </View>

        {/* Attachments Summary */}
        <View style={[styles.attachmentsCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.attachmentsTitle, { color: themeColors.text }]}>Attachments</Text>
          <View style={styles.attachmentRow}>
            <AttachmentBadge
              label="Photo"
              icon="camera"
              attached={!!draft.photoUri}
              themeColors={themeColors}
              onPress={() => router.push('/camera')}
            />
            <AttachmentBadge
              label="Location"
              icon="location"
              attached={!!draft.location}
              themeColors={themeColors}
              onPress={() => router.push('/location')}
            />
            <AttachmentBadge
              label="Contact"
              icon="people"
              attached={!!draft.contact}
              themeColors={themeColors}
              onPress={() => router.push('/contacts')}
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Notes</Text>
          <View style={[styles.textAreaWrapper, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.textArea, { color: themeColors.text }]}
              placeholder="Additional notes or remarks..."
              placeholderTextColor={themeColors.textSecondary}
              value={draft.notes}
              onChangeText={(v) => updateDraft({ notes: v })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: themeColors.primary },
            pressed && styles.pressed,
          ]}
          onPress={handleNext}
        >
          <Ionicons name="eye-outline" size={20} color="#FFF" style={{ marginRight: Spacing.sm }} />
          <Text style={styles.submitButtonText}>Preview Survey</Text>
        </Pressable>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

/* Small sub-component for attachment badges */
function AttachmentBadge({
  label, icon, attached, themeColors, onPress,
}: {
  label: string;
  icon: string;
  attached: boolean;
  themeColors: typeof Colors.light;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.attachmentBadge,
        {
          backgroundColor: attached ? themeColors.success + '15' : themeColors.background,
          borderColor: attached ? themeColors.success : themeColors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={`${icon}-outline` as any}
        size={20}
        color={attached ? themeColors.success : themeColors.textSecondary}
      />
      <Text style={[styles.attachmentLabel, { color: attached ? themeColors.success : themeColors.textSecondary }]}>
        {label}
      </Text>
      {attached && (
        <Ionicons name="checkmark-circle" size={14} color={themeColors.success} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  formHeader: {
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: 14,
  },

  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  dateText: {
    flex: 1,
    fontSize: 15,
  },

  textAreaWrapper: {
    borderWidth: 1.5,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 110,
  },
  textArea: {
    fontSize: 15,
    flex: 1,
  },

  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 1.5,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700',
  },

  attachmentsCard: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  attachmentBadge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    gap: 4,
  },
  attachmentLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
