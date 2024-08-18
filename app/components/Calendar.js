import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import {
  View,
  useColorScheme,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BirthdayCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const colorScheme = useColorScheme();

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  useEffect(() => {
    const loadBirthdays = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("birthdays");
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];

        const marks = parsedItems.reduce((acc, item) => {
          const date = new Date(item.birthday);
          const dayMonth = date.toISOString().slice(5, 10); // Extract MM-DD

          const currentYear = new Date().getFullYear();
          const currentYearDate = `${currentYear}-${dayMonth}`;

          acc[currentYearDate] = {
            selected: true,
            selectedColor: "#007bff",
          };

          return acc;
        }, {});

        setMarkedDates(marks);
      } catch (error) {
        console.error("Error loading birthdays:", error);
      }
    };

    loadBirthdays();
  }, []);

  return (
    <SafeAreaView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor }}
      className="h-[100%]"
    >
      <View className=" h-[70%] flex justify-center">
        <View>
          <Calendar
            className="px-5"
            style={{ backgroundColor }}
            theme={{
              backgroundColor: backgroundColor,
              calendarBackground: backgroundColor,
              textSectionTitleColor: "#b6c1cd",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "red",
              dayTextColor: textColor,
              textDisabledColor: "#555555",
              dotColor: "#00adf5",
              selectedDotColor: "#ffffff",
              arrowColor: iconColor,
              disabledArrowColor: "#d9e1e8",
              monthTextColor: "#007bff",
              indicatorColor: "#007bff",
              textDayFontFamily: "monospace",
              textMonthFontFamily: "monospace",
              textDayHeaderFontFamily: "monospace",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            onDayPress={(day) => {
              console.log("selected day", day);
            }}
            monthFormat={"MMMM yyyy"}
            hideArrows={false}
            disableMonthChange={false}
            enableSwipeMonths={true}
            markedDates={markedDates}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BirthdayCalendar;
