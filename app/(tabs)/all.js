import { Image, View, Text, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Items from "../components/Items";

export default function HomeScreen() {
  return (
    <ThemedView className="h-[100%]">
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View className="px-5 pt-8">
        <Text className="font-bold text-[35px]">Upcoming</Text>
      </View>
      <Items />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 200,
  },
});
