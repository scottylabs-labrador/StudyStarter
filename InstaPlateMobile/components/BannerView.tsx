// components/ParallaxScrollView.tsx
import type { PropsWithChildren } from 'react';
import { StyleSheet, useColorScheme, View, StatusBar, Platform } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import TextBanner from '@/components/TextBanner';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  // headerBackgroundColor: { dark: string; light: string };
  bannerText: string;
}>;

export default function BannerView({
  children,
  // headerBackgroundColor,
  bannerText,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const statusBarHeight = Platform.OS === 'ios' ? 25 : StatusBar.currentHeight ?? 0;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scrollOffset.value * 0.75,
        },
        {
          scale: 1 + scrollOffset.value * 0.001,
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <View style={{ paddingTop: statusBarHeight }}>
          <TextBanner text={bannerText} />
        </View>
        {/* <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        /> */}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
