import React from "react";
import { StyleSheet, useColorScheme, type ScrollViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useScrollViewOffset,
  interpolate,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";

type ThemedScrollViewProps = ScrollViewProps & {
  headerImage: React.ReactElement;
  headerBackgroundColor: { dark: string; light: string };
};

export function ThemedScrollView({
  headerImage,
  headerBackgroundColor = { dark: "#000", light: "#fff" },
  ...scrollViewProps
}: ThemedScrollViewProps) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = React.useRef<Animated.ScrollView>(null);
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-250, 0, 250],
            [-250 / 2, 0, 250 * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-250, 0, 250], [2, 1, 1]),
        },
      ],
    };
  });

  // Fallback color if colorScheme or headerBackgroundColor are not set properly
  const backgroundColor = headerBackgroundColor[colorScheme] || "#fff";

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        {...scrollViewProps}
      >
        <Animated.View
          style={[styles.header, { backgroundColor }, headerAnimatedStyle]}
        >
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>
          {scrollViewProps.children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
