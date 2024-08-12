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
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
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
                  <ThemedText
                    className={`text-base shadow-md ${
                      colorScheme === "dark" ? "text-gray-400" : "text-white"
                    }`}
                  >
                    Add Picture
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsEditing(true)}>
              {!isEditing ? (
                <ThemedView className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
                  <ThemedText className="font-bold">Name</ThemedText>
                  <ThemedText className="text-gray-400">
                    {name || ""}
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedView className="w-[90%] flex flex-row rounded-[12px] h-[60px] px-4 mb-4 shadow-lg">
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

            <ThemedView className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
              <TouchableOpacity
                className="flex flex-row w-full justify-between items-center"
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDatePicker((prev) => !prev);
                }}
              >
                <ThemedText className="font-bold ">Birthday</ThemedText>
                <View className="flex flex-row items-center">
                  <ThemedText className="text-gray-400 text-base">
                    {birthday.toLocaleDateString()}
                  </ThemedText>
                  <Ionicons
                    name={showDatePicker ? "chevron-down" : "chevron-forward"}
                    size={20}
                    color="#9ca3af"
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </TouchableOpacity>
            </ThemedView>

            {showDatePicker && (
              <ThemedView className="rounded-[12px] px-4 mb-4 shadow-md ">
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

            <ThemedView className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
              <ThemedText className="font-bold">Zodiac Sign</ThemedText>
              <ThemedText className="text-gray-400 text-base">
                {zodiacSign}
              </ThemedText>
            </ThemedView>

            <ThemedView className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md">
              <ThemedText className="font-bold">Notification</ThemedText>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
              />
            </ThemedView>

            <ThemedView className="w-[90%] flex items-start justify-between rounded-[12px] h-[150px] px-4 mb-4 shadow-md">
              <ThemedText className="font-bold">Notes</ThemedText>
              <TextInput
                className="flex-1"
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                multiline
              />
            </ThemedView>

            <ThemedText className="mt-10">
              <ThemedText>
                <Button title="Update" onPress={handleSaveEdit} />
              </ThemedText>
              <ThemedText>
                <Button title="Cancel" onPress={() => router.back()} />
              </ThemedText>
            </ThemedText>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </KeyboardAwareScrollView>
  );
}
