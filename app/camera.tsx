import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

export default function CameraScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <CustomHeader title="Camera Utility" />
      <View style={styles.content}>
        <Text style={{ color: themeColors.text }}>Camera tool is coming in Module 3</Text>
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
