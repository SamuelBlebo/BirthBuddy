import { Ionicons } from "@expo/vector-icons/";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  useColorScheme,
  SafeAreaView,
} from "react-native";

import BirthdayCalender from "../components/Calendar";

export default function CalendarScreen() {
  const colorScheme = useColorScheme();

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";
  return (
    <SafeAreaView className="h-[100%] flex-grow" style={{ backgroundColor }}>
      <View className="px-5 pt-8">
        <Text className="font-bold text-[35px]" style={{ color: textColor }}>
          Calendar
        </Text>
      </View>
      <View className="flex-1 justify-center mt-[-150px] mx-5 rounded-2xl">
        <BirthdayCalender />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
