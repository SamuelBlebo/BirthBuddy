import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

const UpcomingBirthdays = () => {
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
    return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  }

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <View className="px-4 py-8">
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.name + index}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <Link href={`/editbirthday?id=${item.id}`}>
              <View
                style={{ backgroundColor }}
                className="w-[100%] flex flex-row justify-between items-center rounded-[10px] mb-4 p-4  shadow-sm "
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
                  <View className="pl-2 flex justify-between ">
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
                      ? `${daysUntilNextBirthday(new Date(item.birthday))} days`
                      : "No Birthday"}
                  </Text>
                  <Text className="font-semibold " style={{ color: textColor }}>
                    {item.zodiacSign || "No Zodiac Sign"}
                  </Text>
                </View>
              </View>
            </Link>
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
    marginTop: 8,
  },
});

export default UpcomingBirthdays;
