import React, { useState, useEffect } from "react";
import { Text, ScrollView, View, useColorScheme, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import UpcomingBirthdays from "../components/UpcomingBirthdays";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation(); // Use navigation hook
  const [daysToNextBirthday, setDaysToNextBirthday] = useState(0);
  const [birthdaysInMonth, setBirthdaysInMonth] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

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

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-5 mb-2 mt-5 pt-7">
        <Text className="font-bold text-[35px]" style={{ color: textColor }}>
          Upcoming
        </Text>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 flex-row items-center p-5">
          <View
            style={{ backgroundColor }}
            className="w-[150px] h-[100px] flex justify-center items-center  rounded-[20px]  mr-4 shadow-md "
          >
            <Text
              className="font-bold text-[32px] "
              style={{ color: textColor }}
            >
              {birthdaysInMonth}
            </Text>
            <Text className="text-gray-400 text-center">
              {new Date().toLocaleString("en-US", { month: "long" })}
            </Text>
          </View>
          <View
            style={{ backgroundColor }}
            className="w-[150px] h-[100px] flex justify-center items-center rounded-[20px]  mr-4 shadow-md"
          >
            <Text
              className="font-bold text-[30px]"
              style={{ color: textColor }}
            >
              {daysToNextBirthday}
            </Text>
            <Text className="text-gray-400">Next Birthday</Text>
          </View>

          <View
            style={{ backgroundColor }}
            className="w-[150px] h-[100px] flex justify-center items-center  rounded-[20px]  mr-4 shadow-md"
          >
            <Ionicons
              name="arrow-forward"
              size={32}
              color={iconColor}
              onPress={() => navigation.navigate("All")} // Use navigation.navigate
            />
            <Text className="text-gray-400">View All</Text>
          </View>
        </View>
      </ScrollView>

      <UpcomingBirthdays />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}
