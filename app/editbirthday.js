import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  Platform,
  Image,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  useColorScheme,
  Button,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

const getZodiacSign = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius ♒";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
    return "Pisces ♓";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return "Aries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return "Taurus ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return "Gemini ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return "Cancer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return "Virgo ♍ ";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio ♏ ";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius ♐ ";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "Capricorn ♑";
};

export default function EditBirthday() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [zodiacSign, setZodiacSign] = useState(getZodiacSign(new Date()));
  const [notes, setNotes] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef(null);

  useEffect(() => {
    const fetchBirthdayData = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("birthdays");
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        const itemToEdit = parsedItems.find((item) => item.id === id);
        if (itemToEdit) {
          setName(itemToEdit.name);
          setBirthday(new Date(itemToEdit.birthday));
          setZodiacSign(itemToEdit.zodiacSign);
          setNotes(itemToEdit.notes || "");
          setNotificationEnabled(itemToEdit.notificationEnabled || false);
          setProfileImage(itemToEdit.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching birthday data:", error);
      }
    };

    fetchBirthdayData();
  }, [id]);

  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveEdit = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("birthdays");
      const parsedItems = storedItems ? JSON.parse(storedItems) : [];
      const updatedItems = parsedItems.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              birthday,
              zodiacSign,
              notes,
              notificationEnabled,
              profileImage,
            }
          : item
      );

      await AsyncStorage.setItem("birthdays", JSON.stringify(updatedItems));
      Alert.alert("Success", "Birthday updated successfully");
      router.back();
    } catch (error) {
      console.error("Error saving edited birthday:", error);
    }
  };
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this birthday?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedItems = await AsyncStorage.getItem("birthdays");
              const parsedItems = storedItems ? JSON.parse(storedItems) : [];
              const updatedItems = parsedItems.filter((item) => item.id !== id);

              await AsyncStorage.setItem(
                "birthdays",
                JSON.stringify(updatedItems)
              );
              Alert.alert("Success", "Birthday deleted successfully");
              router.back();
            } catch (error) {
              console.error("Error deleting birthday:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleDismiss = () => {
    Keyboard.dismiss();
    setShowDatePicker(false);
  };

  const textColor = colorScheme === "dark" ? "#fff" : "#555";
  const iconColor = colorScheme === "dark" ? "#fff" : "#555";
  const backgroundColor = colorScheme === "dark" ? "#232628" : "#fff";

  return (
    <KeyboardAwareScrollView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <View className="flex-1 items-center py-10">
            <TouchableOpacity
              onPress={pickImage}
              className="h-32 w-32 items-center mb-5"
            >
              {profileImage ? (
                <View className="w-32 h-32 rounded-full overflow-hidden ">
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full"
                    style={{ resizeMode: "cover" }}
                  />
                </View>
              ) : (
                <View
                  className={`w-32 h-32 rounded-full justify-center items-center shadow-md ${
                    colorScheme === "dark" ? "bg-gray-700" : "bg-gray-300"
                  }`}
                >
                  <Text
                    className={`text-base shadow-md ${
                      colorScheme === "dark" ? "text-gray-400" : "text-white"
                    }`}
                  >
                    Add Picture
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              {!isEditing ? (
                <View
                  className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
                  style={{ backgroundColor }}
                >
                  <Text className="font-bold" style={{ color: textColor }}>
                    Name
                  </Text>
                  <Text className="text-gray-400">{name || ""}</Text>
                </View>
              ) : (
                <View className="w-[90%] flex flex-row rounded-[12px] h-[60px] px-4 mb-4 shadow-lg">
                  <TextInput
                    ref={textInputRef}
                    className="w-[100%]"
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    onBlur={() => setIsEditing(false)}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View
              className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
              style={{ backgroundColor }}
            >
              <TouchableOpacity
                className="flex flex-row w-full justify-between items-center"
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDatePicker((prev) => !prev);
                }}
              >
                <Text className="font-bold " style={{ color: textColor }}>
                  Birthday
                </Text>
                <View className="flex flex-row items-center">
                  <Text className="text-gray-400 text-base">
                    {birthday.toLocaleDateString()}
                  </Text>
                  <Ionicons
                    name={showDatePicker ? "chevron-down" : "chevron-forward"}
                    size={20}
                    color="#9ca3af"
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <View
                className="rounded-[12px] px-4 mb-4 shadow-md "
                style={{ backgroundColor }}
              >
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setBirthday(selectedDate);
                      setZodiacSign(getZodiacSign(selectedDate));
                    }
                  }}
                />
              </View>
            )}
            <View
              className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
              style={{ backgroundColor }}
            >
              <Text className="font-bold" style={{ color: textColor }}>
                Zodiac Sign
              </Text>
              <Text className="text-gray-400 text-base">{zodiacSign}</Text>
            </View>

            <View
              className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
              style={{ backgroundColor }}
            >
              <Text className="font-bold" style={{ color: textColor }}>
                Notification
              </Text>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
              />
            </View>
            <View
              className="w-[90%] flex items-start justify-between rounded-[12px] h-[150px] px-4 mb-4 shadow-md"
              style={{ backgroundColor }}
            >
              <Text className="font-bold mt-2" style={{ color: textColor }}>
                Notes
              </Text>
              <TextInput
                className="flex-1 w-[100%] h-[100%]"
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                multiline
              />
            </View>
            <Text className="mt-5">
              <Text>
                <Button title="Update" onPress={handleSaveEdit} />
              </Text>
              <Text>
                <Button color="red" title="Delete" onPress={handleDelete} />
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </KeyboardAwareScrollView>
  );
}
