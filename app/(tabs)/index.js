import { Image, View, Text, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#80BFFF", dark: "#6699CC" }}
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
        <ThemedText className="font-bold">Hello World</ThemedText>
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
