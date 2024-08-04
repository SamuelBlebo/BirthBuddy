import { Image, View, Text, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#B0B0B0" }}
      headerImage={
        <Image
          source={require("../../assets/images/birthday-doodle.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
      }
    >
      <StatusBar style="auto" />
      <ThemedView>
        <ThemedText className="font-bold">All</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 200,
  },
});
