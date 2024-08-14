import React, { useState, useEffect, useCallback } from "react";
import { Tabs, useRouter } from "expo-router";
import { Platform, Text, ScrollView, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import UpcomingBirthdays from "../components/UpcomingBirthdays";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [daysToNextBirthday, setDaysToNextBirthday] = useState(0);
  const [birthdaysInMonth, setBirthdaysInMonth] = useState(0);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("birthdays");
      const parsedItems = storedItems ? JSON.parse(storedItems) : [];

      const today = new Date();
      const currentMonth = today.getMonth();

      let minDaysToNextBirthday = Infinity;
      let birthdaysThisMonth = 0;

      parsedItems.forEach((item) => {
        if (item.birthday) {
          // Ensure consistent date parsing
          const birthdayDate = new Date(item.birthday);

          // Calculate days to the next birthday
          const daysToNext = daysUntilNextBirthday(birthdayDate);

          // Update minimum days to next birthday
          if (daysToNext < minDaysToNextBirthday) {
            minDaysToNextBirthday = daysToNext;
          }

          // Check if the birthday is in the current month
          if (birthdayDate.getMonth() === currentMonth) {
            birthdaysThisMonth++;
          }
        }
      });

      setDaysToNextBirthday(
        minDaysToNextBirthday === Infinity ? 0 : minDaysToNextBirthday
      );
      setBirthdaysInMonth(birthdaysThisMonth); // Ensure this is set correctly
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const daysUntilNextBirthday = (birthday) => {
    const today = new Date();
    const nextBirthday = new Date(
      today.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );

    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffInMilliseconds = nextBirthday - today;
    return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  };
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ThemedView className="h-[100%]">
        <ThemedView className="px-5 mb-2 mt-5">
          <Text className="font-bold text-[34px] " style={{ color: textColor }}>
            Upcoming
          </Text>
        </ThemedView>

        <View className="h-[130px] ">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ThemedView className="flex-1 flex-row items-center px-5 ">
              <ThemedView
                style={{ backgroundColor }}
                className="w-[150px] h-[100px] flex justify-center items-center  rounded-[20px]  mr-4 shadow-md"
              >
                <Text
                  className="font-bold text-[50px]"
                  style={{ color: textColor }}
                >
                  {birthdaysInMonth}
                </Text>
                <Text className="text-gray-400">
                  Birthdays in{" "}
                  {new Date().toLocaleString("en-US", { month: "long" })}
                </Text>
              </ThemedView>
              <ThemedView
                style={{ backgroundColor }}
                className="w-[150px] h-[100px] flex justify-center items-center rounded-[20px]  mr-4 shadow-md"
              >
                <Text
                  className="font-bold text-[50px]"
                  style={{ color: textColor }}
                >
                  {daysToNextBirthday}
                </Text>
                <Text className="text-gray-400">Days to next birthday</Text>
              </ThemedView>

              <ThemedView
                style={{ backgroundColor }}
                className="w-[150px] h-[100px] flex justify-center items-center  rounded-[20px]  mr-4 shadow-md"
              >
                <Ionicons
                  name="arrow-forward"
                  size={50}
                  color={iconColor}
                  onPress={() => router.push("/all")} // Navigate to the "All" tab
                />
                <Text className="text-gray-400">View All</Text>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </View>

        <UpcomingBirthdays />
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </ThemedView>
    </ScrollView>
  );
}
