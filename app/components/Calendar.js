import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BirthdayCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const loadBirthdays = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("birthdays");
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];

        const marks = parsedItems.reduce((acc, item) => {
          const date = new Date(item.birthday);
          const dayMonth = date.toISOString().slice(5, 10); // Extract MM-DD

          // Create a date string for the current year
          const currentYear = new Date().getFullYear();
          const currentYearDate = `${currentYear}-${dayMonth}`;

          acc[currentYearDate] = {
            selected: true, // Use 'selected' instead of 'marked'
            selectedColor: "#00adf5", // Use 'selectedColor' instead of 'dotColor'
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
    <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
      <Calendar
        style={{
          margin: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#e0e0e0",
        }}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          textSectionTitleDisabledColor: "#d9e1e8",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          arrowColor: "blue",
          disabledArrowColor: "#d9e1e8",
          monthTextColor: "blue",
          indicatorColor: "blue",
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
  );
};

export default BirthdayCalendar;
