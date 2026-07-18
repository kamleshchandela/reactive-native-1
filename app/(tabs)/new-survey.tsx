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
  const [activeField, setActiveField] = useState<string | null>(null);

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
    if (!draft.siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!draft.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!draft.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      router.push('/preview');
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
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

        {/* Clean Header */}
        <View style={styles.formHeader}>
          <Text style={[styles.formTitle, { color: themeColors.text }]}>
            {editingId ? 'Update Report Details' : 'Create New Inspection'}
          </Text>
          <Text style={[styles.formSubtitle, { color: themeColors.textSecondary }]}>
            Complete site fields and attach inspector resources below
          </Text>
        </View>

        {/* Site Name Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>
            SITE NAME <Text style={{ color: themeColors.error }}>*</Text>
          </Text>
          <View style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.surface,
              borderColor: errors.siteName
                ? themeColors.error
                : activeField === 'siteName'
                  ? themeColors.primary
                  : themeColors.border,
            },
            Shadows.light,
          ]}>
            <Ionicons name="business" size={18} color={activeField === 'siteName' ? themeColors.primary : themeColors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: themeColors.text }]}
              placeholder="e.g. North Station Hub"
              placeholderTextColor={themeColors.textSecondary}
              value={draft.siteName}
              onFocus={() => setActiveField('siteName')}
              onBlur={() => setActiveField(null)}
              onChangeText={(v) => {
                updateDraft({ siteName: v });
                setErrors((e) => ({ ...e, siteName: undefined }));
              }}
              returnKeyType="next"
            />
          </View>
          {errors.siteName && (
            <Text style={[styles.errorLabel, { color: themeColors.error }]}>{errors.siteName}</Text>
          )}
        </View>

        {/* Client Name Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>
            CLIENT NAME <Text style={{ color: themeColors.error }}>*</Text>
          </Text>
          <View style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.surface,
              borderColor: errors.clientName
                ? themeColors.error
                : activeField === 'clientName'
                  ? themeColors.primary
                  : themeColors.border,
            },
            Shadows.light,
          ]}>
            <Ionicons name="person" size={18} color={activeField === 'clientName' ? themeColors.primary : themeColors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: themeColors.text }]}
              placeholder="e.g. Nexus Energy Inc."
              placeholderTextColor={themeColors.textSecondary}
              value={draft.clientName}
              onFocus={() => setActiveField('clientName')}
              onBlur={() => setActiveField(null)}
              onChangeText={(v) => {
                updateDraft({ clientName: v });
                setErrors((e) => ({ ...e, clientName: undefined }));
              }}
              returnKeyType="next"
            />
          </View>
          {errors.clientName && (
            <Text style={[styles.errorLabel, { color: themeColors.error }]}>{errors.clientName}</Text>
          )}
        </View>

        {/* Description Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>
            DESCRIPTION ASSESSMENT <Text style={{ color: themeColors.error }}>*</Text>
          </Text>
          <View style={[
            styles.textAreaContainer,
            {
              backgroundColor: themeColors.surface,
              borderColor: errors.description
                ? themeColors.error
                : activeField === 'description'
                  ? themeColors.primary
                  : themeColors.border,
            },
            Shadows.light,
          ]}>
            <TextInput
              style={[styles.textAreaInput, { color: themeColors.text }]}
              placeholder="Describe assessment goals, structural integrity, and key logs..."
              placeholderTextColor={themeColors.textSecondary}
              value={draft.description}
              onFocus={() => setActiveField('description')}
              onBlur={() => setActiveField(null)}
              onChangeText={(v) => {
                updateDraft({ description: v });
                setErrors((e) => ({ ...e, description: undefined }));
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          {errors.description && (
            <Text style={[styles.errorLabel, { color: themeColors.error }]}>{errors.description}</Text>
          )}
        </View>

        {/* Priority Segment controller */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>PRIORITY LEVEL</Text>
          <View style={styles.prioritySelectorRow}>
            {priorities.map((p) => {
              const isSelected = draft.priority === p;
              const color = getPriorityColor(p);
              return (
                <Pressable
                  key={p}
                  style={({ pressed }) => [
                    styles.priorityChip,
                    {
                      backgroundColor: isSelected ? color : themeColors.surface,
                      borderColor: isSelected ? color : themeColors.border,
                    },
                    Shadows.light,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => updateDraft({ priority: p })}
                >
                  <Ionicons
                    name={p === 'High' ? 'alert-circle-outline' : p === 'Medium' ? 'warning-outline' : 'checkmark-circle-outline'}
                    size={16}
                    color={isSelected ? '#FFFFFF' : color}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[
                    styles.priorityChipText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.text,
                      fontWeight: isSelected ? '800' : '600',
                    }
                  ]}>
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Date Picker Button */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>INSPECTION DATE</Text>
          <Pressable
            style={({ pressed }) => [
              styles.inputContainer,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
              Shadows.light,
              pressed && styles.pressed,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color={themeColors.primary} style={styles.inputIcon} />
            <Text style={[styles.dateValueText, { color: themeColors.text }]}>{formattedDate}</Text>
            <Ionicons name="chevron-down" size={16} color={themeColors.textSecondary} />
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

        {/* Vertical Attachments Checklist (Human Designed Style!) */}
        <Text style={[styles.fieldLabel, { color: themeColors.textSecondary, alignSelf: 'flex-start', marginLeft: Spacing.lg, marginBottom: Spacing.xs }]}>
          REQUIRED ATTACHMENTS
        </Text>
        <View style={[styles.checklistCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, Shadows.light]}>
          
          {/* Item 1: Photo */}
          <Pressable
            style={({ pressed }) => [styles.checklistItem, pressed && styles.pressed]}
            onPress={() => router.push('/camera')}
          >
            <View style={[styles.checklistIconWrapper, { backgroundColor: draft.photoUri ? themeColors.success + '15' : themeColors.primary + '10' }]}>
              <Ionicons name="camera" size={18} color={draft.photoUri ? themeColors.success : themeColors.primary} />
            </View>
            <View style={styles.checklistTextWrapper}>
              <Text style={[styles.checklistLabel, { color: themeColors.text }]}>Site Image Capture</Text>
              <Text style={[styles.checklistStatus, { color: draft.photoUri ? themeColors.success : themeColors.textSecondary }]}>
                {draft.photoUri ? 'Image attached successfully' : 'Inspection photo is required'}
              </Text>
            </View>
            <Ionicons
              name={draft.photoUri ? "checkmark-circle" : "chevron-forward"}
              size={18}
              color={draft.photoUri ? themeColors.success : themeColors.border}
            />
          </Pressable>

          <View style={[styles.checklistDivider, { backgroundColor: themeColors.border }]} />

          {/* Item 2: Location */}
          <Pressable
            style={({ pressed }) => [styles.checklistItem, pressed && styles.pressed]}
            onPress={() => router.push('/location')}
          >
            <View style={[styles.checklistIconWrapper, { backgroundColor: draft.location ? themeColors.success + '15' : themeColors.primary + '10' }]}>
              <Ionicons name="location" size={18} color={draft.location ? themeColors.success : themeColors.primary} />
            </View>
            <View style={styles.checklistTextWrapper}>
              <Text style={[styles.checklistLabel, { color: themeColors.text }]}>GPS Marker Coordinates</Text>
              <Text style={[styles.checklistStatus, { color: draft.location ? themeColors.success : themeColors.textSecondary }]}>
                {draft.location ? 'GPS coordinates pinned' : 'Satellite marker coordinates required'}
              </Text>
            </View>
            <Ionicons
              name={draft.location ? "checkmark-circle" : "chevron-forward"}
              size={18}
              color={draft.location ? themeColors.success : themeColors.border}
            />
          </Pressable>

          <View style={[styles.checklistDivider, { backgroundColor: themeColors.border }]} />

          {/* Item 3: Contact */}
          <Pressable
            style={({ pressed }) => [styles.checklistItem, pressed && styles.pressed]}
            onPress={() => router.push('/contacts')}
          >
            <View style={[styles.checklistIconWrapper, { backgroundColor: draft.contact ? themeColors.success + '15' : themeColors.primary + '10' }]}>
              <Ionicons name="people" size={18} color={draft.contact ? themeColors.success : themeColors.primary} />
            </View>
            <View style={styles.checklistTextWrapper}>
              <Text style={[styles.checklistLabel, { color: themeColors.text }]}>Site Representative Contact</Text>
              <Text style={[styles.checklistStatus, { color: draft.contact ? themeColors.success : themeColors.textSecondary }]}>
                {draft.contact ? `${draft.contact.name} linked` : 'Link site representative contact (Optional)'}
              </Text>
            </View>
            <Ionicons
              name={draft.contact ? "checkmark-circle" : "chevron-forward"}
              size={18}
              color={draft.contact ? themeColors.success : themeColors.border}
            />
          </Pressable>

        </View>

        {/* Notes Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>ADDITIONAL NOTES</Text>
          <View style={[styles.textAreaContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, Shadows.light]}>
            <TextInput
              style={[styles.textAreaInput, { color: themeColors.text }]}
              placeholder="Type additional remarks or climate parameters here..."
              placeholderTextColor={themeColors.textSecondary}
              value={draft.notes}
              onChangeText={(v) => updateDraft({ notes: v })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Preview Button */}
        <Pressable
          style={({ pressed }) => [
            styles.previewButton,
            { backgroundColor: themeColors.primary },
            pressed && styles.pressed,
          ]}
          onPress={handleNext}
        >
          <Ionicons name="eye" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.previewButtonText}>Preview Survey Report</Text>
        </Pressable>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  formHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  fieldGroup: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  textAreaContainer: {
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 100,
  },
  textAreaInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  errorLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  
  // Segmented priority chips
  prioritySelectorRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  priorityChipText: {
    fontSize: 13,
  },

  dateValueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Checklist Card Styles (LinkedIn/Human Style)
  checklistCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  checklistIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  checklistTextWrapper: {
    flex: 1,
  },
  checklistLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  checklistStatus: {
    fontSize: 10,
    fontWeight: '600',
  },
  checklistDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },

  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Radii.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  previewButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
