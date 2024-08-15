import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View, Text } from "react-native";

export default function TabTwoScreen() {
  return (
    <View>
      <View>
        <Text className="font-bold h-full text-gray-400">Settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 200,
  },
});
