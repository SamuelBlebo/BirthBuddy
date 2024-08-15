import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View } from "react-native";

import BirthdayCalender from "../components/Calendar";

export default function TabTwoScreen() {
  return (
    <View className="h-[100%] flex-1 justify-center ">
      <BirthdayCalender />
    </View>
  );
}

const styles = StyleSheet.create({});
