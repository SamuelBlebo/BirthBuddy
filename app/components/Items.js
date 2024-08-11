import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Items = () => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const fetchData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("birthdays");
      const parsedItems = storedItems ? JSON.parse(storedItems) : [];

      const filteredItems = parsedItems.filter(
        (item) => item && item.name && item.name.trim() !== ""
      );

      // Sort the filtered items based on upcoming birthdays
      const sortedItems = filteredItems.sort((a, b) => {
        const daysA = daysUntilNextBirthday(new Date(a.birthday));
        const daysB = daysUntilNextBirthday(new Date(b.birthday));
        return daysA - daysB;
      });

      setItems(sortedItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

    // If the next birthday is already passed this year, calculate for the next year
    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    // Calculate the difference in milliseconds
    const diffInMilliseconds = nextBirthday - today;

    // Convert milliseconds to days
    const daysUntilBirthday = Math.ceil(
      diffInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return daysUntilBirthday;
  }

  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <ThemedView className=" px-4 py-8 mb-10">
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.name + index}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href="/editbirthday">
            <ThemedView
              style={{ backgroundColor }}
              className="w-[100%] flex flex-row justify-between items-center rounded-[10px] mb-4 p-4  shadow-sm"
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
                  <ThemedText style={styles.name} className="mb-[6px]">
                    {item.name || "No Name"}
                  </ThemedText>
                  <ThemedText>
                    {item.birthday
                      ? new Date(item.birthday).toLocaleDateString()
                      : "No Birthday"}
                  </ThemedText>
                </View>
              </View>
              <View className="flex justify-between items-end">
                <ThemedText className="font-semibold mb-[6px] text-gray-400">
                  {item.birthday
                    ? `${daysUntilNextBirthday(new Date(item.birthday))}`
                    : "No Birthday"}
                </ThemedText>
                <ThemedText className="font-semibold ">
                  {item.zodiacSign || "No Zodiac Sign"}
                </ThemedText>
              </View>
            </ThemedView>
          </Link>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginTop: 8,
  },
});

export default Items;
