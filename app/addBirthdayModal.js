import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Platform,
  Image,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";

// Function to calculate the zodiac sign based on date
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

export default function Modal() {
  const colorScheme = useColorScheme(); // Get current color scheme
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [zodiacSign, setZodiacSign] = useState(getZodiacSign(new Date()));
  const [notes, setNotes] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // State to toggle TextInput
  const textInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("birthdays");
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveItems = async (newItems) => {
    try {
      await AsyncStorage.setItem("birthdays", JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = () => {
    if (name.trim()) {
      const newItems = [
        ...items,
        {
          id: Date.now().toString(),
          name,
          birthday: birthday.toLocaleDateString(),
          zodiacSign,
          notes,
          notificationEnabled,
          profileImage,
        },
      ];
      saveItems(newItems);
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setBirthday(new Date());
    setZodiacSign(getZodiacSign(new Date()));
    setNotes("");
    setNotificationEnabled(false);
    setProfileImage(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  // Combine the two functions into one
  const handleDismiss = () => {
    Keyboard.dismiss();
    setShowDatePicker(false);
  };

  // Determine background color based on the color scheme
  const backgroundColor = colorScheme === "dark" ? "#151718" : "#f5f5f5";

  return (
    <KeyboardAvoidingView
      className="flex-1 px-[25px]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor }}
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <ThemedView>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor }}
          >
            <View className="flex-1 py-10">
              <TouchableOpacity
                onPress={pickImage}
                className="items-center mb-5"
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <View className="w-24 h-24 bg-gray-300 rounded-full justify-center items-center">
                    <ThemedText className="text-white text-base">
                      Add Picture
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsEditing(true)}>
                {!isEditing ? (
                  <ThemedView className="flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4">
                    <ThemedText className="font-bold">Name</ThemedText>
                    <ThemedText className="text-gray-400">
                      {name || "Click to edit"}
                    </ThemedText>
                  </ThemedView>
                ) : (
                  <ThemedView className="flex flex-row rounded-[12px] h-[60px] px-4 mb-4">
                    <TextInput
                      ref={textInputRef}
                      className="w-[100%]"
                      placeholder="Name"
                      value={name}
                      onChangeText={setName}
                      onBlur={() => setIsEditing(false)}
                    />
                  </ThemedView>
                )}
              </TouchableOpacity>

              <ThemedView className="flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4">
                <TouchableOpacity
                  className="flex flex-row w-full justify-between items-center"
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker((prev) => !prev);
                  }}
                >
                  <ThemedText className="font-bold">Birthday</ThemedText>
                  <View className="flex flex-row items-center">
                    <ThemedText className="text-gray-400 text-base">
                      {birthday.toLocaleDateString()}
                    </ThemedText>
                    <Ionicons
                      name={showDatePicker ? "chevron-down" : "chevron-forward"}
                      size={20}
                      color="black"
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>
              </ThemedView>

              {showDatePicker && (
                <ThemedView className="rounded-[12px] px-4 mb-4">
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
                </ThemedView>
              )}

              <ThemedView className="flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4">
                <ThemedText className="font-bold">Zodiac Sign</ThemedText>
                <ThemedText className="text-gray-400 text-base">
                  {zodiacSign}
                </ThemedText>
              </ThemedView>

              <ThemedView className="flex-row items-center justify-between rounded-[12px] h-[60px] py-4 px-4 mb-4">
                <TextInput
                  className="h-[100%] w-[100%]"
                  placeholder="Note"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  placeholderTextColor="#000" // Set the placeholder text color to black
                  style={{ fontWeight: "bold" }} // Make the placeholder text bold
                />
              </ThemedView>

              <ThemedView className="flex-row items-center justify-between rounded-[12px] h-[60px] px-4">
                <ThemedText className="font-bold">Notification</ThemedText>
                <Switch
                  value={notificationEnabled}
                  onValueChange={setNotificationEnabled}
                />
              </ThemedView>

              <Link href="../" className="mt-5 text-blue-500 text-center">
                Dismiss
              </Link>
              <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
            </View>
          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
