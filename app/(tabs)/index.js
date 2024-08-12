import React from "react";
import { Platform, Text, ScrollView, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedView } from "@/components/ThemedView";
import UpcomingBirthdays from "../components/UpcomingBirthdays";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <>
      <ScrollView className="h-[100%] flex flex-1 py-8">
        <View className="px-5 mb-10">
          <Text className="font-bold text-[34px]">Upcoming</Text>
        </View>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ThemedView className="flex-1 flex-row items-center px-5 ">
              <ThemedView
                style={{ backgroundColor }}
                className="w-[200px] h-[200px] flex justify-center items-center rounded-[20px]  mr-4"
              >
                <Text className="font-bold text-[50px]">0</Text>
                <Text>Days to next birthday</Text>
              </ThemedView>

              <ThemedView
                style={{ backgroundColor }}
                className="w-[200px] h-[200px] flex justify-center items-center  rounded-[20px]  mr-4"
              >
                <Text className="font-bold text-[50px]">0</Text>
                <Text>Birthdays in August</Text>
              </ThemedView>

              <ThemedView
                style={{ backgroundColor }}
                className="w-[200px] h-[200px] flex justify-center items-center  rounded-[20px]  mr-4"
              >
                <Text className="font-bold text-[50px]">0</Text>
                <Text>View All</Text>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </View>

        <ThemedView className="flex-1 px-4 ">
          <UpcomingBirthdays />
        </ThemedView>
      </ScrollView>
    </>
  );
}
