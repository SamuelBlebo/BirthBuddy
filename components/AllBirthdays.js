// AllBirthdays.js
import React, { useEffect, useState, useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

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

const AllBirthdays = () => {
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

      const groupedItems = filteredItems.reduce((groups, item) => {
        const month = new Date(item.birthday).getMonth() + 1;
        if (!groups[month]) {
          groups[month] = [];
        }
        groups[month].push(item);
        return groups;
      }, {});

      const sortedGroupedItems = Object.keys(groupedItems)
        .sort((a, b) => a - b)
        .map((month) => ({
          title: new Date(0, month).toLocaleString("default", {
            month: "long",
          }),
          data: groupedItems[month].sort(
            (a, b) =>
              new Date(a.birthday).getDate() - new Date(b.birthday).getDate()
          ),
        }));

      setItems(sortedGroupedItems);
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

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <View className="px-4 py-6">
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.title + index}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View key={item.title}>
            <Text className="text-x text-gray-400 mb-2">{item.title}</Text>
            {item.data.map((birthdayItem, index) => (
              <TouchableOpacity
                key={birthdayItem.name + index}
                onPress={() =>
                  navigation.navigate("EditBirthday", { id: birthdayItem.id })
                }
              >
                <View
                  style={{ backgroundColor }}
                  className="w-[100%] flex flex-row justify-between items-center rounded-[10px] mb-4 p-4 shadow-sm"
                >
                  <View className="flex flex-row items-center shadow-sm">
                    {birthdayItem.profileImage ? (
                      <Image
                        source={{ uri: birthdayItem.profileImage }}
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
                        style={{ color: textColor }}
                        className="mb-[6px] text-[18px] font-[600]"
                      >
                        {birthdayItem.name || "No Name"}
                      </Text>
                      <Text className="text-gray-400">
                        {birthdayItem.birthday
                          ? new Date(birthdayItem.birthday).toLocaleDateString()
                          : "No Birthday"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex justify-between items-end">
                    <Text className="font-semibold mb-[6px] text-gray-400">
                      {birthdayItem.birthday
                        ? `${daysUntilNextBirthday(
                            new Date(birthdayItem.birthday)
                          )} days`
                        : "No Birthday"}
                    </Text>
                    <Text className="font-semibold">
                      {birthdayItem.zodiacSign || "No Zodiac Sign"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
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

export default AllBirthdays;
