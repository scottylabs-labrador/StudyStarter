// components/TextBanner.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

import Ionicons from '@expo/vector-icons/Ionicons';

type TextBannerProps = {
  text: string;
};

export const TextBanner = ({ text }: TextBannerProps) => {
  return (
    <ThemedView style={styles.bannerContainer}>
      {/* <Ionicons name="ios-information-circle" size={24} color="black" style={styles.icon} /> */}
      <ThemedText style={styles.bannerText}>{text}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    padding: 10,
    // backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default TextBanner;
