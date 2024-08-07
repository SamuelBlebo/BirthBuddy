import { Image, View, Text, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedView>
        <ThemedText className="font-bold h-full">All</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 200,
  },
});
