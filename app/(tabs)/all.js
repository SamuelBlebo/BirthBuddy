import { Image, View, Text, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import UpcomingBirthdays from "../components/UpcomingBirthdays";

export default function HomeScreen() {
  return (
    <ThemedView className="h-[100%]">
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View className="px-5 pt-8">
        <Text className="font-bold text-[35px]">All</Text>
      </View>
      <UpcomingBirthdays />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 200,
  },
});
