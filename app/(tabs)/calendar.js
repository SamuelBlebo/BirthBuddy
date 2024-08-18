import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  useColorScheme,
} from "react-native";

import BirthdayCalender from "../components/Calendar";

export default function CalendarScreen() {
  const colorScheme = useColorScheme();

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";
  return (
    <View
      className="h-[100%] flex-1 justify-center "
      style={{ backgroundColor }}
    >
      <View className="px-10 mb-2 mt-[100px]">
        <Text className="font-bold text-[34px] " style={{ color: textColor }}>
          Calendar
        </Text>
      </View>
      <BirthdayCalender />
    </View>
  );
}

const styles = StyleSheet.create({});
