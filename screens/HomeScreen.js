import React, { useState, useEffect } from "react";
import { Platform, Text, ScrollView, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { differenceInDays } from "date-fns";

import UpcomingBirthdays from "../components/UpcomingBirthdays";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [daysToNextBirthday, setDaysToNextBirthday] = useState(0);
  const [birthdaysInMonth, setBirthdaysInMonth] = useState(0);
  const router = useRouter();

  // Fetch birthdays and update state
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
          const birthdayDate = new Date(item.birthday);
          const daysToNext = daysUntilNextBirthday(birthdayDate);

          if (daysToNext < minDaysToNextBirthday) {
            minDaysToNextBirthday = daysToNext;
          }

          if (birthdayDate.getMonth() === currentMonth) {
            birthdaysThisMonth++;
          }
        }
      });

      setDaysToNextBirthday(
        minDaysToNextBirthday === Infinity ? 0 : minDaysToNextBirthday
      );
      setBirthdaysInMonth(birthdaysThisMonth);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to calculate days until the next birthday
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

  // Invoke fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center items-center bg-blue-500">
        <Text className="text-white text-lg">Hello, NativeWind!</Text>
      </View>
      <View className="h-[100%]">
        <View className="px-5 mb-2 mt-5 pt-7">
          <Text className="font-bold text-[35px] " style={{ color: textColor }}>
            Upcoming
          </Text>
        </View>

        <View className="h-[130px] ">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="flex-1 flex-row items-center px-5 ">
              <View
                style={{ backgroundColor }}
                className="w-[150px] h-[100px] flex justify-center items-center  rounded-[20px]  mr-4 shadow-md"
              >
                <Text
                  className="font-bold text-[35px]"
                  style={{ color: textColor }}
                >
                  {birthdaysInMonth}
                </Text>
                <Text className="text-gray-400">
                  Birthdays in{" "}
                  {new Date().toLocaleString("en-US", { month: "long" })}
                </Text>
              </View>
              <View
                style={{ backgroundColor }}
                className="w-[150px] h-[100px] flex justify-center items-center rounded-[20px]  mr-4 shadow-md"
              >
                <Text
                  className="font-bold text-[35px]"
                  style={{ color: textColor }}
                >
                  {daysToNextBirthday}
                </Text>
                <Text className="text-gray-400">Days to next birthday</Text>
              </View>

              <View
                style={{ backgroundColor }}
                className="w-[150px] h-[100px] flex justify-center items-center  rounded-[20px]  mr-4 shadow-md"
              >
                <Ionicons
                  name="arrow-forward"
                  size={35}
                  color={iconColor}
                  onPress={() => router.push("/all")} // Navigate to the "All" tab
                />
                <Text className="text-gray-400">View All</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <UpcomingBirthdays />
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </ScrollView>
  );
}
