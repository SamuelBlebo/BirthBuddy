import {
  Image,
  View,
  Text,
  StyleSheet,
  Platform,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AllBirthdays from "../components/AllBirthdays";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";
  return (
    <ThemedView className="h-[100%]">
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View className="px-5 pt-8">
        <Text className="font-bold text-[35px]" style={{ color: textColor }}>
          All
        </Text>
      </View>
      <AllBirthdays />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 200,
  },
});
