import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons/";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const UpcomingBirthdays = () => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("birthdays");
      const parsedItems = storedItems ? JSON.parse(storedItems) : [];

      const filteredItems = parsedItems.filter(
        (item) => item && item.name && item.name.trim() !== ""
      );

      const sortedItems = filteredItems.sort((a, b) => {
        const daysA = daysUntilNextBirthday(new Date(a.birthday));
        const daysB = daysUntilNextBirthday(new Date(b.birthday));

        if (daysA === "Today" || daysA === "Tomorrow") return -1;
        if (daysB === "Today" || daysB === "Tomorrow") return 1;

        return daysA - daysB;
      });

      setItems(sortedItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  function daysUntilNextBirthday(birthday) {
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
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    const isLeapYear = (year) => {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    };

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Tomorrow";
    } else if (diffInDays === -1) {
      return "Yesterday";
    } else if (
      diffInDays === 365 ||
      (isLeapYear(today.getFullYear()) && diffInDays === 366)
    ) {
      return "Today";
    } else {
      return diffInDays;
    }
  }

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <View className="px-4 py-8 ">
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.name + index}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                console.log("Navigating to EditBirthday with ID:", item.id);
                navigation.navigate("EditBirthday", { id: item.id });
              }}
            >
              <View
                style={{ backgroundColor }}
                className="w-[100%] flex flex-row justify-between items-center rounded-[10px] mb-4 p-4 shadow-sm"
              >
                <View className="flex flex-row items-center shadow-sm">
                  {item.profileImage ? (
                    <Image
                      source={{ uri: item.profileImage }}
                      style={styles.image}
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={52}
                      color="#ccc"
                      style={styles.icon}
                    />
                  )}
                  <View className="pl-2 flex justify-between">
                    <Text
                      className="mb-[6px] text-[18px] font-[600]"
                      style={{ color: textColor }}
                    >
                      {item.name || "No Name"}
                    </Text>
                    <Text className="text-gray-400">
                      {item.birthday
                        ? new Date(item.birthday).toLocaleDateString()
                        : "No Birthday"}
                    </Text>
                  </View>
                </View>
                <View className="flex justify-between items-end">
                  <Text className="font-semibold mb-[6px] text-gray-400">
                    {item.birthday
                      ? daysUntilNextBirthday(new Date(item.birthday))
                      : "No Birthday"}
                  </Text>
                  <Text className="font-semibold" style={{ color: textColor }}>
                    {item.zodiacSign || "No Zodiac Sign"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default UpcomingBirthdays;
