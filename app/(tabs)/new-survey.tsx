import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomHeader } from '../../components/CustomHeader';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

export default function NewSurveyScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="New Survey" />
      <View style={styles.content}>
        <Text style={{ color: themeColors.text }}>Create Survey form is coming in Module 2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
