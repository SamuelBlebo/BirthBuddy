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
  Alert, // Import Alert for displaying messages
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SaveForm from "./components/SaveForm";
import { useNavigation } from "@react-navigation/native";

const currentYear = new Date().getFullYear();
const years = [...Array(currentYear - 1899).keys()]
  .map((i) => i + 1900)
  .concat("--"); // Years from 1900 to current year + "--"

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
  const colorScheme = useColorScheme();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [zodiacSign, setZodiacSign] = useState(getZodiacSign(new Date()));
  const [notes, setNotes] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef(null);
  const navigation = useNavigation();

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

  const resetForm = () => {
    setName("");
    setBirthday(new Date());
    setZodiacSign(getZodiacSign(new Date()));
    setNotes("");
    setNotificationEnabled(false);
    setProfileImage(null);
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

  // Combine the two functions into one
  const handleDismiss = () => {
    Keyboard.dismiss();
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    // Validate form data
    if (!name.trim() || !birthday) {
      Alert.alert("Validation Error", "Name and Birthday are required fields.");
      return;
    }

    const formData = {
      name,
      birthday,
      zodiacSign,
      notes,
      notificationEnabled,
      profileImage,
    };

    await SaveForm(formData); // Save the form data using SaveForm component
    resetForm(); // Reset the form after saving
    navigation.goBack();
  };

  // Determine background color based on the color scheme
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
                <View className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
                  <Text className="font-bold">Name</Text>
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

            <View className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
              <TouchableOpacity
                className="flex flex-row w-full justify-between items-center"
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDatePicker((prev) => !prev);
                }}
              >
                <Text className="font-bold ">Birthday</Text>
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
              <View className="rounded-[12px] px-4 mb-4 shadow-md ">
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date("1900-01-01")} // Set the minimum year to 1900
                  maximumDate={new Date()} // Set the maximum date to the current date
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setBirthday(selectedDate);
                      setZodiacSign(getZodiacSign(selectedDate));
                    }
                  }}
                />
              </View>
            )}
            <View className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
              <Text className="font-bold">Zodiac Sign</Text>
              <Text className="text-gray-400 text-base">{zodiacSign}</Text>
            </View>

            <View className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
              <Text className="font-bold">Notification</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                trackColor={{ true: "#6495ED" }}
              />
            </View>

            <View className="w-[90%] flex items-start justify-between rounded-[12px] h-[150px] px-4 mb-4 shadow-md">
              <Text className="font-bold">Notes</Text>
              <TextInput
                className="w-[100%] h-[100%]"
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                multiline
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="bg-blue-500 rounded-lg px-8 py-4 mt-4 shadow-md "
            >
              <Text className="text-white text-center font-bold">Save</Text>
            </TouchableOpacity>

            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
